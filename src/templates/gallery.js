import React, { useState, useEffect } from "react"
import { Link } from 'gatsby'
import Layout from '../components/layout'
import Image from '../components/Image'
import pageStyles from "../pages/pageStyles.module.css"
import tripStyles from "../pages/tripStyles.module.css"

import Masonry from 'react-masonry-component';


import { useImageZoom } from 'react-medium-image-zoom'

import eventStyles from "./eventStyles.module.css"

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function Item(props) {
  const { ref } = useImageZoom({ zoomMargin: 24})

  let widthOpts = ['16.65%', '33.3%', '33.3%', '33.3%', '33.3%', '33.3%', '33.3%', '50%']
  let widthVar = widthOpts[Math.floor(Math.random() * 100 / 12.5)]

  return(
    <div ref={ref} Style={`width:${widthVar}; height: auto; position:relative`}>
    <Link to={`/events/${props.eventID}`}>
      <Image
        className={tripStyles.item_cont_img}
        imgStyle = {{
          objectFit : 'cover'
        }}
        filename={props.filename}
      />
      </Link>
    </div>
  )
}

export default function Gallery({pageContext: {items}}) {


const list = shuffle(
items.map(item =>
  <Item eventID={item.EventID} id={item.MediaID} filename={item.Path}/>
)
)

return (
  <Layout>
      <div className={tripStyles.top_cont} Style="background: linear-gradient(to right, #fff, #ccc, #fff); margin-top: -2em;">
      <Masonry Style="width:100%">
          {list}
      </Masonry>
      </div>
  </Layout>
)
}
