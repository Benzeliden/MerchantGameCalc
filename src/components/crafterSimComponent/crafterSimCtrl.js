componentController.$inject = ["craftService", "gradeService"];
function componentController(craftService, gradeService) {
    var vm = this;
    vm.prefixData = craftService.prefixData
    vm.suffixData = craftService.suffixData

    activate();
    function activate() {
    }

    vm.recalc = function () {
        vm.result = null
        vm.error = null
        if (!angular.isNumber(vm.crafterLvl) || !angular.isNumber(vm.itemLvl) 
                || vm.crafterLvl < 0 || vm.itemLvl < 0) {
            return
        }
        if (vm.crafterLvl < vm.itemLvl) {
            vm.error = "Can't craft item: crafter level is too low"
            return
        }
        let res = craftService.getCraftResult(vm.crafterLvl, vm.itemLvl, null)
        res.grade = gradeService.numToGrade(res.grade)
        vm.result = res
    }
}

module.exports = componentController;