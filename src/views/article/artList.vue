<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
              <el-option :label="item.cate_name" :value="item.id" v-for="item in cateList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="choseFn">筛选</el-button>
            <el-button type="info" size="small" @click="resetFn">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button type="primary" size="small" class="btn-pub" @click="showPubDialogFn">发表文章</el-button>
      </div>

      <!-- 文章表格区域 -->
      <el-table :data="artList" style="width: 100%" border stripe>
        <el-table-column label="文章标题" prop="title">
          <template v-slot="scope">
            <el-link type="primary" @click="showDetailFn(scope.row.id)">{{ scope.row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="cate_name"></el-table-column>
        <el-table-column label="发表时间" prop="pub_date">
          <template v-slot="scope">
            <span> {{ $formatDate(scope.row.pub_date) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="danger" size="mini" @click="removeFn(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChangeFn" @current-change="handleCurrentChangeFn" :current-page.sync="q.pagenum" :page-sizes="[2, 3, 5, 10]" :page-size.sync="q.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </el-card>

    <!-- 发表文章的 Dialog 对话框 -->
    <el-dialog title="发表文章" :visible.sync="pubDialogVisible" fullscreen :before-close="handleClose" @closed="dialogCloserFn">
      <!-- 发布文章的对话框 -->
      <el-form :model="pubForm" :rules="pubFormRules" ref="pubFormRef" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%">
            <el-option :label="item.cate_name" :value="item.id" v-for="item in cateList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <!-- 使用 v-model 进行双向的数据绑定 -->
          <quill-editor v-model="pubForm.content" @blur="contentChangeFn"></quill-editor>
        </el-form-item>
        <el-form-item label="文章封面" prop="cover_img">
          <!-- 用来显示封面的图片 -->
          <img src="../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef" />
          <br />
          <!-- 文件选择框，默认被隐藏 -->
          <input type="file" style="display: none" accept="image/*" ref="iptFileRef" @change="onCoverChangeFn" />
          <!-- 选择封面的按钮 -->
          <el-button type="text" @click="chooseImgFn">+ 选择封面</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="pubArticleFn('已发布')">发布</el-button>
          <el-button type="info" @click="pubArticleFn('草稿')">存为草稿</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 查看文章详情的对话框 -->
    <el-dialog title="文章预览" :visible.sync="detailVisible" width="80%">
      <h1 class="title">{{ artDetail.title }}</h1>

      <div class="info">
        <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
        <span> 发布时间：{{ $formatDate(artDetail.pub_date) }}</span>
        <span> 所属分类：{{ artDetail.cate_name }}</span>
        <span> 状态：{{ artDetail.state }}</span>
      </div>

      <!-- 分割线 -->
      <el-divider></el-divider>

      <!-- 文章的封面 -->
      <img v-if="artDetail.cover_img" :src="baseURLR + artDetail.cover_img" alt="" />

      <!-- 文章的详情 -->
      <div v-html="artDetail.content" class="detail-box"></div>
    </el-dialog>
  </div>
</template>
// 什么是富文本?
// 带内容和样式的标签字符串, 一般用于自带排版布局的内容的, 例如文章详情, 商品详情
<script>
// 导入默认的封面图片
import defaultImg from '@/assets/images/cover.jpg'
import { getArtCateListAPI, uploadArticleAPI, getArticleListAPI, getArticleDetailFn, delArticleAPI } from '@/api'
import { baseURL } from '@/utils/request'
export default {
  name: 'ArtList',
  data() {
    return {
      q: {
        // 查询参数对象
        pagenum: 1, // 默认拿第一页的数据
        pagesize: 2, // 默认当前页需要几条数据
        cate_id: '',
        state: ''
      },
      pubDialogVisible: false, // 控制发表文章对话框的显示与隐藏
      pubForm: {
        // 发布文章-表单的数据对象
        title: '',
        cate_id: '',
        // 定义富文本编辑器对应的数据项, 也绑定到表单的数据对象属性中
        content: '', // 文章内容
        cover_img: null, // 用户选择的封面图片(null 表示没有选择任何封面)
        state: '' // 文章的发布状态(值：已发布、草稿)
      },
      pubFormRules: {
        // 表单的验证规则对象
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          {
            min: 1,
            max: 30,
            message: '文章标题的长度为1-30个字符',
            trigger: 'blur'
          }
        ],
        cate_id: [{ required: true, message: '请选择文章标题', trigger: 'change' }],
        content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
        cover_img: [{ required: true, message: '请选择封面', trigger: 'change' }]
      },
      cateList: [], // 保存文章分类列表
      artList: [], // 文章的列表数据
      total: 0, // 总数据条数
      detailVisible: false, // 控制文章详情对话框的显示与隐藏
      artDetail: {}, // 文章的详情信息对象
      baseURLR: baseURL // 基地址
    }
  },
  created() {
    this.getCateList()
    this.getArtListFn() // 获取文章列表
  },
  methods: {
    // 获取-所有列表数据
    async getArtListFn() {
      const { data: res } = await getArticleListAPI(this.q)
      if (res.code !== 0) return this.$message.error(res.message)
      this.artList = res.data
      this.total = res.total
    },
    // 获取-所有分类
    async getCateList() {
      const { data: res } = await getArtCateListAPI()
      if (res.code === 0) {
        this.cateList = res.data
      }
    },
    // 发表文章按钮->点击事件->让添加文章对话框出现
    showPubDialogFn() {
      this.pubDialogVisible = true
    },
    // 对话框关闭前的回调
    async handleClose(done) {
      const confirmResult = await this.$confirm('此操作将导致文章信息丢失, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 取消了关闭-阻止住, 什么都不干
      if (confirmResult === 'cancel') return
      // 确认关闭
      done()
    },
    // 选择封面点击事件-让文件选择窗口出现
    chooseImgFn() {
      this.$refs.iptFileRef.click()
    },
    // 用户选择了封面文件
    onCoverChangeFn(e) {
      // 获取到用户选择的封面
      const files = e.target.files
      if (files.length === 0) {
        // 用户没有选择封面
        this.pubForm.cover_img = null
        this.$refs.imgRef.setAttribute('src', defaultImg)
      } else {
        // 用户选择了封面
        this.pubForm.cover_img = files[0]
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
      }
    },
    // 表单里(点击发布/存为草稿)按钮点击事件->准备调用后端接口
    pubArticleFn(state) {
      // 1.设置发布状态
      this.pubForm.state = state
      // 2.表单预校验
      this.$refs.pubFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请完善文章信息！')
        // 3.判断是否提供了文章封面
        if (!this.pubForm.cover_img) {
          return this.$message.error('请选择文章封面！')
        }
        // 4.TODO: 发布文章
        // 创建FormData对象
        const fd = new FormData()

        // 向FormData中追加数据
        // fd.append('参数名', 值)
        // fd.append('title', this.pubForm.title)
        // fd.append('cate_id', this.pubForm.cate_id)
        // fd.append('content', this.pubForm.content)
        // fd.append('cover_img', this.pubForm.cover_img)
        // fd.append('state', this.pubForm.state)
        Object.keys(this.pubForm).forEach(key => {
          fd.append(key, this.pubForm[key])
        })

        // 发起请求
        const { data: res } = await uploadArticleAPI(fd)
        if (res.code !== 0) return this.$message.error('发布文章失败！')
        this.$message.success('发布文章成功！')
        // 关闭对话框
        this.pubDialogVisible = false
        // 刷新文章列表数据
        this.getArtListFn()
      })
    },
    // 富文本编辑器内容改变触发此事件方法
    contentChangeFn() {
      // 目标：如何让el-form校验，只校验content这个规则？
      this.$refs.pubFormRef.validateField('content')
    },
    // 新增文章->对话框关闭时->清空表单
    dialogCloserFn() {
      this.$refs.pubFormRef.resetFields()
      // 因为这个变量对应的标签不是表单绑定的, 所以需要单独控制
      this.$refs.imgRef.setAttribute('src', defaultImg)
    },
    handleSizeChangeFn(newSize) {
      // newSize:当前需要每页显示的条数
      this.q.pagesize = newSize
      this.q.pagenum = 1
      this.getArtListFn()
    },
    // 当前页码改变时触发
    handleCurrentChangeFn(newPage) {
      // newPage：当前要看的第几页，页数
      this.q.pagenum = newPage
      this.getArtListFn()
    },
    // 筛选按钮->点击事件
    choseFn() {
      // 目的：当有了筛选的条件，我想让页码回归1，每页的条数回归2
      this.q.pagenum = 1
      this.q.pageSize = 2
      this.getArtListFn()
    },
    // 重置按钮->点击事件
    resetFn() {
      this.q.pagenum = 1
      this.q.pageSize = 2
      this.q.cate_id = ''
      this.q.state = '' // 对象改变，v-model关联的表单标签也会变为空

      this.getArtListFn()
    },
    // 文章标题点击事件->为了查看详情
    async showDetailFn(Id) {
      const { data: res } = await getArticleDetailFn(Id)
      if (res.code !== 0) return this.$message.error('获取文章详情失败')
      this.artDetail = res.data
      this.detailVisible = true
    },
    // 删除按钮->点击事件
    async removeFn(id) {
      const { data: res } = await delArticleAPI(id)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      // 数组里只保存当前页的数据，别的页的需要传参q给后台获取覆盖
      // 1的原因：虽然你调用删除接口但是那是后端删除，前端数组里你没有代码去修改它
      if (this.artList.length === 1) {
        if (this.q.pagenum > 1) {
          // 保证pagenum最小值为1
          this.q.pagenum--
        }
      }
      // 重新获取数据
      this.getArtListFn()
    }
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .btn-pub {
    margin-top: 5px;
  }
}
// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}
// 设置富文本编辑器的默认最小高度
// ::v-deep作用: 穿透选择, 正常style上加了scope的话, 会给.ql-editor[data-v-hash]属性, 只能选择当前页面标签或者组件的根标签
// 如果想要选择组件内的标签(那些标签没有data-v-hash值)所以正常选择选不中, 加了::v-deep空格前置的话, 选择器就会变成如下形式
// [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了
::v-deep .ql-editor {
  min-height: 300px;
}
// 总结：scoped不会给组件内的标签添加data-v属性，所以要用::v-deep穿透选择组件内的标签设置样式
.el-pagination {
  margin-top: 15px;
}
</style>
