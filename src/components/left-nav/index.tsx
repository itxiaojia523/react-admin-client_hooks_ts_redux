import React, { FC, ReactElement, ReactNode } from 'react'
import { Dispatch } from 'redux'
import {connect} from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import { Menu } from 'antd';
import { PieChartOutlined, MailOutlined } from '@ant-design/icons';

import menuList from '../../config/menuConfig';
import './index.less'
import { HeadTitle, setHeadTitle } from '../../redux/action';
import { IStoreState } from '../../typings'
const { SubMenu } = Menu;

// 头部组件
interface IItem {
    title: string,
    key: string,
    icon?: string,
    isPublic?: Boolean,
    children?: []
  }

const LeftNav:FC = (props:any):ReactElement=>{

    //得到当前的路径,用于设置自动选中当前菜单项
    const location = useLocation();
    let path = location.pathname
    if(path === '/'){
        path = '/home'
    }
    if(path.indexOf('/product') === 0){
        path = '/product'
    }
    // const [openKey,setOpenKey] = useState('')
    let openKey:string = ''
   
        // 判断当前用户对item是否有权限
        const hasAuth = (item:any)=>{
            const {key, isPublic} = item
            const menus = props?.user.role.menus
            const username = props?.user.username
            // 如果是admin 直接通过
            // 判断权限 key是否在menus中
            // 如果当前item是公开的，也返回true
            if(username === 'admin' || isPublic || menus.indexOf(key)!== -1 ){
                return true
            }else if(item.children){ //如果有此item的某个子item的权限，父item也要显示
                const result = item.children.find( (child:any) => menus.indexOf(child.key) === -1)
                // !！ 表转化为布尔值
                // console.log(!!result);
                return !!result
            }
            return false               
        }
    
    // 根据menuList的数组数组，生成对应的标签数组，为什么标签数组会直接渲染出来 -> jsx会渲染数组
    const getMenuNodes = (menuList:any):ReactNode=>{
        return menuList.map((item:IItem)=>{      
            // 如果当前用户有对应的权限，才需要显示 
            if(hasAuth(item)){
                
                if(!item.children){
                    // 在有子项的地方刷新 会是初始值 首页 以及添加商品时路径不会全等
                    // 判断item是否为当前对应的item
                    if(item.key === path || path.indexOf(item.key) === 0){
                        // 当前要显示title为item.title 而不是citem
                        props.setHeadTitle(item.title)
                    }
                    return  (
                        <Menu.Item key={item.key} icon={<PieChartOutlined />}>
                            <Link to={item.key} onClick={()=>{props.setHeadTitle(item.title)}}>
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    )
                }else{
                    // 某一项的children 跟 当前路径匹配
                    const citem = item.children.find((cItem:IItem)=>{
                        return path.indexOf(cItem.key)
                        
                    })
                    //如果存在说明，当前item对应的子列表需要展开
                    if(citem){
                        openKey = item.key
                    }
                    
    
                    return (      
                <SubMenu key={item.key} icon={<MailOutlined />} title={item.title}>
                    {
                        getMenuNodes(item.children)
                    }
                </SubMenu> 
                    )
                }
            } 
            return null

            
        })

    }
    //出bug了，因为代码顺序问题 拿不到openKey
    //先取出menuNodes
    const menuNodes:ReactNode  = getMenuNodes(menuList)


    return (
        <div className='left-nav'>
            {/* header是一个link，路径是home */}
            <Link className="left-nav-header" to={'/'}>
                <img src={logo} alt="logo" />
                <h1>硅谷后台</h1>
            </Link>
            {/* antd的menu组件 导航菜单 可以把每个链接作为key*/}
            <Menu
            // 值为数组，表可以选中多个，值是key
            // default只会初始时指定一次, 类式组件的子路由从/ 到/home 发生更新，这个不会更新
            // 在这边两种都行
                // defaultSelectedKeys={[path]} 

                selectedKeys={[path]} 
                // 选中品类管理，刷新后会自动展开,这里要写submenu的key
                // 条件：某一项的children 跟 当前路径匹配，在getNodes函数中写
                defaultOpenKeys={[openKey]}
                mode="inline"
                theme="dark"
                >
             
                {/* <Menu.Item key="/home" icon={<PieChartOutlined />}>
                    <Link to={'/home'}>
                        <span>首页</span>
                    </Link>
                    
                </Menu.Item>
                <SubMenu key="sub1" icon={<MailOutlined />} title="商品">
                    <Menu.Item key="/category" icon={<PieChartOutlined />}>
                        <Link to={'/category'}>
                           <span>品类管理</span>
                        </Link>
                    </Menu.Item>
                </SubMenu> */}
                {/* 动态生成标签数组，jsx会渲染 */}
                {
                    menuNodes
                }
           


        </Menu>
        </div>
    )
}
const mapStateToProps = (state: IStoreState) => {
    return {
        user: state.user
    }
};
  interface IDispatcherProps {
    setHeadTitle: (title:string) => HeadTitle;
  }
// 将 对应action 插入到组件的 props 中
const mapDispatcherToProps = (dispatch:Dispatch): IDispatcherProps => {
    return {
        setHeadTitle: (title:string) => dispatch(setHeadTitle(title))
    }
};
export default connect(
    mapStateToProps,
    mapDispatcherToProps
)(LeftNav)

// 将 对应action 插入到组件的 props 中
// const mapDispatcherToProps = (dispatch: Dispatch, ownProps: IStateProps): IDispatcherProps => ({
//     deleteTodo: () => dispatch(actions.deleteTodo(ownProps.id)),
//     toggleTodo: () => dispatch(actions.toggleTodo(ownProps.id)),
//     editTodo: (text: string) => dispatch(actions.editTodo(ownProps.id, text))
// });
