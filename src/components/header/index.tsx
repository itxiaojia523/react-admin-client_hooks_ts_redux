import React, { FC, ReactElement, useEffect, useState } from 'react'
import memoryUtils from '../../utils/memoryUtils'
import { formatDateTime } from '../../utils/dateUtils'

import './index.less'
import { useLocation, useNavigate } from 'react-router-dom'
import menuList from '../../config/menuConfig';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import storageUtils from '../../utils/storageUtils'
import LinkButton from '../link-button'
import { IMemoryUser } from '../../typings'
const { confirm } = Modal;

  // 头部组件
const Header:FC = ():ReactElement=>{
    const [ user, setUser] = useState<IMemoryUser>()
    const [curTime,setCurTime] = useState(formatDateTime(Date.now()))
    const [curTitle,setCurTitle] = useState('首页')
    const navigate = useNavigate()
    //动态显示首页字段，根据地址，匹配key，到menuConfig中找对应的title
    const location = useLocation();
    const path = location.pathname

    // 顺序 1. 自定义函数  2.声明周期 3.reder和return
    const logOut = () => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: '确定退出吗',
      onOk() {
          //1.删除user数据 本地和内存
          storageUtils.removeUser()
          memoryUtils.user = {}
          //2.跳转到login页面
          navigate('/login',{replace: true})
      },
    //   onCancel() {}, //取消不需要
    });
  }



    // 使得时间自动+， 利用定时器
    const getTime = ()=>{
        //每隔一秒获取当前时间 并更新curTime
        let intervalID = setInterval(()=>{
            const curTime = formatDateTime(Date.now())
            setCurTime(curTime)
            return () => {//组件卸载前执行 清楚定时器
                clearInterval(intervalID)
            }
        },1000)
    }

    const getTitle= ()=>{ 
        //得到当前请求路径
        // 不能用find因为有对象嵌套 ，这时候要两层遍历
        menuList.forEach(item=>{ 
            if(item.key === path){
                setCurTitle(item.title)
            }else if(item.children){
                //这时候可以用find 只有一层,在子item中查找
               const cItem = item.children.find((citem)=> citem.key === path)
               //如果有值，表找到了，设置title
               if(cItem){
                setCurTitle(cItem.title)
               }
            }
        })
    } 

    useEffect(() => {
        getTime()
        const user = memoryUtils.user
        setUser(user)
    }, [])
    
    useEffect(() => {
        getTitle()
    }, [path])
 
    
    return (
        <div className='header'>
            <div className="header-top">
                <span>欢迎，{user?.username}</span>
                {/* <a href="javascript:;" onClick={logout}>退出</a> */}
                <LinkButton onClick={logOut}>退出</LinkButton>
            </div>
            <div className="header-bottom">
                <div className="header-bottom-left">{curTitle}</div>
                <div className="header-bottom-right">
                    <span>{curTime}</span>
                    <img src="" alt="weather" />
                    <span>晴</span>
                </div>
            </div>
        </div>
    )
}
export default Header
