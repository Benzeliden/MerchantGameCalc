componentController.$inject = ["basicMechanicService"];
function componentController(basicMechanicService) {
    var vm = this;

    vm.armorFunc = basicMechanicService.displayArmorModifier;

    vm.toogle = function(){
        vm.showDetails = !vm.showDetails;
    }

    activate();
    function activate() {
        vm.showDetails = true;
    }
}


module.exports = componentController;