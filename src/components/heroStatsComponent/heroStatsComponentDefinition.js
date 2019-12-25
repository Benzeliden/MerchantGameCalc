const componentController = require('./heroStatsComponent');
const template = require("./heroStatsComponent.html");

const myComponentDefinition = {
    bindings: {
       data: '<',
    },
    templateUrl: template,
    
    controller: componentController,
    controllerAs: 'hero'
}

module.exports = myComponentDefinition;