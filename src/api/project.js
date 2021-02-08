import request from './../utils/request'

export function getProject (name, projectName){
    return request.get(`/repos/${name}/${projectName}/contents/README.md`)
}
