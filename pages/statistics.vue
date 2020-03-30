<template>
  <div>
    <div class="statistic-main" style="padding: 1rem .2rem;word-break: break-all">
      <h3>TESTING</h3>
      <p>IP:{{ip}}</p>
      <p>LOCATION:{{loc}}</p>
      <p>OS:</p>
      <p>BROWSER:</p>
      {{JSON.stringify(test)}}
    </div>
  </div>
</template>

<script>
export default {
  name: "statistics",
  asyncData({app,req}){
    return app.$fetch('/apis/statistics.php',{},req).then(res=>{
      let {ip,loc,test} = res.data;
      return{
        ip,loc,test
      }
    })
  }
}
//TODO: 待完善
</script>

<style>
</style>
