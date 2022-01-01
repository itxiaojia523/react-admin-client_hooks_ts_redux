import React, { FC, ReactElement, useEffect, useRef } from 'react'
import BarChild from './barchild'

// 首页路由
const Bar:FC = ():ReactElement=>{
    const bcRef = useRef(null)
    useEffect(() => {
        const result = bcRef.current?.getMenus()
        console.log(result);
        console.log(bcRef.current);
        
        
    }, [])
    return (
        <BarChild ref={bcRef}/>
    )
}
export default Bar
