import React from 'react'
import Image from './Image.js'
import tripStyles from "../pages/tripStyles.module.css"
import {Link} from 'gatsby'


function TripCard(props) {

  const types = props.type.map((type,index) => index < props.type.length-1 ? <span>{type}, </span> : <span>{type}</span>)

  return (
      <div className={tripStyles.card_block}>
        <div className={tripStyles.card_title}>
          <small>features: {types}</small>
          <Link to='test-trip'><h2>{props.name}</h2></Link>
        </div>
        <div className={tripStyles.card_image}>
          <Image filename={props.img}/>
        </div>
        <small>{props.date}</small>
      </div>
  )
}

export default TripCard
