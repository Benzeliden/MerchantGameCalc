storageController.$inject = ["localStorageService", "setupService"];
function storageController(storageService, setService) {
    var vm = this;

    vm.statusText = storageService.status;
    vm.isStorageAvailable = storageService.isAvailable;
    vm.loadActive = storageService.checkPreviousSaveExist();

    vm.saveSetup = function () {
        console.log('saving');
        let setup = setService.all;
        //let mage = soloMageService.getMage()
        storageService
            .saveSetup(setup)
            .then(() => console.log('saved'), err => console.log('save failed', err));
    }

    vm.loadSetup = function () {
        storageService
            .loadSetup()
            .then(data => {
                if (data) {
                    //todo: ask if user want to continue
                    setService.loadSetup(data.setup);
                    //soloMageService.loadMage(data.mage);
                }
            },
            err => console.log('error when loading', err));
    }

    activate();
    function activate() {
        if (vm.loadActive) {
            vm.loadSetup();
        }
    }
}


module.exports = storageController;