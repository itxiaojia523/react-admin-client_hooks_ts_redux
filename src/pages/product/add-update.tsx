import { ArrowLeftOutlined } from '@ant-design/icons'
import { Card, Form, Input,Cascader ,Button, message } from 'antd'
import React, { FC, ReactElement, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { reqAddOrUpdateProduct, reqCategorys } from '../../api'
import LinkButton from '../../components/link-button'
import {  Iproduct, Option } from '../../typings'
import PicturesWall from './pictures-wall'
import RichTextEdtor from './rich-tect-editor'
const {Item} = Form
const {TextArea} = Input
// 产品的添加和更新的子路由
const ProductAddUpdate:FC = ():ReactElement=> {
    const [isUpdate, setIsUpdate] = useState(false)
    //  !!表 强制转化成boolean
    // const [product, setProduct] = useState()
    const [options, setOptions] = useState<Option[]>([]);
    const editorRef = useRef(null);
    const pwRef = useRef(null);
    const navigate = useNavigate()
    const [form] = Form.useForm();
    const location = useLocation();
    const [product, setProduct] = useState<Iproduct>({}) //当前商品
    // 即便我在home 是用{product} 传递一个对象
    const [categoryIds, setCategoryIds] = useState<string[]>([])
    const {categoryId,pCategoryId,imgs,name,desc,price,detail} = product  
    
    const title = (
        <span>
            <LinkButton>
               <ArrowLeftOutlined style={{color:'green', marginRight: 10,fontSize: 20}}
                onClick={()=>{navigate(-1)} }
               />
            </LinkButton>
            <span>{isUpdate? '修改商品' : '添加商品'}</span>
            {/* <span>添加商品</span> */}
        </span>
    )
    // submit
    const onFinish = async (values:any)=>{
        //1. 搜集数据 并封装成product形式
        const {name,desc,price,categoryIds} = values

        let pCategoryId='', categoryId=''
        if(categoryIds.length === 1){
            // 说明是一级分类
            pCategoryId = '0'
            categoryId = categoryIds[0]
        }else{
            pCategoryId = categoryIds[0]
            categoryId = categoryIds[1]
        }
        const imgs = pwRef?.current.getImgs()
        const detail = editorRef?.current.getDetail()
        // 封装成product
        const addProduct:Iproduct = {name,desc,price,imgs,detail,pCategoryId,categoryId}
        // console.log(addProduct);
        
        // 如果是更新 还需要_id
        if(isUpdate){
            addProduct._id = product._id

        }
        //2  调用接口 添加或更新
         const result = await reqAddOrUpdateProduct(addProduct)
        //  const result = await reqAddProduct(addProduct)
        //3. 根据结果提示
        if(result.status === 0 ){
            message.success(`${isUpdate? '更新' : '添加'}商品成功 `)
            navigate(-1)
        }else{
            message.error(`${isUpdate? '更新' : '添加'}商品失败 `)
        }

        
        
        
    }

    const initOptions = async (categorys:[])=>{
        //根据categorys，生成options数组
        const options:Option[] = categorys.map((c:any)=>({
            value: c._id,
            label: c.name,
            isLeaf: false, //不是叶子  
            // 但是默认所有都会有箭头，得基于手台返回数据才知道没有， 体验稍微有点不好
        }))
        //如果是一个二级分类商品的更新 应该提前拿到二级的options
        if(pCategoryId !== '0'){
            //获取对应的二级分类列表
            const subCategorys = await getCategorys(pCategoryId)
            //生成二级下拉列表options
            const childOptions = subCategorys.map( (c:any) => ({
                value: c._id,
                label: c.name,
                isLeaf: true, //不是叶子
             }))
             //关联到当前一级option上
            //  找到targetOption
            const targetOption = options.find(option => option.value === pCategoryId)
            if(targetOption){
                targetOption.children = childOptions
            }
             
        }

        // 更新options状态
        setOptions(options)
       
       
    }
    // 获取一级/二级分类列表列表
    // async返回值是一个新的Promise对象，这个对象的结果和值由async函数的结果决定
    const getCategorys = async(parentId:string)=>{
        const result = await reqCategorys(parentId)
        if(result.status === 0){
            const categorys = result.data
            // 如果是一级，初始化
            if(parentId === '0'){
                initOptions(categorys)
            }else{
                return categorys //返回二级列表 使得async函数返回的promise 成功且value为categorys
            }
        }
        
        
        
    }
            const onChange = (value:any, selectedOptions:any) => {
          console.log(value, selectedOptions);
        };
      
        // 加载下一级列表的回调
        const loadData = async(selectedOptions:any) => {
            //得到选择的option对象  它支持多选 这里其实就1
        //   const targetOption = selectedOptions[selectedOptions.length - 1];
        const targetOption = selectedOptions[0];
          targetOption.loading = true;
            // 根据选中的一级，请求获取二级分类
           const subCategorys =  await getCategorys(targetOption.value)
           targetOption.loading = false
           //二级分类数组有数据才生成
           if (subCategorys && subCategorys.length>0){
            //    生成二级分列表的options
             const childOptions = subCategorys.map( (c:any) => ({
                value: c._id,
                label: c.name,
                isLeaf: true, //不是叶子
             }))
             //关联到当前option上
             targetOption.children = childOptions
           }else{//当前分类没有二级分类
                targetOption.isLeaf = true
           }
        //    更新options状态
            setOptions([...options]);

        }

        useEffect(() => {
            getCategorys('0')
            if(location.state?.product._id ){
                setIsUpdate(true)
                setProduct(location.state.product)
                if(pCategoryId === '0'){
                    // categoryIds.push(pCategoryId)
                    setCategoryIds([pCategoryId])
                    form.setFieldsValue({categoryIds: categoryIds})
        
                }else{
                    // categoryIds.push(pCategoryId)
                    // categoryIds.push(categoryId)
                    setCategoryIds([pCategoryId,categoryId])
                    // console.log(categoryIds); 这时候还是undefined 再写个useEffect
                }
                form.setFieldsValue({
                    name:name,
                    desc:desc,
                    categoryIds: categoryIds,
                    price:price
                })    

                
            } 
        }, [product])
        useEffect(() => {
            form.setFieldsValue({categoryIds: categoryIds})
        }, [categoryIds])
    
        

    return (
        <Card title={title}>
            <Form
            //指定label  栅格总体是24
             labelCol={{ span: 3 }} //左侧label宽度
             wrapperCol={{ span: 8 }} //指定右侧包裹宽度
             onFinish={onFinish}
             form={form}
             >
                {/* label 就是左侧的文本 */}
                <Item label='商品名称' name='name' rules={[{required:true, message:'商品名称必须输入'}]}>
                    <Input placeholder='商品名称：' ></Input>
                </Item>
                <Item label='商品描述' name='desc' rules={[{required:true, message:'商品描述必须输入'}]} >
                    <TextArea placeholder='请输入商品描述：' autoSize={{minRows: 2, maxRows: 6}}></TextArea>
                </Item>
                <Item label='商品价格' name='price' 
                rules={[
                {required:true, message:'商品价格必须输入'},
                { pattern:new RegExp('^[0-9]*$','g'),message:'商品价格必须大于0'},
                ]}
                >
                    {/* 输入的是数字 指定type 会出现上下箭头 */}
                    <Input type='number' placeholder='请输入商品价格：' addonAfter='元' ></Input>
                </Item>

                <Item label='商品分类' name='categoryIds' rules={[{required:true, message:'商品分类必须输入'},]} 
                >
                    <Cascader options={options} loadData={loadData} />
                </Item>
                <Item label='商品图片' labelCol={{span:3}} wrapperCol={{span:20}}>
                    <PicturesWall ref={pwRef} imgs={imgs}/>
                </Item>
                <Item label='商品详情' labelCol={{span:3}} wrapperCol={{span:20}}>
                    <RichTextEdtor ref={editorRef} detail={detail}/>
            
                </Item>
                <Item>
                    <Button type='primary' htmlType='submit'>提交</Button>
                </Item>
                
            </Form>
        </Card>
    )
}

export default ProductAddUpdate
