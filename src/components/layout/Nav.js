import React, { useState } from 'react'
import * as headStyles from "./headStyles.module.css"
import { Link } from "gatsby"
import menu from '../../../static/bars-solid.svg'


function Nav() {
  const [showMenu, setShowMenu] = useState(false)
  return (
    <>
    <button className={headStyles.menu_button_show} onClick={() => setShowMenu(true)}><img src={menu}/></button>
    <nav className={`${showMenu ? headStyles.nav_hide : headStyles.nav_show}`}>
        <button className={headStyles.menu_button_hide} onClick={() => setShowMenu(false)}>×</button>

        <li><Link onClick={() => setShowMenu(false)} activeClassName={headStyles.active} to="/map">map</Link></li>
        <li><Link onClick={() => setShowMenu(false)} activeClassName={headStyles.active} to="/trips">trips</Link></li>
        <li><Link onClick={() => setShowMenu(false)} activeClassName={headStyles.active} to="/blog">blog</Link></li>
        <li><Link onClick={() => setShowMenu(false)} activeClassName={headStyles.active} to="/#about">about</Link></li>

    </nav>
    </>
  )
}

export default Nav;
