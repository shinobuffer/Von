<template>
  <div class="space-launch">
    <div class="l-sidenav">
      <ul class="sidenav-list">
        <li class="sidenav-item" :class="{cur:$route.name==='space-content'}">
          <nuxt-link to="/space/content">内容管理</nuxt-link>
        </li>
        <li class="sidenav-item" :class="{cur:$route.name==='space-content-article_draft'}">
          <nuxt-link to="/space/content/article_draft">文章草稿</nuxt-link>
        </li>
        <li class="sidenav-item" :class="{cur:$route.name==='space-content-note_draft'}">
          <nuxt-link to="/space/content/note_draft">笔记草稿</nuxt-link>
        </li>
      </ul>
    </div>
    <nuxt-child class="l-main"/>
  </div>
</template>

<script>
export default {
  name: "space-content"
}
</script>

<style>
</style>
