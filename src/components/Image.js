import React from "react"
import {GatsbyImage, getImage} from "gatsby-plugin-image"
import {useStaticQuery, graphql} from "gatsby"
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css'

function Image(props) {
    const {filename, type = 'default', alt, imgStyle, style, className, objectPosition, zoomable} = props;

    const images = useStaticQuery(graphql`
        query ImageQuery {
            allFile {
                nodes {
                    relativePath
                    childImageSharp {
                        gatsbyImageData(quality: 80, layout: FULL_WIDTH)
                    }
                }
            }
        }
    `);

    const image = images.allFile.nodes.find(node => node.relativePath.includes(filename));

    if (!image) {
        return null;
    }

    const imageData = getImage(image);

    return (
        zoomable ? (
            <Zoom>
                <GatsbyImage
                    loading="lazy"
                    className={className}
                    alt={alt ? alt : ""}
                    style={style}
                    imgStyle={imgStyle}
                    image={imageData}
                />
            </Zoom>
        ) : (
            <GatsbyImage
                loading="lazy"
                className={className}
                alt={alt ? alt : ""}
                style={style}
                imgStyle={imgStyle}
                image={imageData}
            />
        )
    );
}

export default Image;