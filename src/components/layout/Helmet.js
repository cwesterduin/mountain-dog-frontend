import { Helmet } from 'react-helmet'

function MyHelmet() {
  return (

  <Helmet htmlAttributes={{ lang : 'en-uk' }}>
    <meta charSet="utf-8" />
    <title>Mountain dog</title>
    <meta name="description" content=""/>
    <meta name="keywords" content=""/>
    <meta name="author" content=""/>
    <meta charSet="utf-8" />
    <link rel="canonical" href="" />
    <meta property="og:title" content="" />
    <meta property="og:description" content="" />
    <meta property="og:image" content={`https://rory-macdonald-static.s3.eu-west-2.amazonaws.com/og_image/studio_og.jpg`} />
  </Helmet>
  )

  export default MyHelmet
