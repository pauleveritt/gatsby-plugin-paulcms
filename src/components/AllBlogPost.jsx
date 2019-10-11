import React from "react"
import Layout from "./layout"
import {graphql, Link} from "gatsby"

export default ({data}) => {
    const {allBlogPost} = data;
    return (
        <Layout>
            <h1>All</h1>
            <ul>
                {allBlogPost.nodes.map(node => <li key={node.slug}>
                   <Link to={node.slug}>{node.title}</Link>
                </li>
                )}
            </ul>
        </Layout>
    )
}

export const query = graphql`
  query {
    allBlogPost {
        nodes {
          title
          slug
          body
        }
    }
  }
`
