<template>
  <div class="space-dynamic">
    <div class="col-1">
      <div class="history-dynamic">
        <div class="dynamic-content-wrap" v-for="item in dynamics" :key="item.id">
          <dynamic-card
            :ddata="item"
            :emoData_="emoData"
            :emoMap_="emoMap"/>
          <div class="dynamic-opt">
            <i class="iconfont icon-more"></i>
            <div class="more-opt"><a @click="delDynamic(item)">删除</a></div>
          </div>
        </div>
        <div class="no-more" v-show="noMore">
          <p>你已经到达了世界的尽头</p>
        </div>
      </div>
    </div>

    <div class="col-2">
      <div class="section dynamic-launch">
        <h4>发布动态</h4>
        <textarea placeholder="要写些什么呢?" @keydown="textareaTab" v-model="content"></textarea>
        <emotion-box v-model="content" :emoData="emoData" :emoMap="emoMap" float="right"></emotion-box>
        <div class="upload-box">
          <div class="title fz-14">图片上传<span>{{uploadImgs.length}} / 9</span>
            <span class="iconfont icon-chevronright pointer"
                  :class="{unfold:ulUnfolded}"
                  @click="ulUnfolded=!ulUnfolded"></span>
          </div>
          <div class="upload-list fzz is-collapsible" :class="{'is-collapsed':!ulUnfolded}">
            <div class="upload-item"
                 v-for="(item,index) in uploadImgs"
                 v-divImg="item"
                 :key="item.timestamp">
              <span class="uploading"></span>
              <div class="redo">
                <span @click="delImg(index)"><i class="iconfont icon-cancel clearm"></i></span>
              </div>
            </div>
            <div class="upload-btn" v-show="uploadImgs.length<9">
              <input type="file" accept="image/png, image/jpeg, image/jpg, image/gif" @change="addImg">
              <i class="iconfont icon-plus"></i>
            </div>
          </div>
        </div>
        <div class="type-box">
          <div class="title fz-14">发布栏目(可选)</div>
          <ul class="type-selector no-select">
            <li v-for="(item,key) in typeMap"
                :key="key"
                @click="dType=dType===key?0:key"
                :class="{cur:dType===key}">{{item}}</li>
          </ul>
        </div>
        <button @click="launchDynamic">发布</button>
      </div>
      <div class="section recommend-edit">
        <h4>推荐栏目</h4>
        <div class="anli-add-wrap">
          <div class="anli-add title">
            <span>标题:</span>
            <input type="text" v-model.trim="anliTitle">
          </div>
          <div class="anli-add link">
            <span>链接:</span>
            <input type="text" v-model.trim="anliLink">
          </div>
          <button class="anli-btn" @click="anli">安利！安利！安利！</button>
        </div>
      </div>
    </div>

    <div class="popup-panel-container" v-if="popupShow">
      <div class="popup-panel">
        <h3 class="popup-title tl">删除动态</h3>
        <div class="popup-content tl">确定要删除此条动态?</div>
        <div class="popup-confirm tc fzz">
          <button class="btn-primary" @click="delConfirm(true)">删除</button>
          <button class="btn-secondary" @click="delConfirm(false)">手抖点错</button>
        </div>
        <a class="popup-cancel" @click="popupShow=false"><i class="iconfont icon-cancel"></i></a>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import Validator from '~/utils/Validator';
