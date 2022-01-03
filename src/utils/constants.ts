//常量模块
export const PAGE_SIZE = 2 //分页的每页记录数

export const BASE_IMG_URL = 'http://localhost:5000/upload/'

// action type
export const SET_Head_TITLE = 'set_head_title'
// type 类型别名  typeof 取类型符
export type SET_Head_TITLE = typeof SET_Head_TITLE

export const RECEIVE_USER = 'receive_user' //接受用户信息
export type RECEIVE_USER = typeof RECEIVE_USER

export const SHOW_ERROR_MSG = 'show_error_msg' //显示错误信息
export type SHOW_ERROR_MSG = typeof SHOW_ERROR_MSG

export const RESET_USER = 'reset_user' //显示错误信息
export type RESET_USER = typeof RESET_USER



