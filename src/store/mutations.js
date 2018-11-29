import * as types from './types'

//相关修改方法
const mutations = {
    //方法名[...]
    [types.SET_SINGER](state,singer) {
            state.singer = singer
    }
}

export default mutations