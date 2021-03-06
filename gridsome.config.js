/*
 * @Descripttion: 
 * @version: 
 * @Author: 马琳峰
 * @Date: 2021-02-02 16:29:41
 * @LastEditors: 马琳峰
 * @LastEditTime: 2021-02-03 12:16:24
 */
// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'Gridsome',
  plugins: [],
  outputDir: 'docs',
  templates: {
    blogData: [
      {
        path: '/details/:id',
        component: './src/templates/details.vue'
      }
    ],
    repos: [
      {
        path: '/reDetails/:id',
        component: './src/templates/prDetails.vue'
      }
    ]
  }
}
