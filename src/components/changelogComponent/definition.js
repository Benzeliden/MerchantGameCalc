const componentController = require('./changelog');
const template = require("./changelog.html");

const myComponentDefinition = {
    templateUrl: template,

    controller: componentController,
    controllerAs: 'changelog'
}

module.exports = myComponentDefinition;