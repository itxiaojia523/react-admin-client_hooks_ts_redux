import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Input, message, Select, Table } from 'antd'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import LinkButton from '../../components/link-button'
import { Iproduct } from '../../typings'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'
import { useNavigate } from 'react-router-dom'
const Option = Select.Option
// 产品主页的子路由
const ProductHome:FC = ():ReactElement=> {
    const [pageNum, setPageNum] = useState<number>(1)
    const [products,setProducts] = useState<Iproduct[]>([]) //产品信息数组
    const [total,setTotal] = useState<number>() //获取总记录数
    const [loading ,setLoading] = useState<boolean>(false) //是否加载中
    const [searchContent ,setSearchContent] = useState<string>('') //搜索的关键字
    const [searchType ,setSearchType] = useState<string>('productName') //默认按名称搜索
    const navigate = useNavigate()

      //更新商品上下架
      const updateStatus = async(productId:string,status:number)=>{
        const result = await reqUpdateStatus(productId,status)
        
        if(result.status === 0){
          message.success('更新商品成功')
          getProducts(pageNum) //更新当前页
        }
      }

      const getProducts = async(pageNum:number)=>{
        setPageNum(pageNum)
        setLoading(true)
        //区分一般分页 和 按条件查找 如果关键字有值
        let result:any
        if(searchContent){
           result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchContent,searchType})
           console.log(result);
           
        }else{
          result = await reqProducts(pageNum,PAGE_SIZE)
        }
        setLoading(false)
        if (result.status === 0){
          //   取出分页数据 更新显示
            const {total,list} = result.data
            setProducts(list)
            setTotal(total)
        }
    }
    
    const title = (
        <span>
            {/* 搜索前 select 和input数据要搜集起来 onchange监听 + state*/}
            <Select value={searchType} style={{width:150}} onChange={value => setSearchType(value)}>
                <Option value='productName'>按名称搜索</Option>
                <Option value='productDesc'>按描述搜索</Option>
            </Select>
            {/* Input和Select 的onchange返回的不一样 根据文档 */}
            <Input placeholder='关键字' style={{width:150, margin:'0 15px'}} value={searchContent} 
             onChange={e => setSearchContent(e.target.value)}
            />
            <Button type='primary' onClick={()=>{getProducts(1)} }>搜索</Button>

        </span>
    )
    const extra = (
        <Button type='primary' onClick={ ()=>{navigate('/product/addupdate')} }>
            <PlusOutlined />
            添加商品
        </Button>
    )
    //   table的列数组
      const columns = [
        {
          title: '商品名称',
          dataIndex: 'name',
        },
        {
          title: '商品描述',
          dataIndex: 'desc',
  
        },
        {
          title: '价格',
          dataIndex: 'price',
          //没有dataIndex时，render接收行对象 有的话直接拿到dataIndex
          render:(price:number)=> '￥'+price
        },
        {
          width:100,
          title: '状态',
          // dataIndex: 'status',
          render:(product:Iproduct) =>{
            const {status,_id} = product
              return(
                  <span >
                      <Button type='primary' onClick={ ()=>{updateStatus(_id, status === 1? 2 : 1)} }>{status === 1? '下架' : '上架'}</Button>
                      {status === 1? '在售' : '已下架'}
                  </span>
              )
          }
        },
        {
          width:100,
          title: '操作',
          render: (product:Iproduct)=>{
              return(
                <span>
                    <LinkButton onClick={()=>{navigate('detail',{state:{product} })} }>详情</LinkButton>
                    <LinkButton onClick={()=>{navigate('addupdate',{state:{product}  })} }>修改</LinkButton>
               </span>
              )
          }
        }  
      ];

      useEffect(() => {
          getProducts(1)
      }, [])
    return (
        <Card title={title} extra={extra}>
            <Table
             loading={loading}
             dataSource={products}
             columns={columns}
            //  指定行key 拿到product的id 注意写法
             rowKey='_id'
            //  边框
            bordered
            //分页配置 要保证这边3与reqProduct的3一致 利用常量模块
            // 要告诉他记录数total
            // 需要监听页码
            pagination={{total,defaultPageSize:PAGE_SIZE, showQuickJumper:true,
                // onChange: (pageNum)=>{getProducts(pageNum)} 外接到一个参数，传给里一个函数执行，简写为
                // 给到的实参，即我要的参数
                onChange: getProducts,
                current: pageNum
            }}
            />

        </Card>
    )
}

export default ProductHome