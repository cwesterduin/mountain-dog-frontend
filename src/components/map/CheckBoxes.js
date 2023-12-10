import React, { useEffect, useState, useContext } from 'react'
import { keyIcons } from './icons.js'
import { myContext } from '../PageContext';


function CheckBox(props) {
  const mapContext = useContext(myContext);

  const [checked, setChecked] = useState(mapContext.referringFilter.includes(props.feature))

  function tryChange() {
    if (checked) {
      setChecked(false)
      mapContext.changeReferringFilter(mapContext.referringFilter.filter(mc => mc !== props.feature))
    } else {
      setChecked(true)
      mapContext.changeReferringFilter(mapContext.referringFilter.concat([props.feature]))
    }
  }

  return (
    <li Style={props.feature === 'misc' ? 'display:none':'display: flex; align-items: center; justify-content: space-between; font-size: 1em'}>
    <img onClick={() => tryChange(props.feature)} Style={"height:1em; display: inline"} src={keyIcons[props.feature]}/>
    <label onClick={() => tryChange(props.feature)}>{props.feature}
    </label>
    <input Style="float:right" onChange={() => tryChange(props.feature)} checked={checked} name={props.feature} type="checkbox"/>
    </li>
  )
}

function CheckBoxes() {
  const [minimized, setMinimized] = useState(false)

  const featureTypes = ['munro','corbett','walk','bike','swim','kayak','view','misc']
  const checkBoxes = featureTypes.map(feature =>
                    <CheckBox feature={feature}/>
                )
      return (
        <>
        <div Style={'position:absolute; border-radius: 5px; transition:0.5s; padding: 0.5em; margin: 0; list-style: none; z-index: 999; bottom: 0; left: 0; background: white; border: solid .1em #ddd; overflow-y:auto; max-height: 60%; margin: 0.5em '}>
        {/*<button Style={'top: 0; right: 0'} onClick={() => minimized ? setMinimized(false) : setMinimized(true)}>{minimized ? '+' : '-'}</button>*/}
        <ul Style={minimized ? 'display: none; list-style:none; padding: 0; margin: 0' : 'display: block; list-style:none; padding: 0; margin: 0'}>
        {checkBoxes}
        </ul>
        </div>
        </>
      )
    }
export default CheckBoxes;
