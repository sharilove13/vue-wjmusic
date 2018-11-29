import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
//打印修改日志插件
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

//strict:debug的严格模式在开发中可使用
const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
    // strict:debug,
    actions,
    getters,
    state,
    mutations,
    plugins:debug?[createLogger()]:[]
})

