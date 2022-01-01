import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import{
    Form,
    Input,
    Tree
} from 'antd'
import menuList from '../../config/menuConfig'
import { IRole } from '../../typings'
const Item = Form.Item

interface Iprops{
    role?: IRole
    authRef? :any
}
const AuthForm= (props:Iprops,authRef:any) =>{
    const {role} = props
    const [treeData, setTreeData] = useState( [  ])
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>();
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>();
    const getMenus = () => checkedKeys
    useImperativeHandle(
        authRef,
        () => ({
            getMenus
        })
    )
    

    //   根据menuList生成treedata、
    const getTreeData = (menuList:any) =>{
        return menuList.map((item:any)=>{
            if(!item.children){
                return  (
                    {
                        title: item.title,
                        key: item.key,
                    }
                )
            }else{
                const treeChildren = getTreeData(item.children)
                return  (
                    {
                        title: item.title,
                        key: item.key,
                        children: treeChildren
                    }
                )
                
            }

        })
    }
    useEffect(() => {
        // 因为是异步得到的treedata，如果不通过状态的话，初始值虽然执行，但是打钩空气，然后出来数据，默认打钩了 就不会再执行
       setTreeData(getTreeData(menuList))
       setExpandedKeys(['/products','/charts'])
       setCheckedKeys(role.menus)
    }, [role])
    
    //   const onSelect = (selectedKeys: React.Key[], info: any) => {
    //     console.log('selected', selectedKeys, info);
    //   };
    
      const onCheck = (checkedKeys:any, info: any) => {
        // console.log('onCheck', checkedKeys, info);
        setCheckedKeys(checkedKeys)
      };
    
    return (
        <>
            <Item
            
            label='角色名称'  
            >
                <Input value={role.name} disabled/>
            </Item>  
            {/* 教程有个bug，role变了，但是其他状态没变，导致打钩都一样 */}
            {/* 给modal添加destroyOnClose，损耗性能但是能实现根据新传入role，更新checkkeys状态 */}
            {/* componentWillReceiveProps 当组件接受到新属性时调用 menus= nextProps.role.menus*/}
            <Tree
                checkable
                expandedKeys={expandedKeys}
                checkedKeys={checkedKeys}
                // defaultSelectedKeys={['0-0-0', '0-0-1']}
                // defaultCheckedKeys={['0-0-0', '0-0-1']}
                // onSelect={onSelect}
                onCheck={onCheck}
                treeData={treeData}
           />
        </>

    )
}

export default forwardRef(AuthForm)
