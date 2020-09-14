import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations.js'
import actions from './action.js'
import getters from './getters.js'

Vue.use(Vuex);

const state = {
   todoList:[]
}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
})