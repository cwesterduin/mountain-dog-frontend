import React from 'react'
import "./layout.css"

import Head from './layout/Head'


export default function Layout(props) {
    return(
      <>
      <header><Head map={props.map}/></header>
      <div className="pageContainer">
      {props.children}
      </div>
      <footer>© 2020 mountain-dog.co.uk</footer>
      </>
    )
}
