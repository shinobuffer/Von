<template>
  <div class="d-card">
    <div class="author-avatar" :style="{backgroundImage:`url(${ddata.avatar})`}"></div>
    <div class="content tl">
      <p class="author-namae">{{ddata.author}}</p>
      <p class="time">{{ddata.time|commentTime}}</p>
      <div class="d-card-content">
        <div class="text markdown-area" v-html="dRenderer(ddata,0,0)" v-highlight></div>
        <!--当存在图片时开启下面的imgsbox-->
        <div class="imgsbox no-select" v-if="ddata.imgs.length">
          <div class="thumbnail-wrap" v-if="!zoomingIn">
            <ul class="thumbnail-list fzz">
              <li class="item" v-for="(item,index) in ddata.imgs" :key="index" @click="zoomIn(index)" :class="{'item-1':ddata.imgs.length===1}">
                <img class="img-content" :src="'/root'+item">
              </li>
            </ul>
          </div>
          <div class="zoom-wrap" v-else>
            <ul class="zoom-control">
              <li @click="zoomOut"><i class="iconfont icon-compress"></i><span>收起</span></li>
              <li @click="callLB"><i class="iconfont icon-expand"></i><span>全屏</span></li>
              <li @click="imgRotate(0)"><i class="iconfont icon-rotateleft"></i><span>向左旋转</span></li>
              <li @click="imgRotate(1)"><i class="iconfont icon-rotateright"></i><span>向右旋转</span></li>
            </ul>
            <div class="zoom-img" ref="imgWrap">
              <div class="zoom-img-container" @click="zoomOut"><img :src="'/root'+ddata.imgs[zoomingIndex]" ref="img"></div>
              <div class="prev" @click="imgPush(0)" v-show="zoomingIndex>0"></div>
              <div class="next" @click="imgPush(1)" v-show="ddata.imgs.length-1>zoomingIndex"></div>
            </div>
            <!--当不止一张图片时才启用滑动栏-->
            <div class="zoom-slider-wrap" v-if="ddata.imgs.length>1">
              <div class="zoom-slider-border" :style="{left:`${zoomingIndex*.66}rem`}"></div>
              <ul class="zoom-slider fzz">
                <li v-for="(item,index) in ddata.imgs" :key="index" @click="imgJump(index)" :class="{cur:zoomingIndex===index}">
                  <img :src="'/root'+item">
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="d-card-btn-bar no-select">
        <button @click="commentToggle" :class="{selected:commentShow}"><i class="iconfont icon-comment"></i>{{ddata.commentCount}}</button>
        <button @click="likeToggle" :class="{selected:ddata.likeStatus}"><i class="iconfont" :class="`icon-${ddata.likeStatus?'heart':'hearto'}`"></i>{{ddata.liked}}</button>
      </div>
    </div>
    <div class="bottom" v-if="commentShow">
      <div class="d-card-comment" :id="`comments-${ddata.id}`">
        <div class="respond" :id="`respond-${ddata.id}`">
          <button class="cancel-reply-btn" v-if="to_id" @click="cancelReply">取消回复</button>
          <h3 class="respond-title">{{to_uname|respondTitle}}<span v-show="to_id&&!isMobile"> | #{{to_id}}</span></h3>
          <div class="comment-form">
            <div class="comment-info-input">
              <input placeholder="昵称(必填)" v-model.trim="nickname" name="nickname">
              <input placeholder="邮箱(必填，保密)" v-model.trim="email" name="email">
              <input placeholder="qq(选填，拉取头像)" v-model.trim="qq" name="qqnum">
            </div>
            <span title="除了html、标题、分割线、表格、图片、下划线、标记、上下标"><i class="iconfont icon-markdown"></i>Markdown Supported</span>
            <div class="comment-content-input"><textarea @keydown="textareaTab" placeholder="说点什么吧..." v-model="content"></textarea></div>
          </div>
          <div class="comment-buttons tr">
            <emotion-box v-model="content" :emoData="emoData" :emoMap="emoMap" float="left"/>
            <span><label><input type="checkbox" v-model="notifyMe"> 回复提醒</label></span>
            <button @click="commentSubmit">提交评论</button>
          </div>
        </div>
        <div class="comments-main" :id="`anchor-${ddata.id}`">
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
                <div class="comment-content markdown-area" v-html="dRenderer(comment,1,0)" v-highlight></div>
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
                      <div class="comment-content markdown-area" v-html="dRenderer(reply,1,1)" v-highlight></div>
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
      </div>
    </div>
  </div>
