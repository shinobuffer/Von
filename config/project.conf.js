export default {
	version:'v1.2.0',
	navList:[
		{icon:'iconfont icon-archive',des:'归档',animate:'rotate-bf',subs:[
				{icon:'iconfont icon-bilibili',des:'Anime',href:'/archive/anime'},
				{icon:'iconfont icon-code',des:'极客',href:'/archive/code'},
				{icon:'iconfont icon-youxi',des:'游民',href:'/archive/game'},
				{icon:'iconfont icon-coffee',des:'随写',href:'/archive/trivial'}
			],href:'/archive',isUnfolded:true},
		{icon:'iconfont icon-pen',des:'笔记',animate:'writing',subs:false,href:'/note',isUnfolded:true},
		{icon:'iconfont icon-tags',des:'标签',animate:'fade-bf',subs:false,href:'/tags',isUnfolded:true},
		{icon:'iconfont icon-dongtai',des:'动态',animate:'writing',subs:false,href:'/dynamic',isUnfolded:true},
		{icon:'iconfont icon-link',des:'友链',animate:'enlarge-abrupt',subs:false,href:'/links',isUnfolded:true},
		// {icon:'iconfont icon-gear',des:'实验室',animate:'spin',subs:false,href:'/lab',isUnfolded:true},
		{icon:'iconfont icon-leaf',des:'关于',animate:'axis-rotate',subs:false,href:'/about',isUnfolded:true}
	],

	MDPreviewMode:{
		scrollStyle:false,
		boxShadow:false,
		subfield:false,
		defaultOpen:'preview',
		editable:false,
		codeStyle:'github',
		toolbarsFlag:false,
		shortCut:false,
		tabSize:4,
		externalLink: {
			markdown_css:()=>'/static/css/github-markdown3.0.css'
		}
	},

	MDEditMode:{
		placeholder:'开始烤鸽子...',
		codeStyle:'github',//darcula
		imageFilter:function(file){
			return (/image\/\w+/.test(file.type)&&file.size<5000000);
		},
		tabSize:4,
		toolbars:{
			bold: true,
			italic: true,
			header: true,
			underline: true,
			strikethrough: true,
			mark: true,
			superscript: true,
			subscript: true,
			quote: true,
			ol: true,
			ul: true,
			link: true,
			imagelink: true,
			code: true,
			table: true,
			fullscreen: false,
			readmodel: true,
			htmlcode: false,
			help: false,//markdown 帮助
			undo: true,
			redo: true,
			trash: false,
			save: true,
			navigation: true,
			alignleft: true,
			aligncenter: true,
			alignright: true,
			subfield: true,
			preview: true,
		},
		externalLink: {
			markdown_css:()=>'/static/css/github-markdown3.0.css'
		}
	},


}
