import React from "react"
import {graphql} from "gatsby"
import {MDXRenderer} from "gatsby-plugin-mdx"

import Layout from "./Layout"

export default ({data}) => {
    const {title, body} = data.blogPost
    return (
        <Layout>
            <div style={{margin: "3em"}}>
                <h1>{title}</h1>
                <MDXRenderer>{body}</MDXRenderer>
            </div>
        </Layout>
    )
}
export const query = graphql`
  query($slug: String!) {
    blogPost(slug: { eq: $slug }) {
        ...ResourceInfo
    }
  }
`
