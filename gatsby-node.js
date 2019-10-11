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
        parent.relativePath.includes("posts")) {
        const fieldData = {
            title: node.frontmatter.title,
            tags: node.frontmatter.tags || []
        };

        const slug = createFilePath({node, getNode});

        const blogPostNode = {
            ...fieldData,
            id: createNodeId(`${node.id} >>> BlogPost`),
            slug,
            parent: node.id,
            children: [],
            internal: {
                type: `BlogPost`,
                contentDigest: createContentDigest(fieldData),
                content: JSON.stringify(fieldData)
            }
        };

        blogPostNode.fileAbsolutePath = node.absolutePath;
        createNode(blogPostNode);
        createParentChildLink({
            parent: node,
            child: blogPostNode
        });
        return blogPostNode;

    }
}

exports.onCreateNode = onCreateNode

exports.createSchemaCustomization = ({actions, schema}) => {
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
        tags: [String]!
        body: String! @parentbody
        parent: Node
    }
    `);

    // Now create the types
    createTypes(`
    type BlogPost implements Node & Resource {
        id: ID!
        slug: String!
        title: String!
        tags: [String]!
        body: String! @parentbody
        parent: Node
    }
    `);
};

exports.createPages = async ({graphql, actions}) => {
    const {createPage} = actions
    const result = await graphql(`
    query {
      allBlogPost {
        nodes {
            slug
        }
      }
    }
  `)

    result.data.allBlogPost.nodes.forEach((node) => {

        createPage({
            path: node.slug,
            component: path.resolve(`./src/components/blog-post.js`),
            context: {
                // Data passed to context is available
                // in page queries as GraphQL variables.
                slug: node.slug,
            },
        })
    });
}
