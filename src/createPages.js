const path = require(`path`)

exports.setupCreatePages = async ({graphql, actions}) => {
    const {createPage} = actions
    const result = await graphql(`
    query {
      allResource {
        nodes {
            slug
            __typename
        }
      }
    }
  `)

    result.data.allResource.nodes.forEach((node) => {

        const componentFile = `./src/components/${node.__typename}.jsx`;

        createPage({
            path: node.slug,
            component: path.resolve(componentFile),
            context: {
                slug: node.slug,
            },
        })
    });
}
