const componentController = require('./heroStatsEditableComponent');
const template = require("./heroStatsEditableComponent.html");

const myComponentDefinition = {
    bindings: {
       hero: '=',
    },
    templateUrl: template,
    
    controller: componentController,
    controllerAs: 'ctrl'
}

module.exports = myComponentDefinition;