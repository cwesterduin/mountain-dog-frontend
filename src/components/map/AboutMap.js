import React, {useEffect, useRef} from 'react';
import {Map, Marker, Polyline, TileLayer, Tooltip, useLeaflet} from 'react-leaflet';
import 'react-leaflet-fullscreen/dist/styles.css';
import leafletMapStyles from './leafletMapStyles.module.css';
import {icons} from './icons.js';
import 'proj4';
import 'proj4leaflet';

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

function PointMarker({ item }) {
  return (
      <Marker position={[item.coordinate[0], item.coordinate[1]]} icon={icons[item.type]} class="active">
        <Tooltip permanent direction="bottom" opacity="0.8">
          <b>{item.name}</b>
        </Tooltip>
      </Marker>
  );
}

function PointsLayer({ mapItems }) {
  return mapItems.map((item, index) => <PointMarker key={index} item={item} />);
}

function Setter({ mapItems, coordinates }) {

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

    useEffect(() => {
        if (map) {
            try {
                map.fitBounds(coordinates)
            } catch(e){
                let bounds = calculateBounds(mapItems)
                if (bounds) {
                    map.fitBounds(bounds)
                }
            }
        }
    }, [mapItems]);

    const { map } = useLeaflet();

    return null;
}

function LeafletMap(props) {
  const coordinates = props.coordinates;
  const mapRef = useRef(null);
  const mapContRef = useRef(null);
  const mapItems = props.mapItems;

  if (typeof window !== 'undefined') {
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

          {mapItems[0] !== undefined ? (
              <Map ref={mapRef} crs={props.crs}>
                {coordinates ? (
                    <>
                      <Polyline color="orangered" positions={coordinates} />
                      <Marker position={coordinates[coordinates.length - 1]} icon={icons.redIcon} />
                      <Marker position={coordinates[0]} icon={icons.greenIcon} />
                    </>
                ) : null}

                <TileLayer url="https://api.os.uk/maps/raster/v1/zxy/Leisure_27700/{z}/{x}/{y}.png?key=6oLE6u9HjlkdNwxYkeTDp8wEa9dBq0cs" />

                <Setter mapItems={mapItems} coordinates={coordinates} />
                <PointsLayer mapItems={mapItems} />
              </Map>
          ) : (
              <div className={leafletMapStyles.leaflet_container_loading} style={{ background: '#ddd' }}>
                <div className="sk-folding-cube">
                  <div className="sk-cube1 sk-cube"></div>
                  <div className="sk-cube2 sk-cube"></div>
                  <div className="sk-cube4 sk-cube"></div>
                  <div className="sk-cube3 sk-cube"></div>
                </div>
              </div>
          )}
        </div>
    );
  } else {
    return null;
  }
}

export default LeafletMap;