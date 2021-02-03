/*
 * @Descripttion: 
 * @version: 
 * @Author: 马琳峰
 * @Date: 2021-02-02 16:29:41
 * @LastEditors: 马琳峰
 * @LastEditTime: 2021-02-03 17:35:38
 */
const axios = require('axios')
const configurationData = require('./static/configuration.json')
module.exports = function (api) {


  api.loadSource(async ({ addCollection }) => {

    const configuration = addCollection('configuration');

    configuration.addNode({
      ...configurationData
    })

  })

  api.loadSource(async ({ addCollection }) => {

    const { data } = await axios.get(`https://api.github.com/users/${configurationData.githubUsername}`);


    const configuration = addCollection('userInfo');

    configuration.addNode({
      ...data
    })

  })
}
