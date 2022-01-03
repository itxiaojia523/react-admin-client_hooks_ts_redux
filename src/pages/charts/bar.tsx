import React, { FC, ReactElement, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { Button, Card } from 'antd'

// 首页路由
const Bar:FC = ():ReactElement=>{
    const [sales, setSales] = useState([5, 20, 36, 10, 10, 20]) //销量
    const [storages, setStorages] = useState([15, 10, 16, 10, 10, 20]) //库存
    // 返回柱状图的配置对象
    const getOptions = ()=>{
        return {
            title: {
              text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
              data: ['销量','库存']
            },
            xAxis: {
              data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
            },
            yAxis: {},
            series: [
              {
                name: '销量',
                type: 'bar',
                data: sales
              },
              {
                name: '库存',
                type: 'bar',
                data: storages
              }
            ]
          };
    }
    const update = ()=>{
        setSales( (sales) => {
            const newSales = sales.map( (sale: number) => sale+1 )
            return newSales
        }
        )
        setStorages( (storages) => {
            const newStorages = storages.reduce((pre,storage)=>{
                pre.push(storage -1)
                return pre
            },[] )
            return newStorages
        }
        ) 
        
    }
    return (
        <>
        <Card>
            <Button type='primary' onClick={update}>更新</Button>
        </Card>
        <Card title='柱状图一'>
            <ReactECharts option={getOptions()} />
        </Card>
        </>
    )
}
export default Bar
