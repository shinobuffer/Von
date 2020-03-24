<template>
  <content-draft type="note"/>
</template>

<script>
import ContentDraft from '~/components/space/ContentDraft';
import UCONF from '~/config/user.conf';
const {siteTitle:{title}} = UCONF;
export default {
  name: "note_draft",
  head(){
    return{
      title:`笔记草稿 | ${title}`
    }
  },
  components:{
    ContentDraft
  }
}
</script>

<style>
</style>
