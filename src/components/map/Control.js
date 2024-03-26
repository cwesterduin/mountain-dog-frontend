import { useMap as useLeaflet } from "react-leaflet";
import L from "leaflet";
import React, { useEffect } from "react";
import ReactDOM from 'react-dom'



const Control = (props)  => {
const { map } = useLeaflet();
  useEffect(() => {
    // get color depending on population density value

    const key = L.control({ position: props.position });

    const jsx = (
  // PUT YOUR JSX FOR THE COMPONENT HERE:
    <div>
      {props.children}
    </div>
  );

    key.onAdd = () => {
      let div = L.DomUtil.create('div', '');
      ReactDOM.render(jsx, div);
      return div;

    };

    key.addTo(map);
  },[]);
  return null;
};

export default Control;
