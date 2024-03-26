import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';

function Legend({ updatePosition, zoom }) {
    const map = useMap();

    useEffect(() => {
        if (updatePosition === undefined) {
            map.invalidateSize();
        } else {
            map.invalidateSize();
            map.flyTo(
                [updatePosition.coordinate[0], updatePosition.coordinate[1]],
                zoom < 9 ? 9 : zoom
            );
        }
    }, [map, updatePosition, zoom]);

    return null;
}

export default Legend;