const {setupSchemaCustomizations} = require('./src/schemaCustomizations');
const {setupCreatePages} = require('./src/createPages');
const {setupCreateNode} = require('./src/createNode');


exports.createSchemaCustomization = setupSchemaCustomizations;
exports.createPages = setupCreatePages;
exports.onCreateNode = setupCreateNode;
