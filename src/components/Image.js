import React from "react"
import Img from "gatsby-image"
import { useStaticQuery, graphql } from "gatsby"

function Image(props) {

  const { filename, type = 'default', alt, imgStyle, style, className } = props;

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
    console.log(image)
    return n.node.relativePath.includes(filename);
  });

  if (!image) {
    return null;
  }

  return (
    <Img loading="lazy"
    className={className}
    alt={alt}
    style={style}
    imgStyle={imgStyle}
    fluid={{
      ...image.node[type].fluid,
    }} />
  )
}

export default Image
