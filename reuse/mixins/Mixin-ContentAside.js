import marked from "marked";
export default {
	data(){
		return{
			firstImg:'/static/images/nodata.png',
			firstDes:'NO IMAGE',
			dynamic:{id:0,content:'没有动态，\_(:3」∠)\_',time:'2333-06-06 xx:xx:xx'},
		}
	},
	methods:{
		markIt(src){
			src = src.replace(/∫f\(.+?_(.+?)\)/g,' \\[表情_$1\\] ');
			let renderer = new marked.Renderer();
			renderer.heading = (text) => `<p>${text}</p>`;
			renderer.hr = () => '';
			renderer.table = () => '';
			renderer.tablerow = () => '';
			renderer.tablecell = () => '';
			renderer.code = () => `<p><strong>[代码块]</strong></p>`;
			let tmp = document.createElement('div');
			tmp.innerHTML = marked(src,{
				renderer: renderer,
				gfm: true,
				tables: true,
				breaks: true, //不开启时，单个换行只会p内\n换行（表现为空格）、多个换行会生成两个p;开启时单个换行会导致p内br换行，多个换行会导致两个p间br换行
				pedantic: false,
				//sanitize: true,//开启时忽略rawString中的html标签
				smartLists: true,
				smartypants: false
			});
			let text = tmp.innerText;
			return text.length>100?`${text.slice(0,100)}…`:text;
		},
		openDyn(id){
			id && window.open(`/dynamic/${id}`)
		},
		openLB(){
			this.$store.commit('lumiBox/showC',true);
		},
	},
	filters:{
		dynTime(datetime){
			let ymd = datetime.substr(0,10).split('-');
			return `--- ${['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(ymd[1])]} ${ymd[2]}, ${datetime.substr(11,5)}`;
		}
	}
}
