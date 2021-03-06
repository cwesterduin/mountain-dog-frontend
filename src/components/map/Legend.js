import React, {useState, useEffect, useRef} from 'react'
import {useLeaflet } from "react-leaflet"

function Legend(props) {
  const { map } = useLeaflet();
  const [delay, setDelay] = useState(false)
  useEffect(() => {
  if (props.updatePosition === undefined) {
    map.invalidateSize()
  }
  else {
        map.invalidateSize()
        map.flyTo([props.updatePosition.Lat, props.updatePosition.Lng], props.zoom < 9 ? 9 : props.zoom)
      }
  },[props.updatePosition])
  return (
    null
  )
}



export default Legend
