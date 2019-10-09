const jsYaml = require(`js-yaml`)
const _ = require(`lodash`)

async function onCreateNode({
                                node,
                                actions,
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

    const {createNode, createParentChildLink} = actions
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
}

exports.onCreateNode = onCreateNode
