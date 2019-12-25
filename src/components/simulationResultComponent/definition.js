const componentController = require('./simulationResultComponent');
const template = require("./simulationResultComponent.html");

const myComponentDefinition = {
    bindings: {
        result: '<'
    },
    templateUrl: template,

    controller: componentController,
    controllerAs: 'ctrl'
}

module.exports = myComponentDefinition;