const componentController = require('./crafterSimCtrl');
const template = require("./crafterSim.html");

const myComponentDefinition = {
    templateUrl: template,

    controller: componentController,
    controllerAs: 'cs'
}

module.exports = myComponentDefinition;