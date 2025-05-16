import React from 'react'
import {DingdingOutlined} from '@ant-design/icons'

export const Logo = ({collapsed}) => {
  return (
    <div className='logo'>
        <DingdingOutlined />
        <div className="logo-icon">
        {!collapsed && <span>StockPlus</span>}
        </div>
    </div>
  )
}
