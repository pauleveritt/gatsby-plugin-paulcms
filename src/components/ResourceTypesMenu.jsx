import React from 'react'
import {graphql, Link, useStaticQuery} from 'gatsby'

const ResourceTypesMenu = () => {
    const {allResource} = useStaticQuery(
        graphql`
        query {
            allResource {
                nodes {
                    __typename
                }
            }
        }
        `
    )
    return (
        <div>
            {allResource.nodes.map(({__typename}) => (
                <Link key={__typename} to={`/${__typename.toLowerCase()}s/`} style={{padding: '0.4em'}}>{__typename}s</Link>
            ))}
        </div>
    )
}

export default ResourceTypesMenu;
