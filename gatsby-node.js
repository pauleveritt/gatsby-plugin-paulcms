const fs = require(`fs`);
const path = require(`path`)

const {createFilePath} = require(`gatsby-source-filesystem`);


async function onCreateNode(
    {
        actions,
        node,
        getNode,
        createNodeId,
        createContentDigest,
    }) {
    const {createNode, createParentChildLink} = actions;
    const parent = getNode(node.parent);
    if (node.internal.type === `Mdx` &&
        (parent.relativePath.includes("blogposts") || parent.relativePath.includes("authors")) &&
        parent.name !== 'index'
    ) {
        const fieldData = {
            title: node.frontmatter.title
        };

        const slug = createFilePath({node, getNode});

        const resourceType = parent.relativePath.includes("blogposts") ? `BlogPost` : 'Author';
        const resourceNode = {
            ...fieldData,
            id: createNodeId(`${node.id} >>> ${resourceType}`),
            slug,
            parent: node.id,
            children: [],
            internal: {
                type: resourceType,
                contentDigest: createContentDigest(fieldData),
                content: JSON.stringify(fieldData)
            }
        };

        resourceNode.fileAbsolutePath = node.absolutePath;
        createNode(resourceNode);
        createParentChildLink({
            parent: node,
            child: resourceNode
        });
        return resourceNode;

    }
}

exports.onCreateNode = onCreateNode

exports.createSchemaCustomization = ({actions}) => {
    const {createTypes, createFieldExtension} = actions;

    createFieldExtension({
        name: `parentbody`,
        extend() {
            return {
                async resolve(source, args, context, info) {
                    const type = info.schema.getType(`Mdx`);
                    const mdxNode = context.nodeModel.getNodeById({
                        id: source.parent
                    });
                    const resolver = type.getFields()["body"].resolve;
                    return await resolver(mdxNode, {}, context, {
                        fieldName: "body"
                    });
                },
            }
        },
    });

    // Create the base stuff
    createTypes(`
    interface Resource @nodeInterface {
        id: ID!
        slug: String!
        title: String!
        body: String! @parentbody
        parent: Node
    }
    `);

    // Read this site's typedefs from a GQL file
    const typeDefs = fs.readFileSync(`typedefs.graphql`, {
        encoding: `utf-8`
    });

    createTypes(typeDefs);
};

exports.createPages = async ({graphql, actions}) => {
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
