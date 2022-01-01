// 进行local 数据存储管理的模块
// 原生语法，可能有兼容性问题，借助一个叫store的库
import store from "store"
const USER_KEY = 'user_key' //保证变量名一直


const storageUtils = {
    // 保存user
    saveUser(user){
        // 注意值也是string，而对象的toString是 {object Object}没用
        // localStorage.setItem(USER_KEY,JSON.stringify(user))
        store.set(USER_KEY,user)
    },

    // 读取user
    getUser (){
        // 拿到一个JSON字符串 但是也有可能没有，会返回null，希望返回一个空对象
        // return JSON.parse(localStorage.getItem(USER_KEY) || '{}') 
        return store.get(USER_KEY) || {}
    },

    // 删除user
    removeUser(){
        // localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }
}

export default storageUtils