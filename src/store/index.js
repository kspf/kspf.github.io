import Cookie from './../utils/cookie'
import { verifyToken } from './../api/user'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const TOKEN_KEY = "TOKEN_KEY"
const store = new Vuex.Store({
    state: {
        token: Cookie.getAttribute(TOKEN_KEY)
    },

    mutations: {
        SET_TOKEN: (state, value) => {
            state.token = value
            Cookie.setAttribute(TOKEN_KEY, value, 30)
        },
        REMOVE_TOKEN: (state) => {
            state.token = null
            Cookie.remove(TOKEN_KEY)
        }
    },

    actions: {
        Authentication({ commit }, accessToken) {
            verifyToken(accessToken).then((response) => {
                let result = response.data
                if ('kspf' == result['login']) {
                    commit('SET_TOKEN', accessToken)
                    Vue.prototype.$notify({
                        title: '成功',
                        message: 'Token绑定成功',
                        type: 'success'
                    })
                } else {
                    Vue.prototype.$message({
                        message: 'Token用户不一致',
                        type: 'error'
                    })
                }
            }).catch(() => {    
                Vue.prototype.$message({
                    message: 'Token用户不一致',
                    type: 'error'
                })
            })
        },
    }
})


export default store