import React from "react"
import Layout from '../components/layout'
import Image from '../components/Image'

export default function Blog() {
  return (
    <Layout>
      <h2 Style={"color:var(--main-border-color)"}>My blog</h2>
      <div Style="width:96px; height:96px">
        <Image
        imgStyle = {{
          objectFit : 'cover'
        }}
        src={'primary.jpeg'}/>
      </div>
    </Layout>
  )
}
