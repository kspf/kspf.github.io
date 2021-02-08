import axios from 'axios'
import Vue from 'vue'
import Store from "./../store/index";

const service = axios.create({
    baseURL: "https://api.github.com",
    timeout: 15000
})

service.interceptors.request.use(
    config => {
        let token = Store.state.token
        if (token) {
            let sp = "?"
            if (config.url.indexOf("?") >= 0) {
                sp = "&"
            }
            config.url = config.url + sp + "access_token=" + token
        }
        return config
    },
    error => {

    }
)


service.interceptors.response.use(
    response => {
        let responseJson = response.data
        return response
    },
    error => {
        let message
        console.log(error)
        switch (error.response.status) {
            case 401:
                message = "Token错误"
                break
            default:
                message = error.response.data.message
                break
        }
        Vue.prototype.$message({
            message: message,
            type: 'error'
        })
        return Promise.reject('error')
    }
)

export default service