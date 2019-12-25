import "babel-polyfill";

import angular from 'angular';
import "@uirouter/angularjs";
//import tabs from 'angular-ui-bootstrap/src/tabs';
import collapse from 'angular-ui-bootstrap/src/collapse';
import dropdown from 'angular-ui-bootstrap/src/dropdown';
import { routing, transitionEvents } from "./routing";

//import "oclazyload"; //add "oc.lazyLoad" to modules
(function () {
    'use strict'
    //loading js
    loadThirdParty();    
    
    var app = angular.module('myApp', ["ui.router", 'ngAnimate', 'ngDialog', 'ui.select', 'ngSanitize', collapse, dropdown]);

    app.config(['ngDialogProvider', function (ngDialogProvider) {
        ngDialogProvider.setDefaults({
            className: 'ngdialog-theme-default',
            showClose: true,
            closeByDocument: false,
            closeByEscape: true,
            cache: !isDevelopment
        });
    }]);
    
    app.config(routing)  
    
    app.run(transitionEvents)

    app.filter("timeFilter", require("./filters/timeFilter"))

    app.controller('setupController', require("./setupController.js"));
    app.controller('storageController', require("./storageController.js"));
    app.controller('simulationController', require("./simulationController.js"));
    app.controller('navbarController', require("./customUI/navbarController.js"));

    app.service('abilityInfoService', require("./Services/common/abilityInfoService.js"));
    app.service('classInfoService', require("./Services/common/classInfoService.js"));
    app.service('enemyDataService', require("./Services/common/enemyDataService.js"));
    app.service('basicMechanicService', require("./Services/common/basicMechanicService.js"));
    app.service('baseFuncService', require("./Services/common/baseFuncService.js"));
    app.service('gradeService', require("./Services/common/gradeService.js"));

    app.service('setupService', require("./Services/setupService.js"));
    app.service('simulationService', require("./Services/simulationService.js"));

    app.service('dialogService', require("./Services/ui/dialogService.js"));
    app.service('localStorageService', require("./Services/ui/localStorageService.js"));

    //app.service('soloMageService', require("./Services/soloMage/soloMageService.js"));
    app.service('craftService', require("./Services/crafters/craftService"));


    app.component('selectEnemy', require("./components/selectEnemyComponent/selectEnemyComponentDefinition"));
    app.component('enemyData', require("./components/enemyDataComponent/enemyDataComponentDefinition"));
    app.component('heroStats', require("./components/heroStatsComponent/heroStatsComponentDefinition"));
    app.component('heroStatsEditable', require("./components/heroStatsEditableComponent/heroStatsEditableComponentDefinition"));
    app.component('partyPicker', require("./components/partyPickerComponent/partyPickerComponentDefinition"));
    
    app.component('selectSkill', require("./components/selectSkillComponent/selectSkillComponentDefinition"));
    app.component('skillsPicker', require("./components/skillsPickerComponent/skillsPickerComponentDefinition"));
    app.component('soloMage', require("./components/soloMageComponent/definition"));
    app.component('changelog', require("./components/changelogComponent/definition"));
    app.component('simulationResult', require("./components/simulationResultComponent/definition"));
    app.component('heroStatistic', require("./components/heroStatisticComponent/definition"));
    app.component('partySimulation', require("./components/partySimulationComponent/definition"));
    app.component('crafterSim', require("./components/crafterSimComponent/csDefinition"));
    app.component('enchanterSim', require("./components/enchanterSimComponent/esDefinition"));

})();

function loadThirdParty() {
    require('angular-animate');
    require("angular-sanitize");
    // ng dialog
    // todo: think about using boostrap-modal 
    //like import modal from 'angular-ui-bootstrap/src/modal';
    require('ng-dialog');
    require('ng-dialog/css/ngDialog.css');
    require('ng-dialog/css/ngDialog-theme-default.css');
    //ui select
    require("ui-select");
    require("ui-select/dist/select.css");


    //loading css
    function requireAll(requireContext) {
        return requireContext.keys().map(requireContext);
    }
    requireAll(require.context('../css/', true, /\.css$/));
    require('../icomoon/style.css');
}
