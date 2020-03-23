<template>
  <div class="space-album">
    <div class="a-sidenav">
      <ul class="sidenav-list">
        <li class="sidenav-item" :class="{cur:$route.name==='space-album'}">
          <nuxt-link to="/space/album">我的相簿</nuxt-link>
        </li>
        <li class="sidenav-item" :class="{cur:$route.name==='space-album-upload'}">
          <nuxt-link to="/space/album/upload">上传图片</nuxt-link>
        </li>
      </ul>
    </div>
    <nuxt-child class="a-main"/>
  </div>
</template>

<script>
export default {
  name: "space-album",
}
</script>

<style>
</style>
