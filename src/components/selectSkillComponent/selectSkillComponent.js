componentController.$inject = [];
function componentController() {
    var vm = this;

    vm.onChange = function () {
        //console.log('testing', vm.selected,vm)
        vm.onSelect({
            $event: vm.selected
        });
    }

    vm.$onInit = function(){
        vm.selected = vm.skillList.find(x => x.name == vm.initialSelected)
    }

    activate();
    function activate() {
    }
}


module.exports = componentController;