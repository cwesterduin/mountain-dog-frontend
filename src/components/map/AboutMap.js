import React, {useEffect, useRef, useState} from 'react';
import {MapContainer as Map, Marker, Polyline, TileLayer, Tooltip, useMap as useLeaflet} from 'react-leaflet';
import 'react-leaflet-fullscreen/styles.css';
import * as leafletMapStyles from './leafletMapStyles.module.css';
import {icons} from './icons.js';
import 'proj4';
import 'proj4leaflet';
import L from "leaflet";

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

function PointMarker({item}) {
    return (
        <Marker position={[item.coordinate[0], item.coordinate[1]]} icon={icons[item.type]} class="active">
            <Tooltip permanent direction="bottom" opacity="0.8">
                <b>{item.name}</b>
            </Tooltip>
        </Marker>
    );
}

function PointsLayer({mapItems}) {
    return mapItems.map((item, index) => <PointMarker key={index} item={item}/>);
}

function LeafletMap(props) {
    const coordinates = props.coordinates
    const mapRef = useRef(null);
    const mapContRef = useRef(null);
    const mapItems = props.mapItems;

    const [myBounds, setMyBounds] = useState(bounding())

    function calculateBounds(mapItems) {
        if (mapItems.length === 0) {
            return null;
        }

        let north = mapItems[0].coordinate[0];
        let east = mapItems[0].coordinate[1];
        let south = mapItems[0].coordinate[0];
        let west = mapItems[0].coordinate[1];

        mapItems.forEach(item => {
            const [lat, lon] = item.coordinate;

            north = Math.max(north, lat);
            east = Math.max(east, lon);
            south = Math.min(south, lat);
            west = Math.min(west, lon);
        });

        const offset = 0.005;


        return [
            [north + offset, west - offset],
            [south - offset, east + offset]
        ];

    }


    function bounding() {
        if (coordinates) {
            return coordinates
        } else {
            return calculateBounds(mapItems)
        }
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
            <button
                className={leafletMapStyles.container_fullscreen}
                style={{
                    position: 'absolute',
                    right: '.5em',
                    zIndex: 999,
                    width: '34px',
                    height: '34px',
                    border: 'solid 2px #bbb',
                    borderRadius: '5px',
                    top: '.5em',
                    background: 'white',
                    fontWeight: 'bold',
                }}
                onClick={() => fullScreenToggle(mapContRef)}
            >
                &#x26F6;
            </button>

            {/*
// @ts-ignore */}
            <Map
                bounds={myBounds}
                ref={mapRef}
                crs={crs}
            >
                {coordinates ? (
                    <>
                        <Polyline color="orangered" positions={coordinates}/>
                        <Marker position={coordinates[coordinates.length - 1]} icon={icons.redIcon}/>
                        <Marker position={coordinates[0]} icon={icons.greenIcon}/>
                    </>
                ) : null}

                <TileLayer
                    url="https://api.os.uk/maps/raster/v1/zxy/Leisure_27700/{z}/{x}/{y}.png?key=6oLE6u9HjlkdNwxYkeTDp8wEa9dBq0cs"/>

                <PointsLayer mapItems={mapItems}/>
            </Map>

        </div>
    );

}

export default LeafletMap;