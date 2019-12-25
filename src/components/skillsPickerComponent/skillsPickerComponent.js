componentController.$inject = ["basicMechanicService", "classInfoService"];
function componentController(basicMechanicService, classInfoService) {
    var vm = this;

    vm.setSkill = function(skill, turn){
        //console.log("skill", skill, "was set for turn", turn)
        let idx = turn - 1;
        let oldApCost = vm.skills[idx].apCost
        vm.skills[idx] = skill

        vm.totalAp = vm.totalAp - oldApCost + skill.apCost
        vm.skillsChanged({
            skills : vm.skills,
            totalAp : vm.totalAp
        })
    }

    vm.$onInit = function(){  
        vm.skillList = classInfoService.getPossibleSkills(vm.hero.classId, vm.hero.level)   
        vm.skills = []
        for(let i = 0; i < vm.initialSkills.length; i++){
            let skill = vm.skillList.find(x => x.name == vm.initialSkills[i])
            if (skill == undefined){
                skill = vm.skillList.find(x => x.name == "Basic")
            }
            vm.skills.push(skill)
        }        
        vm.totalAp = vm.skills.reduce((prev, cur) => prev + cur.apCost, 0)

        vm.skillsChanged({
            skills : vm.skills,
            totalAp : vm.totalAp
        })
    }
    
    activate();
    function activate() {     
    }
}


module.exports = componentController;