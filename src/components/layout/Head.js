import React from 'react'
import * as headStyles from "./headStyles.module.css"
import { Link } from "gatsby"
import logo from '../../../static/logo.svg'

import { myContext } from '../PageContext';

function Head() {
  return (
    <myContext.Consumer>
    {context => (
    <>
      <div className={headStyles.title_cont}>
        <Link className={headStyles.logo_cont} to="/"><img alt={"logo"} className={headStyles.logo} src={logo}/></Link>
        <Link to="/"><h1 className={headStyles.title}>mountain dog</h1></Link>
      </div>
      {/*<Link Style={props.map ? 'display:none' : null} className={headStyles.map_link} to="/map">map</Link>*/}
      {/*<Link Style={props.map ? 'display:none' : null} className={headStyles.map_link} to="/map">Map</Link>*/}
      <div className={headStyles.nav_cont}>
      <Link to={"/map"}>map</Link>
      <Link to={"/events"}>events</Link>
      <Link to={"/#about"}>about</Link>
      </div>
      {/*<Nav/>*/}
    </>
  )}
  </myContext.Consumer>
  )
}

export default Head;
