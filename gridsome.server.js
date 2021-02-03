/*
 * @Descripttion: 
 * @version: 
 * @Author: 马琳峰
 * @Date: 2021-02-02 16:29:41
 * @LastEditors: 马琳峰
 * @LastEditTime: 2021-02-03 17:35:38
 */
const axios = require('axios')
const configurationData = require('./static/configuration.json');
const menu = require('./static/menu.json')
module.exports = function (api) {


  api.loadSource(({ addCollection }) => {

    const configuration = addCollection('configuration');
    const menuPl = addCollection('menu');

    configuration.addNode({
      ...configurationData
    })
    menuPl.addNode({
      ...menu
    })

  })


  api.loadSource(async ({ addCollection }) => {

    const { data } = await axios.get(`https://api.github.com/users/${configurationData.githubUsername}`);


    const Collection = addCollection('userInfo');

    Collection.addNode({
      ...data
    })

  })

  api.loadSource(async ({ addCollection }) => {

    const { data } = await new Promise((reslove,reject) => {
      axios.get(`https://api.github.com/users/${configurationData.githubUsername}/gists`).then(({data}) => {
        return data;
      }).then((data) => {
        if(data.length  <= 0 ) return;
        return axios.get(`https://api.github.com/gists/${data[0].id}`);
      }).then(data => {
        reslove(data);
      }).catch(reject)
    });


    let resData = {
      description: data.description,
      createTime: data.created_at,
      updateTime: data.updated_at,
      id: data.id
    };


    for(let key in data.files){
      resData.title = key
      resData.content = data.files[key].content
      break
    }


    const Collection = addCollection('gists');

    Collection.addNode(resData)

  })

}
