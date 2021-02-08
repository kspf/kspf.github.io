import request from './../utils/request'

export function verifyToken (token){
    return request.get(`/user?access_token=${token}`)
}
