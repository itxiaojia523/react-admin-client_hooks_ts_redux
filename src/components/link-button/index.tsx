import React, { FC, ReactElement } from 'react'
import './index.less'

interface Iprops{
    children?:unknown
    onClick? : ()=>void
}
const LinkButton:FC<Iprops> = (props):ReactElement =>{
    return (
        <button className = 'link-button' {...props}></button>
    )
}

export default LinkButton
