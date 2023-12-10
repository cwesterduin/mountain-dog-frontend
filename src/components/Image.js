import React from "react"
import Img from "gatsby-image"
import {useStaticQuery, graphql} from "gatsby"
import {useImageZoom} from "react-medium-image-zoom";

function Image(props) {

    const {filename, type = 'default', alt, imgStyle, style, className} = props;
    const {ref} = useImageZoom({zoomMargin: 24})

    const images = useStaticQuery(graphql`
    query ImageQuery {
      data: allFile {
        edges {
          node {
            relativePath
            default: childImageSharp {
              fluid(quality:80) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }

          }
        }
      }
    }
  `);

    const image = images.data.edges.find(n => {
        return n.node.relativePath.includes(filename);
    });

    if (!image) {
        return null;
    }


    return (
        <div ref={ref}>
            <Img loading="lazy"
                 className={className}
                 alt={alt}
                 style={style}
                 imgStyle={imgStyle}
                 fluid={{
                     ...image.node[type].fluid,
                 }}/>
        </div>
    )
}

export default Image
