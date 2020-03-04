export default {
	filters:{
		typeEN2CN(type){
			if (type==='anime')return 'Anime';
			else if (type==='code')return '极客';
			else if (type==='game')return '游民';
			else return type==='trivial'?'随写':'笔记'
		},
		ym(time){
			return time.substr(0,4) + '. ' + time.substr(5,2)
		},
		commentNum(count){
			return count>0?count+' 评论':'No Comment';
		},
		readNum(count){
			return count.replace(/(\d)(?=(?:\d{3})+$)/g,'$1,')
		},
	}
}
