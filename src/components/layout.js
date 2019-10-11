import React from 'react'
import {StaticQuery, graphql, Link} from 'gatsby'


const Layout = ({children}) => (
    <StaticQuery
        query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
        render={data => (
            <>
                <header>
                    <h1>{data.site.siteMetadata.title}</h1>
                    <p>
                        <Link to={`/blogposts/`}>Blog</Link>
                    </p>
                </header>
                <div>
                    {children}
                </div>
            </>
        )}
    />
)

export default Layout

// Define some fragments used everywhere
export const query = graphql`
  fragment ResourceInfo on Resource {
    slug
    title
    body
  }
`
