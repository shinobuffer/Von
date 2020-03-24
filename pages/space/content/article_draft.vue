<template>
  <content-draft type="article"/>
</template>

<script>
import ContentDraft from '~/components/space/ContentDraft';
import UCONF from '~/config/user.conf';
const {siteTitle:{title}} = UCONF;
export default {
  name: "article_draft",
  head(){
    return{
      title:`文章草稿 | ${title}`
    }
  },
  components:{
    ContentDraft
  }
}
</script>

<style>
</style>
