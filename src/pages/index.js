import React from "react"
import { Link } from "gatsby"
import Layout from '../components/layout'
import SlideShow from '../components/SlideShow'
import GridImage from '../components/GridImage'
import Image from '../components/Image'
import Div100vh from 'react-div-100vh'
import pageStyles from "./pageStyles.module.css"
import eventStyles from "../templates/eventStyles.module.css"

export default function Home() {
  return (
    <Layout>

    {/* <SlideShow/> */}
    <Div100vh>
    <div className="contB">
    <div className="imageContB">
    <Image
      style={{position:"default"}}
      imgStyle = {{
          objectFit: "cover",
          objectPosition: "40% 35%"
      }}
      filename={'Favourites/test.png'}
    />
    </div>
    </div>
    </Div100vh>

      <div className={`${pageStyles.content} ${pageStyles.index_content}`}>
        <div className={pageStyles.content_inner}>

          <div className={pageStyles.text_block}>
            <div id="about" className={pageStyles.text_block_title_cont}>
              <h1>Dog Blog</h1>

              <p>Alfie is a mountain dog, a Springador (springer lab cross). Born on the 8th July 2013, he lives for the outdoors.</p>

              <p>The <Link to={"/map"}>interactive Map</Link> is the sites main feature, where you can explore Alfie’s adventures. The map defaults to show Alfie’s completed Munros. View his other activities by selecting them in the key. Use the search function to look for specific hills or locations.</p>

              <p>Select the <Link to={"/events"}>Events</Link> to view Alfie’s favourites, top walks and a large variety of pictures and videos of Alfie posing – which he seems to love.</p>

              <p>The site is not intended as a guide, but many of the activities include interactive GPS maps and addition information. See Navigation for more details on this.</p>

              <p>2020 was not a good year for Alfie – see Calculi and Catheters for the full story. The events inspired this website, facilitated by the Covid enforced time off the hills.</p>

              <p>And enjoy Alfie’s <Link to={"/events/top"}>Favourites page</Link> to see the adventures that we have had along the way.</p>

                <div Style={"margin:0 auto; min-width: 80%"} className={eventStyles.image_big_cont}>
                  <GridImage Path={'Favourites/Alfie_Portrait.jpeg'} />
                </div>
                <p Style={"text-align:center; margin:1em 0 "}>Alfie's portrait</p>
            </div>
          </div>

          {/*<SlideShow/>*/}
          </div>
      </div>

    </Layout>
  )
}
