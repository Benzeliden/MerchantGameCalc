const componentController = require('./selectSkillComponent');
const template = require("./selectSkillComponent.html");

const myComponentDefinition = {
    bindings: {
        onSelect: '&',
        skillList: '<',
        initialSelected: '<'      
    },
    templateUrl: template,

    controller: componentController,
    controllerAs: 'ctrl'
}

module.exports = myComponentDefinition;