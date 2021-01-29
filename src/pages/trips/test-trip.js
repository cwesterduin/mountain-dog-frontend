import React, { useEffect, useRef, useState} from "react"
import Layout from '../../components/layout'
import Image from '../../components/Image'
//import Thumbnail from '../../components/Thumbnail'

import LeafletMap from '../../components/map/LeafletMap'


import Div100vh from 'react-div-100vh'
import pageStyles from "../pageStyles.module.css"
import tripStyles from "./tripStyles.module.css"

import mediaPlayerStyles from "../../components/mediaPlayer/mediaPlayer.module.css"
import "../../components/layout.css"



export default function Trip() {
  const mediaViewerCont = useRef(null);
  const [activeMedia, setActiveMedia] = useState(0)
  const [fullScreen, setFullScreen] = useState(false)
  // Find the right method, call on correct element
  function launchIntoFullscreen(element) {
    if(element.requestFullscreen) {
      element.requestFullscreen();
    } else if(element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if(element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if(element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }
  function fullScreenToggle(e) {
    launchIntoFullscreen(e.current)
  }

  const items = ['Am Bodach','An Caisteal','An Gearanach']

  const media = [
    {src: 'map-thumbnails/Am_Bodach', type:'image'},
    {src: 'map-thumbnails/An_Caisteal', type:'image'},
    {src:'map-thumbnails/An_Gearanach', type:'image'}
  ]
  const mediaLength = (media.length - 1)

  const slideMedia = media.map(item =>
    item.type === 'image' ?
        <Image
          imgStyle = {{
            objectFit : 'scale-down '
          }}
          filename={item.src}
        />

    : <div Style="width:80%; height:100%; margin-left:10%"><iframe src={item.vidsrc} frameborder="0" allowFullScreen="0" controls="0"></iframe></div>
  )

  const slideThumbnails = media.map((item,index) =>
    item.type === 'image' ?
    <div Style={activeMedia === index ? 'border-color:green' : null} onClick={() => setActiveMedia(index)} className={mediaPlayerStyles.thumbnail_inner_cont}>

    </div>
    :
    <div Style={activeMedia === index ? 'border-color:green' : null} className={mediaPlayerStyles.thumbnail_inner_cont} onClick={() => setActiveMedia(index)}>
        <img
          src={item.src}
          />
    </div>
  )


  return (
    <Layout>
      <div clasName={mediaPlayerStyles.top}>
        <Div100vh>
          <div className={mediaPlayerStyles.fold}>
            <div className={mediaPlayerStyles.fold_upper}>
              <h2 Style="display:inline">trip name</h2><small Style="display:inline"><a href="#map">view trip map</a></small>
            </div>
            <div ref={mediaViewerCont} className={mediaPlayerStyles.container}>
              {activeMedia === mediaLength ? null : <button className={`${mediaPlayerStyles.button_next} ${mediaPlayerStyles.control_button}`} onClick={() => setActiveMedia(activeMedia + 1)}>Next</button>}
              {activeMedia === 0 ? null : <button className={`${mediaPlayerStyles.button_back} ${mediaPlayerStyles.control_button}`} onClick={() => setActiveMedia(activeMedia - 1)}>Prev</button>}
              <button className={`${mediaPlayerStyles.button_fullscreen} ${mediaPlayerStyles.control_button}`} onClick={() => fullScreenToggle(mediaViewerCont)}>FullscreenO</button>
              {slideMedia[activeMedia]}
            </div>
          </div>
        </Div100vh>
        </div>

          <div className={mediaPlayerStyles.thumbnail_cont}>{slideThumbnails}</div>

    <div className={pageStyles.content}>

    <div className={tripStyles.main}>
      <div className={tripStyles.main_left}>
        <p id="map">Map</p>
        <div className={tripStyles.map_contaniner}>
          <LeafletMap items={items}/>
        </div>

        <h2>Blog goes here...</h2>
        <p>Some text in the blog</p>

        <h2>Comments? (helps bulk out space)</h2>
        <p>Some comments</p>
        <p>Some comments</p>
        <p>Some comments</p>

      </div>

      <div className={tripStyles.main_right}>

        <ul>trips featuring these locations
          <li className={tripStyles.list_item}>
            <div className={tripStyles.list_thumbnail_cont}>
            </div>
            <div className={tripStyles.list_title}>
              <small><b>Trip title...</b></small><br />
              <small>Featuring...</small>
            </div>
          </li>
          <li className={tripStyles.list_item}>
            <div className={tripStyles.list_thumbnail_cont}>
            </div>
            <div className={tripStyles.list_title}>
              <small><b>Trip title...</b></small><br />
              <small>Featuring...</small>
            </div>
          </li>
          <li className={tripStyles.list_item}>
            <div className={tripStyles.list_thumbnail_cont}>
            </div>
            <div className={tripStyles.list_title}>
              <small><b>Trip title...</b></small><br />
              <small>Featuring...</small>
            </div>
          </li>
        </ul>

        <ul>nearby trips
          <li className={tripStyles.list_item}>
            <div className={tripStyles.list_thumbnail_cont}>
            </div>
            <div className={tripStyles.list_title}>
              <small><b>Trip title...</b></small><br />
              <small>Featuring...</small>
            </div>
          </li>
          <li className={tripStyles.list_item}>
            <div className={tripStyles.list_thumbnail_cont}>
            </div>
            <div className={tripStyles.list_title}>
              <small><b>Trip title...</b></small><br />
              <small>Featuring...</small>
            </div>
          </li>
          <li className={tripStyles.list_item}>
            <div className={tripStyles.list_thumbnail_cont}>
            </div>
            <div className={tripStyles.list_title}>
              <small><b>Trip title...</b></small><br />
              <small>Featuring...</small>
            </div>
          </li>
        </ul>

      </div>

    </div>

      </div>
    </Layout>
  )
}
