
class CombatantStatistic {
    constructor() {
        this.pdmgDeal = 0;
        this.mdmgDeal = 0;
        this.pdmgTaken = 0;
        this.mdmgTaken = 0;
        this.hits = 0;
        this.crits = 0;
        this.misses = 0;
        this.total = 0;
        this.dpt = 0;
    }
    registerMiss() {
        this.misses++;
        this.total++;
    }
    registerHit(pdmg, mdmg, isCrit) {
        this.hits++;
        this.total++;
        if (isCrit) {
            this.crits++;
        }
        this.pdmgDeal += Math.round(pdmg);
        this.mdmgDeal += Math.round(mdmg);
    }
    recordDamageTaken(pdmg, mdmg) {
        this.pdmgTaken += Math.round(pdmg);
        this.mdmgTaken += Math.round(mdmg);
    }
    getHitPercent() {
        if (this.total == 0) {
            return 0;
        }
        return 100 * this.hits / this.total;
    }
    getCritPercent() {
        if (this.hits == 0) {
            return 0;
        }
        return 100 * this.crits / this.hits;
    }
    finalizeDpt(turns){
        if (turns > 0){
            this.dpt = (this.pdmgDeal + this.mdmgDeal) / turns
        }
    }
}

module.exports = CombatantStatistic