module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 关闭变量名不能出现带下划线
    camelcase: 'off',
    // never 禁止在函数名称 或 function参数的 ( 前面有空格。
    'space-before-function-paren': ['error', 'never'],
    // 关闭eslint检查文件名是否为驼峰命名
    'vue/multi-word-component-names': 'off'
  }
}
