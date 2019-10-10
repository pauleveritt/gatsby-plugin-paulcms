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
                        <Link to={`/`}>Home</Link>
                        <span style={{padding: '0.3em'}}>|</span>
                        <Link to={`/posts/post1/`}>Post 1</Link>
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
