import React, { FC, useEffect } from 'react'
import{
    Form,
    Input
} from 'antd'
const Item = Form.Item

interface Iprops{
    subSetForm? : Function
}
const AddForm:FC<Iprops> = (props) =>{
    const {subSetForm} = props
    const [form] = Form.useForm();
    useEffect(() => {
        // 像父组件传递form
        subSetForm(form)
    }, [])

    return (
        <Form form={form}>
 
            <Item
             name='roleName'
             label='角色名称'  
             rules={[{ required: true, message:'分类名称必须输入' }]}
             labelCol={{span:4}}
             wrapperCol={{span:15}} 
            >
                 <Input placeholder='请输入角色名称'/>
            </Item>  
        </Form>
    )
}

export default AddForm
