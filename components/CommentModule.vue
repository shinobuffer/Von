<template>
  <section id="comments" class="comments tl">
    <div id="respond" class="respond">
      <button class="cancel-reply-btn" v-if="to_id" @click="cancelReply">取消回复</button>
      <h3 class="respond-title">{{to_uname|respondTitle}}<span v-show="to_id&&!isMobile"> | #{{to_id}}</span></h3>
      <div class="comment-form">
        <div class="comment-info-input">
          <input placeholder="昵称(必填)" v-model.trim="nickname" name="nickname">
          <input placeholder="邮箱(必填，保密)" v-model.trim="email" name="email">
          <input placeholder="qq(选填，拉取头像)" v-model.trim="qq" name="qqnum">
          <input placeholder="网站(选填)" v-model.trim="website" name="website">
        </div>
        <span title="除了html、标题、分割线、表格、图片、下划线、标记、上下标"><i class="iconfont icon-markdown"></i>Markdown Supported</span>
        <div class="comment-content-input" v-if="!previewOn">
          <textarea @keydown="textareaTab" placeholder="说点什么吧..." v-model="content"></textarea>
        </div>
        <div class="comment-content preview markdown-area" v-html="contentPreview" v-highlight v-else></div>
      </div>
      <div class="comment-robot-check">
        简单数学题：{{add1}} + {{add2}} = <input type="text" v-model.trim="sum">
      </div>
      <div class="comment-buttons tr">
        <emotion-box v-model="content" :emoData="emoData" :emoMap="emoMap" float="left"></emotion-box>
        <span><label><input type="checkbox" v-model="notifyMe"> 回复提醒</label></span>
        <button @click="commentPreview">{{previewOn?'返回编辑':'预览'}}</button>
        <button @click="commentSubmit" >提交评论</button>
      </div>
    </div>
    <div class="comments-main" id="anchor">
      <h3 class="comments-list-title">Comments<span> | {{allCount}} 条评论</span></h3>
      <waiting v-if="commentWaiting"/>
      <div class="comments-list" v-else-if="allCount">
        <div class="comments-list-item" :id="'comment-'+comment.id" v-for="comment in commentList" :key="comment.id">
          <div class="comment-content-wrap">
            <div class="comment-avatar">
              <img v-lazyload="[comment.avatar||'/static/images/passerby.png','/static/images/spinner-preloader.svg']">
            </div>
            <div class="comment-meta">
              <p class="uname"><a :href="comment.ulink">{{comment.uname}}</a></p>
              <span class="comment-time" :title="comment.datetime.substr(0,16)">{{comment.datetime|commentTime}}</span>
              <span v-show="!isMobile" class="comment-id">#{{comment.id}}</span>
            </div>
            <div class="comment-content markdown-area" v-html="commentRenderer(comment,false)" v-highlight></div>
            <button class="comment-reply no-select" @click="replyThis(comment.id,comment.uid,comment.uname)">回复</button>
          </div>
          <div class="comment-children">
            <div class="comments-list">
              <div class="comments-list-item" :id="'comment-'+reply.id" v-for="reply in comment.children" :key="reply.id">
                <div class="comment-content-wrap">
                  <div class="comment-avatar">
                    <img v-lazyload="[reply.avatar||'/static/images/passerby.png','/static/images/spinner-preloader.svg']">
                  </div>
                  <div class="comment-meta">
                    <p class="uname"><a :href="reply.ulink">{{reply.uname}}</a><span v-show="!isMobile"><span style="font-weight: normal"> 回复 </span><span>@{{reply.to_uname}}<span class="reply-id"> | #{{reply.parent_id}}</span></span></span></p>
                    <span class="comment-time" :title="reply.datetime.substr(0,16)">{{reply.datetime|commentTime}}</span>
                    <span v-show="!isMobile" class="comment-id">#{{reply.id}}</span>
                  </div>
                  <div class="comment-content markdown-area" v-html="commentRenderer(reply,true)" v-highlight></div>
                  <button class="comment-reply no-select" @click="replyThis(reply.id,reply.uid,reply.uname)">回复</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="no-comment" v-else>
        <h3>这里什么都没有`╮(￣▽￣)╭` </h3>
      </div>
    </div>
    <ol class="c-pager" v-if="pageNum>1&&!commentWaiting">
      <li class="prev" @click="curPage--" v-if="curPage!==1"><i class="iconfont icon-caretleft"></i></li>
      <li v-show="curPage>=4" @click="curPage=1">1</li>
      <li v-if="curPage>=5" class="ellipses"><i class="iconfont icon-ellipsis"></i></li>
      <li v-for="each in pageList" :key="each" @click="curPage=each" :class="{current:each===curPage}">{{each}}</li>
      <li v-if="curPage<=pageNum-4" class="ellipses"><i class="iconfont icon-ellipsis"></i></li>
      <li v-show="curPage<=pageNum-3" @click="curPage=pageNum">{{pageNum}}</li>
      <li class="next" @click="curPage++" v-if="curPage!==pageNum"><i class="iconfont icon-caretright"></i></li>
    </ol>
  </section>
</template>

