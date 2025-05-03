import React from 'react'
import Layout from '../components/layout'
import * as pageStyles from "../pages/pageStyles.module.css"
import * as blogStyles from "./blogStyles.module.css"

import {BLOCKS, INLINES} from "@contentful/rich-text-types";
import {documentToReactComponents} from "@contentful/rich-text-react-renderer";
import Zoom from "react-medium-image-zoom";
import {Helmet} from "react-helmet";


const renderOptions = {
    renderNode: {
        [BLOCKS.PARAGRAPH]: (node, children) => <p>{children}</p>,
        [INLINES.HYPERLINK]: (node, children) => (
            <a href={node.data.uri} rel="noopener noreferrer" target="_blank">
                {children}
            </a>
        ),
        [BLOCKS.EMBEDDED_ASSET]: (node) => {
            const {file, title, description} = node.data.target.fields;
            const {url, details, fileName, contentType} = file;

            if (contentType.startsWith("image/")) {
                return (
                    <div className={blogStyles.imageContainer}>
                        <Zoom>
                            <img
                                alt={description || title || fileName}
                                height={details.image.height}
                                loading="lazy"
                                src={url}
                                title={title}
                                width={details.image.width}
                            />
                        </Zoom>
                        <small>{description}</small>
                    </div>
                );
            }

            if (contentType.startsWith("video/")) {
                return (
                    <video controls src={url} style={{maxWidth: "100%"}} title={title}>
                        Your browser does not support the video tag.
                    </video>
                );
            }

            return (
                <a href={url} rel="noopener noreferrer" target="_blank">
                    {title || fileName}
                </a>
            );
        },
    },
};


function Blog({pageContext: {title, date, image, description, content}}) {

    console.log(image)
    return (
        <Layout>
            <Helmet htmlAttributes={{lang: 'en-uk'}}>
                <meta charSet="utf-8"/>
                <title>{title}</title>
                <meta name="description" content={description}/>
            </Helmet>
            <div className={`${pageStyles.content} ${blogStyles.parent}`}>
                <div className={`${blogStyles.content}`}>
                    <hr/>
                    <div className={blogStyles.head}>
                        <div>
                            <h1>{title}</h1>
                            <p className={blogStyles.description}>
                                {description}
                            </p>
                            <small>
                                Posted on {" "}
                                {new Date(date).toLocaleDateString("en-GB", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </small>
                        </div>
                        <img
                            alt={image.fields.description || image.fields.title}
                            height={200}
                            loading="lazy"
                            src={image.fields.file.url}
                            title={image.fields.title}
                            width={"auto"}
                        />
                    </div>
                    <hr/>
                    <div className={blogStyles.container}>
                        {documentToReactComponents(content, renderOptions)}
                    </div>
                </div>
            </div>
        </Layout>
    )


}

export default Blog
