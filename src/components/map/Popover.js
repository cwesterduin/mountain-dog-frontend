import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'gatsby';
import { useImageZoom } from 'react-medium-image-zoom';
import leafletMapStyles from "./leafletMapStyles.module.css";
import exclamation from '../../../static/exclamation.svg';
import { makeDate } from '../../helpers/date.js';
import Image from "../Image";
import tripStyles from "../../pages/tripStyles.module.css";

function EventDetails({ event }) {
    return (
        <>
            <div style={{ width: 'auto' }} className={leafletMapStyles.popover_extra}>
                <Link to={`/events/${event.id}`}>{event.name}</Link>
                <span className={leafletMapStyles.popover_extra}>&nbsp;- {makeDate(event.date)}</span>
            </div>
            {event.trip_id ? (
                <div className={`${leafletMapStyles.popover_extra} ${leafletMapStyles.popover_extra_trip}`}>
                    <Link to={`/trips/${event.trip_id}`}>
                        <span className={leafletMapStyles.popover_extra_sub}> {event.trip_name}</span>
                    </Link>
                </div>
            ) : null}
        </>
    );
}

function Popover(props) {
    const [active, setActive] = useState(false);
    const popoverRef = useRef(null);
    const { ref } = useImageZoom({ zoomMargin: 24 });

    useEffect(() => {
        setActive(props.item !== undefined);
        popoverRef.current.scrollTop = 0;
    }, [props.item]);

    return (
        <div
            ref={popoverRef}
            style={
                active
                    ? {
                        transform: props.closing ? 'translateX(100%)' : 'translateX(0)',
                        transitionDelay: props.closing ? '1s' : '0s',
                    }
                    : null
            }
            className={leafletMapStyles.popover_cont}
        >
            <div className={leafletMapStyles.popover_header}>
                <button className={leafletMapStyles.popover_cont_close} onClick={props.close}>
                    &times;
                </button>
            </div>
            <div ref={ref} className={`${leafletMapStyles.popover_image_cont}`}>

                <Image
                    className={tripStyles.item_cont_img}
                    imgStyle = {{
                        objectFit : 'cover'
                    }}
                    filename={props.item.path ? (props.item.path.substring(props.item.path.indexOf('/images/') + '/images/'.length)) : "test.png"}
                />
            </div>
            <div className={leafletMapStyles.popover_title_cont}>
                <div className={leafletMapStyles.popover_title}>
                    <h1>{props.item.name}</h1>
                    {props.item.height ? <span className={leafletMapStyles.popover_height}>{` ${props.item.height}m`}</span> : null}
                </div>
                {props.item.munro_order ? (
                    <div className={leafletMapStyles.popover_subtitle}>{`Alfie's Munro ${props.item.munro_order}/282`}</div>
                ) : null}
            </div>

            <div className={leafletMapStyles.popover_trip_item}>
                {!(props.item.events?.[0]?.name) ? (
                    <div
                        style={{
                            display: 'flex',
                            flexFlow: 'row wrap',
                            justifyContent: 'center',
                            borderBottom: '0.1em solid rgba(14, 30, 37, 0.055)',
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', padding: '1em' }}>
                            <img style={{ height: '1.5em' }} src={exclamation} alt="Exclamation" />
                            <span style={{ fontSize: '1em' }}>no details yet...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {props.item.events.slice(0, 1).map((primaryEvent) => (
                            <div key={primaryEvent.id} className={leafletMapStyles.popover_extra_cont}>
                                <div className={leafletMapStyles.popover_sub_title}>Details</div>
                                <EventDetails event={primaryEvent} />
                                {props.item.events.slice(1).length > 0 ? (
                                    <div className={leafletMapStyles.popover_sub_title}></div>
                                ) : null}
                                {props.item.events.slice(1).map((extraEvent) => (
                                    <EventDetails key={extraEvent.id} event={extraEvent} />
                                ))}
                            </div>
                        ))}
                    </>
                )}

                {props.item.translation || props.item.pronunciation ? (
                    <div className={leafletMapStyles.popover_additional_info}>
                        <div className={leafletMapStyles.popover_sub_title}>Info</div>
                        {props.item.translation ? (
                            <div className={leafletMapStyles.popover_additional_info_text}>
                                Translation: {props.item.translation}
                            </div>
                        ) : null}
                        {props.item.pronunciation ? (
                            <div className={leafletMapStyles.popover_additional_info_text}>
                                Pronunciation: {props.item.pronunciation}
                            </div>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default Popover;