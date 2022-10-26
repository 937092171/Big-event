<template>
  <router-view></router-view>
</template>

<script>
import { getUserInfoAPI } from '@/api'
export default {
  created() {
    getUserInfoAPI().then(res => {
      console.log(res)
    })
  }
}
</script>

<style lang="less" scoped></style>
