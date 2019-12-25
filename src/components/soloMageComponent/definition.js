const componentController = require('./soloMageComponent');
const template = require("./soloMageComponent.html");

const myComponentDefinition = {
    templateUrl: template,
    
    controller: componentController,
    controllerAs: 'smc'
}

module.exports = myComponentDefinition;