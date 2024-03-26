import React, {useState, useEffect, useRef} from 'react';
import {navigate} from 'gatsby';
import {MapContainer, TileLayer, Marker, Tooltip, useMap as useLeaflet} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'proj4';
import 'proj4leaflet';
import L from 'leaflet';

import * as leafletMapStyles from './leafletMapStyles.module.css';
import Div100vh from "react-div-100vh";
import {CRS} from "leaflet/src/geo";

function launchIntoFullscreen(element) {
    if (document.fullscreenElement) {
        document.exitFullscreen();
        document.webkitExitFullscreen();
    } else if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function fullScreenToggle(e) {
    launchIntoFullscreen(e.current);
}

function go(index) {
    console.log(index)
    navigate(`/events/${index}`);
}

function PointMarker({item, index}) {
    const myIcon = L.divIcon({className: 'html_icon', html: `<div>${index}</div>`});
    return (
        <Marker position={[item.mapFeatures[0].coordinate[0], item.mapFeatures[0].coordinate[1]]} icon={myIcon}
                eventHandlers={{click: () => go(item.id)}}>
            <Tooltip permanent direction="bottom" opacity="0.8">
                <b>{item.name}</b>
            </Tooltip>
        </Marker>
    );
}

function PointsLayer({mapItems}) {
    return (
        mapItems
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((item, index) => <PointMarker key={index} item={item} index={index + 1}/>)
    );
}

function Setter(props) {
    const {map} = useLeaflet();

    useEffect(() => {
        if (props.gpx === 'false') {
            let originLatTopLeft = [props.mapItems[0].coordinate[0] - 0.005, props.mapItems[0].coordinate[1] - 0.005]
            let originLatBottomRight = [props.mapItems[0].coordinate[0] + 0.005, props.mapItems[0].coordinate[1] + 0.005]
            map.fitBounds([originLatTopLeft, originLatBottomRight])
        } else {
            map.fitBounds(props.gpx)
        }
    }, [props.gpx, props.mapItems, map])

    return null

}

function LeafletMap({mapItems}) {
    const mapContRef = useRef(null);
    const mapFeatures = mapItems.map((m) => m.mapFeatures).flat();

    let gpx = mapFeatures.length > 1 ? mapFeatures.map((a) => [a.coordinate[0], a.coordinate[1]]) : 'false'
    let bounds
    if (gpx === 'false') {
        let originLatTopLeft = [mapItems[0].coordinate[0] - 0.005, mapItems[0].coordinate[1] - 0.005]
        let originLatBottomRight = [mapItems[0].coordinate[0] + 0.005, mapItems[0].coordinate[1] + 0.005]
        bounds = [originLatTopLeft, originLatBottomRight]
    } else {
        bounds = gpx
    }

    let crs
    if (typeof window !== 'undefined') {
         crs = new L.Proj.CRS('EPSG:27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs', {
            resolutions: [896.0, 448.0, 224.0, 112.0, 56.0, 28.0, 14.0, 7.0, 3.5, 1.75],
            origin: [-238375.0, 1376256.0]
        });
    }

    return (


        <div ref={mapContRef} className={leafletMapStyles.container_about}>
            <button className={leafletMapStyles.container_fullscreen}
                    onClick={() => fullScreenToggle(mapContRef)}>&#x26F6;</button>
            <MapContainer
                bounds={bounds}
                crs={crs}
                maxZoom={15}
                className={leafletMapStyles.map}
            >
                <PointsLayer mapItems={mapItems}/>
                <TileLayer
                    url="https://api.os.uk/maps/raster/v1/zxy/Leisure_27700/{z}/{x}/{y}.png?key=6oLE6u9HjlkdNwxYkeTDp8wEa9dBq0cs"/>
            </MapContainer>
        </div>

    );
}

export default LeafletMap;