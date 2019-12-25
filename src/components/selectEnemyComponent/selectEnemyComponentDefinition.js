const componentController = require('./selectEnemyComponentController');
const template = require("./selectEnemyComponent.html");

const myComponentDefinition = {
    bindings: {
        onSelect: '&',
        hideInfo: '<'        
    },
    templateUrl: template,

    controller: componentController,
    controllerAs: 'ec'
}

module.exports = myComponentDefinition;