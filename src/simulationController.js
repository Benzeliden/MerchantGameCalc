controller.$inject = ["setupService", "basicMechanicService", "simulationService", "dialogService"];
function controller(setupService, basicMechanicService, simulationService, dialogService) {
    var vm = this;
    vm.currentlySelected = undefined;
    vm.currentAmount = 1;

    vm.heroes = setupService.all;
    vm.questData = simulationService.questData;
    vm.party = []
    vm.errors = []

    vm.handler = function (event, amount) {
        let isChanged = event !== vm.currentlySelected
        vm.currentlySelected = event;
        if (isChanged) {
            vm.party = []
        }
        if (!vm.currentlySelected) {
            return;
        }
        vm.currentlySelected._amount = amount;
        vm.hideInfo = false;
        vm.showResult = false;
        vm.errors = []
    }

    vm.heroExists = function (hero) {
        return hero != undefined
    }

    vm.editSkills = function (partyHero) {
        dialogService.pickSkills(partyHero).then((ret) => {
            partyHero.skills = ret.attackList
            partyHero.skillsStr = partyHero.skills.reduce((prev, cur) => prev + " > " + cur)
        })
    }

    vm.removeHero = function (partyHero) {
        let index = vm.party.indexOf(partyHero)
        if (index > -1) {
            vm.party[index] = undefined
        }
    }

    vm.validate = function () {
        vm.errors = []
        var heroesUsed = 0;

        for (let i = 0; i < vm.party.length; i++) {
            if (vm.party[i] != undefined) {
                heroesUsed++;
            }
        }
        if (heroesUsed == 0) {
            vm.errors.push("Select at least one hero!")
        }
        if (heroesUsed > vm.currentlySelected.partySize) {
            vm.errors.push("Quest size is " + vm.currentlySelected.partySize + " and you used " + heroesUsed + " heroes. Please, remove some heroes")
        }

        if (vm.errors.length > 0) {
            return false;
        }

        if (vm.party[1] == undefined) {
            vm.errors.push("Warning: No central hero!")
        }

        return true
    }

    vm.go = function () {
        if (!vm.validate()) {
            return
        }
        //console.log("go", vm.party)
        simulationService.setSimulationQuest(vm.currentlySelected);
        var heroes = vm.party.map(ph => {
            if (ph == undefined) return undefined;
            ph.hero.attackList = ph.skills
            return ph.hero
        })
        //console.log("go", heroes)
        var simResult = simulationService.doSimulation(heroes, vm.currentAmount);
        //console.log('simulation result', simResult)
        simResult.time = Math.round(simResult.time)
        vm.showResult = true
        vm.simResult = simResult
    }

    vm.goExtended = function () {
        if (!vm.validate()) {
            return
        }

        var heroes = vm.party.map(ph => {
            if (ph == undefined) return undefined;
            ph.hero.attackList = ph.skills
            return ph.hero
        })
        var simResult = simulationService.nTimeSimulation(heroes, vm.currentlySelected)
        vm.showResult = true
        vm.simResult = simResult
    }

    activate();
    function activate() {
        vm.hideInfo = true;
    }

}
module.exports = controller;