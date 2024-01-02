import React, {useState, useContext} from 'react';
import {keyIcons} from './icons.js';
import {myContext} from '../PageContext';

function CheckBox(props) {
    const mapContext = useContext(myContext);

    const [checked, setChecked] = useState(mapContext.referringFilter.includes(props.feature));

    function tryChange() {
        if (checked) {
            setChecked(false);
            mapContext.changeReferringFilter(mapContext.referringFilter.filter((mc) => mc !== props.feature));
        } else {
            setChecked(true);
            mapContext.changeReferringFilter(mapContext.referringFilter.concat([props.feature]));
        }
    }

    return (
        <li style={{
            display: props.feature === 'misc' ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}>
            <img alt={'checkBox item'} onClick={() => tryChange(props.feature)}
                 style={{height: '1em', display: 'inline'}} src={keyIcons[props.feature]}/>
            <label onClick={() => tryChange(props.feature)}>{props.feature}</label>
            <input style={{float: 'right'}} onChange={() => tryChange(props.feature)} checked={checked}
                   name={props.feature} type="checkbox"/>
        </li>
    );
}

function CheckBoxes() {
    const featureTypes = ['munro', 'corbett', 'walk', 'bike', 'swim', 'kayak', 'view', 'misc'];
    const checkBoxes = featureTypes.map((feature) => <CheckBox key={feature} feature={feature}/>);

    return (
        <>
            <div style={{
                position: 'absolute',
                borderRadius: '5px',
                transition: '0.5s',
                padding: '0.5em',
                listStyle: 'none',
                zIndex: 999,
                bottom: 0,
                left: 0,
                background: 'white',
                border: 'solid .1em #ddd',
                overflowY: 'auto',
                maxHeight: '60%',
                margin: '0.5em',
            }}>
                <ul style={{display: 'block', listStyle: 'none', padding: 0, margin: 0}}>{checkBoxes}</ul>
            </div>
        </>
    );
}

export default CheckBoxes;