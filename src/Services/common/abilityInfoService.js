service.$inject = []
function service(){
    var self = this;
    
    self.ablityData = require("../../data/abilityDescription.json");
    
    self.getAbility = function(name){
        var ability = self.ablityData[name];
        if (ability){
            if (ability.apCost == undefined){
                ability.apCost = 0
            }
            if (ability.name == undefined){
                ability.name = name
            }
        }
        return ability;
    }
}

module.exports = service;