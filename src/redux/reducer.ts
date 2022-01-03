// 根据state和action 返回newState

import { Iuser } from "../typings"
import storageUtils from "../utils/storageUtils"
import {combineReducers} from 'redux'
import { RECEIVE_USER, RESET_USER, SET_Head_TITLE, SHOW_ERROR_MSG } from "../utils/constants"
import { HeadTitle, User } from "./action"


//用来管理头部标题的reducer函数
const initHeadeTitle = ''
function headTitle(state=initHeadeTitle,action:HeadTitle):string{
    switch(action.type){
        case SET_Head_TITLE:
            return action.data
        default:
            return state
    }

}
//用来管理当前登录用户user函数
const initUser:Iuser = storageUtils.getUser()
function user(state=initUser,action:User){
    switch(action.type){
        case RECEIVE_USER:
            return action.user
        case SHOW_ERROR_MSG:
            const errorMsg = action.errorMsg
            // 在原有基础上 加errorMsg属性 
            // 不要直接修改原有数据
            return {...state,errorMsg}
        case RESET_USER:
            return {}
        default:
            return state
    }

}
// 多个reducer时，需要combineReducers
// 管理的总的state结构：{
    // headTitle: '首页',
    // usre: {}
// }
export default combineReducers({
    headTitle,
    user
})