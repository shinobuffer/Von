<template>
  <div>
    <div class="page-header-wrap">
      <div class="pattern-center page-header">
        <div class="ph-img" :style="'background-image: url(/root'+imgSrc+')'"></div>
        <div class="ph-info fc">
          <h1 class="entry-title">{{title}}</h1>
          <p class="entry-info">
            <nuxt-link :to="xtype|typeUrl">{{xtype|typeEN2CN}}</nuxt-link>
            <span class="isolate">·</span><span>{{time.substr(0,10)}}</span><span class="isolate">·</span><span>{{readCount|readNum}}阅读</span>
          </p>
        </div>
      </div>
    </div>

    <div class="page-content-wrap">
      <div class="page-content article">
        <div class="content-area fc">
          <div class="entry-series" id="entry-series" v-if="series">
            <p>本文属于系列<nuxt-link :to="'/series/'+series">《{{series}}》</nuxt-link></p>
          </div>
          <article :id="'post-'+$route.params.id" class="post-article">
            <div class="entry-content tl"><!--markdown 渲染区域-->
              <mavon-editor v-if="inClient"
                            v-model="rawContent"
                            :imageClick="imageClick"
                            :scrollStyle="mdSet.scrollStyle"
                            :boxShadow="mdSet.boxShadow"
                            :subfield="mdSet.subfield"
                            :defaultOpen="mdSet.defaultOpen"
                            :editable="mdSet.editable"
                            :toolbarsFlag="mdSet.toolbarsFlag"
                            :shortCut="mdSet.shortCut"
                            :tabSize="mdSet.tabSize"
                            :externalLink="mdSet.externalLink"
                            @change="afterRender"/>
              <ssr-editor v-else :raw-content="rawContent"/>
            </div>
            <footer class="post-footer tl">
              <div class="post-update"><span>{{lut}} Lsat Update</span></div>
              <div class="post-reward"></div><!--暂不开发-->
              <div class="post-copyright">
                <div class="post-copyright-author tl">
                  <span class="pck">文章作者：</span><span class="pcv">{{author}}</span>
                </div>
                <div class="post-copyright-link tl">
                  <span class="pck">文章链接：</span><span class="pcv">{{xurl}}</span>
                </div>
                <div class="post-copyright-license tl">
                  <span class="pck">版权声明：</span><span>文章采用</span>
                  <span><a class="pcv" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh" target="_blank" rel="nofollow"><i class="iconfont icon-cc" aria-hidden="true"></i>CC BY-NC-SA 4.0</a></span>
                  <span>，转载时请标明来源并附上地址</span>
                </div>
              </div>
              <div class="post-bot">
                <div class="post-tags">
                  <i class="iconfont icon-tags"></i>
                  <span v-if="!tags.length" style="margin-left: .25rem;vertical-align: middle">NO TAGS</span>
                  <ul v-else>
                    <li class="tag" v-for="(tag,index) in tags" :key="index"><nuxt-link :to="'/tags/'+tag" rel="tag">{{tag}}</nuxt-link></li>
                  </ul>
                </div>
                <div class="post-like pr">
                  <a href="javascript:void(0);" title="等待实装" class="like"><i class="iconfont icon-heart"></i><span class="count">{{liked}}</span></a>
                </div>
                <div class="post-share pr">
                  <i class="iconfont icon-share clearm"></i>
                  <div class="share-option">
                    <a class="iconfont icon-wechat">
                      <div class="wechat-qrcode">
                        <h4>微信扫一扫</h4>
                        <div class="qrcode" id="qrcode"></div>
                        <p>微信扫一扫打开网页</p>
                        <p>左上角分享给朋友/朋友圈</p>
                      </div>
                    </a>
                    <a class="iconfont icon-qq" :href="qqShareUrl" target="_blank" rel="nofollow"></a>
                    <a class="iconfont icon-weibo" :href="weiboShareUrl" target="_blank" rel="nofollow"></a>
                    <a class="iconfont icon-facebook" :href="facebookShareUrl" target="_blank" rel="nofollow"></a>
                    <a class="iconfont icon-twitter" :href="twitterShareUrl" target="_blank" rel="nofollow"></a>
                  </div>
                </div>
              </div>
            </footer>
          </article>
          <div class="post-prev">
            <div class="previous tl" v-if="pre" :class="{half:pre&&next}">
              <nuxt-link :to="pre|toUrl">
                <div class="background">
                  <img v-lazyload="[`/root${pre.imgSrc}`,`/root${pre.imgSrc}.thumb`]" alt="previous">
                </div>
                <span class="label">PREVIOUS</span>
                <div class="info">
                  <h3>{{pre.title}}</h3>
                </div>
              </nuxt-link>
            </div>
            <div class="next tr" v-if="next" :class="{half:pre&&next}">
              <nuxt-link :to="next|toUrl">
                <div class="background">
                  <img v-lazyload="[`/root${next.imgSrc}`,`/root${next.imgSrc}.thumb`]" alt="next">
                </div>
                <span class="label">NEXT</span>
                <div class="info">
                  <h3>{{next.title}}</h3>
                </div>
              </nuxt-link>
            </div>
          </div>

          <div class="toc-wrap" :style="{height:articleHeight+'px'}" v-if="!isMobile">
            <div class="toc">
              <ol class="toc-list">
                <li class="toc-list-item" v-for="each in titleList" :key="each.index">
                  <a :href="'#'+each.id" class="toc-link" :title="each.des" :class="{'is-active-link':scrollTop>titlePosition[each.index]&&scrollTop<titlePosition[each.index+1]}">{{each.des}}</a>
                  <ol v-if="each.subs.length" class="toc-list is-collapsible" :class="{'is-collapsed':isCollapsed(each.subs)}">
                    <li class="toc-list-item" v-for="sub in each.subs" :key="sub.index">
                      <a :href="'#'+sub.id" class="toc-link" :title="sub.des" :class="{'is-active-link':scrollTop>titlePosition[sub.index]&&scrollTop<titlePosition[sub.index+1]}">{{sub.des}}</a>
                    </li>
                  </ol>
                </li>
              </ol>
            </div>
          </div>
        </div>
        <comment-module :id_="xid" :type="xtype" :unique="xid+xtype"/>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import {copyText} from "~/utils/lib";
