
let toPercent = ["hits", "crits"]
let testProps2 = ["pdmgDeal", "mdmgDeal", "pdmgTaken", "mdmgTaken", "dpt"]
function asValOrRange(val1, val2) {
    if (val1 == val2) {
        return val1
    }
    return val1 + " - " + val2
}
class AgregatedStatistic {
    constructor(hero) {
        this.numTotal = 0;
        this.isAgregated = true;
        this.statistic = {};
        this.heroName = hero.name;
        this.position = hero.position;
        this.maxHp = hero.maxHp;
        this.questHpMin = this.questHpMax = hero.questHP

        let stat = hero.statistic
        for (let i = 0; i < testProps2.length; i++) {
            let statName = testProps2[i]
            this.statistic[statName + "min"] = stat[statName]
            this.statistic[statName + "max"] = stat[statName]
        }
        this.numTotal++;
        this.statistic["hits" + "min"] = stat.getHitPercent()
        this.statistic["hits" + "max"] = stat.getHitPercent()
        this.statistic.avgHit = stat.getHitPercent()
        this.statistic["crits" + "min"] = stat.getCritPercent()
        this.statistic["crits" + "max"] = stat.getCritPercent()
        this.statistic.avgCrit = stat.getCritPercent()
        this.statistic.avgDpt = stat.dpt
    }

    _setStatistic(statName, value) {
        if (this.statistic[statName + "min"] > value) {
            this.statistic[statName + "min"] = value;
        } else if (this.statistic[statName + "max"] < value) {
            this.statistic[statName + "max"] = value;
        }

    }

    addHero(hero) {
        this.numTotal++;
        if (this.questHpMin > hero.questHP) {
            this.questHpMin = hero.questHP;
        } else if (this.questHpMax < hero.questHP) {
            this.questHpMax = hero.questHP
        }
        let stat = hero.statistic
        for (let i = 0; i < testProps2.length; i++) {
            let statName = testProps2[i]
            let value = stat[statName]
            this._setStatistic(statName, value)
        }

        this.statistic.avgDpt += stat.dpt
        this.statistic.avgHit += stat.getHitPercent()
        this.statistic.avgCrit += stat.getCritPercent()
        this._setStatistic("hits", stat.getHitPercent())
        this._setStatistic("crits", stat.getCritPercent())
    }

    getHpLoss() {
        let loss1 = Math.round(this.maxHp - this.questHpMin);
        let loss2 = Math.round(this.maxHp - this.questHpMax);
        if (loss2 > loss1) {
            let temp = loss1;
            loss1 = loss2;
            loss2 = temp;
        }
        if (loss1 >= this.maxHp) {
            loss1 = this.maxHp + " (Dead)"
        } else if (loss1 < 0) {
            loss1 = 0;
        }
        if (loss2 >= this.maxHp) {
            loss2 = this.maxHp + " (Dead)"
        } else if (loss2 < 0) {
            loss2 = 0;
        }

        if (loss1 == loss2) {
            return loss1;
        }

        return loss1 + " - " + loss2
    }
    finalize() {
        this.statistic.dptmin = Math.round(this.statistic.dptmin * 100) / 100
        this.statistic.dptmax = Math.round(this.statistic.dptmax * 100) / 100
        for (let i = 0; i < testProps2.length; i++) {
            let statName = testProps2[i]
            let val1 = this.statistic[statName + "min"]
            let val2 = this.statistic[statName + "max"]
            this.statistic[statName] = asValOrRange(val1, val2)
        }
        this.statistic.avgDpt = Math.round(100 * this.statistic.avgDpt / this.numTotal) / 100
        let minTotal
        this.statistic.totalDealt = asValOrRange(this.statistic["pdmgDealmin"] + this.statistic["mdmgDealmin"],
            this.statistic["pdmgDealmax"] + this.statistic["mdmgDealmax"])
        this.statistic.totalTaken = asValOrRange(this.statistic["pdmgTakenmin"] + this.statistic["mdmgTakenmin"],
            this.statistic["pdmgTakenmax"] + this.statistic["mdmgTakenmax"])
        this.statistic.hitPct = asValOrRange(Math.round(100 * this.statistic["hitsmin"]) / 100, Math.round(100 * this.statistic["hitsmax"]) / 100)
        this.statistic.critPct = asValOrRange(Math.round(100 * this.statistic["critsmin"]) / 100, Math.round(100 * this.statistic["critsmax"]) / 100)
        this.statistic.avgHit = Math.round(100 * this.statistic.avgHit / this.numTotal) / 100
        this.statistic.avgCrit = Math.round(100 * this.statistic.avgCrit / this.numTotal) / 100
        this.name = this.heroName
    }
}

module.exports = AgregatedStatistic