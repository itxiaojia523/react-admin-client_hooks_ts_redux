import React, { FC, useEffect } from 'react'
import{
    Form,
    Select,
    Input
} from 'antd'
import { Icategory, IFormIProps } from '../../typings'
const Item = Form.Item
const Option = Select.Option


const AddForm:FC<IFormIProps> = (props) =>{
    const {categorys,parentId,setForm} = props
    const [form] = Form.useForm();
    useEffect(() => {
        // 像父组件传递form
        setForm(form)
        form.setFieldsValue({pid: parentId})
    }, [parentId])
 
    

    return (
        <Form form={form}>
            <Item name='pid' initialValue={parentId}>
                <Select >
                    <Option value='0'>一级分类</Option>
                    {
                        categorys!.map((item:Icategory)=><Option value={item._id!} key={item._id}>{item.name}</Option>)
                    }
                </Select>
            </Item>

            <Item name='categoryName'rules={[{ required: true, message:'分类名称必须输入' }]}>
                 <Input placeholder='请输入分类名称'/>
            </Item>

            
        </Form>
    )
}

export default AddForm
