import React from 'react'
import Zoom from 'react-medium-image-zoom'

import * as eventStyles from "../templates/eventStyles.module.css"

function GridImage(props) {
  return (
    <Zoom>
      <img
        Style = {{
          objectFit : 'scale-down '
        }}
        src={props.Path}
        alt={""}
      />
    </Zoom>
  )
}

export default GridImage
