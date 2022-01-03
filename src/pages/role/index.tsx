
import { Button, Card, FormInstance, message, Modal, Table } from 'antd'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { reqAddRole, reqRoleList, reqUpdateRole } from '../../api'
import { IRole, IStoreState } from '../../typings'
import { PAGE_SIZE } from '../../utils/constants'
import { formatDateTime } from '../../utils/dateUtils'
import {connect} from 'react-redux'
import storageUtils from '../../utils/storageUtils'
import AddForm from './add-form'
import AuthForm from './auth-form'
import { logout } from '../../redux/action'

// 首页路由
const Role = (props:any):ReactElement=>{
    const [roles, setRoles] = useState<IRole[]>() //所有角色
    const [role, setRole] = useState<IRole>() //当前选中角色
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>()
    const [isDisabled, setIsDisabled] = useState(true)
    const [isModalVisible,setIsModalVisible] = useState(0) //0关闭 1展示添加角色 2展示权限
    const [form, setForm] = useState<FormInstance>()
    const authRef = useRef<any>()
    const navigate = useNavigate()

    const columns = [
        {
            title: '角色名称',
            dataIndex: 'name'
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            render: (create_time: any) => formatDateTime(create_time)
        },
        {
            title: '授权时间',
            dataIndex: 'auth_time',
            // 上面render可以写成这样
            render: formatDateTime
        },
        {
            title: '授权人',
            dataIndex: 'auth_name'
        }
    ]
    const title = (
        <span>
            <Button type='primary' onClick={ ()=>{setIsModalVisible(1)} }>创建角色</Button> &nbsp;&nbsp;
            <Button type='primary' disabled = {isDisabled}  onClick={ ()=>{setIsModalVisible(2)}}>
            设置角色权限</Button>
        </span>
    )

    const onRow = (role:IRole)=>{
        return{
            onClick: (event:any) => {//点击行
                setRole(role)
                setSelectedRowKeys([role._id])
                setIsDisabled(false)

                
            } 
        }
    }
    const getRoles = async()=>{
        const result = await reqRoleList()
        if(result.status === 0){
            const roles = result.data
            setRoles(roles)
        }
    }
// 添加角色 
    const addRole = ()=>{
        // 进行表单验证
        form.validateFields(['roleName'])
        .then( async(values) => {
            // 搜集输入数据
            const {roleName} = values
            const result = await reqAddRole(roleName)
            if(result.status === 0){
                message.success('添加角色成功')
                // 1.发送请求重新获取 这次选择不发送直接更新
                // 2.根据result拿到新产生的角色
                const role = result.data
                // 更新roles
                // const newRoles = roles 这么写没用 不要直接操作状态里数据
                setRoles((roles)=>{return [...roles,role]})
                
                
            }else{
                message.success('添加角色失败')
            }
            // 清除输入
            form.resetFields()
            // 隐藏modal
            setIsModalVisible(0)
        })
        .catch(errorInfo => {
            message.error(errorInfo)
        });
    }

    // 更新角色（权限）
    const updateRole = async()=>{
        // 隐藏确认框
        setIsModalVisible(0)
        // 需要最新的menus 从子组件取checkedKeys 状态
        const menus = authRef.current?.getMenus() 
        
        role.menus = menus
        role.auth_name = props?.user.username
        // 发送请求更新角色
        const result = await reqUpdateRole(role)
        if(result.status === 0 ){

            // 如果改的是当前用户的权限，需要退回到登录页面重新登录
            if(role._id === props?.user.role_id){
                props.logout()
                message.success('当前用户权限已修改，请重新登录')
            }else{
                message.success('设置角色权限成功')
                getRoles()
            }
            
        }else{
            message.error('设置角色权限失败')
        }
    }
    useEffect(() => {
        getRoles()
        
    }, [])
    return (
        <Card title={title}>
            <Table
            // 配置选项卡勾选 selectRowkeys是一个数组 可以设置多个
                rowSelection={{
                    type: 'radio',
                    selectedRowKeys: selectedRowKeys,
                    onSelect: (role:any)=>{ 
                        setRole(role); 
                        setSelectedRowKeys([role._id]);
                        setIsDisabled(false) 
                    }
                }}
                bordered
                rowKey='_id'
                dataSource={roles}
                columns={columns}
                pagination={{defaultPageSize:PAGE_SIZE, showQuickJumper:true}}
            // 配置onRow 使得点击某一行 选项卡选择
            onRow={onRow}
            />

            <Modal
                title="添加角色" 
                visible={isModalVisible === 1} 
                onOk={addRole} 
                onCancel={()=>{
                    setIsModalVisible(0)
                    // 取消也要清楚数据
                    form.resetFields()
                }}>
                <AddForm subSetForm={(form:FormInstance)=>{setForm(form)}}/>
            </Modal>  
            <Modal
                title="设置角色权限" 
                visible={isModalVisible === 2} 
                onOk={updateRole} 
                onCancel={()=>{setIsModalVisible(0)}}
                >
                 <AuthForm role={role} ref={authRef}/>
            </Modal>    
        </Card>
    )
}
const mapStateToProps = (state: IStoreState) => {
    return {
        user: state.user
    }
};
interface IDispatcherProps{
    logout: () => void
}
  const mapDispatcherToProps = (dispatch:any): IDispatcherProps => {
    return {
         logout: () => dispatch(logout())
     }
};
export default connect(
    mapStateToProps,
    mapDispatcherToProps
)(Role)