<script>
import {randInt} from "../utils/lib";
import {getLocalStorage, setLocalStorage} from "../utils/storageManager";
import Validator from '../utils/Validator';
import marked from 'marked';
import Mixin_RichText from '../reuse/mixins/Mixin-RichText';
import EmotionBox from './public/EmotionBox';
export default {
  name: "CommentModule",
  components:{
    EmotionBox
  },
  mixins:[Mixin_RichText],
  props:['id_','type','unique'],
  data(){
    return{
      newing:false,//用于标识“需要更新”，同步curPage和unique的

      website:'',
      contentPreview:'',
      previewOn:false,

      add1:NaN,
      add2:NaN,
      sum:'',
    }
  },
  watch:{
    curPage(cur){
      if (this.newing)//被unique叫去更新
        this.newing = false;
      else{//页内跳转
        this.cancelReply();
        document.getElementById('comments').scrollIntoView(true)
      }
      this.fetchComment((cur - 1)*10);
    },
    unique(){//文章发生更新，评论跟着更新
      this.allCount = '??';
      this.pageNum = 1;
      this.cancelReply();
      if (this.curPage === 1){ //原来就在第一页，不去触发curPage，自己去更新数据
        //原来在第一页，自己更新
        this.fetchComment(0);
      }
      else{//原来不在第一页，更新并触发curPage，让他更新数据，
        //原来不在第一页，让curPage更新
        this.newing = true;
        this.curPage = 1;
      }
    }
  },
  async beforeMount(){
    [this.nickname,this.email] = getLocalStorage(['COMMENT_NICKNAME','COMMENT_EMAIL']);
    this.markedInit();
    this.genRandAdd();
    await this.fetchEmo();
    this.fetchComment(0);
  },
  methods:{
    commentRenderer(item,isReply){//存在一个问题：发生任意更新时全部评论会调用一次，v-html的郭？如果真这样可以不要contentPreview将其纳入commentRenderer
      let start = (isReply&&this.isMobile)?`[@${item.to_uname}](#comment-${item.parent_id}): `:'';
      return marked(this.emoRenderer(start+item.content))
    },
    commentPreview(){
      if (!this.previewOn)
        this.contentPreview = marked(this.emoRenderer(this.content));
      this.previewOn = !this.previewOn;
    },
    genRandAdd(){
      this.add1 = randInt(-50,50);
      this.add2 = randInt(-50,50);
      this.sum = '';
    },
    fetchComment(offset){
      this.commentWaiting = true;
      while (this.commentList.pop()){}
      this.$post('/apis/apiv6.php',{id:this.id_,type:this.type,offset:offset}).then(response=>{
        if (response.data.code < 1) {
          let data = response.data.data;
          this.allCount = parseInt(data.allCount);
          this.pageNum = Math.ceil(data.commentCount/10);
          //console.log(this.allCount,this.pageNum);
          this.commentWaiting = false;
          data.comments.forEach(e=>{
            e['children'] = this.gen_children(e);
            delete e.replies;
            this.commentList.push(e)
          });

        }
      })
    },
    replyThis(id,uid,uname){
      if (id!==this.to_id){
        this.to_id = id;
        this.to_uid = uid;
        this.to_uname = uname;
        let target = document.getElementById('comment-'+id);
        target.appendChild(document.getElementById('respond'));
        document.getElementById('respond').scrollIntoView(false);
      }

    },
    cancelReply(){
      this.to_id = this.to_uid = this.to_uname= null;
      document.getElementById('comments').insertBefore(document.getElementById('respond'),document.getElementById('anchor'))
    },
    commentSubmit(){
      let validator = new Validator();
      validator.check(this.nickname,{strategy:'notEmpty',errMsg:'昵称不能为空'});
      validator.check(this.email,{strategy:'isEmail',errMsg:'请输入正确邮箱'});
      validator.check(this.qq,{strategy:'isQQ',errMsg:'请输入合法QQ号'},true);
      validator.check(this.website,{strategy:'isLink',errMsg:'请输入正确网址'},true);
      validator.check(this.content.trim(),{strategy:'notEmpty',errMsg:'内容不能为空'});
      validator.check(this.sum,{strategy:'notEmpty',errMsg:'请完成简单数学题'});
      let err = validator.checkResult();
      if (err){
        this.$store.dispatch('infoBox/callInfoBox',{info:err, ok:false, during:3000});
        return;
      }
      if (this.add1+this.add2===parseInt(this.sum)){
        let data = {
          puzzle:btoa(this.add1+','+this.add2+','+this.sum),
          id:this.id_,
          type:this.type,
          nickname:this.nickname,
          qq:this.qq,
          email:this.email,
          website:this.website,
          content:this.content.trim(),
          to_id:this.to_id,
          to_uid:this.to_uid,
          notifyMe:this.notifyMe
        };
        if(window.confirm('即将提交评论，是否确认')){
          this.$post('/apis/apiv7.php',data).then(response=>{
            setLocalStorage({
              COMMENT_NICKNAME:this.nickname,
              COMMENT_EMAIL:this.email
            });
            if (response.data.code<1){
              this.content = this.contentPreview = '';
              this.previewOn = false;
              if (this.to_id){
                this.cancelReply();
                this.fetchComment((this.curPage-1)*10);
              }
              else if (this.curPage===1)
                this.fetchComment(0);
              else
                this.curPage = 1;
            }
            else
              this.$store.dispatch('infoBox/callInfoBox',{info:'评论发布失败', ok:false, during:3000});
          })
        }
      }
      else{
        this.$store.dispatch('infoBox/callInfoBox',{info:'数学题不通过', ok:false, during:4000});
      }
      this.genRandAdd();
    }
  },

}
</script>

<style>
</style>
