import React, {useState, useEffect, useRef} from 'react'
import { navigate } from 'gatsby'
import * as L from 'leaflet'
import { Map, TileLayer, Marker, useLeaflet, Tooltip } from "react-leaflet"
import 'react-leaflet-fullscreen/dist/styles.css'

import leafletMapStyles from "./leafletMapStyles.module.css"

import "proj4";
import "proj4leaflet";

function launchIntoFullscreen(element) {
  if (document.fullscreenElement) {
    document.exitFullscreen()
    document.webkitExitFullscreen()
  } else if(element.requestFullscreen) {
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

function go(index) {
  navigate(`/events/${index}`).then()
}

function PointMarker(props) {
  let myIcon = L.divIcon({className: 'html_icon', html:`<div>${props.index}</div>`});
  return (
    <Marker
    position={[props.item.mapFeatures[0].coordinate[0],props.item.mapFeatures[0].coordinate[1]]}
    icon={myIcon}
    onClick={(e) => go(props.item.id)}
    >
      <Tooltip permanent direction={"bottom"} opacity={"0.8"}>
        <b>{props.item.name}</b>
      </Tooltip>
    </Marker>
  )
}


function PointsLayer(props) {
  return (
    props.mapItems.sort((a, b) => a.date.localeCompare(b.date)).map((item,index) =>
      <PointMarker
        key={index}
        item={item}
        index={index + 1}
      />
  ))
}

function Setter(props) {
  const { map } = useLeaflet();

  useEffect(() => {
  if (props.gpx === 'false') {
    let originLatTopLeft = [props.mapItems[0].coordinate[0] - 0.005, props.mapItems[0].coordinate[1] - 0.005]
    let originLatBottomRight = [props.mapItems[0].coordinate[0] + 0.005, props.mapItems[0].coordinate[1] + 0.005]
    map.fitBounds([originLatTopLeft,originLatBottomRight])
  }
  else {
    map.fitBounds(props.gpx)
  }
},[props.gpx, props.mapItems, map])

return null

}

function LeafletMap(props) {

  const [isLoaded, setIsLoaded] = useState(false)

  const mapRef = useRef(null);
  const mapContRef = useRef(null);
  const [crs,setCrs] = useState()
  const mapFeatures = props.mapItems.map(m => m.mapFeatures).flat()


  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCrs(new L.Proj.CRS(
          'EPSG:27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs',
          {
            resolutions: [ 896.0, 448.0, 224.0, 112.0, 56.0, 28.0, 14.0, 7.0, 3.5, 1.75 ],

            origin: [ -238375.0, 1376256.0 ],
            transformation: L.Transformation(1, 0, -1, 0)
          }

      ))
      setIsLoaded(true)}
  },[])



     if (typeof window !== 'undefined' && isLoaded) {
      return (
        <div ref={mapContRef} className={leafletMapStyles.container_about}>
          <button className={leafletMapStyles.container_fullscreen} onClick={() => fullScreenToggle(mapContRef)}>&#x26F6;</button>

          {props.mapItems[0] !== undefined ?
          <Map ref={mapRef} crs={crs} >

            <TileLayer url='https://api.os.uk/maps/raster/v1/zxy/Leisure_27700/{z}/{x}/{y}.png?key=6oLE6u9HjlkdNwxYkeTDp8wEa9dBq0cs'/>

            <Setter mapItems={props.mapItems} gpx={mapFeatures.length > 1 ? mapFeatures.map(a => [a.coordinate[0],a.coordinate[1]]) : 'false'} />

            <PointsLayer mapItems={props.mapItems} events={props.events}/>
            {/* Map code goes here */}
          </Map>
          : <div className={leafletMapStyles.leaflet_container_loading} Style={"background: #ddd"}>loading...</div>
        }
        </div>
      )
    }
    else {
    return null
  }
}

export default LeafletMap
