<template>
  <div class="footer">
    <h4>Copyright © {{ year }} | 学生网络管理协会</h4>
    <h4>Powered by GuoChuanKun</h4>
  </div>
</template>

<script setup lang="ts">
    let date: Date = new Date()
    let year: number = date.getFullYear()
</script>

<style scoped>
.footer{
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
}
</style>