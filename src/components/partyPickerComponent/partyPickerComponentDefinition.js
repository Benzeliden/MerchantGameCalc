const componentController = require('./partyPickerComponent');
const template = require("./partyPickerComponent.html");

const myComponentDefinition = {
    bindings: {
       party: '<',
       quest: '<'
    },
    templateUrl: template,
    
    controller: componentController,
    controllerAs: 'picker'
}

module.exports = myComponentDefinition;