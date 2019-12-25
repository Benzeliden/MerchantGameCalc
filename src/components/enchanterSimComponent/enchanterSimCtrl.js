componentController.$inject = ["craftService", "gradeService"];
function componentController(craftService, gradeService) {
    var vm = this;
    vm.prefixData = craftService.prefixData
    vm.suffixData = craftService.suffixData

    vm.grade = "3"

    activate();
    function activate() {
    }

    vm.recalc = function () {
        vm.result = null
        vm.error = null
        let startGradeLetter = gradeService.numToGrade(+vm.grade)
        if (!angular.isNumber(vm.crafterLvl) || !angular.isNumber(vm.itemLvl)
            || vm.crafterLvl < 0 || vm.itemLvl < 0 || startGradeLetter == undefined) {
            return
        }

        let res = craftService.getEnchantGradeResult(vm.crafterLvl, vm.itemLvl, +vm.grade)
        res.pattern = startGradeLetter + " (start) > " + res.pattern.map(x => gradeService.numToGrade(x)).join(" > ")
        res.crystalPattern = res.crystalCost.join(" > ")
        res.crystalCost = res.crystalCost.reduce((prev, cur) => prev + cur)
        vm.result = res
    }
}

module.exports = componentController;