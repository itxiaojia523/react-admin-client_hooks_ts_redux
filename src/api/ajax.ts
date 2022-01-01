// 能发送异步ajax请求的函数模块 
// 封装axios,函数的返回值是一个promise 
import axios from 'axios'
import {message} from 'antd'

const ajax = (url:string,data:object={},type:string="GET"): any => {
    let promise
    return new Promise((resolve,reject)=>{
        //1.执行异步请求
        if(type === "GET"){
            // 发送get请求
            promise = axios.get(url,{
                // 配置对象
                params: data
            })
        }else{
            promise = axios.post(url,data)
        }
        //2.如果成功了，调用resolve(value)
        promise.then((response)=>{
            resolve(response.data)
            //正常 如果失败了,调用reject(reason)，用try catch
        //3.如果失败了 不调用,而是提示异常信息
        }).catch((error
        )=>{
            //reject(error)
            message.error('请求出错' + error.message)
        })
    })
    
}

export default ajax

