componentController.$inject = ["basicMechanicService", "abilityInfoService"];
function componentController(basicMechanicService, abilityInfoService) {
    var vm = this;

    vm.percentArmorFunc = basicMechanicService.displayArmorModifier;
    vm.getAbilityDescription = function(name){
        var ability = abilityInfoService.getAbility(name);
        return ability.desc1 + " " + ability.desc2
    }

    activate();
    function activate() {
    }
}


module.exports = componentController;