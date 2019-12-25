componentController.$inject = ["enemyDataService"];
function componentController(enemyDataService) {
    var vm = this;

    vm.onChange = function () {
        if (vm.selected.isRare){
            vm.questAmount = "1"
        }
        vm.onSelect({
            $event: vm.selected,
            $amount: +vm.questAmount
        });
    }

    activate();
    function activate() {
        vm.data = enemyDataService.data;
        vm.questAmount = "1"
    }
}


module.exports = componentController;