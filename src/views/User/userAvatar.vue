<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img class="the_img" v-if="!this.avatar" src="../../assets/images/avatar.jpg" alt="" />
      <img class="the_img" v-else :src="this.avatar" alt="">
      <!-- 按钮区域 -->
      <div class="btn-box">
        <input type="file" accept="image/*" style="display: none" ref="iptRef" @change="onFileChange" />
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg">选择图片</el-button>
        <el-button type="success" icon="el-icon-upload" :disabled="avatar === ''" @click="uploadFn">上传头像</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { updateAvatarAPI } from '@/api'
export default {
  name: 'UserAvatar',
  data() {
    return {
      avatar: ''
    }
  },
  methods: {
    // 选择图片
    chooseImg() {
      // 模拟点击行为
      this.$refs.iptRef.click()
    },
    // 选择框中选择图片后触发的改变事件
    onFileChange(e) {
      // 获取用户选择的文件列表(伪数组)
      const files = e.target.files
      if (files.length === 0) {
        // 没有选择图片
        this.avatar = ''
      } else {
        // 选择了图片
        console.log(files[0])
        // 方式1：使用URL.createObjectURL()方法，转换文件变成图片地址(纯前端本地)
        // this.avatar = URL.createObjectURL(files[0])

        // 方式2：FileReader() 来读取选择的前端文件，转为base64字符串，给img标签渲染
        // 1.创建 FileReader 对象
        const fr = new FileReader()
        // 2.调用 readAsDataURL 函数，读取文件内容
        fr.readAsDataURL(files[0])
        // 3.监听fr的onload事件
        fr.onload = e => {
          // 4.通过 e.target.result 获取到读取的结果，值是字符串(base64 格式的字符串)
          this.avatar = e.target.result
        }
      }
    },
    // 开始上传头像
    async uploadFn() {
      const { data: res } = await updateAvatarAPI(this.avatar)
      if (res.code !== 0) return this.$message.error(res.message)
      // 更新头像成功
      this.$message.success(res.message)
      // 再请求一次后台更新vuex里的值
      this.$store.dispatch('getUserInfoActions')
    }
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
}
.the_img {
  width: 350px;
  height: 350px;
}
</style>
