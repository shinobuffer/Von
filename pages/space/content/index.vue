<template>
  <div>
    <h2 class="admin-head">内容管理</h2>
    <div class="admin-statistics">
      <div class="s-cell">
        <p>内容数</p>
        <span>{{numSum}}</span>
      </div>
      <div class="s-cell">
        <p>总PV</p>
        <span>{{pvSum}}</span>
      </div>
      <div class="s-cell">
        <p>评论数</p>
        <span>{{commentSum}}</span>
      </div>
    </div>
    <div class="admin-nav">
      <a class="admin-nav-item" href="javascript:void(0);" @click="curIndex=0" :class="{cur:!curIndex}" >文章</a>
      <a class="admin-nav-item" href="javascript:void(0);" @click="curIndex=1" :class="{cur:curIndex}">笔记</a>
    </div>
    <div class="a-table-wrap">
      <div class="a-table">
        <div class="a-table-head">
          <div>标题</div>
          <div>PV</div>
          <div>评论</div>
          <div>发布时间</div>
          <div>更新时间</div>
          <div>操作</div>
        </div>
        <div class="a-table-row" v-for="each in curList" :key="`${each.type}-${each.id}`">
          <div class="title" ><p><nuxt-link :to="each|itemUrl">{{each.title}}</nuxt-link></p><span>{{each|itemInfo}}</span></div>
          <div class="pv">{{each.readCount|readNum}}</div>
          <div class="comment-num"><nuxt-link :to="each|commentUrl">{{each.commentCount}}</nuxt-link></div>
          <div class="ptime">{{each.time.substr(0,10)}}</div>
          <div class="utime">{{each.lut|updateTime}}</div>
          <div class="operate"><button @click="editItem(each)">编辑</button> / <button v-if="each.topped" @click="topItem(each)">{{parseInt(each.topped)?'取消置顶':'置顶'}}</button> / <button @click="delItem(each)" class="del">删除</button></div>
        </div>
      </div>
    </div>
    <div class="auth-box-container" v-if="authBoxShow">
      <div class="auth-box">
        <div class="box-header">
          <span style="color: #db6e6e;font-weight: bold">危险操作</span><a @click="authBoxShow=false;password=''"><i class="iconfont icon-cancel"></i></a>
        </div>
        <div class="box-warn">你正在尝试删除现有文章/笔记</div>
        <div class="box-body">
          <p style="margin-bottom: .1rem;">该操作一旦执行无法撤销，将会永久的删除文章<strong>《{{delTarget.title}}》</strong>及其评论</p>
          <p>输入用户密码以授权操作</p>
          <input type="password" v-model="password">
          <button @click="authorize">授权操作</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import {aesEncrypt} from "~/utils/crypto";
