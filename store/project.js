/*
 * @Descripttion: 
 * @version: 
 * @Author: 马琳峰
 * @Date: 2021-02-03 10:55:03
 * @LastEditors: 马琳峰
 * @LastEditTime: 2021-02-03 11:12:55
 */
const axios = require('axios')
axios
 
module.exports = {
    getBlogConfigure(api){
        api.loadSource(async ({ addCollection }) => {

            // axios.get('/static/configuration.json')
            
            // const baseUrl = addCollection('baseUrl');
          
            baseUrl.addNode({
              url: process.env.STRAPI_URL
            })
            
        })
    }
}