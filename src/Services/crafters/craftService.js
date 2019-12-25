serv.$inject = ['baseFuncService'];
function serv(baseFuncService) {
    let self = this;
    self.prefixData = require("../../data/prefixData.json")
    self.suffixData = require("../../data/suffixData.json")

    self.itemStartGrade = function (craftLevel, itemLevel) {
        return baseFuncService.clamp(baseFuncService.round(1 + (craftLevel - itemLevel) / 4, 2), 1, 4.5)
    }

    self.getCraftResult = function (crafterLvl, itemLvl, materials) {
        let startGrade = self.itemStartGrade(crafterLvl, itemLvl)
        let matGradeAverage;
        if (materials == null) {
            matGradeAverage = 5.25
        } else {
            console.log("not implemented")
            matGradeAverage = 5.25
        }

        let grade = baseFuncService.clamp(baseFuncService.round((startGrade + matGradeAverage) / 2), 1, 5)

        let prefixData = {};
        let suffixData = {}
        if (grade > 2) {
            prefixData = self.getPrefixChance(crafterLvl, grade, itemLvl)
            suffixData = self.getSuffixChance(crafterLvl, grade, itemLvl)
            //from merchant
            // self.grade = self.grade + prefixList[self.prefix].sell*2
        } else {
            prefixData.num = 0;
            prefixData.totalW = 1;
            prefixData.prefixChance = 0;
            suffixData.suffixChance = 0;
            suffixData.num = 0;
            suffixData.totalW = 1;
        }

        return {
            grade: grade,

            prefixChance: prefixData.prefixChance,
            lastPrefixNum: prefixData.num,
            prefixTotalW: prefixData.totalW,

            suffixChance: suffixData.suffixChance,
            lastSuffixNum: suffixData.num,
            suffixTotalW: suffixData.totalW,
        }
    }

    self.getPrefixChance = function (crafterLvl, grade, itemLevel) {
        let gradeBonus = grade * 2 - 4
        let combinedOdds = Math.round(crafterLvl + gradeBonus) // for enchant math.round(self.crafter.level + 5 + self.grade*2)
        let prefixChance = Math.min((combinedOdds - itemLevel) * 2, 25)
        let i = 0;
        let totalW = 0;
        while (i < self.prefixData.length && combinedOdds >= self.prefixData[i].minLevel) {
            totalW += self.prefixData[i].weight
            i++;
        }
        return {
            num: i,
            totalW: totalW,
            prefixChance: prefixChance
        };
    }
    self.getSuffixChance = function (crafterLvl, grade, itemLevel) {
        let gradeBonus = grade * 2 - 4
        let combinedOdds = Math.round(crafterLvl + gradeBonus)
        let suffixChance = Math.min((combinedOdds - itemLevel) * 2, 40)

        let i = 0;
        let totalW = 0;
        while (i < self.suffixData.length && combinedOdds >= self.suffixData[i].minLevel) {
            totalW += self.suffixData[i].weight
            i++;
        }
        return {
            num: i,
            totalW: totalW,
            suffixChance: suffixChance
        }
    }

    self.getEnchanterFinalGrade = function (enchanterLvl, itemLvl, itemGrade, attempt) {
        let startGrade = self.itemStartGrade(enchanterLvl + 5, itemLvl)
        let minGrade = Math.max(itemGrade - 1, 1)

        return baseFuncService.clamp(Math.round(startGrade + attempt * 0.33), minGrade, 5);
    }

    let crystalPattern = [1, 2, 2, 3, 4, 6, 9]
    self.getCrystalCost = function (attempts) {
        let idx = Math.min(attempts - 1, crystalPattern.length - 1)
        return crystalPattern[idx]
    }

    self.getEnchantGradeResult = function (enchanterLvl, itemLvl, startGrade) {
        let grade = startGrade
        let attempts = 0
        let pattern = []
        let crystalCost = []
        do {
            grade = self.getEnchanterFinalGrade(enchanterLvl, itemLvl, grade, attempts)
            pattern.push(grade)
            attempts++
            crystalCost.push(self.getCrystalCost(attempts))
        } while (grade < 5 && attempts < 100)

        return {
            attempts: attempts,
            pattern: pattern,
            crystalCost: crystalCost
        }
    }
}

module.exports = serv