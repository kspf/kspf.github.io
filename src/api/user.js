import request from './../utils/request'

export function verifyToken (token){
    return request.get(`/user?access_token=${token}`)
}

export function getConfiguration(){
    return request.get('/configuration.json')
}