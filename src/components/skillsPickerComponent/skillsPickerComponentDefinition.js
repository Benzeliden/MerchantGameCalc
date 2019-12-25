const componentController = require('./skillsPickerComponent');
const template = require("./skillsPickerComponent.html");

const myComponentDefinition = {
    bindings: {
       hero: '<',
       initialSkills: '<',
       skillsChanged: '&'
    },
    templateUrl: template,
    
    controller: componentController,
    controllerAs: 'ctrl'
}

module.exports = myComponentDefinition;