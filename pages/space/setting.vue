<template>
  <div class="space-setting">
    <div class="section setting-tags">
      <h3 class="section-title" id="setting-tags">标签管理</h3>
      <div class="section-content">
        <div class="tag-cloud">
          <h4>Tags <a class="roll-toggle" href="javascript:void(0);" @click="tagExpand=!tagExpand" v-if="manyTags">{{this.tagExpand|expandStatus}}</a></h4>
          <ul class="tag-list" id="tag-list" :class="{more:tagExpand}">
            <li class="tag" v-for="item in tagCountList" :key="item.id"><a :title="item.count+' 相关'">{{item.tagName}}</a></li>
          </ul>
        </div>
        <div class="tag-set-btns">
          <div class="tag-add">
            <input type="text" v-model.trim="newTag" placeholder="添加标签，不含英文逗号">
            <a class="iconfont icon-plus tag-add-btn" @click="addTag"></a>
          </div>
          <div class="tag-del">
            <input type="text" v-model.trim="searchKey" placeholder="删除标签">
            <ul class="match-list" v-show="tagTips.length">
              <li class="match-list-item"
                  v-for="item in tagTips"
                  :key="item"
                  @click="searchKey=item">
                <span>{{beforeTarget(item)}}</span><span style="color:#00a1d6">{{target(item)}}</span><span>{{afterTarget(item)}}</span>
              </li>
            </ul>
            <a class="iconfont icon-trash tag-del-btn" @click="delTag"></a>
          </div>
        </div>
      </div>
    </div>

    <div class="section setting-series-cat">
      <h3 class="section-title" id="setting-series-cat">系列&分类管理</h3>
      <div class="section-content">
        <div class="setting-series">
          <h4>系列</h4>
          <ul>
            <li v-for="item in seriesList" :title="item.count+'相关'" :key="item.id">{{item.name}}<a class="iconfont icon-cancel" @click="delSeries(item)"></a></li>
          </ul>
          <div class="series-des-add">
            <input type="text" v-model.trim="newSeriesDes" placeholder="系列描述">
          </div>
          <div class="series-add">
            <input type="text" v-model.trim="newSeries" placeholder="新系列名">
            <a class="iconfont icon-plus series-add-btn" @click="addSeries"></a>
          </div>
        </div>
        <div class="setting-cat">
          <h4>笔记类别</h4>
          <ul>
            <li v-for="item in categoryList" :title="item.count+'相关'" :key="item.id">{{item.nameCN}}<span> · {{item.nameEN}}</span><a class="iconfont icon-cancel" @click="delCat(item)"></a></li>
          </ul>
          <div class="cat-add">
            <input type="text" v-model.trim="newCat" placeholder="添加类别，格式CN@EN">
            <a class="iconfont icon-plus cat-add-btn" @click="addCat"></a>
          </div>
        </div>
      </div>
    </div>

    <div class="section setting-bg">
      <h3 class="section-title" id="setting-bg">背景管理</h3>
      <div class="section-content">
        <div class="header-card" v-for="item in headers" :key="item.id">
          <div class="bg-chg" :style="{backgroundImage:'url('+item.imgSrc+')'}">
            <input type="text"  v-if="item.id<6" v-model.trim="item.tmpDes" title="修改吐槽">
            <input type="file" hidden :id="item.id" @change="imgChange">
            <a class="iconfont icon-image clearm" title="修改背景" @click="imgAdd"></a>
          </div>
          <div class="bg-title">
            {{item.title}}
            <a class="iconfont icon-save" v-if="item.tmpDes!==item.description||item.file" @click="changeHeader(item)">更改</a>
          </div>
        </div>
      </div>
    </div>

    <div class="section setting-link">
      <h3 class="section-title" id="setting-link">链接管理</h3>
      <div class="section-content">
        <div class="s-link-list">
          <h4>工 具 箱</h4>
          <ul>
            <li v-for="item in outerLinks.tool" :key="item.id"><a target="_blank" :href="item.url">{{item.name}}</a><i class="iconfont icon-shanchutupian" @click="delLink(item)"></i></li>
          </ul>
        </div>
        <div class="s-link-list">
          <h4>A·C·G</h4>
          <ul>
            <li v-for="item in outerLinks.acg" :key="item.id"><a target="_blank" :href="item.url">{{item.name}}</a><i class="iconfont icon-shanchutupian" @click="delLink(item)"></i></li>
          </ul>
        </div>
        <div class="s-link-list">
          <h4>森 罗 万 象</h4>
          <ul>
            <li v-for="item in outerLinks.kaleidoscope" :key="item.id"><a target="_blank" :href="item.url">{{item.name}}</a><i class="iconfont icon-shanchutupian" @click="delLink(item)"></i></li>
          </ul>
        </div>
        <div class="link-add">
          <div class="type-input">
            <span>{{linkTypeMap[newLinkType]}}</span><i class="iconfont icon-down clearm pr"></i>
            <ul><li v-for="(item,key) in linkTypeMap" :key="key" @click="newLinkType=key">{{item}}</li></ul>
          </div>
          <input type="text" v-model.trim="newLinkUrl" placeholder="ADD_URL">
          <input type="text" v-model.trim="newLinkName" placeholder="ADD_NAME" class="link-name">
          <a style="font-size: .16rem" class="iconfont icon-plus" @click="addLink"></a>
        </div>
      </div>
    </div>

    <div class="section setting-me">
      <h3 class="section-title" id="setting-me">帐号管理</h3>
      <div class="section-content">
        <p>因为很少用，待开发</p>
      </div>
    </div>

    <div class="popup-panel-container" v-if="popupShow">
      <div class="popup-panel">
        <h3 class="popup-title tl">{{popupTitle}}</h3>
        <div class="popup-content tl">{{popupContent}}?</div>
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
import {aesEncrypt} from "~/utils/crypto";
import Validator from '~/utils/Validator';
import Mixin_TagCloud from "~/reuse/mixins/Mixin-TagCloud";
import UCONF from '~/config/user.conf';
const {siteTitle:{title}} = UCONF;
export default {
  name: "space-setting",
  head(){
    return{
      title:`设置 | ${title}`
    }
  },
  mixins:[Mixin_TagCloud],
  asyncData({app,req}){
    return app.$fetch('/apis/auth/v10api.php',{},req).then(res=>{
      let {tagCountList,seriesList,categoryList,headers,outerLinks} = res.data.data;
      let tags = [];
      tagCountList.forEach(e=>tags.push(e.tagName));
      headers.forEach(e=>{
        e.file = undefined;
        e.tmpDes = e.description;
        e.imgSrc = '/root'+e.imgSrc;
      });
      return{
        tagCountList,
        manyTags:tagCountList.length>30,
        tags,
        seriesList,
        categoryList,
        headers,
        outerLinks
      }
    })
  },
  data(){
    return{
      popupTitle:'',
      popupContent:'',
      popupShow:false,
      delTarget:{},//删除对象，允许多种
      delWaiting:false,//用于防止竞争删除

      newTag:'',
      searchKey:'',
      tags:[],
      tagTips:[],

      seriesList:[],
      newSeries:'',
      newSeriesDes:'',
      categoryList:[],
      newCat:'',

      // headerMap: ['Anime', '极客', '游民', '随写', '笔记', '链接', '归档', '关于'],
      headers:[],

      linkTypeMap:{
        tool:'四次元工具箱',
        acg:'A·C·G',
        kaleidoscope:'森 罗 万 象'
      },
      outerLinks:{tool:[], acg:[], kaleidoscope:[]},
      newLinkUrl:'',
      newLinkName:'',
      newLinkType:'tool'
    }
  },
  computed:{
    target(){
      return tip => tip.substr(tip.toLowerCase().indexOf(this.searchKey.toLowerCase()),this.searchKey.length)
    },
    beforeTarget(){
      return tip => tip.substr(0,tip.toLowerCase().indexOf(this.searchKey.toLowerCase()))
    },
    afterTarget(){
      return tip => tip.substr(tip.toLowerCase().indexOf(this.searchKey.toLowerCase())+this.searchKey.length)
    }
  },
  watch:{
    searchKey(cur){
      this.tagTips = [];
      if (cur){
        let reg = new RegExp(cur,'i');
        for (let i=0;i<this.tags.length;i++)
          if (reg.test(this.tags[i]))
            this.tagTips.push(this.tags[i])
      }
    }
  },
  methods:{
    genKeySet(objArr){
      let r = [];
      objArr.forEach(e=>r.push(e.tagName));
      return r;
    },
    findTagID(tagName,tagCountList){
      for (let i = 0; i < tagCountList.length; i++) {
        if (tagCountList[i].tagName===tagName)
          return tagCountList[i].id;
      }
      return false;
    },
    addTag(){
      let validator = new Validator();
      validator.check(this.newTag,[
        {strategy:'notEmpty',errMsg:'标签不能为空'},
        {strategy:'notContains:,',errMsg:'标签不能含英文逗号'}
      ]);
      let err = validator.checkResult();
      if (err){
        this.$store.dispatch('infoBox/callInfoBox',{info:err, ok:false, during:3000});
        return;
      }
      let data = {newTag:this.newTag};
      this.$post('/apis/auth/v10api.php',{...aesEncrypt(JSON.stringify(data))}).then(response=>{
        if (response.data.code < 1){
          if (response.data.tagExist > 0)
            this.$store.dispatch('infoBox/callInfoBox',{info:'标签已存在', ok:false, during:2000});
          else{
            this.tagCountList.push(response.data.newTagInfo);
            this.tags = this.genKeySet(this.tagCountList);
            this.newTag = '';
            this.$store.dispatch('infoBox/callInfoBox',{info:'标签添加成功', ok:true, during:2000});
          }
        }
        else
          this.$store.dispatch('infoBox/callInfoBox',{info:'添加操作失败', ok:false, during:2000});
      }).catch(err=>console.warn(err))
    },
    addSeries(){
      let validator = new Validator();
      validator.check(this.newSeries,{strategy:'notEmpty',errMsg:'系列不能为空'});
      validator.check(this.newSeriesDes,{strategy:'notEmpty',errMsg:'系列描述不能为空'});
      let err = validator.checkResult();
      if (err){
        this.$store.dispatch('infoBox/callInfoBox',{info:err, ok:false, during:3000});
        return;
      }
      let data = {newSeries:this.newSeries,newSeriesDes:this.newSeriesDes};
      this.$post('/apis/auth/v10api.php',{...aesEncrypt(JSON.stringify(data))}).then(response=>{
        if (response.data.code<1){
          if (response.data.seriesExist > 0)
            this.$store.dispatch('infoBox/callInfoBox',{info:'系列已存在', ok:false, during:2000});
          else{
            this.seriesList.push({name:data.newSeries,id:response.data.id,count:0});
            this.newSeriesDes = this.newSeries = '';
            this.$store.dispatch('infoBox/callInfoBox',{info:'系列添加成功', ok:true, during:2000});
          }
        }
        else
          this.$store.dispatch('infoBox/callInfoBox',{info:'添加操作失败', ok:false, during:2000});
      }).catch(err=>console.warn(err))
    },
    addCat(){
      let CNEN = this.newCat.split('@');
      if (CNEN.length===2){
        let CN = CNEN[0].trim();
        let EN = CNEN[1].trim();
        let validator = new Validator();
        validator.check(CN,{strategy:'notEmpty',errMsg:'@左端不能为空'});
        validator.check(EN,{strategy:'isEn',errMsg:'@右端只允许英文数字下划线'});
        let err = validator.checkResult();
        if (err){
          this.$store.dispatch('infoBox/callInfoBox',{info:err, ok:false, during:3000});
          return;
        }
        let data = {newCatCN:CN,newCatEN:EN};
        this.$post('/apis/auth/v10api.php',{...aesEncrypt(JSON.stringify(data))}).then(response=>{
          if (response.data.code < 1) {
            if (response.data.catExist > 0)
              this.$store.dispatch('infoBox/callInfoBox',{info:'笔记类别已存在', ok:false, during:2000});
            else{
              this.categoryList.push({nameCN:CN,nameEN:EN,id:response.data.id,count:0});
              this.newCat = '';
              this.$store.dispatch('infoBox/callInfoBox',{info:'笔记类别添加成功', ok:true, during:2000});
            }
          }
          else
            this.$store.dispatch('infoBox/callInfoBox',{info:'添加操作失败', ok:false, during:2000});
        }).catch(err=>console.warn(err))
      }
      else
        this.$store.dispatch('infoBox/callInfoBox',{info:'创建格式非法', ok:false, during:2000});
    },
    addLink(){
      let validator = new Validator();
      validator.check(this.newLinkUrl,{strategy:'isLink',errMsg:'请输入正确网址'});
      validator.check(this.newLinkName,{strategy:'notEmpty',errMsg:'内容不能为空'});
      let err = validator.checkResult();
      if (err){
        this.$store.dispatch('infoBox/callInfoBox',{info:err, ok:false, during:3000});
        return;
      }
      let data = {newLinkUrl:this.newLinkUrl,newLinkName:this.newLinkName,newLinkType:this.newLinkType};
      this.$post('/apis/auth/v10api.php',{...aesEncrypt(JSON.stringify(data))}).then(response=>{
        if (response.data.code < 1) {
          if (response.data.linkExist>0)
            this.$store.dispatch('infoBox/callInfoBox',{info:'该链接已存在', ok:false, during:2000});
          else{
            this.outerLinks[data.newLinkType].push({name:data.newLinkName,url:data.newLinkUrl,type:data.newLinkType,id:response.data.id});
            this.newLinkName = this.newLinkUrl = '';
            this.$store.dispatch('infoBox/callInfoBox',{info:'外部链接添加成功', ok:true, during:2000});
          }
        }
        else
          this.$store.dispatch('infoBox/callInfoBox',{info:'添加操作失败', ok:false, during:2000});
      }).catch(err=>console.warn(err));
    },
    delTag(){
      if (this.tags.indexOf(this.searchKey) >= 0) {
        if (this.delWaiting)
          this.$store.dispatch('infoBox/callInfoBox',{info:'操作频繁，请稍等', ok:false, during:2000});
        else{
          let delTagID = this.findTagID(this.searchKey,this.tagCountList);
          if (!delTagID){
            this.$store.dispatch('infoBox/callInfoBox',{info:'操作失败', ok:false, during:2000});
          }
          else {
            this.delTarget = {delTagID:delTagID};
            this.popupTitle = '删除标签';
            this.popupContent = '确定要删除标签「'+this.searchKey+'」';
            this.popupShow = true
          }
        }
      }
      else
        this.$store.dispatch('infoBox/callInfoBox',{info:'不存在该标签', ok:false, during:2000});
    },
    delSeries(item){
      if (this.delWaiting)
        this.$store.dispatch('infoBox/callInfoBox',{info:'操作频繁，请稍等', ok:false, during:2000});
      else{
        this.delTarget = {delSeriesID:item.id};
        this.popupTitle = '删除系列';
        this.popupContent = '确定要删除系列《'+item.name+'》';
        this.popupShow = true
      }
    },
    delCat(item){
      if (this.delWaiting)
        this.$store.dispatch('infoBox/callInfoBox',{info:'操作频繁，请稍等', ok:false, during:2000});
      else{
        this.delTarget = {delCatID:item.id};
        this.popupTitle = '删除笔记类别';
        this.popupContent = '确定要删除笔记类别「'+item.nameCN+'」';
        this.popupShow = true
      }
    },
    delLink(item){
      if (this.delWaiting)
        this.$store.dispatch('infoBox/callInfoBox',{info:'操作频繁，请稍等', ok:false, during:2000});
      else{
        this.delTarget = {delLinkID:item.id,delLinkType:item.type};
        this.popupTitle = '删除外部链接';
        this.popupContent = '确定要删除外部链接「'+item.name+'」';
        this.popupShow = true;
      }
    },
    delConfirm(bool){
      if (bool){
        if (!this.delWaiting){
          this.delWaiting = true;
          this.$post('/apis/auth/v10api.php',{...aesEncrypt(JSON.stringify(this.delTarget))}).then(response=>{
            if (response.data.code < 1){
              if (this.delTarget.delTagID){
                this.searchKey = '';
                for (let i = 0; i < this.tagCountList.length; i++) {
                  if (this.tagCountList[i].id===this.delTarget.delTagID){
                    this.tagCountList.splice(i,1);
                    break;
                  }
                }
                this.tags = this.genKeySet(this.tagCountList);
              }
              else if(this.delTarget.delSeriesID){
                for(let i=0;i<this.seriesList.length;i++)
                  if (this.seriesList[i].id === this.delTarget.delSeriesID){
                    this.seriesList.splice(i,1);
                    break;
                  }
              }
              else if (this.delTarget.delCatID){
                for(let i=0;i<this.categoryList.length;i++)
                  if (this.categoryList[i].id === this.delTarget.delCatID){
                    this.categoryList.splice(i,1);
                    break;
                  }
              }
              else if(this.delTarget.delLinkID&&this.delTarget.delLinkType){
                let targetList = this.outerLinks[this.delTarget.delLinkType];
                for(let i=0;i<targetList.length;i++)
                  if (targetList[i].id === this.delTarget.delLinkID){
                    targetList.splice(i,1);
                    break;
                  }
              }
              this.$store.dispatch('infoBox/callInfoBox',{info:'删除操作成功', ok:true, during:2000});
            }
            else
              this.$store.dispatch('infoBox/callInfoBox',{info:'删除操作失败', ok:false, during:2000});
            this.delWaiting = false;
            this.popupShow = false;
          }).catch(err=>console.warn(err))
        }
        else
          this.$store.dispatch('infoBox/callInfoBox',{info:'操作中，请稍等', ok:false, during:2000});
      } //确认删除
      else
        this.popupShow = false
    },
    changeHeader(item){
      if (this.delWaiting)
        this.$store.dispatch('infoBox/callInfoBox',{info:'操作频繁，请稍等', ok:false, during:2000});
      else{
        let data = item.file?{headerID:item.id,description:item.tmpDes,file:1}:{headerID:item.id,description:item.tmpDes,file:0};
        let fd = new FormData();
        let encData_param = aesEncrypt(JSON.stringify(data));
        fd.append('encData',encData_param.encData);
        fd.append('param',encData_param.param);
        if (item.file){
          fd.append('bg',item.file)
        }
        this.$post_form('/apis/auth/v10api.php',fd).then(response=>{
          if (response.data.code < 1){
            item.file = undefined;
            item.description = item.tmpDes = response.data.data.des;
            this.$store.dispatch('infoBox/callInfoBox',{info:'背景修改成功', ok:true, during:2000});
          }
          this.delWaiting = false;
        }).catch(err=>console.warn(err));
      }
    },
    imgAdd(e){
      e.target.previousElementSibling.click();
    },
    imgChange(e){
      let id = e.target.id;
      let file = e.target.files[0];
      if (file){
        if(/image\/\w+/.test(file.type))
          if(file.size<10000000){
            let fr = new FileReader();
            fr.onload = ()=>this.headers[id].imgSrc = fr.result;
            fr.readAsDataURL(file);
            this.headers[id].file = file
          }
          else
            window.alert('文件过大');
        else window.alert('请选择正确的文件类型')
      }
    },
  }
}
</script>

<style>
</style>
