import { Iproduct, IRole, Iuser } from '../typings'
import ajax from './ajax'
// 应用中所有接口请求函数的模块  每个函数的返回值是response

const BASE = "http://localhost:5000"
// 登录
export function reqLogin(username:string,password:string):any{
    return ajax(BASE+'/login',{username:username,password},"POST")
}

//查询一般只需get，更新post 如果不传参也可get
//获取分类列表 一级/二级 0时表一级 
export const reqCategorys = (parentId:string)=> ajax(BASE + '/manage/category/list',{parentId : parentId})
//添加分类 创建数据
export const reqAddCategory = (categoryName:string,parentId:string)=> ajax(BASE + '/manage/category/add',{categoryName: categoryName,parentId : parentId},"POST")
//更新分类 加添加的分类数据更新过去
// export const reqUpdateCategory = (categoryId:string,categoryName:string)=> ajax(BASE + '/manage/category/update',{categoryId: categoryId,categoryName: categoryName},"POST")

//也可用对象
interface IObj{
    categoryId:string,
    categoryName:string
}
export const reqUpdateCategory = (obj:IObj)=> ajax(BASE + '/manage/category/update',{categoryId: obj.categoryId,categoryName: obj.categoryName},"POST")

// 获取商品分页
export const reqProducts = (pageNum:number,pageSize:number)=> ajax(BASE + '/manage/product/list',{pageNum,pageSize})

// 按条件获取商品分页  
interface IReqsearch{
    pageNum:number
    pageSize:number
    searchContent:string
    searchType:string
}
export const reqSearchProducts = (obj:IReqsearch)=> {
    const {pageNum,pageSize,searchContent,searchType} = obj
    // [] 取值符 productName / productDesc
    return ajax(BASE + '/manage/product/search',{pageNum,pageSize,[searchType]:searchContent})
}

// 根据id获取分类
export const reqCategory = (categoryId:string)=> ajax(BASE+'/manage/category/info',{categoryId})

//更新产品（上下架）
export const reqUpdateStatus = (productId:string,status:number)=> ajax(BASE+'/manage/product/updateStatus',{productId,status},'POST')

// 删除图片
export const reqDeleteImg = (name:string)=> ajax(BASE+'/manage/img/delete',{name},'POST')

// 添加商品
export const reqAddProduct = (product:Iproduct)=> ajax(BASE+'/manage/product/add',product,'POST')

// 更新商品
export const reqUpdateProduct = (product:Iproduct)=> ajax(BASE+'/manage/product/update',product,'POST')

// 添加或更新商品 区别在于更新时 product有_id
export const reqAddOrUpdateProduct = (product:Iproduct)=> ajax(BASE+'/manage/product/'+ (product._id? 'update' : 'add'),product,'POST')

// 获取角色列表
export const reqRoleList = ()=> ajax(BASE+'/manage/role/list')  

// 添加角色
export const reqAddRole = (roleName:string)=> ajax(BASE+'/manage/role/add',{roleName},'POST')  

// 更新角色
export const reqUpdateRole = (role:IRole)=> ajax(BASE+'/manage/role/update',role,'POST')  

// 获取所有用户列表 
export const reqUsers = ()=> ajax(BASE+'/manage/user/list')  

// 删除指定用户 
export const reqDeleteUser = (userId:string)=> ajax(BASE+'/manage/user/delete',{userId},'POST')  

//添加用户
export const reqAddUser = (user:Iuser)=> ajax(BASE+'/manage/user/add',user,'POST') 

//更新用户
export const reqUpdateUser = (user:Iuser)=> ajax(BASE+'/manage/user/update',user,'POST') 

// 添加或更新用户
export const reqAddOrUpdateUser = (user:Iuser) => ajax(BASE+'/manage/user/' + (user._id? 'update' : 'add'),user,'POST')
