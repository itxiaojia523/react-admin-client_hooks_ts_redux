import React, { FC, ReactElement, useEffect, useState } from 'react'
import { Card,Button, Table } from 'antd';
import { ArrowRightOutlined, PlusOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button';
import {reqAddCategory, reqCategorys, reqUpdateCategory} from '../../api/index'
import {message, Modal} from 'antd'
import AddForm from './add-form';
import UpdateForm from './update-form';
import { Icategory } from '../../typings';
import { FormInstance } from 'antd';


// 首页路由
const Category:FC = ():ReactElement=>{

    const [loading,setLoading] = useState<boolean>(false) //是否正在获取数据
    const [categorys,setCategorys] = useState<Icategory[]>([]) //一级列表
    const [subCategorys,setSubCategorys] = useState<Icategory[]>([]) //一级列表
    const [parentId,setParentId] = useState<string>('0') //当前列表的pid
    const [parentName,setParentName] = useState<string>('') //当前列表的pname
    const [isModalVisible,setIsModalVisible] = useState<number>(0); //标识模态框显示0都不显示 1显示添加 2显示修改
    const [category,setCategory] = useState<Icategory>({})
    const [form,setFForm] = useState<FormInstance>()


    // 显示添加确认框
    const showAddCatogery = ()=>{
      setIsModalVisible(1)
    }

    // 显示修改确认框
    const showUpdateCategory = (category:Icategory)=>{
      // 从render中接收到category,存起来
      setCategory(category)     

      setIsModalVisible(2)
    }

    // 确认框点击ok后添加分类
    const addCategory = ()=>{
      form!.validateFields().then(async values => {
        // 隐藏确认框
      setIsModalVisible(0)
      
      // 获取数据并发送请求
      // console.log(form!.getFieldsValue()); //+s能拿到所有formitem的值
      // const{pid,categoryName}=form!.getFieldsValue() 
      const{pid,categoryName}= values
      //重置输入数据
      form!.resetFields()
      const result = await reqAddCategory(categoryName,pid)
      
      if(result.status === 0){
        // 重新获取分类列表显示 
        // getCategorys() //此时在一级中添加某个二级 也会重新获取，网速慢会转圈，没意义
        // 只在当前页面添加当前分类时才需要获取
        // 只有在一级列表中添加一级  以及二级列表中添加 当前的二级 才需要获取
        if(pid === parentId){ //在当前页,需发请求
          getCategorys()
        }else if(pid === '0'){//在二级列表下 添加 一级分类,需要重新获取一级分类，但不需要显示
          getCategorys('0') //重新设置getCategory函数，如果没指定参数，就根据状态中的pid

        }
      }
        
      })
      
      
    }

    // 确认框点击ok后修改分类
    const updateCategory = ()=>{

      //表单验证
      form!.validateFields().then(async values => {
        // 发送请求
      let categoryId:string = category._id || ''
      // 要拿到input的值  从子拿到form对象
      // const categoryName:string = form!.getFieldValue('categoryName')
      const {categoryName} = values
      
        // 一旦修改了，会保存数据，希望不保存，清除掉 这次没遇到，因为直接在子组件effct中改了
       // form!.resetFields()
 
       // 发请求更新
       const result = await reqUpdateCategory({categoryId,categoryName})
       
       if (result.status === 0){
         //更新显示列表
         getCategorys()
       }
       
       //隐藏窗口 
       setIsModalVisible(0)
      });
      
     
    }

    // 点击取消,隐藏确认框
    const handleCancel = ()=>{
      setIsModalVisible(0)
      //重置输入数据
      form!.resetFields()
    }
    
    //异步获取一级/二级列表数据  根据pid区分
    const getCategorys = async(pId?:string)=>{
      // 请求前loading
      setLoading(true)
      const result = await reqCategorys(pId || parentId)
      
      // const result = await reqCategorys(parentId)
      // 请求后无论成功 false
      setLoading(false)
      if(result.status === 0){
        //如果pid是0，则更新一级 否则更新二级
        if(parentId === '0'){
          setCategorys(result.data)
        }else{
          setSubCategorys(result.data)
        }
      
      }else{
        message.error('列表获取失败')
      }
      
    }
    //一级中点击查看子分类，获取二级列表
    const showSubCategorys = (category: any)=>{
      //更新状态
      setParentId(category._id)
      setParentName(category.name)
      //获取二级分类 
      //更新时异步的，此时pid依然为0,不能直接写，要在effect中添加依赖
      // console.log(parentId);
    }

    //二级中点击标题返回一级
    const showCategorys = ()=>{
      // 此时不需要发送请求，一级的一直在
      setParentId('0')
      setParentName('')
      setSubCategorys([])
    }

    useEffect(() => {
      getCategorys()
    }, [parentId])

    //card的左侧
    // title也一样会变
    const title = parentId === '0'? '一级分类列表' : (
      <span>
        {/* 点击后返回一级 */}
        <LinkButton onClick={showCategorys}>一级分类列表</LinkButton> 
        <ArrowRightOutlined style={{marginRight: 5}}/>
        <span>{parentName}</span>
      </span>
    ) 
    //card的右侧
    const extra = (
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddCatogery}>
            添加
        </Button>
    )

    //分类的信息，即首行标题
    const columns = [
    {
      title: '分类名称',
      dataIndex: 'name',//对应DataSource中的name属性名
      // key: 'name',
    },
    {
      title: '操作',
      width : 300,
      render: (category: any)=> ( //指定需要显示的界面标签 render能拿到每一行的对象category作为参数传入
        <span>
          <LinkButton onClick={()=>{showUpdateCategory(category)}}>修改分类</LinkButton>
          {/* linkbtn在二级中没有，写Null 不做任何显示 */}
          {parentId === '0'? <LinkButton onClick={()=>{showSubCategorys(category)}}>查看子分类</LinkButton> : null }
          
        </span>
      )
    }
  ];
 
    return (
        <div>
            <Card title={title} extra={extra}>
                <Table 
                  bordered 
                  rowKey='_id'
                  //可能一级 也可能二级
                  dataSource={parentId === '0'? categorys : subCategorys}
                  columns={columns}
                  // 分页器
                  pagination={{defaultPageSize:5, showQuickJumper: true}}
                  loading={loading}
                />;
                <Modal
                  title="添加分类" 
                  visible={isModalVisible === 1} 
                  onOk={addCategory} 
                  onCancel={handleCancel}>
                    <AddForm categorys={categorys} parentId={parentId} 
                    setForm={(form:FormInstance)=>{setFForm(form)}}/>
                </Modal>

                <Modal
                  title="修改分类" 
                  visible={isModalVisible === 2} 
                  onOk={updateCategory} 
                  onCancel={handleCancel}>
                    <UpdateForm categoryName ={category.name || ''} 
                     setForm={(form:FormInstance)=>{setFForm(form)}}/>
                </Modal>




            </Card>
        </div>
    )
}
export default Category
