setupController.$inject = [];
function setupController() {
    var vm = this;

    vm.isNavCollapsed = true;
    vm.toogle = function () {
        vm.isNavCollapsed = !vm.isNavCollapsed;
    }
    vm.hide = function () {
        vm.isNavCollapsed = true;
    }
}

module.exports = setupController;