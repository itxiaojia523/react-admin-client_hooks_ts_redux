import React, { FC, ReactElement, useEffect } from 'react'
import logo from '../../assets/images/logo.png'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { reqLogin } from '../../api';
import './login.less'
import { useNavigate } from 'react-router-dom';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';

// 一级路由 登录的路由组件 在app中映射为路由
const Login:FC = ():ReactElement => {
    interface IUser{
        username? : string
        _id? : string
    }

    let navigate = useNavigate();
    // 判断用户是否登录，如果已经登录，自动跳转到管理界面 要在写在渲染前
    useEffect(() => {
       let user:IUser = memoryUtils.user
        if(user&& user._id){
           navigate('/',{replace: true})
       }   
       }, [])
    interface IValue{
        username: string,
        password: string
    }
    const onFinish = async(values: IValue) => {
        // console.log('Received values of form: ', values);
        //发送登录请求
        const {username,password} = values
        const result = await reqLogin(username,password)
        // console.log('成功了',response.data)
        if(result.status === 0){//登录成功
            message.success('登陆成功')
            //维持登录和自动登录 维持登录需要保存到内存 自动登录需要存到本地
            //1.存在内存中 利用memoryUtils
            const user = result.data
            memoryUtils.user = user
            //保存user到本地 -，利用storageUtils-利用了store库
              storageUtils.saveUser(user)
            //在入口index 中取local的user存到内存
            // 跳转到后台，不需要回退
           navigate('/',{replace: true})

        }else{
            message.error(result.msg)
        }
      };

    return (
        <div className='login'>
            <header className="login-header">
                <img src={logo} alt="logo" />
                <h1>React项目：后台管理系统</h1>
            </header>
            <section className="login-content"> 
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

export default Login