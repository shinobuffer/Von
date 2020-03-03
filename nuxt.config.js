module.exports = {
  /*
  ** Headers of the page
  */
  modules: [
    '@nuxtjs/proxy'
  ],
  proxy: {
    '/root': {
      target: 'http://localhost',
      changeOrigin:true,
      pathRewrite: {
        '^/root' : ''
      }
    }
  },
  head: {
    title: '忍野喵 | おしの · にゃ',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'a personal blog for ACG lover' },
      { hid: 'keywords', name: 'keywords', content: '忍野喵,oshinonya,ACG,coding,二次元,动漫,游戏,极客,前端,后端,jojo,东方,Fate,明日方舟' }
    ],
    link: [
      { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/apple-icon.png' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '/static/iconfont/iconfont.css' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/github.min.css' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Noto+Serif+SC:500,700&display=swap&subset=chinese-simplified,cyrillic' },
    ]
  },
  css:['~assets/styles/index.css','aplayer/dist/APlayer.min.css'],
  plugins:[
    '~plugins/http.js',
    '~plugins/prototype.js',
    '~plugins/vue_use.js',
  ],
  server: {
    port: 8080,
  },
  env:{
    API_ROOT: process.env.API_ROOT
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    extractCSS: { allChunks: true },//提取样式输出整个css
    /*
    ** Run ESLint on save
    */
    // extend (config, { isDev, isClient }) {
    //   if (isDev && isClient) {
    //     config.module.rules.push({
    //       enforce: 'pre',
    //       test: /\.(js|vue)$/,
    //       loader: 'eslint-loader',
    //       exclude: /(node_modules)/
    //     })
    //   }
    // }
  }
};

