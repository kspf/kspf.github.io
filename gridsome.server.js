/*
 * @Descripttion: 
 * @version: 
 * @Author: 马琳峰
 * @Date: 2021-02-02 16:29:41
 * @LastEditors: 马琳峰
 * @LastEditTime: 2021-02-04 16:54:52
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

    const { data } = await new Promise((reslove, reject) => {
      axios.get(`https://api.github.com/users/${configurationData.githubUsername}/gists`).then(({ data: res }) => {

        const blogData = addCollection('blogData');



        for (let i = 0; i < res.length; i++) {
          for (let key in res[i].files) {
            let data = {}
            data['title'] = key
            data['url'] = res[i].files[key]
            data['description'] = res[i]['description']
            data['id'] = res[i]['id']
            data['createTime'] = res[i]['created_at']
            data['updateTime'] = res[i]['updated_at']
            data['hide'] = false
            blogData.addNode({
              ...data
            })
            break
          }
        }

        return res;
      }).then((data) => {
        if (data.length <= 0) return;
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


    for (let key in data.files) {
      resData.title = key
      resData.content = data.files[key].content
      break
    }


    const Collection = addCollection('gists');

    Collection.addNode(resData)

  })

  // 被关注
  api.loadSource(async ({ addCollection }) => {

    const { data } = await axios.get(`https://api.github.com/users/${configurationData.githubUsername}/followers`);


    const Collection = addCollection('followers');

    Collection.addNode({
      followers: data,
      followersTotal: data.length
    })
  })

  //关注的用户
  api.loadSource(async ({ addCollection }) => {

    const { data } = await axios.get(`https://api.github.com/users/${configurationData.githubUsername}/following`);


    const Collection = addCollection('following');

    Collection.addNode({
      following: data,
      followingTotal: data.length
    })
  })


  //开源项目   
  api.loadSource(async ({ addCollection }) => {

    const { data: res } = await axios.get(`https://api.github.com/users/${configurationData.githubUsername}/repos`);
 
    const Collection = addCollection('repos');


    for (let i = 0; i < res.length; i++) {
      let item = res[i]
      let data = {}
      data.id = item['id']
      data.name = item['name']
      data.url = item['html_url']
      data.description = item['description']
      data.stargazersCount = item['stargazers_count']
      data.watchersCount = item['watchers_count']
      data.forksCount = item['forks_count']
      data.language = item['language']
      data.license = item['license'] ? item['license']['spdx_id'] : null
      data.createTime = item['created_at']
      data.updateTime = item['updated_at']
      data.hide = false
      Collection.addNode({
        ...data
      })
    }

  })

}
