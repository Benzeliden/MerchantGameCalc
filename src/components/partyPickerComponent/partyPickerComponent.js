componentController.$inject = ["setupService", "dialogService"];
function componentController(setupService, dialogService) {
    var vm = this;

    vm.callSelectHero = function(num){
        var heroes = setupService.all;
        console.log("select hero", num)
        console.log("quest", vm.quest)
        var availableHeroes = []
        heroes.forEach(hero => {
            let isInParty = vm.party.find(x => x != undefined && x.hero == hero) != undefined
            console.log("hero", hero, isInParty)
            if (!isInParty) {
                availableHeroes.push(hero)
            }
        });

        dialogService.pickHero(availableHeroes).then(
            hero => vm.addHeroToParty(hero, num), (err) => console.log("pick hero cancel", err)
        )
    }

    vm.addHeroToParty = function(hero, num){
        var newMember = {
            hero: hero,
            skills: ["Basic", "Basic", "Basic", "Basic", "Basic"],
            position: num
        }
        newMember.skillsStr = newMember.skills.reduce((prev,cur) => prev + " > " + cur)
        vm.party[num - 1] = newMember
    }

    activate();
    function activate() {
        console.log("this", vm)
    }
}


module.exports = componentController;