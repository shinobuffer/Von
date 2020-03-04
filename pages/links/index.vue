<template>
  <div>
    <div class="page-header-wrap">
      <div class="pattern-full-width page-header">
        <div class="page-img" :style="{backgroundImage:'url(/root'+headerInfo.imgSrc+')'}">
          <div class="page-info fc">
            <h2 class="intro">{{headerInfo.title}}</h2>
            <p class="tsukkomi">{{headerInfo.description}}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="page-content-wrap">
      <div class="page-content link">
        <div class="content-area fc">
          <div class="link-description tl">
            <h2>壹 · 关于友链</h2>
            <p>作为半个肥宅 + 半个技术宅，每访问一个船新的博客，我总会不自觉地去点开 关于&链接，想着会不会又见到一个技术dalao或者和我志趣相投的人。这是一种非常神奇的体验，遇到同类、发现新事物让我欣喜雀跃（或许也只是我的怪癖而已）。</p>
            <p>不管怎样，现在拥有了自己博客之后，我也能参与到这条链的传递当中了，请多多指教</p>
            <del>（虽然我对SPA的SEO不抱什么希望）</del>
            <h2>貳 · 几点希望</h2>
            <ul>
              <li>符合社会主义核心价值观，网站不会给人造成困扰</li>
              <li>全站启用 HTTPS 访问 or 支持HTTP/2</li>
              <li>原创内容过半且定期更新</li>
              <li>第一点是硬性要求，不满足直接否决</li>
            </ul>
            <h2>叁 · 交易方式</h2>
            <p>通过评论 OR <a href="mailto:oshinoNya@outlook.com">邮箱</a>留下 <strong>名称，链接，简介，头像</strong> 即可如</p>
            <blockquote>
              <p>Name：忍野喵<br>Link：https://www.bilibili.com<br>Bio：今天喝了典明粥了吗<br>Avatar：https://www.bilibili.com</p>
            </blockquote>
            <p>友達になろう( *・ω・)✄╰ひ╯</p>
          </div>
          <div class="link-category">
            <div class="link_subtitle friends">
              友情链接
              <p>以添加时间为序</p>
            </div>
            <div class="friend-list">
              <ul>
                <li v-for="(item,index) in FList" :key="index">
                  <a :href="item.ulink" target="_blank" :title="item.message" rel="noopener">
                    <img v-lazyload="[item.avatar,'/static/images/spinner-preloader.svg']">
                    <h5>{{item.uname}}</h5>
                    <p>{{item.message||'这人很懒，什么都没留下'}}</p>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="link-category">
            <div class="link_subtitle">
              四次元工具箱
              <p>从最常用解析工具到各种神奇的网站</p>
            </div>
            <div class="link-list">
              <ul>
                <li v-for="item in outerLinks['tool']" :key="item.id"><a :href="item.url" target="_blank" rel="nofollow">{{item.name}}</a></li>
              </ul>
            </div>
          </div>
          <div class="link-category">
            <div class="link_subtitle">
              A·C·G
              <p>肥宅天堂</p>
            </div>
            <div class="link-list">
              <ul>
                <li v-for="item in outerLinks['acg']" :key="item.id"><a :href="item.url" target="_blank" rel="nofollow">{{item.name}}</a></li>
              </ul>
            </div>
          </div>
          <div class="link-category">
            <div class="link_subtitle">
              森 罗 万 象
              <p>这些都是我所不知道的东西</p>
            </div>
            <div class="link-list">
              <ul>
                <li v-for="item in outerLinks['kaleidoscope']" :key="item.id"><a :href="item.url" target="_blank" rel="nofollow">{{item.name}}</a></li>
              </ul>
            </div>
          </div>
        </div>
<!--        <comment id_="1" type="link" unique="1link"></comment>-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head(){
    return{
      title:'友链 | 忍野喵'
    }
  },
  components:{

  },
  asyncData({app,req}){
    return app.$relayFetch('/apis/apiv11.php',{},req.headers).then(res=>{
      let data = res.data.data;
      return{
        headerInfo:data.headerInfo,
        FList:data.FList,
        outerLinks:data.outerLinks
      }
    })
  },
  data(){
    return{
      headerInfo:{imgSrc:'/static/images/loading.gif',title:'友链',description:''},
      linkTypeMap:{//需要和 outerLinks 的键同步
        tool:'四次元工具箱',
        acg:'A·C·G',
        kaleidoscope:'森 罗 万 象'
      }
    }
  }
}
</script>

<style>
</style>
