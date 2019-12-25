dial.$inject = ["ngDialog", "classInfoService"];

const addHeroPopupTemplatePath = require("../../../templates/popups/addHeroPopup.html");
const deleteHeroConfirmTemplatePath = require('../../../templates/popups/deleteHeroConfirm.html')
const pickHeroPopupTemplatePath = require('../../../templates/popups/pickHeroPopup.html')
const pickSkillsPopupTemplatePath = require('../../../templates/popups/pickSkillsPopup.html')

function dial(ngDialog, classInfoService){
    var self = this;
    
    self.deleteHeroConfirm = function(name){
        return ngDialog.openConfirm({
            template: deleteHeroConfirmTemplatePath,
            data : {
                heroName : name
            }
        });
    }
    
    self.editHeroPopup = function(heroData, isEdit) {
        return ngDialog.openConfirm({
            template: addHeroPopupTemplatePath,
            data : { stats : angular.copy(heroData), isEdit : isEdit }
        }); 
    }

    self.pickHero = function(heroes){
        return ngDialog.openConfirm({
            template: pickHeroPopupTemplatePath,
            data : {
                heroes : heroes
            }
        });
    }

    self.pickSkills = function(partyHero){
        var scope = {}
        scope.initialSkills = partyHero.skills
        scope.apAvailable = classInfoService.getApAvailable(partyHero.hero.level)
        scope.skillsChanged = function(skills, totalAp){
            
            scope.attackList = skills.map(x => x.name);
            scope.totalAp = totalAp
        }
        
        return ngDialog.openConfirm({
            template: pickSkillsPopupTemplatePath,
            data : {
                hero : partyHero.hero,
                scope: scope
            }
        });
    }
    
}
module.exports = dial;