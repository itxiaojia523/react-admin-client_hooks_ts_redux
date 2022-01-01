import React, { FC, ReactElement } from 'react'
import { Route, Routes } from 'react-router-dom'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'
import ProductHome from './home'
import './index.less'

// 首页路由
const Product:FC = ():ReactElement=>{
    return (
        <Routes>
            {/* 注意不要写成/product/detail */}
            <Route path='detail' element={<ProductDetail/>}> </Route>
            <Route path='addupdate' element={<ProductAddUpdate/>}> </Route>
            {/* /在这里表 /product路径 */}
            <Route path='/' element={<ProductHome/>}> </Route>
            <Route path="/*" element={<ProductHome />} />
        </Routes>
    )
}
export default Product
