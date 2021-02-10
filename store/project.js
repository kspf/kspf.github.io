/*
 * @Descripttion: 
 * @version: 
 * @Author: 马琳峰
 * @Date: 2021-02-03 10:55:03
 * @LastEditors: 马琳峰
 * @LastEditTime: 2021-02-03 16:41:26
 */
const axios = require('axios')
 
module.exports = {
    getBlogConfigure(api){
        let configuration
        api.loadSource(async ({ addCollection }) => {

            const {data} = await axios.get('https://kspf.github.io/configuration.json');
            
            console.log(data);
            const configuration = addCollection('configuration');
          
            configuration.addNode({
                ...data
            })
            
        })
    }
}