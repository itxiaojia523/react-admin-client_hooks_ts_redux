import React, { FC, forwardRef, ReactElement, useImperativeHandle } from 'react'

// 首页路由
interface Iprops{
    bcRef? :React.Ref<unknown>
}
interface RefObject {
    getMenus: () => number
  }
const BarChild = (props:any,bcRef:any):ReactElement=>{
    const getMenus = ()=> 123
    useImperativeHandle(
        bcRef,
        () => ({
            getMenus
        })
    )
    return (
        <div>
            barchild
        </div>
    )
}
export default forwardRef(BarChild)
