<template>
  <div>
    <div class="section upload">
      <h3 class="section-title">图片上传</h3>
      <div class="section-content">
        <div class="upload-box">
          <transition name="balloon">
            <div class="balloon" v-if="balloonShow">请确认你已经填好描述并选择图片</div>
          </transition>
          <div class="upload-img" :class="{empty:!tmpImg}" @click="imgAdd" id="img">
            <div class="no-img-meta" v-if="!tmpImg">
              <i style="font-size: .5rem" class="iconfont icon-plus clearm"></i>
              <p>点击添加图片</p>
            </div>
            <input type="file" @change="imgChange" id="img-input" hidden>
          </div>
          <button @click="add2wait">添加至待上传</button>
        </div>

        <h4 class="tl">图片描述及归类</h4>
        <div class="upload-info">
          <div class="type-input">
            <span>{{typeMap[tmpType]}}</span><i class="iconfont icon-down clearm pr"></i>
            <ul><li v-for="(item,key) in typeMap" :key="key" @click="tmpType=key">{{item}}</li></ul>
          </div>
          <input type="text" class="description-input" placeholder="图片描述" v-model.trim="tmpDes">
        </div>
      </div>
    </div>

    <div class="section upload-list tl">
      <h3 class="section-title">待上传</h3>
      <div class="section-content" :class="{empty:!imgs.length}" etext="待上传图片——无">
        <div class="upload-list">
          <div class="album-card" v-for="item in imgs" :key="item.ts">
            <div class="picture" :style="item.img|bgUrl" :class="{uploading:item.uploading,fail:item.fail}">
              <a @click.stop="delImg(item)" v-if="!item.uploading" class="iconfont icon-trash clearm"></a>
            </div>
            <a class="title">{{item.des}}<span style="font-size: .12rem;color: #8b8e99"> ·{{typeMap[item.type]}}</span></a>
          </div>
        </div>
        <div class="upload-foot" v-if="imgs.length">
          <span>最多同时上传5张图片(多图先后顺序受影响)</span>
          <button @click="uploadAll">上传所有</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UCONF from '~/config/user.conf';
const {siteTitle:{title}} = UCONF;
export default {
  name: "space-album-upload",
  head(){
    return{
      title:`相册上传 | ${title}`
    }
  },
  filters:{
    bgUrl(file){
      let url = window.URL.createObjectURL(file);
      return  'background-image: url('+url+')'
    }
  },
  data(){
    return{
      balloonShow:false,
      imgs:[],
      tmpImg:null,
      tmpDes:'',
      tmpType:'anime',
      typeMap:{anime:'Anime',game:'游民',trivial:'日常'},
    }
  },
  methods:{
    imgAdd(){
      document.getElementById('img-input').click();
    },
    imgChange(e){
      let file = e.target.files[0];
      if (file){
        if(/image\/\w+/.test(file.type))
          if(file.size<10000000){
            let fr = new FileReader();
            fr.onload = ()=>document.getElementById('img').style.backgroundImage='url('+fr.result+')';
            fr.readAsDataURL(file);
            this.tmpImg = file;
          }
          else
            window.alert('文件过大');
        else window.alert('请选择正确的文件类型')
      }
    },
    add2wait(){
      if (this.tmpImg&&this.tmpDes){
        if (this.imgs.length<5){
          this.imgs.push({ts:new Date().getTime(),type:this.tmpType,des:this.tmpDes,img:this.tmpImg,uploading:false,fail:false});
          this.tmpImg = null;
          this.tmpDes = '';
          document.getElementById('img').style.backgroundImage='none'
        }
      }
      else{
        this.balloonShow = true;
        setTimeout(()=>this.balloonShow=false,5000)
      }
    },
    uploadAll(){
      this.imgs.forEach(e=>{
        e.uploading = true;
        let fd = new FormData();
        fd.append('type',e.type);
        fd.append('des',e.des);
        fd.append('img',e.img);
        this.$post_form('/apis/auth/v9api.php',fd).then(response=>{
          if (response.data.code < 1)
            this.imgs.splice(this.imgs.indexOf(e),1);
          else{
            e.uploading = false;
            e.fail = true
          }
        })
      })
    },
    delImg(item){
      this.imgs.splice(this.imgs.indexOf(item),1)
    }
  }
}
</script>

<style>
</style>
