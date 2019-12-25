const abilityFunc = require("../../data/abilityFunc")

service.$inject = ["baseFuncService"];
function service(baseFuncService) {
    var self = this;

    self.copyMerchantLike = function (obj) {
        return baseFuncService.copyTable(obj)
    }

    self.calculateArmorReduction = function (armor) {
        return 100 / (100 + armor);
    }

    self.calculateArmorModifier = function (armor) {
        return 1 - self.calculateArmorReduction(armor);
    }

    self.displayArmorModifier = function (armor) {
        return isFinite(armor)
            ? self.calculateArmorModifier(armor) * 100
            : "err";
    }

    self.calculateDamage = function (damage, armor, damageRatio) {
        let dmg = damage
        if (damageRatio) {
            dmg = dmg * damageRatio
        }
        return Math.round(self.calculateArmorReduction(armor) * dmg);
    }

    self.rollPercent = function (percentChance) {
        return Math.random() * 100 < percentChance;
    }

    self.calculateHitChance = function (acc, eva) {
        var chance = Math.round(200 * acc / (acc + eva))
        return Math.min(chance, 100)
    }

    self.getApPointsPossible = function (hero) {
        if (hero.level < 10) {
            return 0;
        }
        if (hero.level > 40) {
            return 20;
        }
        return Math.floor(hero.level / 2) + 5;
    }

    self.createBaseStats = function (data) {
        let result = {}
        for (let i = 0; i < statsToMerge.length; i++) {
            let statName = statsToMerge[i]
            result[statName] = data[statName] || 0
        }
        result.maxHp = data.hp;
        if (data._amount) {
            result.maxHp = result.maxHp * data._amount;
        }
        result.critMod = 2;
        for (let st in statsToPercentMapping) {
            let percentSt = statsToPercentMapping[st];
            result[percentSt] /= 100;
        }
        
        if (data.critModItems) {
            result.critMod += data.critModItems/100;
        }

        let passives = abilityFunc.passiveData;
        let passive = passives[data.selectedPassive]
        if (passive && passive.stats) {
            //console.log("before passives", JSON.stringify(result),passive.stats)
            for (let st in passive.stats) {
                //console.log("adding",result[st] ,passive.stats[st])
                result[st] += passive.stats[st]
            }
            //console.log("passives merged", JSON.stringify(result))
        }

        for (let st in statsToPercentMapping) {
            let percentSt = statsToPercentMapping[st];
            if (result[percentSt] != 0) {
                result[st] = result[st] / (1 + result[percentSt]);
            }
        }
        //console.log("final stats", JSON.stringify(result))

        return result
    }

    const statsToMerge = ["atk", "matk", "def", "mdef", "acc", "maxHp", "crit", "critMod", "eva",
        "atkPct", "matkPct", "defPct", "mdefPct", "accPct", "hpPct", "evaPct"]
    const statsToPercentMapping = {
        "atk": "atkPct", "matk": "matkPct", "def": "defPct",
        "mdef": "mdefPct", "acc": "accPct", "maxHp": "hpPct", "eva": "evaPct"
    }
    self.determineStats = function (combatant) {
        let base = combatant.baseStats;
        let effects = combatant.effects;

        let result = {}
        for (let i = 0; i < statsToMerge.length; i++) {
            let statName = statsToMerge[i]
            result[statName] = base[statName] || 0
        }
        //console.log("stats before", result)

        for (let i = 0; i < effects.length; i++) {
            let eff = effects[i]
            if (eff.trigger == "OnTurn" || eff.trigger == "Permanent") {
                if (eff.statFunc) {
                    console.log("never happens?")
                    eff.statFunc(combatant)
                } else {
                    let statsToAdd = eff.stats
                    //console.log("to add", statsToAdd.atk)
                    for (let statKey in statsToAdd) {
                        if (statsToMerge.indexOf(statKey) != -1) {
                            let destinationStat = statKey;
                            if (statsToPercentMapping.hasOwnProperty(statKey)) {
                                destinationStat = statsToPercentMapping[statKey];
                            }
                            result[destinationStat] += statsToAdd[statKey]
                            //console.log("added", statsToAdd[statKey], result[destinationStat])
                        }
                    }
                }
            }
        }

        //console.log("stats after", result)

        for (let i = 0; i < statsToMerge.length; i++) {
            let statName = statsToMerge[i]
            let resultValue = result[statName]
            if (statsToPercentMapping.hasOwnProperty(statName)) {
                let pctStat = statsToPercentMapping[statName];
                resultValue = resultValue * (1 + result[pctStat])
            }
            combatant[statName] = resultValue
        }
    }

    self.mergeStackEffect = function (to, from) {

        for (let i in to) {
            console.log("merging", to[i], from[i])
            to[i] = to[i] + from[i];

        }
    }

    self.calculateTrueDamage = function (dmg, damageRatio) {
        if (damageRatio) {
            return dmg * damageRatio
        }
        return dmg
    }

    const timePerTurn = 5;
    const timePerAction = 5;
    const gradeTime = [2, 1.25, 1.1, 1, 0.9, 0.75]
    self.calculateQuestTime = function (quest, turns, actions, gradeNum, speedModTotal) {
        let time = turns * timePerTurn + actions * timePerAction + quest.time * quest._amount * gradeTime[gradeNum]

        let speedModReduction = (100 - Math.min(speedModTotal, 50)) / 100

        return (time * speedModReduction)
    }


    //let max = 100000;
    //let cur = 0;
    //for(let i=0;i<max;i++){
    //    if (self.rollPercent(37)){
    //        cur++;
    //    }
    //}
    //console.log("expected 37% crit chance, practically - ", cur/max);
}


module.exports = service;