export default {
	data(){
		return{
			tagCountList:[],
			manyTags:false,
			tagExpand:false
		}
	},
	filters:{
		expandStatus(e){
			return e?'-':'+'
		}
	}
}
