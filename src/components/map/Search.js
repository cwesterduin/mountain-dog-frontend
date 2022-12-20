import React, {useState, useEffect, useRef} from 'react'
import { keyIcons } from './icons.js'


function Search(props) {
  const [hidden, setHidden] = useState(true)
  const [featureSearch, setFeatureSearch] = useState("")

  const [dropDownItemsConst, setDropDownItemsConst] = useState(props.dropdown)
  const [dropDownItems, setDropDownItems] = useState(props.dropdown)

  const searchInput = useRef(null);
  const searchListItem = useRef(null);



  useEffect(() => {setDropDownItemsConst(props.dropdown)},[props.dropdown])
  useEffect(() => {setDropDownItems(props.dropdown)},[props.dropdown])

  function SearchDropdownItems(props) {
    if (dropDownItems.length > 0) {
    return (
      dropDownItems.sort((a, b) => a.name.localeCompare(b.name)).map(item =>
        <li className={"searchItem"}
            onFocus={props.onFocus}
            onBlur={props.onBlur}
            onClick={() => props.onClick(item)}
            onKeyPress={(e) => e.key === 'Enter' ? props.onClick(item) : null}
            tabindex="0" Style={"font-size: 1em; padding: 4px 4px"}>
          <img
            Style={"height:16px; width:16px; margin-right: .1em"}
            src={keyIcons[item.type]}/>
            {item.name}
        </li>
    )
  )
}
  else {return <span Style={"font-size: 1em; padding: 4px 4px"}>no results...</span>}
  }


  function search(e) {
    setFeatureSearch(e.target.value)
  }

  useEffect(() => {
    if (featureSearch.length > 0) {
      setHidden(false)
      let filterDropdownItems = dropDownItemsConst
      .filter(a =>
          a.name.split(" ").some(a => a.toLowerCase().startsWith(featureSearch.toLowerCase())) ||
          a.name.toLowerCase().startsWith(featureSearch.toLowerCase())
      )
      setDropDownItems(filterDropdownItems)
    }
    else {
      setHidden(true)
    }
  },[featureSearch])


  function setHide(e) {
    if (featureSearch.length > 0) {
      let filterDropdownItems = dropDownItemsConst
      .filter(a =>
        a.name.split(" ").some(a => a.toLowerCase().startsWith(featureSearch.toLowerCase())) ||
        a.name.toLowerCase().startsWith(featureSearch.toLowerCase())
      )
    setDropDownItems(filterDropdownItems)
    setHidden(false)
  }
  }


  function setBlurChild(e) {
    if (featureSearch.length > 0) {

    if (e.relatedTarget === null) {setHidden(false)}
    else if (e.relatedTarget.className === 'search' || e.relatedTarget.className === 'searchItem') {
      setHidden(false)
    }
    else {
      setHidden(true)
    }
  }
  }

  function handleClick(e) {
    searchInput.current.value = ""
    setFeatureSearch("")
    setHidden(true)
    props.onItemClick(e)
  }

  return (
    <div  className={`searchCont ${props.popover ? 'searchContActive' : null}`}>
    <input
      ref={searchInput}
      onChange={e => search(e)}
      onFocus={e => setHide(e)}
      onBlur={e => setBlurChild(e)}
      type="text"
      className="search"
      placeholder="search map..."
      />
    <ul className={"searchItem"} tabindex={"-1"} Style={hidden ? "display:none" : "display:block"}>
    <SearchDropdownItems onClick={e => handleClick(e)}  onBlur={e => setBlurChild(e)} />
    </ul>
    </div>
  )
}

export default Search;
