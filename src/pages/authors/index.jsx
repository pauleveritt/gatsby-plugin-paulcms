import React from "react"
import {graphql, Link} from "gatsby"
import Layout from "../../components/Layout"

export default ({data}) => {
    const {allAuthor} = data;
    return (
        <Layout>
            <h1>All Authors</h1>
            <ul>
                {allAuthor.nodes.map(node => <li key={node.slug}>
                        <Link to={node.slug}>{node.title}</Link>
                    </li>
                )}
            </ul>
        </Layout>
    )
}

export const query = graphql`
  query {
    allAuthor {
        nodes {
          title
          slug
          body
        }
    }
  }
`
