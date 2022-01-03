import { Button, Card, FormInstance, message, Modal, Table } from 'antd'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import { reqAddOrUpdateUser, reqDeleteUser, reqUsers } from '../../api'
import LinkButton from '../../components/link-button'
import { IRole, Iuser } from '../../typings'
import { PAGE_SIZE } from '../../utils/constants'
import { formatDateTime } from '../../utils/dateUtils'
import UserForm from './user-form'

// 首页路由
const User:FC = ():ReactElement=>{
    const [users,setUsers] = useState<Iuser[]>() //用户列表
    const [roles,setRoles] = useState<IRole[]>() //角色列表
    const [user, setUser] = useState<Iuser>() //当前用户
    const [roleNames,setRoleNames] = useState(null) //用户列表
    const [showModal,setShowModal] = useState(false) //显示隐藏modal
    const [isUpdate,setIsUpdate] = useState(false)
    const [staForm,setStaForm] =useState<FormInstance>()
    
    const columns = [
        {
            title: '用户名',
            dataIndex: 'username'
        },
        {
            title: '邮箱',
            dataIndex: 'email'
        },
        {
            title: '电话',
            dataIndex: 'phone'
        },
        {
            title: '注册时间',
            dataIndex: 'create_time',
            render: formatDateTime
        },
        {
            title: '所属角色',
            dataIndex: 'role_id',
            //每一行都要计算一边 效率较低
            // render: (role_id:any)=> roles.find( role => role._id === role_id)?.name
            // 想要根据id找到name，如果我有一个对象key:id值 value:name  只需遍历一次
            render: (role_id:string)=> {
                return roleNames[role_id]
            }
        },
        { 
            title: '操作',
            render: (user:Iuser)=>(
                <span>
                    <LinkButton onClick={()=>{showUpdate(user)}}>修改</LinkButton>
                    <LinkButton onClick={()=>{deleteUser(user)}}>删除</LinkButton>
                </span>
            )
        },
    ]

    // 添加或更新用户
    const addOrUpdateUser = ()=>{
       

        // 表单验证
        staForm.validateFields()
        .then(async(values:any) => {
        //搜集数据 发送请求 更新显示  
        // 因为设计原因 values即user对象
        
        // 如果是更新需要给user指定_id属性 因为搜集不到所以要手动添加
        if(isUpdate){
            values._id = user?._id 
        }
        console.log(values);
        // let result
        // if(isUpdate){
        //     result = await reqUpdateUser(values)
        // }else{
        //     result = await reqAddUser(values)
        // }
        const result = await reqAddOrUpdateUser(values)
        
        if(result.status === 0){
            message.success(`${isUpdate? '修改' : '添加'}用户成功`)
            getUsers()
        }else{
            message.error(`${isUpdate? '修改' : '添加'}用户失败`)
        }

        staForm.resetFields()
        setShowModal(false)
     
        
        })
        .catch(errorInfo => {
        // 这里写啥不知道
        });
    }

    // 根据roles数组，生成key:id值 value:角色名  对象
    const initRoleNames = (roles:IRole[])=>{
        const newRoleNames = roles.reduce((prev:any,role)=>{
            prev[role._id] = role.name
            return prev
        } ,{})
        // 保存起来
        setRoleNames(newRoleNames)        
    }

    // 发送请求获取用户
    const getUsers = async()=>{ 
        const result = await reqUsers()
        // 注意data中有 users和roles
        if(result.status === 0){
            const {users, roles} = result.data      
            initRoleNames(roles)
            setUsers(users)
            setRoles(roles)
        }
    }

    // 删除用户
    const deleteUser = (user:Iuser)=>{
        // modal的confirm方法可以弹出一个确认框，参数是一个配置对象
        Modal.confirm({
            title: `确认删除${user.username}吗？`,
            async onOk(){
               const result = await reqDeleteUser(user._id)
               if(result.status === 0){
                   message.success('删除用户成功')
                //    更新界面
                   getUsers()
               }else{
                   message.error('删除失败')
               }
            },
            // onCancel(){}
        })
    }

    const showUpdate = (user:Iuser)=>{
        // 表示是修改界面
        setIsUpdate(true)
        setUser(user)
        staForm?.setFieldsValue({
            username:user.username,
            password:user.password,
            phone: user.phone,
            email: user.email,
            role_id: user.role_id
        })

        setShowModal(true)
    }
    const showAdd = ()=>{
        setIsUpdate(false)
        setUser(null)

        setShowModal(true)
    }
    
    useEffect(() => {
        getUsers()
    }, [])

    const title = <Button type='primary' onClick={showAdd}>创建用户</Button>
    return (
        <Card title={title}>
            <Table
                bordered
                rowKey='_id'
                dataSource={users}
                columns={columns}
                pagination={{defaultPageSize:PAGE_SIZE, showQuickJumper: true}}
            />
            
            {/* 创建和修改是同一个modal */}
            <Modal
                // afterClose={ ()=> {setIsUpdate(false)}}
                // title= {user?._id? '修改用户' : '添加用户'}
                title= {isUpdate? '修改用户' : '添加用户'}
                visible={showModal}
                onOk={addOrUpdateUser}
                onCancel={()=>{
                    staForm.resetFields()
                    setShowModal(false) 
                } }
            >
                <UserForm setForm={(form:FormInstance)=>{setStaForm(form)}} roles={roles} user={user}/>
            </Modal>
        </Card>
    )
}
export default User


