<template>
  <div @click="catExpand=tiFocus=false">
    <div class="page-header-wrap">
      <div class="pattern-full-width page-header">
        <div class="no-img" v-show="!hi" @click="hiAdd">
          <i class="iconfont icon-images clearm" style="font-size: .5rem"></i>
          <h4>请添加笔记头图</h4>
          <p class="tips">支持5MB内的JPG／JPEG／BMP／PNG格式的高清图片</p>
          <p class="tips">（建议大于960*540像素）</p>
        </div>
        <div class="header-img" id="hi" v-show="hi">
          <div class="hi-control">
            <button class="re-add" @click="hiAdd"><i class="iconfont icon-image clearm"></i></button>
            <button class="delete" @click="hi=null"><i class="iconfont icon-trash clearm"></i></button>
          </div>
        </div>
        <input type="file" @change="hiChange" id="hi-add" hidden>
      </div>
    </div>
    <div class="page-content-wrap">
      <div class="publish-area">
        <div class="pa-unit">
          <i class="iconfont icon-title">:</i>
          <input type="text" class="title-input" placeholder="无题" v-model.trim="title">
        </div>
        <div class="pa-unit">
          <i class="iconfont icon-file">:</i>
          <input type="text" class="preview-input" placeholder="无介绍则截取笔记内容开头代之" v-model.trim="preview">
        </div>
        <div class="pa-unit detail-select">
          <div class="tag-btn-wrap" >
            <span>Tags</span>
            <div class="tag-btn tl" @click.stop>
              <div class="no-select dis-ib" v-if="!isMobile">
								<span v-for="each in selectedTagsID" :key="each" class="tag-item">
									{{tagMap[each]}}
									<i class="iconfont icon-cancel clearm" @click="deleteTagID(each)"></i>
								</span>
              </div>
              <span class="tag-num" v-if="selectedTagsID.length">{{selectedTagsID.length}}</span>
              <input class="tag-input" type="text" placeholder="请选中已有标签或新建标签，逗号/分号分隔"
                     v-model="inputTags"
                     @focus="tagInputFocus">
              <ul v-show="tiFocus&&Object.keys(tagMap).length>0">
                <li v-for="(item,key) in tagMap"
                    :key="key"
                    :class="{'t-selected':selectedTagsID.indexOf(key)!==-1}"
                    @click="selectTagID(key)">{{item}}</li>
              </ul>
            </div>
          </div>
          <div class="cat-btn">
            <span>Category</span>
            <button @click.stop="categoryClick" :title="selectedCat" class="tl">
              <span>{{selectedCat||'未分类'}}</span>
              <i class="iconfont icon-down"></i>
            </button>
            <ul v-show="catExpand">
              <li v-for="item in catOptions"
                  :key="item['cid']"
                  :title="item['catName']"
                  @click="categorySelect(item)">{{item['catName']}}</li>
            </ul>
          </div>
        </div>
        <mavon-editor v-if="inClient"
                      v-model="rawContent"
                      :imageClick="imageClick"
                      :placeholder="mdSetting.placeholder"
                      :imageFilter="mdSetting.imageFilter"
                      :tabSize="mdSetting.tabSize"
                      :toolbars="mdSetting.toolbars"
                      :externalLink="mdSetting.externalLink"
                      @imgAdd="imgAdd"
                      @imgDel="imgDel"
                      @save="saveTmp"
                      ref=md />
        <div class="pa-submit"><button @click="launch"><i class="iconfont icon-launch"></i> Launch</button></div>
      </div>
    </div>
  </div>
</template>

