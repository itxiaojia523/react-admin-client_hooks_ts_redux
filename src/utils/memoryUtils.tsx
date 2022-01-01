import { IMemoryUser } from "../typings"


// 用来保存数据的工具模块
interface ImemoryUtils{
    user: IMemoryUser
}

const memoryUtils:ImemoryUtils = {
    user:{},//保存当前登录用户
    
}
export default memoryUtils