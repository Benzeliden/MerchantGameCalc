componentController.$inject = ["basicMechanicService", "classInfoService"];
function componentController(basicMechanicService, classInfoService) {
    var vm = this;

    //todo: separate service? - see classInfoService
	var fixNumber = function (num) {
		//todo: fix min\max
		if (!isFinite(num)) {
			return 0;
		}
		var parced = + num;
		if (parced < 0) {
			return 0;
		}
		if (parced > 9999) {
			return 9999;
		}

		return parced;
    }
    
    vm.percentArmorFunc = function(value) {
        return basicMechanicService.displayArmorModifier(value)
	}
	
    vm.$onInit = function(){
		//console.log("test", vm.hero, vm.hero.classId)
		vm.passives = classInfoService.getPassives(vm.hero.classId)
        //vm.selected = vm.skillList.find(x => x.name == vm.initialSelected)
    }

    activate();
    function activate() {
    }
}


module.exports = componentController;