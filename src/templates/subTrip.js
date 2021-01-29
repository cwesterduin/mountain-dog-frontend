import React, { useState, useEffect } from "react"
import { Link } from 'gatsby'
import Layout from '../components//layout'
import Image from '../components/Image'
import pageStyles from "../pages/pageStyles.module.css"
import tripStyles from "../pages/tripStyles.module.css"

function Item(props) {
  const [hover, setHover] = useState(false)
  return(
    <Link onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} to={props.to !== null ? `/trips/${props.to}` : null} className={tripStyles.item_cont}
    Style={hover ? 'border:solid .1em #333' : null}
    >
      <Image
        className={tripStyles.item_cont_img}
        imgStyle = {{
          objectFit : 'cover'
        }}
        style={hover ? {position:"default", borderBottom: 'solid .1em #333'} : {position:"default", borderBottom: 'solid .1em transparent'}}
        filename={props.filename}
      />
      <h2>{props.text}</h2>
    </Link>
  )
}

function SubTrip({pageContext: {filterTrips}}) {

const munroList = filterTrips.map(subItem =>
  <Item to={subItem.TripID} text={`${subItem.Name}`} desc={subItem.Description} filename={subItem.Path ?  subItem.Path : 'favourites/test.png'}/>
)

return (
  <Layout>
    <div className={pageStyles.content}>
      <div className={tripStyles.top_cont}>
          {munroList}
      </div>
    </div>
  </Layout>
)
}

export default SubTrip
