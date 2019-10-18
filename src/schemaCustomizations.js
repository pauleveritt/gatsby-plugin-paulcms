/*

Handlers for gatsby-node.js createSchemaCustomization

 */


const fs = require(`fs`);
const {DirectiveLocation} = require(`graphql`);

const metadata = (createFieldExtension, reporter) => {
    createFieldExtension({
        name: `metadata`,
        args: {
            plural: {
                type: "String"
            },
        },
        locations: [DirectiveLocation.OBJECT],
        resolve(options) {
            const {metadata} = options;
            // We never get inside resolve..I think it is not part of the API
            reporter.info('\n\n\n#### In metadata !!!!!!!!!!');
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
}

const parentBody = (createFieldExtension) => {
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
}

const createBaseInterfaces = (createTypes) => {
    // Create the base stuff
    createTypes(`
    interface Resource @nodeInterface {
        id: ID!
        slug: String!
        title: String!
        body: String!
        parent: Node
    }
    `);
}

const createResourceTypes = (createTypes) => {
    // Read this site's typedefs from a GQL file
    const typeDefs = fs.readFileSync(`./src/typedefs.graphql`, {
        encoding: `utf-8`
    });

    createTypes(typeDefs);
}


exports.setupSchemaCustomizations = ({actions, reporter}) => {
    const {createTypes, createFieldExtension} = actions;

    // Extensions
    metadata(createFieldExtension, reporter);

    parentBody(createFieldExtension);

    // Interfaces
    createBaseInterfaces(createTypes);

    // CMS Resource Types
    createResourceTypes(createTypes);
}
