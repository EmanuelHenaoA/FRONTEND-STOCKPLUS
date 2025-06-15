import React from 'react'
import {FaStaylinked, FaSwift } from "react-icons/fa";
import LogoE from '../assets/images/Pp.jpeg'

export const Logo = ({collapsed}) => {
  return (
    <div className='logo-img'>
        <img src={LogoE} alt="" width="38px" height="28px" />
        {/* <FaStaylinked/> */}
        <div className="logo-icon">
        {!collapsed && <span>StockPlus</span>}
        </div>
    </div>
  )
}
