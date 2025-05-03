import Layout from "../components/layout";
import * as pageStyles from "../pages/pageStyles.module.css";

import React from "react";
import {Link} from "gatsby";
import * as blogStyles from "./blogStyles.module.css";

function Blog({pageContext: {content}}) {


    return (
        <Layout>
            <div className={`${pageStyles.content} ${blogStyles.parent}`}>
                <div className={`${blogStyles.content}`}>

                    {content.map(blog => {
                            const image = blog.fields.image
                            return (<section>
                                    <hr/>
                                    <div className={blogStyles.head}>
                                        <div>
                                            <h1><Link to={blog.fields.slug}>{blog.fields.title}</Link><icon></icon></h1>
                                            <p className={blogStyles.description}>
                                                {blog.fields.description}
                                            </p>
                                            <small>
                                                Posted on {" "}
                                                {new Date(blog.fields.date).toLocaleDateString("en-GB", {
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
                                </section>
                            )
                        }
                    )}
                </div>
            </div>
        </Layout>
)


}

export default Blog