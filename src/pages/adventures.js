import React, { useState } from "react"
import { Link } from 'gatsby'
import Layout from '../components/layout'
import Image from '../components/Image'
import * as pageStyles from "./pageStyles.module.css"
import * as tripStyles from "./tripStyles.module.css"

function Item(props) {
  const [hover, setHover] = useState(false)
  return(
    <Link onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} to={props.to !== null ? `/${props.to}` : null} className={tripStyles.item_cont}
    style={hover ? {border:"solid .1em #333"} : null}
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

export default function Adventures() {
return (
  <Layout>
    <div className={pageStyles.content}>
      <div className={tripStyles.top_cont}>
        <Item text={"favourites"} to={"adventures/top"} filename={"Munro_Walks/057/Photo_8.jpeg"}/>
        <Item text={"multi-day"} to={"adventures/trips"} filename={"Munro_Walks/011/Photo_12.jpg"}/>
        <Item text={"munros"} to={"adventures/munro"} filename={"Munro_Walks/011/Photo_9.jpg"}/>
        <Item text={"corbetts"} to={"adventures/corbett"} filename={"Corbetts/Corbett_054/IMG_1371.jpg"}/>
        <Item text={"mountain biking"} to={"adventures/bike"} filename={"Bike/Glentress_Winter.jpg"}/>
        <Item text={"kayaking"} to={"adventures/kayak"} filename={"Kayak/Gruinard_Bay/gruinard_bay-1.jpg"}/>
        <Item text={"walks"} to={"adventures/walk"} filename={"Walks/Mull_Carsaig/Arches_Map_Feature.jpg"}/>
        <Item text={"swimming"} to={"adventures/swim"} filename={"Swim/Sandaig/Photo_1.JPG"}/>
      </div>
    </div>
  </Layout>
)
}
