import React, { FC, useEffect } from 'react'
import{
    Form,
    Input,
    Select
} from 'antd'
import { Iuser } from '../../typings'
const Item = Form.Item
const Option = Select.Option

// 添加或修改用户的form组件
interface Iprops{
    setForm?:(form:any) => void
    roles?: any
    user?: Iuser
}
const UserForm:FC<Iprops> = (props) =>{
    const {setForm,roles,user} = props
    // user可能有也可能没有
    const [form] = Form.useForm();
    // 像父组件传递form
    useEffect(() => {
        setForm(form)        
    }, [user])
    

    return (
        <Form form={form} labelCol={{span:4}} wrapperCol={{span:15}} preserve={false}>
            <Item
             name='username'
             label='用户名'  
             rules={[{ required: true, message:'用户名必须输入' }]}
            >
                 <Input placeholder='请输入用户名称'/>
            </Item>  
            {
                // 更新时不显示，创建时显示
                user?._id?
                null
                :
                <Item
                name='password'
                label='密码'  
                rules={[{ required: true, message:'密码必须输入' }]}
               >
                    <Input type='password' placeholder='请输入密码'/>
               </Item> 
                 
            }
 
            <Item
             name='phone'
             label='手机号'  
             rules={[{ required: true, message:'分类名称必须输入' }]}
            >
                 <Input placeholder='请输入手机号码'/>
            </Item>  
            <Item
             name='email'
             label='邮箱'  
             rules={[{ required: true, message:'分类名称必须输入' }]}
            >
                 <Input placeholder='请输入邮箱'/>
            </Item>  
            <Item
             name='role_id'
             label='角色'  
             rules={[{ required: true, message:'分类名称必须输入' }]}
            >
                 <Select placeholder='请选择角色分类'>
                    {
                    roles?.map( (role:any) => <Option key={role._id } value={role._id} >{role.name}</Option> )
                    }
                 </Select>
            </Item>  
           
        </Form>
    )
}

export default UserForm
