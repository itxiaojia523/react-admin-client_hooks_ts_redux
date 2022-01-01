import React, { FC, ReactElement, useEffect } from 'react'
import{
    Form,
    Input
} from 'antd'
import { IFormIProps } from '../../typings';

const Item = Form.Item

const UpdateForm:FC<IFormIProps> = (props):ReactElement =>{
    const [form] = Form.useForm();
    const {setForm,categoryName} = props
    
    // 将form传递给父组件
    setForm(form)
    useEffect(() => {
        form.setFieldsValue({categoryName: categoryName})
    }, [categoryName])
    
    return (
        <Form form={form} >
            <Item name="categoryName" rules={[{ required: true, message:'分类名称必须输入' }]}>
                 <Input name='input' placeholder='请输入分类名称' defaultValue={categoryName}/>
            </Item>

            
        </Form>
    )
}

export default UpdateForm
