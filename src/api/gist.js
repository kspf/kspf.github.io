import request from './../utils/request'

export function getProject (name, projectName){
    return request.get(`/repos/${name}/${projectName}/contents/README.md`)
}
export function create (form) {
    let files = {}
    files[form.title] = { content: form.content }
    return request({
        url: '/gists',
        method: 'post',
        data: {
            "description": form.description,
            "public": true,
            "files": files
        }
    })
}
export  function edit (form) {
    let files = {}
    files[form.title] = { content: form.content }
    return request({
        url: '/gists/' + form.id,
        method: 'PATCH',
        data: {
            "description": form.description,
            "public": true,
            "files": files
        }
    })
}

export function adelete(id) {
    return request({
        url: '/gists/' + id,
        method: 'DELETE',
    })
}