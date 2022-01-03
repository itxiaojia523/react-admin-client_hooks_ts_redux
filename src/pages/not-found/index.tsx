import React from 'react'
import {Button, Row, Col} from 'antd'
import {connect} from 'react-redux'
import './index.less'
import { setHeadTitle } from '../../redux/action'
import { useNavigate } from 'react-router-dom'

/*
前台404页面
 */
const NotFound = (props:any) => {
  const navigate = useNavigate()
  const goHome = () => {
    props.setHeadTitle('首页')
    navigate('/home',{replace:true})
  }

    return (

      <Row className='not-found'>
        <Col span={12} className='left'></Col>
        <Col span={12} className='right'>
          <h1>404</h1>
          <h2>抱歉，你访问的页面不存在</h2>
          <div>
            <Button type='primary' onClick={goHome}>
              回到首页
            </Button>
          </div>
        </Col>
      </Row>
    )
}

export default connect(
  null,
  {setHeadTitle}
)(NotFound)
