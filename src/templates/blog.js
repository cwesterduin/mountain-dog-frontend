import React from 'react'
import Layout from '../components/layout'
import * as pageStyles from "../pages/pageStyles.module.css"
import GridImage from '../components/GridImage'


function Blog({pageContext: {item}}) {


const content = JSON.parse(item.Content).map(a => <div>{a.Content}</div>)

  return (
    <Layout>
      <div className={pageStyles.content}>
        <b>{item.Title}</b>
          <div Style="width:50%; margin: 0 auto;">
            <GridImage Path={item.Path} />
          </div>
          {content}
      </div>
    </Layout>
  )




}

export default Blog
