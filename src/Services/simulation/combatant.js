const CombatantStatistic = require("./combatantStatistic")
const Party = require("./party")

class Combatant {
    constructor(data, basicMechanicService, position) {
        this.effects = [];
        let hp = data.hp
        if (data._amount) {
            hp = hp * data._amount;
        }
        this.questHP = hp;

        this.basicMechanicService = basicMechanicService;
        this.baseStats = basicMechanicService.createBaseStats(data);
        this.determineStats();

        this.name = data.name;
        this.isWeekly = data.isWeekly
        this.attackList = data.attackList || ["Basic", "Basic", "Basic", "Basic", "Basic"]
        this.position = position

        this.statistic = new CombatantStatistic();
    }
    receiveHeal(amount, doRessurect, isShield) {
        if (this.isDead && !doRessurect) {
            console.log("Cannot heal dead target", this.name);
            return false
        } else if (doRessurect) {
            console.log("Reviving ", this.name);
            this.isDead = false
            this.questHP = 0
        }

        let receivedHeal = 0
        if (amount < 1) {
            receivedHeal = Math.round(this.maxHp * amount)
        }
        else {
            receivedHeal = Math.round(amount)
        }
        console.log("received heal", this.name, receivedHeal)
        this.questHP = this.questHP + receivedHeal
        if (!isShield) {
            this.questHP = Math.min(this.questHP, this.maxHp)
        }
        //trigger OnHeal
    }
    sendAttack(params) {
        //determine attacker
        let deal = {
            atk: this.atk,
            matk: this.matk,
            acc: this.acc,
            crit: this.crit,
            dmg: 0,
            critMod: this.critMod
        }
        //console.log("deal", deal.critMod)

        if (params) {
            for (let statKey in params) {
                if (deal.hasOwnProperty(statKey)) {
                    //console.log("sendAttack", statKey)
                    deal[statKey] = params[statKey]
                }
            }

            // If it's true damage attack then assign 0 to nil atk\matk
            if (params.dmg) {
                if (!params.atk) {
                    deal["atk"] = 0
                }
                if (!params.matk) {
                    deal["matk"] = 0
                }
                // If only one attack type is in the attack, the other is assumed to be 0
            } else if (params.atk && !params.matk) {
                deal["matk"] = 0
            } else if (params.matk && !params.atk) {
                deal["atk"] = 0
            }

        }
        deal.attacker = this
        let target = this.getTarget();
        if (target.getClassName() == Party.getClassName()) {
            if (params && params.damageRatio) {
                deal.damageRatio = params.damageRatio
            } else {
                deal.damageRatio = this.getDamageRatio()
            }
        }
        //console.log("send attack", deal, params);
        for (let i = this.effects.length - 1; i >= 0; i--) {
            let effect = this.effects[i]
            if (effect.trigger == "OnAttack") {
                if (effect.dmgFunc) {
                    deal = effect.dmgFunc(deal)
                } else {
                    for (let statKey in effect.stats) {
                        deal[statKey] += effect.stats[statKey];
                    }
                }
            }
        }

        if (deal) {
            return this.getTarget().takeAttack(deal)
        }

        return null
    }
    setDefaultTarget(defaultTarget) {
        this.defaultTarget = defaultTarget
    }
    getTarget() {
        return this.defaultTarget
    }
    determineAbility(turn) {
        let abilityNum = (turn) % 5
        let curAbility = this.attackList[abilityNum]
        console.log(this.name + " uses " + curAbility);

        return curAbility
    }
    addEffect(data) {
        //console.log(this.name, "Adding effect", data.name, this.critMod);
        let curEffectIndex = -1
        for (let i = 0; i < this.effects.length; i++) {
            if (this.effects[i].name == data.name) {
                curEffectIndex = i;
                break;
            }
        }
        if (curEffectIndex == -1) {
            this.effects.push(this.basicMechanicService.copyMerchantLike(data))
            curEffectIndex = this.effects.length - 1
            if (data.stats) {
                this.effects[curEffectIndex].stats = this.basicMechanicService.copyMerchantLike(data.stats)
            }
        } else if (data.reversible) {
            this.removeEffect(curEffectIndex)
        } else if (data.stacks) {
            console.log("effect stacks!", data.name)
            //todo: stack after 10 turns?
            this.basicMechanicService.mergeStackEffect(this.effects[curEffectIndex].stats, data.stats)
        } else {
            console.log("Effect already applied", data.name);
            this.effects[curEffectIndex] = this.basicMechanicService.copyMerchantLike(data)
        }
        let curEffect = this.effects[curEffectIndex]
        if (curEffect && !curEffect.trigger && curEffect.turns) {
            console.log("add on turn", curEffect.name)
            curEffect.trigger = "OnTurn"
        }
        this.determineStats()
        //console.log("after effect", this.critMod)
    }
    removeEffect(idx) {
        console.log("todo: implement remove effect for combatant")
    }
    determineStats() {
        this.basicMechanicService.determineStats(this)
    }
    triggerDots() {
        for (let i = 0; i < this.effects.length; i++) {
            let effect = this.effects[i]
            if (effect.trigger == "DamageOnTurn") {
                console.log("triggering DamageOnTurn", effect.name);
                this.takeAttack(effect.stats)
                effect.turns--;
                if (effect.turns == 0) {
                    effect.remove = true
                }
                /*
                    Need to test in Merchant:
                    1) poison can miss on eva > 100
                    2) poison deal 0 damage after blocked once
                */
            }
        }
    }
    tryRemoveEffects() {
        let recalculateStats = false;
        let newEffects = []
        for (let i = 0; i < this.effects.length; i++) {
            let effect = this.effects[i]
            if (effect.turns <= 0 || effect.remove) {
                console.log("Effect", effect.name, "fade from", this.name);
                recalculateStats = true;
            } else {
                newEffects.push(effect)
            }
        }
        this.effects = newEffects;

        if (recalculateStats) {
            this.determineStats();
        }
    }
    reduceEffectsDuration() {
        for (let i = 0; i < this.effects.length; i++) {
            let effect = this.effects[i]
            if (effect.trigger == "DamageOnTurn" && !effect.remove) {
                continue;
            }
            //console.log("effect", effect.name, effect.turns)
            if (effect.trigger == "OnTurn"
                || effect.trigger == "OnDamage" && !isNaN(effect.turns)
                || effect.trigger == "DamageReceived" && !isNaN(effect.turns)) {
                effect.turns--;
            }
        }
    }
    removeAllEffects(flagDebuff) {
        let recalculateStats = false;
        let newEffects = []
        for (let i = 0; i < this.effects.length; i++) {
            let effect = this.effects[i]
            let isDebuff = effect.debuff == true
            if (isDebuff != flagDebuff) {
                newEffects.push(effect)
            } else {
                console.log("Effect", effect.name, "removed from", this.name);
                recalculateStats = true
            }
        }
        this.effects = newEffects;
        if (recalculateStats) {
            this.determineStats();
        }

    }
    takeAttack(data) {
        let basicMechanicService = this.basicMechanicService

        for (let i = this.effects.length - 1; i >= 0; i--) {
            let effect = this.effects[i]
            if (effect.trigger == "OnDamage" && !effect.remove) {
                if (effect.dmgFunc) {
                    data = effect.dmgFunc(data)
                } else {
                    for (let statKey in effect.stats) {
                        //console.log("OnDamage triggered", effect.name, statKey, effect.stats[statKey]);
                        data[statKey] *= effect.stats[statKey];
                    }
                }
                if (!effect.turns) {
                    effect.remove = true;
                }
            }
        }

        let hitChance = data.hitChance || basicMechanicService.calculateHitChance(data.acc, this.eva)
        //console.log("hit chance", hitChance)
        let attackerStatistic = data.attacker.statistic
        if (hitChance >= 100 || basicMechanicService.rollPercent(hitChance)) {
            let isCrit = basicMechanicService.rollPercent(data.crit);
            let critMod = 1
            if (isCrit) {
                critMod = data.critMod || data.attacker.critMod
                //console.log("crit!",critMod)
            }
            let damageRatio = data.damageRatio ? data.damageRatio[this.partyLocation] : null;

            data.physicalDamage = basicMechanicService.calculateDamage(data.atk, this.def, damageRatio) * critMod
            data.magicDamage = basicMechanicService.calculateDamage(data.matk, this.mdef, damageRatio) * critMod
            data.trueDamage = basicMechanicService.calculateTrueDamage(data.dmg, damageRatio)
            data.totalDamage = data.physicalDamage + data.magicDamage + data.trueDamage
            if (data.totalDamage > 0) {
                for (let i = this.effects.length - 1; i >= 0; i--) {
                    let effect = this.effects[i]
                    if (effect.trigger == "DamageReceived" && !effect.remove) {
                        if (effect.dmgFunc) {
                            effect.dmgFunc(data)
                        } else {
                            for (let statKey in effect.stats) {
                                //console.log("DamageReceived triggered", effect.name, statKey, effect.stats[statKey]);
                                data[statKey] *= effect.stats[statKey];
                            }
                        }
                        if (!effect.turns) {
                            effect.remove = true;
                        }
                    }
                }
                //damage can be reduced here: for example mana shield II for mage
                data.totalDamage = Math.round(data.physicalDamage + data.magicDamage + data.trueDamage)
            }

            let taken = this.takeDamage({
                trueDmg: data.trueDamage,
                mdmg: data.magicDamage,
                pdmg: data.physicalDamage
            })
            console.log(this.name + " takes " + (taken.pdmg + taken.mdmg) + " damage. Was (atk/matk/true dmg):",
                data.physicalDamage, data.magicDamage, data.trueDamage);
            this.statistic.recordDamageTaken(taken.pdmg, taken.mdmg)
            attackerStatistic.registerHit(taken.pdmg, taken.mdmg, isCrit)

            if (this.questHP <= 0) {
                this.isDead = true
                console.log(this.name, "dead")
            }

            return { totalDamage: data.totalDamage, atk: data.physicalDamage, matk: data.magicDamage, crit: isCrit }
            //console.log("test", this.name, this.questHP)
        } else {
            console.log(data.attacker.name, "miss");
            attackerStatistic.registerMiss()
            return { missed: true, hitChance: hitChance }
        }
    }
    takeDamage(dmg) {
        let taken = {
            pdmg: 0,
            mdmg: 0
        };
        if (dmg.trueDmg) {
            this.questHP -= dmg.trueDmg;
            let halfTrueDmg = Math.trunc(dmg.trueDmg / 2);
            taken.pdmg += halfTrueDmg;
            taken.mdmg += halfTrueDmg;
        }
        if (dmg.mdmg) {
            let takenMag = dmg.mdmg;
            this.questHP -= takenMag;
            taken.mdmg += takenMag;
        }
        if (dmg.pdmg) {
            let takenPhys = dmg.pdmg;
            this.questHP -= takenPhys;
            taken.pdmg += takenPhys;
        }

        return taken;
    }

    static getClassName() { return 'Combatant'; }
    getClassName() { return Combatant.getClassName(); }
    //Enemy
    getDamageRatio() {
        let party = this.getTarget();
        let aoe = [0, 0, 0, 0, 0, 0];
        let haveFrontRow = false;
        for (let i = 0; i < 3; i++) {
            let fr = party.frontRow[i]
            if (fr && fr.questHP > 0) {
                haveFrontRow = true;
                aoe[i * 2 + 1] = 1
            }
        }

        if (!haveFrontRow) {
            for (let i = 0; i < 3; i++) {
                let fr = party.backRow[i]
                if (fr && fr.questHP > 0) {
                    aoe[i * 2] = 1
                }
            }
        }

        let sum = aoe.reduce((cur, prev) => cur + prev);
        for (let i = 0; i < 6; i++) {
            if (aoe[i] == 1) {
                aoe[i] = 1 / sum;
            }
        }

        return aoe
    }
    getHpLoss() {
        let loss = Math.round(this.maxHp - this.questHP)//), 0, this.maxHp)
        if (loss >= this.maxHp) {
            return this.maxHp + " (Dead)"
        }
        return loss < 0 ? 0 : loss
    }
}

module.exports = Combatant