import EmotionBox from '~/components/public/EmotionBox';
import DynamicCard from '~/components/DynamicCard';
import UCONF from '~/config/user.conf';
const {siteTitle:{title}} = UCONF;
export default {
  name: "space-dynamic",
  head(){
    return{
      title:`动态管理 | ${title} 的空间`
    }
  },
  components:{
    EmotionBox,
    DynamicCard
  },
  directives:{
    divImg:{
      bind(el,binding,vnode){
        let item = binding.value;
        let fd = new FormData();
        fd.append('service_type','1');
        fd.append('img_up',item.file);
        vnode.context.$post_form('/apis/auth/v7api.php',fd).then(res=>{
          let imgSrc = res.data.data.imgSrc;
          vnode.context.$data['uppedImgs'][item.timestamp] = imgSrc;
          el.removeChild(el.children[0]);
          el.style.backgroundImage = `url(/root${imgSrc})`
        });
      },
      unbind(el,binding,vnode){
        let ts = binding.value.timestamp;
        let path = vnode.context.$data['uppedImgs'][ts];
        delete vnode.context.$data['uppedImgs'][ts];
        if (path){
          let data = {
            path:path,
            service_type:2
          };
          vnode.context.$post('/apis/auth/v7api.php',data);
        }
      }
    }
  },
  async asyncData({app,req}){
    let [{data:emoData},res] = await Promise.all([
      app.$fetch('/static/emo/emo.json',{},req),
      app.$fetch('/apis/apiv16.php',{offset:0},req)
    ]);
    let emoMap={};
    emoData.forEach(e=>{
      e.thumbnail = e.path + e.thumbnail;
      if (e.pic){
        let f = e.path.split('/');
        let g = f[f.length-2]+'_';//类别前缀
        e.emoList.forEach(f=>{
          f.des = g + f.des;
          f.imgSrc=e.path+f.imgSrc;
          f.insert = '∫f(' + f.des + ')';
          emoMap[f.des] = f.imgSrc;
        });
      }
    });

    let {dynamics} = res.data.data;
    return {
      emoData,
      emoMap,

      dynamics,
      noMore:!!!dynamics.length
    }
  },
  data(){
    return{
      emoData:[{emoSeries:'',emoList:[]}],
      emoMap:{},

      dynamics:[],
      waiting:false,//标识更多动态加载状态
      noMore:false,//标识是否穷尽动态

      popupShow:false,
      delTarget:null, //待删目标

      content:'',
      ulUnfolded:true,
      uploadImgs:[],
      uppedImgs:{},//已经上传的图片，用时间戳作为键来区分先后

      anliTitle:'',
      anliLink:'',

      dType:0,
      typeMap:{1:'Anime',2:'极客',3:'游民',4:'随写'},
    }
  },
  computed:{
    ...mapGetters(['xAboveBottom'])
  },
  watch:{
    xAboveBottom(cur){
      if (cur<500)this.loadMore();
    }
  },
  methods:{
    textareaTab(e){
      if (e.keyCode === 9){//支持tab输入
        let target = e.target;
        if (document.selection){
          let sel = document.selection.createRange();
          sel.text = '    ';
        }
        else if (typeof target.selectionStart==='number'&&typeof target.selectionEnd==='number'){
          let startPos = target.selectionStart, endPos = target.selectionEnd;
          let cursorPos = startPos, tmp = this.content;
          this.content = tmp.substring(0,startPos) + '    ' +tmp.substring(endPos,tmp.length);
          cursorPos += 4;
          setTimeout(() => target.selectionStart = target.selectionEnd = cursorPos, 10);
        }
        else{
          this.content += '    ';
        }
        if (e&&e.preventDefault)
          e.preventDefault();
        else
          window.event.returnValue = false;
      }
    },
    addImg(e){
      let file = e.target.files[0];
      if (file){
        if(/image\/\w+/.test(file.type))
          if(file.size<10000000){
            this.uploadImgs.length<9 && this.uploadImgs.push({file:file,timestamp:new Date().getTime()});
          }
          else
            window.alert('文件过大');
        else window.alert('请选择正确的文件类型');
        e.target.value = '';
      }
    },
    delImg(index){
      this.uploadImgs.splice(index,1);
    },
    launchDynamic(){
      if (!this.content.trim()){window.alert('动态不能为空');return;}
      if (this.uploadImgs.length===Object.keys(this.uppedImgs).length){
        let uppedKeys = Object.keys(this.uppedImgs).map(e=>parseInt(e)).sort((a,b)=>a-b);
        let imgsString = uppedKeys.map(e=>this.uppedImgs[e]).join(',');
        let data = {
          content:this.content.trim(),
          d_type:this.dType,
          imgs_string:imgsString,
          service_type:3
        };
        this.$post('/apis/auth/v7api.php',data).then(res=>{
          switch (parseInt(res.data.code)) {
            case 0:
              this.content = '';
              this.dType = 0;
              this.uppedImgs = {};
              while (this.uploadImgs.pop()){}
              this.$store.dispatch('infoBox/callInfoBox',{info:'动态发布成功', ok:true, during:2000});
              this.dynamics.unshift(res.data.data.dynamic);
              break;
            case 2:
              this.uppedImgs = {};
              while (this.uploadImgs.pop()){}
              this.$store.dispatch('infoBox/callInfoBox',{info:'图片丢失，请重新上传', ok:false, during:3000});
              break;
            default:
              this.$store.dispatch('infoBox/callInfoBox',{info:'动态发布失败', ok:false, during:3000});
          }
        }).catch(err=>console.warn(err))
      }
      else
        this.$store.dispatch('infoBox/callInfoBox',{info:'图片上载中', ok:false, during:3000});
    },
    anli(){
      let validator = new Validator();
      validator.check(this.anliTitle,{strategy:'notEmpty',errMsg:'标题不能为空'});
      validator.check(this.anliLink,{strategy:'isLink',errMsg:'请输入正确网址'});
      let err = validator.checkResult();
      if (err){
        this.$store.dispatch('infoBox/callInfoBox',{info:err, ok:false, during:3000});
        return;
      }
      let data = {
        url:this.anliLink,
        title:this.anliTitle,
        service_type:5
      };
      this.$post('/apis/auth/v7api.php',data).then(res=>{
        if (res.data.code===0){
          this.anliTitle = this.anliLink = '';
          this.$store.dispatch('infoBox/callInfoBox',{info:'安利成功', ok:true, during:2000});
        }
        else
          this.$store.dispatch('infoBox/callInfoBox',{info:'安利失败', ok:false, during:3000});
      })
    },
    delDynamic(item){
      this.delTarget = item;
      this.popupShow = true;
    },
    delConfirm(bool){
      if (bool){
        let data = {
          delID:this.delTarget.id,
          service_type:4
        };
        this.$post('/apis/auth/v7api.php',data).then(res=>{
          if (!res.data.code){
            this.dynamics.splice(this.dynamics.indexOf(this.delTarget),1);
            this.popupShow = false;
            this.$store.dispatch('infoBox/callInfoBox',{info:'动态删除成功', ok:true, during:2000});
          }
        }).catch(err=>console.warn(err));
      }
      else
        this.popupShow = false
    },
    loadMore(){
      if (!this.noMore&&!this.waiting) {
        this.waiting = true;
        this.$fetch('/apis/apiv16.php',{offset:this.dynamics.length}).then(response=>{
          let tmp = response.data.data.dynamics;
          this.waiting = false;
          if (tmp.length) tmp.forEach(e=>this.dynamics.push(e));
          else this.noMore = true;
        })
      }
    }
  }
}
</script>

<style>
</style>