</template>

<script>
import marked from 'marked';
import {getLocalStorage, setLocalStorage} from "../utils/storageManager";
import Validator from '../utils/Validator';
import Mixin_RichText from "../reuse/mixins/Mixin-RichText";
import EmotionBox from './public/EmotionBox';
export default {
  name: "DynamicCard",
  components:{
    EmotionBox
  },
  mixins:[Mixin_RichText],
  props:{
    ddata:{
      type:Object,
      required:true
    },
    emoData_:{
      type:Array,
      default(){
        return [{emoSeries:'',emoList:[]}]
      }
    },
    emoMap_:{
      type:Object,
      default(){
        return{}
      }
    }
  },
  data(){
    return{
      zoomingIn:false,
      zoomingIndex:0,
      rotateStatus:0,
      emoData:this.emoData_,
      emoMap:this.emoMap_,

      commentReady:false,
      commentShow:false,
    }
  },
  watch:{
    emoData_(cur){
      this.emoData = cur
    },
    emoMap_(cur){
      this.emoMap = cur
    },
    rotateStatus(cur){
      if (this.zoomingIn){
        let imgNode = this.$refs.img;
        let bound = imgNode.getBoundingClientRect();
        let height = bound.height;
        let width = bound.width;
        let height_ = width*width/height;
        switch (cur) {
          case 0:
            this.$refs.img.removeAttribute("style");
            this.$refs.imgWrap.removeAttribute("style");
            break;
          case 1:
            this.$refs.imgWrap.style.height = `${height_}px`;
            imgNode.style.cssText = `
            position: absolute;
            width: unset;
            height: ${width}px;
            left: ${width}px;
            transform-origin: left top;
            transform: rotate(90deg);
            `;
            break;
          case 2:
            this.$refs.img.removeAttribute("style");
            this.$refs.imgWrap.removeAttribute("style");
            imgNode.style.transform = `rotate(180deg)`;
            break;
          case 3:
            this.$refs.imgWrap.style.height = `${height_}px`;
            imgNode.style.cssText = `
            position: absolute;
            width: unset;
            height: ${width}px;
            right: ${width}px;
            transform-origin: right top;
            transform: rotate(270deg);
            `;
        }
      }
    },
    curPage(cur){
      this.cancelReply();
      this.fetchComment((cur - 1)*10);
      setTimeout(()=>document.getElementById('comments-'+this.ddata.id).scrollIntoView(true),100);
    }
  },
  beforeMount(){
    [this.nickname,this.email] = getLocalStorage(['COMMENT_NICKNAME','COMMENT_EMAIL']);
    this.markedInit();
    //this.$forceUpdate();
  },
  methods:{
    dRenderer(item,isComment,isReply){
      if (isComment){
        let start = (isReply&&this.isMobile)?`[@${item.to_uname}](#comment-${item.parent_id}): `:'';
        return marked(this.emoRenderer(start+item.content))
      }
      else
        return marked(this.emoRenderer(item.content))
    },
    commentToggle(){
      if (!this.commentReady){
        this.fetchComment(0);
        this.commentReady = true;
      }
      this.commentShow = !this.commentShow;
    },
    likeToggle(){
      if (!this.ddata.likeStatus)
        this.$fetch('/apis/apiv16p1.php',{like:this.ddata.id}).then(res=>{
          if (res.data.code===0){
            this.ddata.liked++;
            this.ddata['likeStatus'] = true;
          }
        })
    },
    zoomIn(index){
      this.zoomingIndex = index;
      this.zoomingIn = true;
    },
    zoomOut(){
      this.zoomingIn = false;
      this.rotateStatus = 0;
    },
    callLB(){
      let tmp = [],time = this.ddata.time;
      this.ddata.imgs.forEach(e=>{
        tmp.push({imgSrc:e,description:'',time:time})
      });
      this.$store.commit('lumiBox/imgsC',tmp);
      this.$store.commit('lumiBox/indexC',this.zoomingIndex);
      this.$store.commit('lumiBox/showC',true);
    },
    imgRotate(direction){
      if (direction)
        this.rotateStatus = (this.rotateStatus+1) % 4;
      else if (this.rotateStatus===0)this.rotateStatus = 3;
      else this.rotateStatus--;
    },
    imgPush(direction){
      if (direction){
        let tmp = this.zoomingIndex+1;
        this.zoomingIndex = tmp<this.ddata.imgs.length?tmp:this.zoomingIndex
      }
      else
        this.zoomingIndex = this.zoomingIndex?this.zoomingIndex-1:0;
      this.rotateStatus = 0;
    },
    imgJump(index){
      this.zoomingIndex = index;
      this.rotateStatus = 0;
    },
    fetchComment(offset){
      this.commentWaiting = true;
      while (this.commentList.pop()){}
      this.$fetch('/apis/apiv16p1.php',{did:this.ddata.id,offset:offset}).then(response=>{
        if (response.data.code < 1) {
          let data = response.data.data;
          this.allCount = data.allCount;
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
    commentSubmit(){
      let validator = new Validator();
      validator.check(this.nickname,{strategy:'notEmpty',errMsg:'昵称不能为空'});
      validator.check(this.email,{strategy:'isEmail',errMsg:'请输入正确邮箱'});
      validator.check(this.qq,{strategy:'isQQ',errMsg:'请输入合法QQ号'},true);
      validator.check(this.content.trim(),{strategy:'notEmpty',errMsg:'内容不能为空'});
      let err = validator.checkResult();
      if (err){
        this.$store.dispatch('infoBox/callInfoBox',{info:err, ok:false, during:3000});
        return;
      }
      let data = {
        did:this.ddata.id,
        nickname:this.nickname,
        email:this.email,
        qq:this.qq,
        content:this.content.trim(),
        to_id:this.to_id,
        to_uid:this.to_uid,
        notifyMe:this.notifyMe
      };
      if(window.confirm('即将提交评论，是否确认')){
        this.$post('/apis/apiv16p2.php',data).then(response=>{
          setLocalStorage({
            COMMENT_NICKNAME:this.nickname,
            COMMENT_EMAIL:this.email
          });
          if (response.data.code<1){
            //如果是回复更新当页，否则进行回到第一页更新
            this.content = '';
            if (this.to_id){
              this.cancelReply();
              this.fetchComment((this.curPage-1)*10);
            }
            else if (this.curPage===1)
              this.fetchComment(0);
            else
              this.curPage = 1;
            this.ddata.commentCount ++;
          }
          else
            this.$store.dispatch('infoBox/callInfoBox',{info:'评论发布失败', ok:false, during:3000});
        });
      }
    },
    replyThis(id,uid,uname){
      if (id!==this.to_id){
        this.to_id = id;
        this.to_uid = uid;
        this.to_uname = uname;
        let target = document.getElementById('comment-'+id);
        target.appendChild(document.getElementById('respond-'+this.ddata.id));
        document.getElementById('respond-'+this.ddata.id).scrollIntoView(false);
      }
    },
    cancelReply(){
      this.to_id = this.to_uid = this.to_uname= null;
      document.getElementById('comments-'+this.ddata.id).insertBefore(document.getElementById('respond-'+this.ddata.id),document.getElementById('anchor-'+this.ddata.id))
    }
  },
}
</script>

<style>
</style>
