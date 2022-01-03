// 包含多个action creator函数模块
// 同步action： 对象{type: 'xxx' data: 数据值}
// 异步action： 函数 dispatch => {}
// 定义了每个 action的 interface 以及 ActionCreator 函数的实现
import { message } from "antd"
import { Dispatch } from "redux"
import { reqLogin } from "../api"
import { Iuser } from "../typings"
import { RECEIVE_USER, RESET_USER, SET_Head_TITLE, SHOW_ERROR_MSG } from "../utils/constants"
import storageUtils from "../utils/storageUtils"

export interface ISetHeadTitleAction {
    data: string;
    type: SET_Head_TITLE;
  }
// headTitle对应的action的类型集
export type HeadTitle = ISetHeadTitleAction

// 设置头部标题的同步action
export const setHeadTitle = (headTitle:string):ISetHeadTitleAction=>{
    return {
        type: SET_Head_TITLE,
        data: headTitle
    }
}
export interface IReceiveUserAction {
    user: Iuser;
    type: RECEIVE_USER;
}
export interface IShowErrorMsgAction {
    errorMsg:string
    type: SHOW_ERROR_MSG
}
export interface ILogOutAction {
    type: RESET_USER
}
// 接受用户信息的同步action
export const receive_user = (user:Iuser):IReceiveUserAction=>({type: RECEIVE_USER, user})
// 显示错误信息的同步action
export const show_error_msg = (errorMsg:string):IShowErrorMsgAction=>({type: SHOW_ERROR_MSG, errorMsg})


// 登录请求的异步actionCreator  这些函数都是返回一个action
export const login = (username:string,password:string)=>{
    // 返回值是一个函数
    return async(dispatch:Dispatch)=>{
        // 1.执行异步action
        const result = await reqLogin(username,password)
        // 1.1 如果成功 分发一个成功的同步action
        if(result.status === 0){
            const user = result.data
            // 保存到local中
            storageUtils.saveUser(user)
            dispatch(receive_user(user))
        }else{// 1.2 如果失败 分发一个失败的同步action
            const msg = result.msg //显示的错误信息
            // 两种做法 1.简单直接message.error
            message.error(msg)
            // 2.将msg存到user对象中，让组件取读取user信息 如果有错误msg则显示
            // dispatch(show_error_msg(msg))
        }
        
    }
}

// 退出登录的同步action
export const logout = ():ILogOutAction=>{
    // 先删除local中的user
    storageUtils.removeUser()
    // 返回
    return {type: RESET_USER}

}

// user对应的action的 类型集
export type User = IReceiveUserAction | IShowErrorMsgAction | ILogOutAction