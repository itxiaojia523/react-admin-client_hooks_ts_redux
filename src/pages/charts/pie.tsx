import React, { FC, ReactElement, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { Card } from 'antd'


// 首页路由
const Pie:FC = ():ReactElement=>{
    // 返回柱状图的配置对象
    const getOptions = ()=>{
        return {
            backgroundColor: '#2c343c',
            title: {
              text: 'Customized Pie',
              left: 'center',
              top: 20,
              textStyle: {
                color: '#ccc'
              }
            },
            tooltip: {
              trigger: 'item'
            },
            visualMap: {
              show: false,
              min: 80,
              max: 600,
              inRange: {
                colorLightness: [0, 1]
              }
            },
            series: [
              {
                name: 'Access From',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: [
                  { value: 335, name: 'Direct' },
                  { value: 310, name: 'Email' },
                  { value: 274, name: 'Union Ads' },
                  { value: 235, name: 'Video Ads' },
                  { value: 400, name: 'Search Engine' }
                ].sort(function (a, b) {
                  return a.value - b.value;
                }),
                roseType: 'radius',
                label: {
                  color: 'rgba(255, 255, 255, 0.3)'
                },
                labelLine: {
                  lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                  },
                  smooth: 0.2,
                  length: 10,
                  length2: 20
                },
                itemStyle: {
                  color: '#c23531',
                  shadowBlur: 200,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx: any) {
                  return Math.random() * 200;
                }
              }
            ]
          };
    }
    const getOptions2 = ()=>{
        return  {
            title: {
              text: 'Referer of a Website',
              subtext: 'Fake Data',
              left: 'center'
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              orient: 'vertical',
              left: 'left'
            },
            series: [
              {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                data: [
                  { value: 1048, name: 'Search Engine' },
                  { value: 735, name: 'Direct' },
                  { value: 580, name: 'Email' },
                  { value: 484, name: 'Union Ads' },
                  { value: 300, name: 'Video Ads' }
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
    }
    return (
        <>
        <Card title='折线图'>
            <ReactECharts option={getOptions()} />
            <ReactECharts option={getOptions2()} />
        </Card>
        </>
    )
}
export default Pie
