const componentController = require('./partySimulationComponent');
const template = require("./partySimulationComponent.html");

const myComponentDefinition = {
    bindings: {
    },
    templateUrl: template,
    
    controller: componentController,
    controllerAs: 'party'
}

module.exports = myComponentDefinition;