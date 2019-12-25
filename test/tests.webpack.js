require('angular');
require('angular-mocks/angular-mocks');
require('../src/main.js');

const doFull = false

if (doFull) {
    const context = require.context('./', true, /spec\.js$/);
    
    context.keys().forEach(context);
}else{
    //for development
    require("./simulationService.spec.js")
}