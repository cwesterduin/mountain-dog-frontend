import React, {useState, useEffect, useRef, useContext} from 'react';
import {MapContainer, TileLayer, Marker, Tooltip} from 'react-leaflet';
import Div100vh from 'react-div-100vh';
import 'leaflet/dist/leaflet.css';

import Popover from './Popover';
import CheckBoxes from './CheckBoxes';
import Legend from './Legend';
import Search from './Search';

import * as leafletMapStyles from './leafletMapStyles.module.css';

import {icons} from './icons.js';

import {myContext} from '../PageContext';

function PointMarker({item, close, goPopover}) {
    const mapContext = useContext(myContext);
    const markerRef = useRef(null);
    const [active, setActive] = useState(false);

    const clickEvent = (e) => {
        if (mapContext.referringFeature?.id === item.id) {
            close();
            setActive(false);
            markerRef.current.setIcon(icons[item.type]);
            markerRef.current.closeTooltip();
        } else {
            mapContext.changeReferringFeature(item);
            goPopover(e);
            setActive(true); // Set active to true when the marker is clicked
        }
    };

    useEffect(() => {
        if (mapContext.referringFeature?.id !== item.id) {
            setActive(false);
        } else {
            setActive(true);
            markerRef.current.setIcon(icons[item.type]);
            markerRef.current._icon.classList.add('active');
        }
    }, [mapContext.referringFeature, item, active]);

    return (
        active ?
            <Marker
                key={true}
                ref={markerRef}
                position={[item.coordinate[0], item.coordinate[1]]}
                icon={icons[item.type]}

                eventHandlers={{
                    click: () => clickEvent(item),
                    onKeyPress: (e) => (e.originalEvent.code === 'Enter' ? clickEvent(item) : null),
                }}
            >
                <Tooltip permanent={true} direction="top" offset={[0, -16]} opacity={0.8}>
                    <b>{item.name}</b>
                </Tooltip>
            </Marker>
            :

            <Marker
                key={false}
                ref={markerRef}
                position={[item.coordinate[0], item.coordinate[1]]}
                icon={icons[item.type]}
                eventHandlers={{
                    click: () => clickEvent(item),
                    onKeyPress: (e) => (e.originalEvent.code === 'Enter' ? clickEvent(item) : null),
                }}
            >
                <Tooltip permanent={false} direction="top" offset={[0, -16]} opacity={0.8}>
                    <b>{item.name}</b>
                </Tooltip>
            </Marker>
    );
}

function PointsLayer({mapItems, close, goPopover}) {
    return mapItems.map((item) => <PointMarker key={item.id} item={item} close={close} goPopover={goPopover}/>);
}

function LeafletMap({items}) {
    const mapContext = useContext(myContext);

    const [mapItems, setMapItems] = useState([]);
    const [popover, setPopover] = useState();
    const [updatePosition, setUpdatePosition] = useState();
    const [zoom, setZoom] = useState(7);

    const mapRef = useRef(null);

    useEffect(() => {
        const newItems = items.filter((f) => mapContext.referringFilter.includes(f.type));
        setMapItems(newItems);
    }, [mapContext.referringFilter, items]);

    useEffect(() => {
        if (mapContext.referringFeature) {
            const newItem = items.find((i) => i.id === mapContext.referringFeature.id);
            setPopover(newItem);
            setUpdatePosition(mapContext.referringFeature);
        }
    }, [mapContext.referringFeature, items]);

    const handleItemClick = (item) => {
        setPopover(item);
        setUpdatePosition(item);
        mapContext.changeReferringFeature(item);
    };

    const close = () => {
        setPopover(undefined);
        setUpdatePosition();
        mapContext.changeReferringFeature(null);
    };

    return (
        <myContext.Consumer>
            {() => (
                <Div100vh>
                    <div className={leafletMapStyles.top_container}>
                        <div className={leafletMapStyles.container}>
                            <Search popover={popover} dropdown={mapItems} onItemClick={handleItemClick}/>
                            <CheckBoxes/>
                            {popover ? <Popover closing={false} close={close} item={popover} extraItems={null}/> : null}

                            <div className={`${leafletMapStyles.map_cont} ${popover ? leafletMapStyles.active : ''}`}>
                                <MapContainer
                                    ref={mapRef}
                                    maxZoom={15}
                                    zoom={7}
                                    center={[57.5, -4]}
                                    className={leafletMapStyles.map}
                                    onzoomend={() => setZoom(mapRef.current.getZoom())}
                                >
                                    <TileLayer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"/>
                                    <PointsLayer mapItems={mapItems} close={close} goPopover={handleItemClick}/>
                                    <Legend zoom={zoom} updatePosition={updatePosition}/>
                                </MapContainer>
                            </div>
                        </div>
                    </div>
                </Div100vh>
            )}
        </myContext.Consumer>
    );
}

export default LeafletMap;