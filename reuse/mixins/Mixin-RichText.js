import {copyText,unique} from "~/utils/lib";
import hljs from "highlight.js"
import marked from 'marked';
export default {
	data(){
		return{
			allCount:'??',
			pageNum:1,
			curPage:1,
			commentWaiting:true,
			commentList:[],

			nickname:'',
			qq:'',
			email:'',
			content:'',

			emoData:[{emoSeries:'',emoList:[]}],
			emoMap:{},

			to_id:null,
			to_uid:null,
			to_uname:null,
			notifyMe:true,
		}
	},
	methods:{
		markedInit(){
			let renderer = new marked.Renderer();
			renderer.heading = (text) => `<p>${text}</p>`;
			renderer.hr = () => '';
			renderer.table = () => '';
			renderer.tablerow = () => '';
			renderer.tablecell = () => '';
			marked.setOptions({
				renderer: renderer,
				gfm: true,
				tables: true,
				breaks: true, //不开启时，单个换行只会p内\n换行（表现为空格）、多个换行会生成两个p;开启时单个换行会导致p内br换行，多个换行会导致两个p间br换行
				pedantic: false,
				sanitize: true,//开启时忽略rawString中的html标签
				smartLists: true,
				smartypants: false,
				silent:true
			});
		},
		emoRenderer(raw){
			let tmp = raw;
			let replaceSrcList = tmp.match(/∫f\(.+?\)/g);
			if (replaceSrcList){ //当使用了表情包后，需要转义替换以便mark
				let replaceDstList = [];
				let replaceAltList = [];
				replaceSrcList = unique(replaceSrcList);
				replaceSrcList.forEach(e=>{
					let alt = e.match(/∫f\((.+?)\)/)[1];
					replaceAltList.push(alt);
					replaceDstList.push(this.emoMap[alt]);
				});
				// console.log(replaceSrcList);
				// console.log(replaceAltList);
				// console.log(replaceDstList);
				for (let i = 0; i < replaceSrcList.length; i++){
					let reg = new RegExp(replaceSrcList[i].replace('(','\\(').replace(')','\\)'),'g');
					if (replaceDstList[i])//没有的表情不进行渲染
						tmp = tmp.replace(reg,'!['+replaceAltList[i]+'](/root'+replaceDstList[i]+') ');
					else
						tmp = tmp.replace(reg,' ');
				}
			}
			return tmp
		},
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
		async fetchEmo(){
			let response = await this.$fetch('/static/emo/emo.json');
			let data = response.data;
			data.forEach(e=>{
				e.thumbnail = e.path + e.thumbnail;
				if (e.pic){
					let f = e.path.split('/');
					let g = f[f.length-2]+'_';//类别前缀
					e.emoList.forEach(f=>{
						f.des = g + f.des;
						f.imgSrc=e.path+f.imgSrc;
						f.insert = '∫f(' + f.des + ')';
						this.emoMap[f.des] = f.imgSrc;
					});
				}
			});
			this.emoData = data;
		},
		gen_children(comment){
			let stack = [];
			let children = [];
			stack.push(comment);
			let replies;
			while (stack.length){
				replies = stack.pop();
				let target = {...replies};
				delete target.replies;
				children.push(target);
				replies = replies.replies;
				for (let i = replies.length - 1; i >= 0; i--) stack.push(replies[i])
			}
			children.shift();
			return children;
		},
	},
	computed:{
		pageList:function () {
			if(this.pageNum===1)return [1];
			else if(this.pageNum===2)return[1,2];
			else if(this.pageNum===3)return[1,2,3];
			else if(this.curPage===1)return[1,2,3];
			else if(this.curPage===2)return[1,2,3,4];
			else if(this.curPage>=3&&this.curPage<=this.pageNum-2)return[this.curPage-2,this.curPage-1,this.curPage,this.curPage+1,this.curPage+2];
			else if(this.curPage===this.pageNum-1)return[this.curPage-2,this.curPage-1,this.curPage,this.pageNum];
			else return[this.curPage-2,this.curPage-1,this.curPage];
		},
		isMobile(){return this.$store.state.isMobile}
	},
	filters:{
		commentTime(datetime){
			let gap = new Date().getTime() -  new Date(datetime).getTime();
			if (gap<60000)return '刚刚';
			else{
				let gap_m = Math.floor(gap/60000);
				if (gap_m<60)return gap_m + '分钟前';
				else{
					let gap_h = Math.floor(gap_m/60);
					if (gap_h<24)return gap_h + '小时前';
					else{
						let gap_d = Math.floor(gap_h/24);
						if (gap_d<30)return gap_d + '日前';
						else return datetime
					}
				}
			}
		},
		respondTitle(to_uname){
			return to_uname?' @'+to_uname:'添加新评论'
		}
	},
	directives:{
		highlight:{
			bind(e,binding,vm){
				let blocks = e.querySelectorAll('pre code');
				blocks.forEach(e=>{
					let copyBtn = document.createElement('button');
					copyBtn.innerText = 'Copy';
					copyBtn.classList.add('copy-btn');
					copyBtn.onclick = (e) => {
						let flag = copyText(e.target.previousElementSibling.innerText);
						if (flag)
							vm.context.$store.commit('infoBox/callInfoBox',{info:'代码拷贝成功', ok:true, during:2000});
						else
							vm.context.$store.commit('infoBox/callInfoBox',{info:'代码拷贝失败', ok:false, during:2000});
					};
					e.parentElement.appendChild(copyBtn);

					let numberring = document.createElement('ul');
					numberring.classList.add('line-numbers-rows');
					let len = e.innerText.split('\n').length;
					if (e.innerText.charCodeAt(e.innerText.length-1)===10)
						len--;
					for (let i=1;i<=len;i++){
						let li = document.createElement('li');
						li.innerText = i;
						numberring.appendChild(li)
					}
					e.parentElement.appendChild(numberring);
					hljs.highlightBlock(e)
				})
			}
		}
	}
}
