/*
 * @Descripttion: 
 * @version: 
 * @Author: 马琳峰
 * @Date: 2021-02-02 16:29:41
 * @LastEditors: 马琳峰
 * @LastEditTime: 2021-02-03 14:23:33
 */
// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const project = require('./store/project')

module.exports = function (api) {
  // 
  project.getBlogConfigure(api);
}
