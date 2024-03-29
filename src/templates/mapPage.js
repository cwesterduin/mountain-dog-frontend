import React from "react"
import {Link} from "gatsby"
import * as pageStyles from "../pages/pageStyles.module.css"
import * as headStyles from "../components/layout/headStyles.module.css"
import logo from '../../static/logo.svg'


import LeafletMap from '../components/map/LeafletMap.js'

export default function Map({pageContext: {mf}}) {
    return (
        <div className={pageStyles.content_map}>
            <Link style={{position:"absolute",height:"2em;width:2em", zIndex:99999, top: "0.5em", left:"0.5em", marginTop:0}}
                  className={headStyles.logo_cont} to="/"><img className={headStyles.logo} alt={"logo"}
                                                               src={logo}/></Link>
            <LeafletMap items={mf}/>
        </div>
    )
}