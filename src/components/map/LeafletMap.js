import React, {useState, useEffect, useRef, useContext} from 'react'
import { Link } from 'gatsby'
import L from 'leaflet'
import Div100vh from 'react-div-100vh'
import { Map, TileLayer, Marker, Tooltip, useLeaflet } from "react-leaflet"

import Popover from './Popover'
import CheckBoxes from './CheckBoxes'
import Legend from './Legend'
import Search from './Search'

import FullscreenControl from 'react-leaflet-fullscreen';
import 'react-leaflet-fullscreen/dist/styles.css'


import leafletMapStyles from "./leafletMapStyles.module.css"
import { icons } from './icons.js'

import { myContext } from '../PageContext';


function PointMarker(props) {
  const mapContext = useContext(myContext);
  const markerRef = useRef(null);
  const [active, setActive] = useState(false);

  function clickEvent(e) {
    if (mapContext.referringFeature?.id === props.item.id) {
      setActive(false);
      markerRef.current.leafletElement._icon.classList.remove('active');
      markerRef.current.leafletElement.closePopup();
      props.close();
    }
    mapContext.changeReferringFeature(props.item);
    props.goPopover(e);
  }

  useEffect(() => {
    if (mapContext.referringFeature?.id !== props.item.id) {
      setActive(false);
      markerRef.current.leafletElement._icon.classList.remove('active');
    } else {
      setActive(true);
      markerRef.current.leafletElement._icon.classList.add('active');
    }
  }, [mapContext.referringFeature, props.item]);

  return (
      <Marker
          ref={markerRef}
          position={[props.item.coordinate[0], props.item.coordinate[1]]}
          icon={icons[props.item.type]}
          onClick={() => clickEvent(props.item)}
          onKeyPress={(e) => (e.originalEvent.code === 'Enter' ? clickEvent(props.item) : null)}
      >
        <Tooltip key={`${props.item.id}-${active}`} permanent={active} direction="top" offset={[0, -16]} opacity="0.8">
          <b>{props.item.name}</b>
        </Tooltip>
      </Marker>
  );
}

function PointsLayer(props) {
  return props.mapItems.map((item, index) => (
      <PointMarker close={props.close} item={item} goPopover={props.goPopover} key={item.id} />
  ));
}

function LeafletMap(props) {
  const items = props.items;
  const mapContext = useContext(myContext);

  const [mapItems, setMapItems] = useState([]);
  const [popover, setPopover] = useState();
  const [updatePosition, setUpdatePosition] = useState();
  const [popoverClosing, setPopoverClosing] = useState(false);
  const [zoom, setZoom] = useState(7);

  const mapCont = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    let newItems = items.filter((f) => mapContext.referringFilter.includes(f.type));
    setMapItems(newItems);
  }, [mapContext.referringFilter, items]);

  useEffect(() => {
    if (mapContext.referringFeature) {
      setPopover(mapContext.referringFeature);
      setUpdatePosition(mapContext.referringFeature);
    }
  }, [mapContext.referringFeature]);

  function handleItemClick(item) {
    setPopover(item);
    setUpdatePosition(item);
    mapContext.changeReferringFeature(item);
  }

  function close() {
    setPopoverClosing(true);
    setTimeout(() => {
      setPopover(undefined);
      setUpdatePosition();
      setPopoverClosing(false);
      mapContext.changeReferringFeature(null);
    }, 500);
  }

  return (
      <myContext.Consumer>
        {() => (
            <>
              <Div100vh>
                <div ref={mapCont} className={leafletMapStyles.top_container}>
                  <div ref={mapCont} className={leafletMapStyles.container}>
                    <Search popover={popover} dropdown={mapItems} onItemClick={handleItemClick} />
                    <CheckBoxes />
                    {popover ? <Popover closing={popoverClosing} close={close} item={popover} extraItems={null} /> : null}

                    <Map
                        ref={mapRef}
                        maxZoom={15}
                        zoom={7}
                        center={[57.5, -4]}
                        className={popover ? 'active' : null}
                        onzoomend={() => setZoom(mapRef.current.leafletElement.getZoom())}
                    >
                      <TileLayer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />
                      <PointsLayer close={close} goPopover={handleItemClick} mapItems={mapItems} />
                      <Legend zoom={zoom} updatePosition={updatePosition} />
                    </Map>
                  </div>
                </div>
              </Div100vh>
            </>
        )}
      </myContext.Consumer>
  );
}

export default LeafletMap;
