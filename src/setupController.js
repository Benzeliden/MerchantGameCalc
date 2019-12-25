setupController.$inject = ["classInfoService", "setupService", "dialogService"];
function setupController(cIS, setS, dialogService){
    var vm = this;

    vm.heroes = setS.all;
    vm.maxHeroCount = setS.maxHeroCount;
    
    vm.availableHeroes = cIS.classData;

    vm.addHero = function(classId){
        let stats = cIS.getDefaultStats()
        stats.classId = classId
        dialogService
            .editHeroPopup(stats, false)
            .then(stats => {
                console.log('adding hero', stats);
                setS.addHero(classId, stats);
            }, error => console.log("on adding hero", error));
    }

    vm.editHero = function(hero){
        dialogService
            .editHeroPopup(hero, true)
            .then(stats => {
                console.log('edit successful', stats);
                angular.extend(hero, stats);
            }, error => console.log("on edit hero", error));
    }
    
    vm.removeHero = function(id){
        let pos = setS.findHeroPositionById(id);
        if (pos == -1){
            return;
        }
        var heroName = setS.all[pos].name;
        dialogService
            .deleteHeroConfirm(heroName)
            .then(() => setS.removeHero(pos));
    }
}

module.exports = setupController;