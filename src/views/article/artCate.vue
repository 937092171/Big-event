<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addCateBtnFn">添加分类</el-button>
      </div>
      <el-table style="width: 100%" :data="cateList" border stripe>
        <el-table-column label="序号" type="index" width="100"></el-table-column>
        <el-table-column label="分类名称" prop="cate_name"></el-table-column>
        <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" size="mini" @click="updateCateBtnFn(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="delCateFn(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加分类的对话框 -->
    <!-- .sync作用实现双向数据绑定会在运行时给所在标签绑定
     @update:属性名的事件,把接收到子组件内传来的值赋予给右侧Vue变量组件内
     $emit('update:visible', true)这个update: 是固定的  -->
    <el-dialog title="添加文章分类" :visible.sync="addVisible" width="35%" @close="onAddCloseFn">
      <!-- 添加的表单 -->
      <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="80px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="addForm.cate_name" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input v-model="addForm.cate_alias" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelFn">取 消</el-button>
        <el-button size="mini" type="primary" @click="addFn">添 加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getArtCateListAPI, saveArtCateAPI, updateArtCateAPI, delArtCateAPI } from '@/api'
import { nextTick } from 'vue'
export default {
  name: 'ArtCate',
  data() {
    return {
      cateList: [], // 文章分类数组
      addVisible: false, // 添加分类-对话框是否显示-出现(true),隐藏(false)
      addForm: {
        // 添加表单的数据对象
        cate_name: '',
        cate_alias: ''
      },
      addRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'blur' }
        ]
      },
      isEdit: false, // true为编辑状态，false新增状态
      editId: '' // 保存正在要编辑的数据id值
    }
  },
  created() {
    // 获取文章分类
    this.getArtCateFn()
  },
  methods: {
    // 获取-文章分类列表
    async getArtCateFn() {
      const res = await getArtCateListAPI()
      // console.log(res)
      this.cateList = res.data.data
    },
    // (添加分类里的)添加按钮->点击事件
    addFn() {
      this.$refs.addRef.validate(async valid => {
        if (valid) {
          // 通过校验
          if (this.isEdit) {
            // 要修改
            // this.addForm.id = this.editId 把要编辑的文章分类id添加到对象上
            // updateArtCateAPI(this.addForm)
            const { data: res } = await updateArtCateAPI({ id: this.editId, ...this.addForm })
            if (res.code !== 0) return this.$message.error(res.message)
            this.$message.success(res.message)
          } else {
            // 要新增
            const { data: res } = await saveArtCateAPI(this.addForm)
            if (res.code !== 0) return this.$message.error(res.message)
            this.$message.success(res.message)
          }
          // 重新请求列表数据
          // 生命周期的方法比如created, 不会挂载到this身上, 无法this.created
          this.getArtCateFn()
          // 关闭对话框
          this.addVisible = false
        } else {
          return false
        }
      })
    },
    // (添加分类里的)取消按钮->点击事件
    cancelFn() {
      this.addVisible = false
    },
    // 添加分类-让对话框出现
    onAddCloseFn() {
      this.$refs.addRef.resetFields()
    },
    // 添加分类按钮点击事件->为了让对话框出现
    addCateBtnFn() {
      this.addVisible = true
      this.editId = ''
      this.isEdit = false
    },
    // 修改分类按钮->点击事件
    updateCateBtnFn(obj) {
      // obj的值：{ id: 文章分类id, cate_name: 文章分类名字, cate_alias: 文章分类别名}
      this.isEdit = true
      this.editId = obj.id
      this.addVisible = true

      // 让el-dialog第一次挂载el-form时，先用addForm空字符串初始值绑定到内部，后续用作resetFields重置
      // 所以让真实DOM先创建并在内部绑定好"复制"好初始值

      // 接着我们真实DOM更新后绑定好了，咱们再给数据回显
      // 注意：我们给v-model对象赋值只是影响当前显示的值，不会影响到resetFiles复制的初始值
      nextTick(() => {
        // 数据回填
        this.addForm.cate_name = obj.cate_name
        this.addForm.cate_alias = obj.cate_alias
      })
    },
    async delCateFn(id) {
      const { data: res } = await delArtCateAPI(id)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      // 重新请求列表数据
      this.getArtCateFn()
    }
  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
