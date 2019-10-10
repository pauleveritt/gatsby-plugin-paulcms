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

exports.sourceNodes = ({actions, schema}) => {
    const {createTypes} = actions;
    createTypes(
        schema.buildObjectType({
            name: `BlogPost`,
            fields: {
                id: {type: `ID!`},
                title: {
                    type: "String!"
                },
                tags: {type: `[String]!`},
                excerpt: {
                    type: "String!",
                    resolve: async (source, args, context, info) => {
                        const type = info.schema.getType(`Mdx`);
                        const mdxNode = context.nodeModel.getNodeById({
                            id: source.parent
                        });
                        const resolver = type.getFields()["excerpt"].resolve;
                        // noinspection UnnecessaryLocalVariableJS
                        const excerpt = await resolver(
                            mdxNode,
                            {pruneLength: 140},
                            context,
                            {
                                fieldName: "excerpt"
                            }
                        );
                        return excerpt;
                    }
                },
                body: {
                    type: "String!",
                    resolve(source, args, context, info) {
                        const type = info.schema.getType(`Mdx`);
                        const mdxNode = context.nodeModel.getNodeById({
                            id: source.parent
                        });
                        const resolver = type.getFields()["body"].resolve;
                        return resolver(mdxNode, {}, context, {
                            fieldName: "body"
                        });
                    }
                },
            },
            interfaces: [`Node`]
        })
    );
};
