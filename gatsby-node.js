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
        const blogPostNode = {
            ...fieldData,
            id: createNodeId(`${node.id} >>> BlogPost`),
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

    createTypes(`
    interface Resource {
        id: ID!
        title: String!
        tags: [String]!
        body: String! @parentbody
        parent: Node
    }

    type BlogPost implements Node & Resource {
        id: ID!
        title: String!
        tags: [String]!
        body: String! @parentbody
        parent: Node
    }
    `);
};

exports.createResolvers = ({createResolvers}) => {
    const resolvers = {
        Query: {
            allResources: {
                type: ["Resource"],
                resolve(source, args, context, info) {
                    return context.nodeModel.getAllNodes({type: "Resource"})
                },
            },
        },
    }
    createResolvers(resolvers)
}
