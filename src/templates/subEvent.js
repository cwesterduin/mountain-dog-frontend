import React, {useState} from "react"
import {Link} from 'gatsby'
import Layout from '../components//layout'
import Image from '../components/Image'
import pageStyles from "../pages/pageStyles.module.css"
import tripStyles from "../pages/tripStyles.module.css"
import subTrip from "./subTrip";

function Item(props) {
    const [hover, setHover] = useState(false)
    return (
        <Link onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
              to={props.to !== null ? `/events/${props.to}` : null} className={tripStyles.item_cont}
              Style={hover ? 'border:solid .1em #333' : null}
        >
            <img
                className={tripStyles.item_cont_img}
                style={hover ? {position: "default", borderBottom: 'solid .1em #333'} : {
                    position: "default",
                    borderBottom: 'solid .1em transparent'
                }}
                src={props.filename}
            />
            <h2>{props.text}</h2>
        </Link>
    )
}

function SubEvent({pageContext: {item}}) {
    console.log(item)
    const munroList = item.map(subItem =>
        <Item to={subItem.id} text={`${
            subItem.name}`} desc={subItem.description} filename={subItem.path ? subItem.path : 'primary.jpeg'}/>
    )

        return (
            <Layout>
                <div className={pageStyles.content}>
                    <div className={tripStyles.top_cont}>
                        {munroList}
                    </div>
                </div>
            </Layout>
        )
    }

    export default SubEvent
