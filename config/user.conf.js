export default {
  // TODO: 考虑将大部分移动至后端数据库
  siteURL:'https://oshinonya.com',//网站域名
	sinceTime:1573659213000, //网站始于 2019.11.13 23:33:33 GTM+8
	birthday:'1999-06-05', //生日，用于计算年龄
  email:'oshinoNya@outlook.com',//联系邮箱
	statusMap:[
		{icon:'icon-coffee',des:'享受',color:'#b77d68'},
		{icon:'icon-focus',des:'不咕鸟',color:'#ff3d44'},
		{icon:'icon-gezi',des:'咕咕咕',color:'#00a1d6'},
		{icon:'icon-bxs-smiley-sad',des:'(悲)',color:'#9b9b9b'}
	],
	socialList:[//首页社交链接
		{title:'github',href:'https://github.com/Bersder',imgSrc:'/static/images/sns/github.png'},
		{title:'netease',href:'https://music.163.com/user/home?id=93044810',imgSrc:'/static/images/sns/netease.png'},
		{title:'bilibili',href:'https://space.bilibili.com/13351138',imgSrc:'/static/images/sns/bilibili.png'},
		{title:'twitter',href:'https://twitter.com/nya_oshino',imgSrc:'/static/images/sns/twitter.png'},
		{title:'email',href:'mailto:oshinoNya@outlook.com',imgSrc:'/static/images/sns/email.png'},
	],
	friendExchange:[//Game页面右侧游戏好友交换
		{icon:'iconfont icon-playstation',description:'PSN',value:'Bersder3000'},
		{icon:'iconfont icon-ns',description:'NS',value:'SW-1724-8480-2131'},
		{icon:'iconfont icon-steam',description:'steam',value:'Bersder3000'}
	],
	languageList:[//Code页面右侧语言列表
		{lang:'python',imgSrc:'/static/images/lang/moe.python.jpg',description:'python是最好的语言'},
		{lang:'c',imgSrc:'/static/images/lang/moe.c.png',description:'这是什么，我有学过吗(滑稽)'},
		{lang:'php',imgSrc:'/static/images/lang/moe.php.jpg',description:'破站后端支持'},
		{lang:'js',imgSrc:'/static/images/lang/moe.javaScript.jpg',description:'...'},
	],
	siteHistory:[//关于页面的网站黑历史
		['????-??-??','学Vue时用Vue写了一个页面，自认为还不错，加之有建博客的想法，然后一发不可收拾...'],
		['2019-11-13','经过5个月的摸爬滚打，初版博客最终完成（其实是不想再拖了，实际上想干的是还是很多）'],
		['2019-12-16','新添番组页面，与 bangumi 账户维持同步，展示追番进度'],
		['2020-02-06','新增动态页面，可以发带图动态了'],
		['2020-03-30','破站 nuxt 重构完成，唉，坑真不是一般的多'],
	],
	siteTitle:{//网站标题显示
		title:'忍野喵',
		title_:' | 忍野喵',
		subTitle:'おしの · にゃ'
	}
}
