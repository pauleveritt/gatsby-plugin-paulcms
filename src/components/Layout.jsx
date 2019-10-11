import React from 'react'
import {graphql, StaticQuery} from 'gatsby'
import ResourceTypesMenu from "./ResourceTypesMenu"


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
                    <ResourceTypesMenu/>
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
