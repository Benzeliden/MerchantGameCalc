const componentController = require('./enemyDataComponentController');
const template = require("./enemyDataComponent.html");

const myComponentDefinition = {
    bindings: {
        data: '<',
        amount: '<'
    },
    templateUrl: template,

    controller: componentController,
    controllerAs: 'enemy'
}

module.exports = myComponentDefinition;