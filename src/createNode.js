const {createFilePath} = require(`gatsby-source-filesystem`);

exports.setupCreateNode = async function onCreateNode(
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
        parent.relativePath.includes("blogposts") &&
        parent.name !== 'index')

    {
        const fieldData = {
            title: node.frontmatter.title
        };

        const slug = createFilePath({node, getNode});

        const resourceNode = {
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

        resourceNode.fileAbsolutePath = node.absolutePath;
        createNode(resourceNode);
        // createParentChildLink({
        //     parent: node,
        //     child: resourceNode
        // });
        return resourceNode;

    }
}
