import React, { FC, ReactElement, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import {connect} from 'react-redux'
import { Layout } from 'antd';
import LeftNav from '../../components/left-nav';
import Header from '../../components/header';
import Home from '../home';
import Category from '../category';
import Product from '../product';
import Role from '../role';
import User from '../user';
import Bar from '../charts/bar';
import Line from '../charts/line';
import Pie from '../charts/pie';
import Order from '../order';
import { IStoreState } from '../../typings';
import NotFound from '../not-found'

const {Footer, Sider, Content } = Layout;

// 一级路由 登录的路由组件
const Admin:FC = (props:any):ReactElement => {
    let navigate = useNavigate()
    //从内存中取user数据 可能为空 表未登录
    const user = props?.user
    //如果没登录
    //在render中
    useEffect(() => {
        // console.log(user);
        // || !user.id
        if(!user|| !user._id ){
            //自动跳转到登录界面
            navigate('/login')
        }
    },[props?.user])
    
    
    return (
        <>
            {/* 注意100%是字符串 后面有超过100%的情况，所以应该设置为Min*/}
            <Layout style={{minHeight:'100%'}}>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header/>
                    <Content style={{margin: 20, backgroundColor:'#fff'}}>
                        <Routes>
                            <Route index element={<Home/>}></Route>
                            <Route path='home' element={<Home/>}></Route>
                            <Route path='category' element={<Category/>}></Route>  
                            <Route path='product/*' element={<Product/>}></Route>  
                            <Route path='role' element={<Role/>}></Route>  
                            <Route path='user' element={<User/>}></Route>  
                            <Route path='charts/bar' element={<Bar/>}></Route>  
                            <Route path='charts/line' element={<Line/>}></Route>  
                            <Route path='charts/pie' element={<Pie/>}></Route>  
                            <Route path='order' element={<Order/>}></Route>  
                            <Route path="/*" element={<NotFound />} />            
                        </Routes>
                    </Content>
                    <Footer style={{textAlign:'center',color:'#ccc'}}>推荐使用谷歌浏览器，可以获取更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        </>
        
        
    )
}
const mapStateToProps = (state: IStoreState) => {
    return {
        user: state.user
    }
};
export default connect(mapStateToProps)(Admin)