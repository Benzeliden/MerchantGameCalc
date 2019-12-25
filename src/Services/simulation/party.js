
class Party {
    constructor(frontRow, backRow, basicMechanicService) {
        this.frontRow = frontRow
        this.backRow = backRow
        this.basicMechanicService = basicMechanicService

        for (let i = 0; i < 3; i++) {
            var hero = this.frontRow[i]
            if (hero) {
                hero.partyLocation = i * 2 + 1
                hero.party = this
            }
            hero = this.backRow[i]
            if (hero) {
                hero.partyLocation = i * 2
                hero.party = this
            }
        }
    }
    static getClassName() { return 'Party'; }
    getClassName() { return Party.getClassName(); }
    takeAttack(attack) {
        console.log("party take attack", attack.damageRatio);
        let aoeTargeting = attack.damageRatio || [1, 1, 1, 1, 1, 1]
        let res = []
        for (let i = 0; i < 3; i++) {
            let fr = this.frontRow[i]
            if (this.isFrontRowAlive(i) && aoeTargeting[i * 2 + 1] > 0 ) {
                res.push(fr.takeAttack(this.basicMechanicService.copyMerchantLike(attack)))
            }
        }
        for (let i = 0; i < 3; i++) {
            let br = this.backRow[i]
            if (this.isBackRowAlive(i) && aoeTargeting[i * 2] > 0 ) {
                res.push(br.takeAttack(this.basicMechanicService.copyMerchantLike(attack)))
            }
        }

        return res
    }
    receiveHeal(baseHeal, aoe) {
        let aoeTargeting = aoe || [1, 1, 1, 1, 1, 1]
        for (let i = 0; i < 3; i++) {
            let fr = this.frontRow[i]
            if (this.isFrontRowAlive(i) && aoeTargeting[i * 2 + 1] > 0) {
                fr.receiveHeal(aoeTargeting[i * 2 + 1] * baseHeal)
            }
            let br = this.backRow[i]
            if (this.isBackRowAlive(i) && aoeTargeting[i * 2] > 0) {
                br.receiveHeal(aoeTargeting[i * 2] * baseHeal)
            }
        }
    }
    removeAllEffects(flagDebuff, aoe) {
        let aoeTargeting = aoe || [1, 1, 1, 1, 1, 1]
        for (let i = 0; i < 3; i++) {
            if (this.isFrontRowAlive(i) && aoeTargeting[i * 2 + 1] == 1) {
                this.frontRow[i].removeAllEffects(flagDebuff);
            }
            if (this.isBackRowAlive(i) && aoeTargeting[i * 2] == 1) {
                this.backRow[i].removeAllEffects(flagDebuff);
            }
        }
    }
    removeEffect(effect, aoe) {
        //not used?
        throw "removeEffect is not implemented for party"
    }
    addEffect(effect, aoe) {
        let aoeTargeting = aoe || [1, 1, 1, 1, 1, 1]
        for (let i = 0; i < 3; i++) {
            if (this.isFrontRowAlive(i) && aoeTargeting[i * 2 + 1] == 1) {
                this.frontRow[i].addEffect(effect);
            }
            if (this.isBackRowAlive(i) && aoeTargeting[i * 2] == 1) {
                this.backRow[i].addEffect(effect);
            }
        }
        //hack?
        
        for (let i = 0; i < 3; i++) {
            if (this.isFrontRowAlive(i) && aoeTargeting[i * 2 + 1] == 1) {
                this.frontRow[i].determineStats();
            }
            if (this.isBackRowAlive(i) && aoeTargeting[i * 2] == 1) {
                this.backRow[i].determineStats();
            }
        }
    }

    //not merchant code
    useAbilities(callback, turn) {
        //todoL ORDER?
        for (let i = 0; i < 3; i++) {
            if (this.isBackRowAlive(i)) {
                callback(this.backRow[i], turn)
            }
            if (this.isFrontRowAlive(i)) {
                callback(this.frontRow[i], turn)
            }
        }
    }
    isFrontRowAlive(index) {
        return this.frontRow[index] && this.frontRow[index].questHP > 0
    }
    isBackRowAlive(index) {
        return this.backRow[index] && this.backRow[index].questHP > 0
    }
    isDead() {
        for (let i = 0; i < 3; i++) {
            if (this.isFrontRowAlive(i) || this.isBackRowAlive(i)) {
                return false;
            }
        }

        return true;
    }
    reduceEffectsDuration() {
        for (let i = 0; i < 3; i++) {
            if (this.isFrontRowAlive(i)) {
                this.frontRow[i].reduceEffectsDuration()
            }
            if (this.isBackRowAlive(i)) {
                this.backRow[i].reduceEffectsDuration()
            }
        }
    }
    triggerDots() {
        for (let i = 0; i < 3; i++) {
            if (this.isFrontRowAlive(i)) {
                this.frontRow[i].triggerDots()
            }
            if (this.isBackRowAlive(i)) {
                this.backRow[i].triggerDots()
            }
        }
    }
}

module.exports = Party