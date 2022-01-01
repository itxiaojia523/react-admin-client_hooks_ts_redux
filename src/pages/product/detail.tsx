import { ArrowLeftOutlined } from '@ant-design/icons'
import { Card, List } from 'antd'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { reqCategory } from '../../api'
import LinkButton from '../../components/link-button'
const Item = List.Item
// 产品详情的子路由
const ProductDetail:FC = ():ReactElement=> {
    const [cName1,setCname1] = useState<string>('') //一级分类名
    const [cName2,setCname2] = useState<string>('') //二级分类名
    const navigate = useNavigate()
    const location = useLocation();
    // 即便我在home 是用{product} 传递一个对象
    const {product} = location.state
    const {name,desc,price,detail,imgs} = product
    
    const title = (
        <span>
            <LinkButton>
               <ArrowLeftOutlined style={{color:'green', marginRight: 10,fontSize: 20}}
                onClick={()=>{navigate(-1)} }
               />
            </LinkButton>
            <span>商品详情</span>
        </span>
    )

    const getCategory = async()=>{
        const {pCategoryId, categoryId} = product //pid可能为'0'
        if(pCategoryId === '0'){
            // 一级分类商品
           const result = await reqCategory(categoryId)
           const cName1 = result.data.name
           setCname1(cName1)
        }else{
            // 二级分类商品
        //    const result1 = await reqCategory(pCategoryId)
        //    const result2 = await reqCategory(categoryId) 
           //通过多个await存在效率问题 第二个请求是第一个请求成功响应后才发的

        //    需要一次性发多个请求 只有都成功了才正常处理
        const results = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
           const cName1 = results[0].data.name
           const cName2 = results[1].data.name
           setCname1(cName1)
           setCname2(cName2)
        }

    }
    useEffect( () => {
        getCategory()
        
    }, [])
    return (
        <Card title={title} className='product-detail'>
            <List>
              <Item className='product-detail-item'>
                    <span className='left'>商品名称:</span> 
                    <span>{name}</span>
                </Item>   
                <Item className='product-detail-item'>
                    <span className='left'>商品描述:</span>
                    <span>{desc}</span>
                </Item>    
                <Item className='product-detail-item'>
                    <span className='left'>商品价格:</span>
                    <span>{price}元</span>
                </Item>   
                <Item className='product-detail-item'>
                    <span className='left'>所属分类:</span>
                    <span>{cName1}{cName2? '-->'+cName2 : ''}</span>
                </Item>
                <Item className='product-detail-item'>
                    <span className='left'>商品图片:</span>
                    <span>
                        {
                            imgs? 
                            (imgs.map( (img:any) => (
                                <img 
                                 key={img.url}
                                 src = {img.url}
                                className='product-img'
                                alt="img" />
                            ))
                            )
                                :
                                ''
                        }
                        
                     
                    </span>
                </Item>  
                <Item className='product-detail-item'>
                    <span className='left'>商品详情:</span>
                    {/* 拿到的是p标签数据 用上react的dangerouslySetInnerHTML 类似Innerhtml */}
                    {/* <span dangerouslySetInnerHTML={{__html:'<h1>商品详情的内容部分</h1>'}}> */}
                    <span dangerouslySetInnerHTML={{__html: detail}}>
                    </span>
                </Item>    
            </List> 
        </Card>
    )
}

export default ProductDetail