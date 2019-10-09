const jsYaml = require(`js-yaml`)
const _ = require(`lodash`)
const crypto = require("crypto");

async function onCreateNode(
    {
        node,
        actions,
        getNode,
        loadNodeContent,
        createNodeId,
        createContentDigest,
    }) {
    function transformObject(obj, id, type) {
        const yamlNode = {
            ...obj,
            id,
            children: [],
            parent: node.id,
            internal: {
                contentDigest: createContentDigest(obj),
                type,
            },
        }
        createNode(yamlNode)
        createParentChildLink({parent: node, child: yamlNode})
    }

    const {createNode, createNodeField, createParentChildLink} = actions
    if (node.internal.mediaType !== `text/yaml`) {
        return
    }
    const content = await loadNodeContent(node)
    const parsedContent = jsYaml.load(content)
    parsedContent.forEach((obj, i) => {
        transformObject(
            obj,
            obj.id ? obj.id : createNodeId(`${node.id} [${i}] >>> YAML`),
            _.upperFirst(_.camelCase(`${node.name} Yaml`))
        )
    })

    /* Biscardi */
    if (node.internal.type === `Mdx`) {
        const {frontmatter} = node;
        const parent = getNode(node.parent);
        if (
            parent.internal.type === "File" &&
            parent.sourceInstanceName === "posts"
        ) {
            const fieldData = {
                title: node.frontmatter.title,
                tags: node.frontmatter.tags || []
            };
            createNode({
                ...fieldData,
                // Required fields.
                id: createNodeId(`${node.id} >>> BlogPost`),
                parent: node.id,
                children: [],
                internal: {
                    type: `BlogPost`,
                    contentDigest: crypto
                        .createHash(`md5`)
                        .update(JSON.stringify(fieldData))
                        .digest(`hex`),
                    content: JSON.stringify(fieldData),
                    description: `Blog Posts`
                }
            });
            createParentChildLink({
                parent: parent,
                child: node
            });
        }
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
