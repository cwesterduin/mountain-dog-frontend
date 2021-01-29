import React from 'react'
import Image from './Image'
import { useImageZoom } from 'react-medium-image-zoom'

import eventStyles from "../templates/eventStyles.module.css"

function GridImage(props) {
  const { ref } = useImageZoom({ zoomMargin: 24})

  return (
    <div ref={ref} className={eventStyles.imageCont}>
      <Image
        imgStyle = {{
          objectFit : 'scale-down '
        }}
        filename={props.Path}
      />
    </div>
  )
}

export default GridImage
