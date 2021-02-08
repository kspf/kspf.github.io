import request from './../utils/request'

export function verifyToken (token){
    return request.get(`/user?access_token=${token}`)
}

export function getConfiguration(){
    return request.get(`/repos/kspf/kspf.github.io/contents/static/configuration.json`)
}

export function editBlogConfigure(configure, sha) {
    let content = JSON.stringify(configure)
    let githubUsername = 'kspf'
    return request({
        url: '/repos/' + githubUsername + '/' + githubUsername + '.github.io/contents/static/configuration.json',
        method: 'PUT',
        data: {
            "message": "a",
            "content": require('js-base64').Base64.encode(content),

            "sha": sha
        }
    })
}