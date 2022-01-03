import React, { FC, ReactElement, useEffect } from 'react'
import logo from '../../assets/images/logo.png'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './login.less'
import { useNavigate } from 'react-router-dom';
import {connect} from 'react-redux'
import { IStoreState } from '../../typings';
import {Dispatch} from 'redux'
import { login, User } from '../../redux/action';

// 一级路由 登录的路由组件 在app中映射为路由
const Login:FC = (props:any):ReactElement => {
    interface IUser{
        username? : string
        _id? : string
    }

    let navigate = useNavigate();
    // 判断用户是否登录，如果已经登录，自动跳转到管理界面 要在写在渲染前
    useEffect(() => {
       let user = props?.user
        if(user&& user._id){
           navigate('/home',{replace: true})
       }
       }, [props.user])
    interface IValue{
        username: string,
        password: string
    }
    const onFinish = async(values: IValue) => {
        //发送登录请求 通过action
        const {username,password} = values
        props.login(username,password)
      };

    return (
        <div className='login'>
            <header className="login-header">
                <img src={logo} alt="logo" />
                <h1>React项目：后台管理系统</h1>
            </header>
            <section className="login-content"> 
                {/* <div>{props?.user.errorMsg}</div> */}
                <h2>用户登陆</h2>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    >
                    <Form.Item
                        name="username"
                        // 必须输入 大于等于3位 小于等于12位  英文下划线字母
                        // 注意空格 whitespace:true 输入空格也会视为错误，相当于没输
                        rules={[
                            { required: true, whitespace:true, message: '用户名必须输入' },
                            {   min: 3, message: '用户名至少3位'},
                            {   max: 12, message: '用户名最多12位'},
                            //  / 里面写正则/ ^表开头 表结尾 []只能匹配一个字符 +表匹配任意多
                            {   pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文，数字或下划线组成' }
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, whitespace:true, message: '用户名必须输入' },
                            {   min: 3, message: '用户名至少3位'},
                            {   max: 12, message: '用户名最多12位'},
                            //  / 里面写正则/ ^表开头 表结尾 []只能匹配一个字符 +表匹配任意多
                            {   pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文，数字或下划线组成' }
                        ]}
                    >
                        <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="密码"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                        登陆
                        </Button>
                    </Form.Item>
                    </Form>
            </section>
        </div>
    )
}
const mapStateToProps = (state: IStoreState) => {
    return {
        user: state.user
    }
};
interface IDispatcherProps{
    login: (username:string,password:string) => User
}
const mapDispatcherToProps = (dispatch:any): IDispatcherProps => {
    return {
         login: (username:string,password:string) => dispatch(login(username,password))
     }
};
export default connect(
    mapStateToProps,
    mapDispatcherToProps
)(Login)


