const angular = require('angular');
const abilityFunc = require("../data/abilityFunc")
const Combatant = require("./simulation/combatant")
const Party = require("./simulation/party")
const AgregatedResult = require("./simulation/agregatedResult")

service.$inject = ['basicMechanicService', "gradeService", "baseFuncService", "classInfoService"];
function service(basicMechanicService, gradeService, baseFuncService, classInfoService) {
    let self = this;

    self.questData = {
        quest: undefined
    }

    self.setSimulationQuest = function (quest) {
        self.questData.quest = quest;
    }

    self.doSimulation = function (party) {
        return self.singleSimulation(party, self.questData.quest)
    }

    function findMaxAvailableSkill(list, ap) { //list should be sorted by apCost desc        
        for (let i = 0; i < list.length; i++) {
            if (list[i].apCost <= ap) {
                return list[i];
            }
        }
    }

    function addPlainDamageToList(setup, skillList) {
        while (setup.list.length < 5) {
            let skill = findMaxAvailableSkill(skillList, setup.ap)
            setup.list.push(skill.name)
            setup.ap -= skill.apCost
        }
    }

    function createSetup(startingSpells, ap, skillList) {
        let setup = {
            list: [],
            ap: ap
        }

        startingSpells.forEach(x => {
            if (x.apCost <= setup.ap) {
                setup.list.push(x.name);
                setup.ap -= x.apCost;
            }
        })

        addPlainDamageToList(setup, skillList);
        return setup;
    }

    const mageClassId = 3
    const skillsToSilence = ["Iron Hide", "Harden", "Dragon Scales", "Dark Power",
        "Inner Fire", "Shadow Dance II", "Shadow Dance"]
    function proceedAutoPick(quest, party) {
        if (party.length == 1 && party[0].classId == mageClassId) {
            let mage = party[0];
            let prevCrit = mage.crit
            mage.crit = 0
            let attackList

            let apAvailable = basicMechanicService.getApPointsPossible(mage);
            if (apAvailable == 0) {
                attackList = ["Basic", "Basic", "Basic", "Basic", "Basic"]
            } else {
                let possibleSkills = classInfoService.getPossibleSkills(mageClassId, mage.level);
                let manashield = possibleSkills.find(x => x.name == "Mana Shield");
                let silence = possibleSkills.find(x => x.name == "Silence");

                let blasts = []
                let mms = []
                possibleSkills.forEach(skill => {
                    if (skill.name == "Mana Shield") {
                        manashield = skill;
                    } else if (skill.name == "Silence") {
                        silence = skill;
                    } else if (skill.name == "Magic Missile" || skill.name == "Magic Missile II") {
                        mms.push(skill);
                    } else {
                        blasts.push(skill);
                    }
                })
                blasts.sort((a, b) => b.apCost - a.apCost);
                mms.sort((a, b) => b.apCost - a.apCost);
                let results = []

                //full dps
                let setup = createSetup([], apAvailable, blasts);
                //console.log("full dps list", setup.list);
                mage.attackList = setup.list;
                let simResult = self.singleSimulation(party, quest);
                results.push({
                    result: simResult,
                    skills: setup.list
                });
                //full dps2
                for (let i = 0; i < mms.length; i++) {
                    setup = createSetup([mms[i]], apAvailable, blasts);
                    mage.attackList = setup.list;
                    simResult = self.singleSimulation(party, quest);
                    results.push({
                        result: simResult,
                        skills: setup.list
                    });
                }
                //manashield + full dps
                if (manashield) {
                    setup = createSetup([manashield], apAvailable, blasts);
                    mage.attackList = setup.list;
                    simResult = self.singleSimulation(party, quest);
                    results.push({
                        result: simResult,
                        skills: setup.list
                    });
                    //manashield+mm                        
                    for (let i = 0; i < mms.length; i++) {
                        setup = createSetup([manashield, mms[i]], apAvailable, blasts);
                        mage.attackList = setup.list;
                        simResult = self.singleSimulation(party, quest);
                        results.push({
                            result: simResult,
                            skills: setup.list
                        });
                    }
                    //2manashields
                    setup = createSetup([manashield, manashield], apAvailable, blasts);
                    mage.attackList = setup.list;
                    simResult = self.singleSimulation(party, quest);
                    results.push({
                        result: simResult,
                        skills: setup.list
                    });
                    //3manashields
                    setup = createSetup([manashield, manashield, manashield], apAvailable, blasts);
                    mage.attackList = setup.list;
                    simResult = self.singleSimulation(party, quest);
                    results.push({
                        result: simResult,
                        skills: setup.list
                    });
                }


                //add silence
                if (silence) {
                    let needSilence = false;
                    let turnToSilence
                    for (turnToSilence = 0; turnToSilence < quest.attackList.length; turnToSilence++) {
                        if (skillsToSilence.indexOf(quest.attackList[turnToSilence]) != -1) {
                            needSilence = true;
                            turnToSilence += 1; //index of turn tha need silence on it
                            break;
                        }
                    }

                    if (needSilence) {
                        let swapFunc = function (setup, turn) {
                            let t = turn || 1
                            if (turnToSilence != t) {
                                let temp = setup.list[turnToSilence];
                                setup.list[turnToSilence] = setup.list[t];
                                setup.list[t] = temp;
                            }
                        }
                        //manashield + silence
                        setup = createSetup([manashield, silence], apAvailable, blasts);
                        swapFunc(setup);
                        mage.attackList = setup.list;
                        simResult = self.singleSimulation(party, quest);
                        results.push({
                            result: simResult,
                            skills: setup.list
                        });
                        //manashield + silence + mm                        
                        setup = createSetup([manashield, silence, mms[mms.length - 1]], apAvailable, blasts);
                        swapFunc(setup);
                        mage.attackList = setup.list;
                        simResult = self.singleSimulation(party, quest);
                        results.push({
                            result: simResult,
                            skills: setup.list
                        });
                        //2x manashield + silence                        
                        setup = createSetup([manashield, manashield, silence], apAvailable, blasts);
                        swapFunc(setup, 2);
                        mage.attackList = setup.list;
                        simResult = self.singleSimulation(party, quest);
                        results.push({
                            result: simResult,
                            skills: setup.list
                        });

                    }

                }

                var getHpLoss = function (res) {
                    let hero = res.result.heroes[0]
                    return Math.max(hero.maxHp - hero.questHP, 0)
                }
                let bestSimulation = results[0]
                let bestGrade = gradeService.gradeToNum(bestSimulation.result.grade)
                let bestHpLoss = getHpLoss(bestSimulation)
                for (let i = 1; i < results.length; i++) {
                    let curSim = results[i];
                    let curGrade = gradeService.gradeToNum(curSim.result.grade)
                    let currentHpLoss = getHpLoss(curSim)

                    if (curGrade > bestGrade ||
                        (curGrade == bestGrade && currentHpLoss <= 0
                            && bestSimulation.result.duration > curSim.result.duration)
                        || (curGrade == bestGrade && currentHpLoss < bestHpLoss)) {
                        bestSimulation = curSim;
                        bestGrade = curGrade;
                        bestHpLoss = currentHpLoss;
                    }
                }

                if (bestGrade > 0) {
                    attackList = bestSimulation.skills;
                }
            }

            mage.crit = prevCrit
            mage.attackList = attackList
            return attackList;
        } else {
            console.warn("autoPickSkills implemented only for solo mage")
        }
    }

    self.deepSimulation = function (simulationOptions) {

        let quest = angular.copy(simulationOptions.quest)
        quest._amount = simulationOptions.amount
        let party = angular.copy(simulationOptions.party)

        let suggestedSkills;
        if (simulationOptions.autoPickSkills) {
            suggestedSkills = proceedAutoPick(quest, party);
        }

        if (simulationOptions.mode == "minMax") {
            let result = {}
            if (suggestedSkills != undefined) {
                result.suggestedSkills = suggestedSkills
            }

            result.normal = self.singleSimulation(party, quest)

            //party.forEach(h => h.crit = 100);
            //result.lucky = self.singleSimulation(party, quest)

            party.forEach(h => h.crit = 0);
            result.unlucky = self.singleSimulation(party, quest)

            //console.log("suggested skills after simulation", suggestedSkills, result);
            return result
        }

        return {
            normal: self.singleSimulation(party, quest)
        }
    }

    self.nTimeSimulation = function (party, quest) {
        let totalStats = []
        for (let i = 0; i < 1000; i++) {
            let singleResult = self.singleSimulation(party, quest)
            totalStats.push(singleResult)
        }

        let first = totalStats[0]
        let finalResult = new AgregatedResult(first, gradeService)
        for (let i = 1; i < 1000; i++) {
            finalResult.addResult(totalStats[i])
        }
        finalResult.computeResult()


        return finalResult;
    }

    self.singleSimulation = function (party, quest) {
        if (!angular.isArray(party) || party.length === 0) {
            console.warn("party required!", party)
            return;
        }
        ////console.log("test", JSON.stringify(party), JSON.stringify(quest))
        let enemy = initEnemy(quest);

        let combatParty
        let partyHeroes
        if (party.length == 1 && party[0].classId == mageClassId) {
            partyHeroes = party
            let hero = initHero(party[0], 2)
            hero.setDefaultTarget(enemy)
            combatParty = new Party([null, hero, null], [null, null, null], basicMechanicService)
        } else {
            partyHeroes = []
            let frontRow = [null, null, null]
            let backRow = [null, null, null]
            for (let i = 0; i < party.length; i++) {
                if (party[i] == undefined) { continue; }
                partyHeroes.push(party[i])
                let hero = initHero(party[i], i + 1)
                hero.setDefaultTarget(enemy)
                if (i < 3) {
                    frontRow[i] = hero
                } else {
                    backRow[i - 3] = hero
                }
            }
            combatParty = new Party(frontRow, backRow, basicMechanicService)
        }
        let speedModTotal = 0;
        for (let i = 0; i < party.length; i++) {
            if (party[i] == undefined) { continue; }
            if (party[i].speedMod){
                speedModTotal += party[i].speedMod;
            }
        }

        //console.log("enemy ready", enemy);
        enemy.setDefaultTarget(combatParty)
        //console.log("Party ready", combatParty);

        let isEnd = false;
        const turnMax = 200;
        let currentTurn = 0;
        let enemyStrikesFirst = enemy.isWeekly || false
        console.log("is enemy first", enemyStrikesFirst, enemy)
        self.actionsCount = 0;
        while (!isEnd && currentTurn <= turnMax) {
            //console.log("----------------------------------");
            //console.log("Turn started", currentTurn + 1);
            if (enemyStrikesFirst) {
                let enemyDmg = self.useAbility(enemy, currentTurn);

                isEnd = enemy.questHP <= 0 || combatParty.isDead();                
            }

            if (!isEnd) {
                combatParty.useAbilities(self.useAbility, currentTurn);
    
                isEnd = enemy.questHP <= 0 || combatParty.isDead();
            }

            if (!isEnd && !enemyStrikesFirst) {
                let enemyDmg = self.useAbility(enemy, currentTurn);

                isEnd = enemy.questHP <= 0 || combatParty.isDead();
            }
            currentTurn++;
        }

        let isWin = !combatParty.isDead() && enemy.questHP <= 0

        var hArray = []
        for (let i = 0; i < 3; i++) {
            let hero = combatParty.frontRow[i]
            if (hero) {
                hero.statistic.finalizeDpt(currentTurn)
                hArray.push(hero)
            }
        }
        for (let i = 0; i < 3; i++) {
            let hero = combatParty.backRow[i]
            if (hero) {
                hero.statistic.finalizeDpt(currentTurn)
                hArray.push(hero)
            }
        }

        let grade = isWin
            ? gradeService.getGrade(quest, currentTurn, partyHeroes)
            : "F";
        let gradeNumber = gradeService.gradeToNum(grade)

        let result = {
            isWin: isWin,
            heroes: hArray,
            enemy: enemy,
            duration: currentTurn,
            grade: grade,
            time: basicMechanicService.calculateQuestTime(quest, currentTurn, self.actionsCount, gradeNumber, speedModTotal),
            speedBonus: Math.min(speedModTotal, 50),
            resultText: isWin ? "Success" : "Fainted",
        }

        //console.log("----------------------------------");
        //console.log("time", result.time)
        //console.log("winner: " + (!result.isWin ? enemy.name : "party"));
        //console.log("fight ends on turn " + currentTurn);

        return result
    }

    function initEnemy(quest) {
        if (quest.isRare && quest._amount > 1) {
            quest._amount = 1
        }
        quest.acc = 999;
        let enemy = new Combatant(quest, basicMechanicService);

        return enemy;
    }

    function initHero(data, position) {
        let h = new Combatant(data, basicMechanicService, position);

        return h;
    }

    self.useAbility = function (combatant, turn) {
        combatant.tryRemoveEffects()
        let abilityName = combatant.determineAbility(turn);
        abilityFunc.abilities[abilityName](combatant, combatant.getTarget())
        self.actionsCount++
        combatant.triggerDots();
        combatant.reduceEffectsDuration();
    }
}

module.exports = service;