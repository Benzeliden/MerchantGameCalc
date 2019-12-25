const componentController = require('./enchanterSimCtrl');
const template = require("./enchanterSim.html");

const myComponentDefinition = {
    templateUrl: template,

    controller: componentController,
    controllerAs: 'es'
}

module.exports = myComponentDefinition;