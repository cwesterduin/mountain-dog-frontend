import React from 'react'
import { useImageZoom } from 'react-medium-image-zoom'

import eventStyles from "../templates/eventStyles.module.css"

function GridImage(props) {
  const { ref } = useImageZoom({ zoomMargin: 24})
  return (
    <div ref={ref} className={eventStyles.imageCont}>
      <img
        Style = {{
          objectFit : 'scale-down '
        }}
        src={props.Path}
        alt={""}
      />
    </div>
  )
}

export default GridImage
