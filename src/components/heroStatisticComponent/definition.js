const componentController = require('./heroStatisticComponent');
const template = require("./heroStatisticComponent.html");

const myComponentDefinition = {
    bindings: {
       hero: '<',
       showPosition: '<'
    },
    templateUrl: template,
    
    controller: componentController,
    controllerAs: 'ctrl'
}

module.exports = myComponentDefinition;