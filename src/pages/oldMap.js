import React from "react"
import { Link } from "gatsby"
import Layout from '../components/layout'
import Image from '../components/Image'
import pageStyles from "./pageStyles.module.css"
import headStyles from "../components/layout/headStyles.module.css"
import logo from '../../static/logo.svg'


import LeafletMap from   '../components/map/LeafletMap.js'

export default function Map() {
  return (
    <div className={pageStyles.content_map}>
    <Link Style="position:absolute;height:2em;width:2em;z-index:99999; top: 0.5em;left:0.5em; margin-top:0" className={headStyles.logo_cont} to="/"><img className={headStyles.logo} src={logo}/></Link>
      <LeafletMap/>
    </div>
  )
}