import UCONF from '~/config/user.conf';
const {siteTitle:{title}} = UCONF;
export default {
  name: "space-content-index",
  head(){
    return{
      title:`内容管理 | ${title}`
    }
  },
  filters:{
    itemUrl(item){
      return item.type==='note'?'/note/'+item.id:'/archive/'+item.type+'/'+item.id
    },
    commentUrl(item){
      let url = item.type==='note'?'/note/'+item.id:'/archive/'+item.type+'/'+item.id;
      return url + '#comments';
    },
    itemInfo(item){
      let series = item.series?' · '+item.series:'';
      if (item.type==='anime')return 'Anime'+series;
      else if (item.type==='code')return '极客'+series;
      else if (item.type==='game')return '游民'+series;
      else return item.type==='trivial'?'随写'+series:'笔记'+series;
    },
    readNum(count){
      return count.replace(/(\d)(?=(?:\d{3})+$)/g,'$1,')
    },
    updateTime(datetime){
      let gap = new Date().getTime() -  new Date(datetime).getTime();
      if (gap<60000)return '刚刚';
      else{
        let gap_m = Math.floor(gap/60000);
        if (gap_m<60)return gap_m + '分钟前';
        else{
          let gap_h = Math.floor(gap_m/60);
          if (gap_h<24)return gap_h + '小时前';
          else{
            let gap_d = Math.floor(gap_h/24);
            if (gap_d<30)return gap_d + '日前';
            else{
              let gap_mon = Math.floor(gap_d/30);
              if (gap_mon<12)return gap_mon + '月前';
              else return '很久以前';
            }
          }
        }
      }
    }

  },
  asyncData({app,req}){
    return app.$fetch('/apis/auth/v3api.php',{},req).then(res=>{
      let {articles,notes} = res.data.data;
      let pvSum = 0;let commentSum = 0;
      notes.forEach(e=>{
        pvSum += parseInt(e.readCount);
        commentSum += parseInt(e.commentCount);
      });
      articles.forEach(e=>{
        pvSum += parseInt(e.readCount);
        commentSum += parseInt(e.commentCount);
      });
      return{
        articles,notes,
        curList:articles.concat(),
        numSum:articles.length + notes.length,
        pvSum,commentSum
      }
    })
  },
  data(){
    return{
      numSum:0,
      pvSum:0,
      commentSum:0,

      curIndex:0,
      curList:[],
      notes:[],
      articles:[],
      delTarget:'',
      authBoxShow:false,
      password:''
    }
  },
  computed:{
    ...mapState({
      name:state=>state.account.name,
    })
  },
  watch:{
    curIndex(cur){
      if (cur)
        this.curList = this.notes;
      else
        this.curList = this.articles
    }
  },
  methods:{
    editItem(item){
      this.$post('/apis/auth/v2api.php?create',{id:item.id,type:item.type}).then(response=>{
        if (response.data.code < 1){
          let to = item.type==='note'?'/takenote?nid='+item.id:'/write?aid='+item.id;
          this.$router.push(to)
        }
      }).catch(err=>console.warn(err))
    },
    topItem(item){
      let query = parseInt(item.topped)?'':'?topped';
      this.$post('/apis/auth/v4api.php'+query,{id:item.id}).then(response=>{
        if (response.data.code < 1){
          //置顶或取消置顶成功
          this.$store.dispatch('infoBox/callInfoBox',{
            info:parseInt(item.topped)?'取消置顶成功':'置顶成功',
            ok:true,
            during:2000
          });
          item.topped = parseInt(item.topped)?'0':'1'
        }
        else
          this.$store.dispatch('infoBox/callInfoBox',{
            info:'操作失败',
            ok:true,
            during:2000
          });
      }).catch(err=>console.warn(err))
    },
    delItem(item){
      //呼出授权box，为其指定目标
      this.delTarget = item;
      this.authBoxShow = true;
    },
    authorize(){
      //开始授权
      if (this.password) {
        let data = {
          name:this.name,
          psw:this.password,
          id:this.delTarget.id,
          type:this.delTarget.type
        };
        this.$post('/apis/auth/v5api.php',{...aesEncrypt(JSON.stringify(data))}).then(response=>{
          switch (response.data.code) {
            case 0://授权成功删除
              this.password = '';
              this.authBoxShow = false;
              this.$store.dispatch('infoBox/callInfoBox',{
                info:'再见了你嘞！',
                ok:true,
                during:2000
              });
              this.numSum--;
              this.pvSum-=this.delTarget.readCount;
              this.commentSum-=this.delTarget.commentCount;
              if (this.curIndex)
                this.notes.splice(this.notes.indexOf(this.delTarget),1);
              else
                this.articles.splice(this.articles.indexOf(this.delTarget),1);
              break;
            case 1:
              this.password = '';
              this.$store.dispatch('infoBox/callInfoBox',{
                info:'密码错误，授权失败',
                ok:false,
                during:3000
              });
              break;
            case 2:
              this.$store.dispatch('infoBox/callInfoBox',{
                info:'失败过多，请明天再试',
                ok:false,
                during:3000
              });
              break;
            default:
              this.$store.dispatch('infoBox/callInfoBox',{
                info:'出现未知错误',
                ok:false,
                during:3000
              });
          }
        }).catch(err=>console.warn(err))
      }
    }
  }
}
</script>

<style>
</style>