import CommentModule from "~/components/CommentModule";
import PCONF from "~/config/project.conf";
import UCONF from "~/config/user.conf";
const {siteURL,siteTitle} = UCONF;
export default {
  name:'Article',
  head(){
    return{
      title:`${this.title} | ${siteTitle.title}`,
      meta:[
        {hid:'description',name:'description',content:this.preview},
        {hid:'keywords',name:'keywords',content:`${this.tags.join(',')},忍野喵,oshinonya`}
      ]
    }
  },
  validate({params}){
    return ['anime','code','game','trivial','note'].indexOf(params.type)!==-1 && /^[1-9]\d*$/.test(params.id)
  },
  beforeRouteLeave(to,from,next){
    this.$store.commit('appBgC','');
    next()
  },
  components:{
    CommentModule
  },
  filters:{
    toUrl(item){
      if (item)
        return item.type==='note'?'/note/'+item.id:'/archive/'+item.type+'/'+item.id;
      else
        return '';
    },
    typeUrl(type){
      if (type)
        return type==='note'?'/note':'/archive/'+type;
      else
        return ''
    },
    typeEN2CN(type){
      switch (type) {
        case 'anime':return 'Anime';
        case 'code':return '极客';
        case 'game':return '游民';
        case 'trivial':return '随写';
        case 'note':return '笔记';
        default:return '???'
      }
    },
    readNum(count){
      return count?count.replace(/(\d)(?=(?:\d{3})+$)/g,'$1,'):'???'
    },
  },
  asyncData({app,store,params,req,error}){
    const genXurl = (xtype,xid)=>{
      if (xtype==='note')
        return `${siteURL}/note/${xid}`;
      else
        return `${siteURL}/archive/${xtype}/${xid}`
    };
    return app.$fetch('/apis/apiv3.php',{xid:params.id,_:params.type[0]},req).then(res=>{
      if (res.data.code > 0){
        error({statusCode:404,message:'文章404'});
        return;
      }
      let {rawContent,pre,next,info:{
        title,preview,imgSrc,author,time,lut,tags,liked,readCount,series
      }} = res.data.data;
      store.commit('appBgC',imgSrc);
      return{
        xid:params.id,
        xtype:params.type,
        xurl:genXurl(params.type,params.id),

        rawContent,
        title,
        preview,
        imgSrc,
        author,
        time,
        lut,
        tags,
        liked,
        readCount,
        series,
        pre,next
      }
    })
  },
  data(){
    return{
      xid:null,
      xtype:null,
      xurl:'',
      title:'',
      preview:'',
      imgSrc:'/static/images/loading.gif',
      author:'忍野ニャ',
      time:'1111-11-11',
      lut:'1111-11-11 11:11:11',
      tags:[],
      liked:0,
      readCount:undefined,
      series:undefined,//acgt特有
      rawContent:'',
      qrcode:null,
      pre:null,
      next:null,
      mdSet:PCONF.MDPreviewMode,
      inClient:false,

      titleList:[],
      titlePosition:[],
      articleHeight:null,
      imageClick: (e)=>{
        let imgs = document.querySelectorAll('.v-show-content img');
        let index = 0;
        for (; index < imgs.length; index++) {
          if(imgs[index]===e)
            break
        }
        this.$store.commit('lumiBox/indexC',index);
        this.$store.commit('lumiBox/showC',true);
      }
    }
  },
  computed:{
    ...mapState(['scrollTop','isMobile']),
    qqShareUrl(){
      return 'http://connect.qq.com/widget/shareqq/index.html?'+
        'url='+encodeURIComponent(this.xurl)+
        '&title='+encodeURIComponent(this.title)+
        '&source='+encodeURIComponent(this.title)+
        '&desc='+encodeURIComponent(this.preview)+
        '&pics='+encodeURIComponent(siteURL + this.imgSrc)+
        '&summary='+encodeURIComponent(this.preview)
    },
    weiboShareUrl(){
      return 'http://service.weibo.com/share/share.php?'+
        'url='+encodeURIComponent(this.xurl)+
        '&title='+encodeURIComponent(this.title)+
        '&pic='+encodeURIComponent(siteURL + this.imgSrc)+
        '&appkey='
    },
    twitterShareUrl(){
      return 'https://twitter.com/intent/tweet?'+
        'text='+encodeURIComponent(this.title)+
        '&url='+encodeURIComponent(this.xurl)+
        '&via='+encodeURIComponent(siteURL)
    },
    facebookShareUrl(){
      return 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(this.xurl)
    },
  },
  mounted(){
    this.inClient = true;
    this.qrcode = new (require('qrcodejs2'))('qrcode',{
      width:100,
      height:100
    });
    this.qrcode.makeCode(this.xurl);
  },
  methods:{
    afterRender(){
      // if (!this.$route.hash)
      //   setTimeout(()=>document.body.scrollIntoView(true),250);
      // else{
      //   setTimeout(()=>document.getElementById(this.$route.hash.substr(1)).scrollIntoView(true),250);
      // }
      !this.isMobile && setTimeout(()=>this.genNavList(),500);
      setTimeout(()=>this.codeDecorate(),500);
      setTimeout(()=>this.loadImgs(),500);
    },
    isCollapsed(subs) {
      if(!subs.length) return false;
      else return this.scrollTop>this.titlePosition[subs[subs.length-1].index+1];
    },
    genNavList(){
      let ESNode = document.getElementById('entry-series');
      let ESHeight = ESNode?ESNode.offsetHeight:0;
      while (this.titleList.pop()){}
      let hs = document.querySelectorAll('.v-show-content h2,.v-show-content h3');
      let H2indexs =[];
      for(let i=0;i<hs.length;i++)
        if(hs[i].tagName === 'H2'){
          H2indexs.push(i);
          this.titleList.push({
            id:hs[i].children[0].getAttribute('id'),
            index:i+1,
            des:hs[i].innerText,
            subs:[]
          })
        }
      H2indexs.push(hs.length);
      for(let i=0;i<H2indexs.length-1;i++){
        for(let j=H2indexs[i]+1;j<H2indexs[i+1];j++){
          this.titleList[i].subs.push({
            id:hs[j].children[0].getAttribute('id'),
            index:j+1,
            des:hs[j].innerText,
            subs:false
          })
        }
      }
      if (this.titleList.length){
        let sublen = this.titleList[this.titleList.length-1].subs.length;
        let cindex = sublen?this.titleList[this.titleList.length-1].subs[sublen-1].index+1:this.titleList[this.titleList.length-1].index+1;
        this.titleList.push({des:'Comments',id:'comments',index:cindex,subs:[]});
      }
      else
        this.titleList.push({des:'Comments',id:'comments',index:1,subs:[]});
      //console.log(this.titleList);
      this.titlePosition = [];
      this.titlePosition.push(0);
      this.titleList.forEach((v1)=>{
        this.titlePosition.push(document.getElementById(v1.id).offsetTop+540+ESHeight);
        if(v1.subs.length)
          v1.subs.forEach((v2)=>this.titlePosition.push(document.getElementById(v2.id).offsetTop+540+ESHeight))
      });
      this.titlePosition[this.titlePosition.length-1] -= 600+ESHeight;
      this.titlePosition.push(document.body.offsetHeight);
      this.articleHeight = document.getElementsByClassName('content-area')[0].offsetHeight+380;
      //console.log(this.titlePosition)
    },
    codeDecorate(){
      let blocks = document.querySelectorAll('.v-show-content pre code');//下面是代码块修饰，待markdown渲染完后，添加侧边行数和复制按钮
      blocks.forEach(e=>{
        let copyBtn = document.createElement('button');
        copyBtn.innerText = 'Copy';
        copyBtn.classList.add('copy-btn');
        copyBtn.onclick = (e) => {
          let flag = copyText(e.target.previousElementSibling.innerText);
          if (flag)
            this.$store.dispatch('infoBox/callInfoBox',{info:'代码拷贝成功', ok:true, during:2000});
          else
            this.$store.dispatch('infoBox/callInfoBox',{info:'代码拷贝失败', ok:false, during:2000});
        };
        e.parentElement.appendChild(copyBtn);

        let numberring = document.createElement('ul');
        numberring.classList.add('line-numbers-rows');
        for (let i=1;i<=e.innerText.split('\n').length-1;i++){
          let li = document.createElement('li');
          li.innerText = i;
          numberring.appendChild(li)
        }
        e.parentElement.appendChild(numberring);
      })
    },
    loadImgs(){
      let imgs = document.querySelectorAll('.v-show-content img');
      let IDTs = [];
      imgs.forEach(e=>{
        IDTs.push({imgSrc:e.src,description:e.alt})
      });
      this.$store.commit('lumiBox/imgsC',IDTs)
    }
  },
}
</script>

<style>
</style>