<script>
import {unique} from "../utils/lib";
import Validator from '../utils/Validator';
import Mixin_Writing from "../reuse/mixins/Mixin-Writing";
export default {
  name: "takenote",
  watchQuery:['nid'],
  middleware:'preauth',
  head(){
    return{
      title:this.title||'标题未定'
    }
  },
  mixins:[Mixin_Writing],
  async asyncData({app,query,req,redirect}){
    if (query.nid){
      let res = await app.$fetch('/apis/edit/initn.php',query,req);
      if (res.data.code<1 && res.data.exist>0){
        let {
          rawContent,tagMap,catOptions,
          info:{
            title,preview,
            category:selectedCat,
            categoryID:selectedCatID,
            tagsID:selectedTagsID,
            inputTags,
            imgSrc:hi
          }
        } = res.data;
        return {
          nid:query.nid,
          rawContent:rawContent||'',
          tagMap:tagMap||{},
          catOptions:catOptions||[],
          title:title||'',
          preview:preview||'',
          selectedCat:selectedCat||null,
          selectedCatID:selectedCatID||1,
          selectedTagsID:selectedTagsID||[],
          inputTags:inputTags||'',
          hi:hi||null
        }
      }else{
        redirect('/')
      }
    }
    else{
      let res = await app.$fetch('/apis/edit/initn.php',{},req);
      if (res.data.code < 1){
        let {nid} = res.data;
        redirect(`/takenote?nid=${nid}`)
      }else{
        redirect('/')
      }
    }
  },
  data(){
    return{
      catOptions:[],

      nid:this.$route.query.nid,
      selectedType:'note',

      selectedCat:null,
      selectedCatID:1,

      catExpand:false,
    }
  },
  created(){
    if (this.isMobile){
      this.mdSetting.toolbars.subfield = false;
      this.mdSetting.subfield = false;
    }
  },
  methods:{
    tagInputFocus(){
      this.tiFocus=true;
      this.catExpand=false
    },
    categoryClick(){
      this.catExpand=!this.catExpand;
      this.tiFocus=false
    },
    categorySelect(item){
      this.selectedCat=item['catName'];
      this.selectedCatID=item['cid']
    },
    saveTmp(v){
      let it;
      if(!this.title){//标题非空
        window.alert('请输入标题');
        return;
      }
      if(/^([^,;，；]+[,;]?\s*)*$/.test(this.inputTags)){//输入标签合法并处理
        it = this.inputTags.replace(/^[\s,;]+|[\s,;]+$/gm,'').replace(/\s*[,;]\s*/g,',');
      }
      else{
        window.alert('inputTags非法');
        return ;
      }
      let data = {
        type:'note',
        title:this.title,
        preview:this.preview,
        author:this.author,
        tagsID:this.selectedTagsID.join(','),
        inputTags:it,
        categoryID:this.selectedCatID,
        rawContent:v.trim(),
      };
      this.$post('/apis/edit/saveTmp.php?nid='+this.nid,data).then(response=>{
        if (response.data.code<1)
          this.$store.dispatch('infoBox/callInfoBox',{
            info:'草稿保存成功',
            ok:true,
            during:2000
          });
        else
          this.$store.dispatch('infoBox/callInfoBox',{
            info:'草稿保存失败',
            ok:false,
            during:2000
          });
      }).catch(err=>console.warn(err));
    },
    launch(){
      let validator = new Validator();
      validator.check(this.title,{strategy:'notEmpty',errMsg:'请填写标题'});
      validator.check(this.rawContent.trim(),{strategy:'notEmpty',errMsg:'请写点东西'});
      validator.check(this.hi,{strategy:'notEmpty',errMsg:'请选择背景图'});
      let err = validator.checkResult();
      if (err){
        this.$store.dispatch('infoBox/callInfoBox',{info:err, ok:false, during:3000});
        return;
      }
      let it;
      let it_ = [];//当前标签集合
      for (let key in this.tagMap)it_.push(this.tagMap[key].toLowerCase());
      if(/^([^,;，；]+[,;]?\s*)*$/.test(this.inputTags)){
        it = this.inputTags.replace(/^[\s,;]+|[\s,;]+$/gm,'').replace(/\s*[,;]\s*/g,',').split(',');
        it = unique(it);
        it  = it.filter(v=>{return it_.indexOf(v.toLowerCase())===-1}).join(',');
        //然后去重,筛选新标签合并,发送至launch
      }
      else{
        window.alert('inputTags非法');
        return ;
      }
      let tmp = document.createElement('div');
      tmp.innerHTML = this.$refs.md.$data['d_render'];
      let data = {
        type:this.selectedType,
        title:this.title,
        preview:this.preview?this.preview:`${tmp.innerText.slice(0,95).replace(/ +/g,' ')}…`,
        author:this.author,
        tagsID:this.selectedTagsID.join(','),
        newTags:it,
        categoryID:this.selectedCatID,
        rawContent:this.rawContent.trim(),
      };
      if(typeof this.hi==='object'){
        let fd = new FormData();
        fd.append('hi',this.hi);
        this.$post_form('/apis/edit/mdimg.php?nid='+this.nid,fd).then(response=>{
          if (response.data.code < 1) {
            data.imgSrc = response.data.imgSrc;
            this.$post('/apis/edit/launch.php?nid='+this.nid,data).then(re=>{
              if (re.data.code<1){
                this.$store.dispatch('infoBox/callInfoBox',{info:'笔记发布成功', ok:true, during:2000});
                this.$router.push({name:'space'});
              }
              else
                this.$store.dispatch('infoBox/callInfoBox',{
                  info:'笔记发布失败，bug?',
                  ok:false,
                  during:2000
                });
            }).catch(err=>console.warn(err));
          }
          else
            this.$store.dispatch('infoBox/callInfoBox',{
              info:'笔记头图片上传失败，终止发布',
              ok:false,
              during:2000
            });
        }).catch(err=>console.warn(err));
      }
      else{
        data.imgSrc = this.hi;
        this.$post('/apis/edit/launch.php?nid='+this.nid,data).then(response=>{
          if (response.data.code < 1){
            this.$store.dispatch('infoBox/callInfoBox',{info:'笔记发布成功', ok:true, during:2000});
            this.$router.push({name:'space'});
          }
          else
            this.$store.dispatch('infoBox/callInfoBox',{info:'笔记发布失败，bug?', ok:false, during:2000});
        }).catch(err=>console.warn(err));
      }
    }
  }
}
</script>

<style>
</style>
