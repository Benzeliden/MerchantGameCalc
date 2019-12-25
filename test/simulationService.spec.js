import { R_OK } from "constants";

describe('simulation service test', function () {
    beforeEach(angular.mock.module('myApp'));
    var simService;
    var mage1 = { "name": "Mage", "id": 2, "classId": 3, "atk": 31, "matk": 1013, "acc": 244, "crit": 0, "hp": 999, "def": 100, "mdef": 100, "level": 60, "critMod": 2 }
    var war1 = { "name": "Warrior", "id": 2, "classId": 1, "atk": 222, "matk": 10, "acc": 200, "crit": 0, "hp": 999, "def": 100, "mdef": 100, "level": 60, "critMod": 2 }
    var bard1 = { "name": "Bard", "id": 3, "classId": 9, "atk": 50, "matk": 50, "acc": 244, "crit": 0, "hp": 999, "def": 100, "mdef": 100, "level": 60, "critMod": 2 }
    var zerk1 = { "name": "Berserker", "id": 4, "classId": 4, "atk": 1200, "atkPct": 10, "selectedPassive": "Might", "matk": 10, "acc": 244, "crit": 0, "hp": 999, "def": 100, "mdef": 100, "level": 60, "critMod": 2 }
    var rogue100crit = {
        "name": "Rogue",
        "id": 1,
        "classId": 2,
        "atk": 660,
        "atkPct": 10,
        "matk": 10,
        "acc": 222,
        "crit": 100,
        "critMod":2,
        "hp": 999,
        "def": 100,
        "mdef": 100,
        "level": 60
    }
    var sin100crit = { "name": "Assassin", "id": 6, "classId": 6, "atk": 500, "matk": 10, "acc": 200, "crit": 100, "hp": 999, "def": 100, "mdef": 100, "level": 60, "critModItems": 10 }
    var partyMage = [null, mage1];
    var partyBard = [null, bard1];

    var questGnollShaman = { "name": "Gnoll Shaman", "atk": 5, "matk": 75, "def": 35, "mdef": 45, "hp": 240, "attackList": ["Weaken", "Basic", "Mind Blast", "Basic", "Basic"], "eva": 45, "icon": "ico-enemy-Quests_Region_3_Icn_Gnoll_Shaman", "partySize": 1, "region": 3, "questType": 3, "levelReq": 25, "isWeekly": false, "$$hashKey": "object:86", "_amount": 1, "acc": 999 }
    var questDummy = {
        "name": "Dummy",
        "atk": 100,
        "matk": 100,
        "def": 0,
        "mdef": 0,
        "hp": 1000,
        "attackList": [
            "Basic",
            "Basic",
            "Basic",
            "Basic",
            "Basic"
        ],
        "eva": 10,
        "partySize": 3,
        "region": 3,
        "questType": 5,
        "levelReq": 27,
        "isWeekly": false,
        "_amount": 1
    }

    beforeEach(inject(function (_simulationService_) {
        simService = _simulationService_;
    }));


    describe('Mana Shield II', function () {
        it('should not fail ', function () {
            mage1.attackList = ["Mana Shield II", "Mind Blast II", "Mind Blast", "Basic", "Basic"]

            var result
            expect(function () {
                result = simService.singleSimulation(partyMage, questGnollShaman)
            }).not.toThrow();

            var mageHero = result.heroes[0]
            expect(mageHero.statistic.mdmgTaken).toBe(0)
        });
    });

    describe("Berserker", function () {
        it("Enrage added to passive", function () {
            var dummyCopy = angular.copy(questDummy)
            zerk1.attackList = ["Enrage", "Basic", "Basic", "Basic", "Basic"]
            var result
            expect(function () {
                result = simService.singleSimulation([null, zerk1], questDummy)
            }).not.toThrow();

            var zerkHero = result.heroes[0];
            expect(zerkHero.baseStats.atk).toBe(1000)
            expect(zerkHero.statistic.pdmgDeal).toBe(1800);
        })
    })

    describe('Bard skills', function () { 
        it('Serenade works', function () {
            var dummyCopy = angular.copy(questDummy)
            dummyCopy.hp = 10
            bard1.attackList = ["Serenade", "Basic", "Basic", "Basic", "Basic"]
            var result

            expect(function () {
                result = simService.singleSimulation(partyBard, dummyCopy)
            }).not.toThrow();

            var bardHero = result.heroes[0];
            expect(bardHero.statistic.pdmgTaken).toBe(50)
        });
        it('Song of courage works', function () {
            var dummyCopy = angular.copy(questDummy)
            dummyCopy.hp = 10000
            var party = [zerk1, rogue100crit, null, bard1];
            bard1.attackList = ["Song of Courage", "Song of Courage", "Basic", "Basic", "Basic"]
            rogue100crit.attackList = ["Basic", "Basic", "Basic", "Basic", "Basic"]
            zerk1.attackList = ["Basic", "Basic", "Slash II", "Slash II", "Basic"]

            var result

            expect(function () {
                result = simService.singleSimulation(party, dummyCopy)
            }).not.toThrow();

            var zerkHero = result.heroes[0];
            var rogueHero = result.heroes[1];
            var bardHero = result.heroes[2];

            var expectedC = 0.08 + 0.08;

            expect(zerkHero.baseStats.atk).toBe(1000)
            expect(zerkHero.atk).toBeCloseTo(1000 * (1.2 + expectedC), 2)
            expect(rogueHero.baseStats.atk).toBeCloseTo(600, 2)
            expect(rogueHero.atk).toBeCloseTo(600 * (1.1 + expectedC), 2)
        }) 
        it("Poem of Focus works and sin crit skill works", function () {
            var party = [null, rogue100crit, sin100crit, bard1];
            bard1.attackList = ["Poem of Focus", "Basic", "Basic", "Basic", "Basic"]
            rogue100crit.attackList = ["Basic", "Basic", "Basic", "Basic", "Basic"]
            sin100crit.attackList = ["Stab II", "Basic", "Basic", "Basic", "Basic"]

            var result
            expect(function () {
                result = simService.singleSimulation(party, questDummy)
            }).not.toThrow();

            var rogueHero = result.heroes[0];
            expect(rogueHero.statistic.pdmgDeal).toBe(660 * 4.5);

            var sinCritMod = 2.1 + 2.5 + 1
            var sinHero = result.heroes[1];
            expect(sinHero.statistic.pdmgDeal).toBeCloseTo(500 * 2.3 * sinCritMod, 2);
        })
    });

    describe("Taunt skill", function () {
        it("works on basic attack", function () {
            var dummyCopy = angular.copy(questDummy)
            dummyCopy.hp = 10
            mage1.attackList = ["Silence", "Mind Blast II", "Mind Blast", "Basic", "Basic"]
            war1.attackList = ["Taunt", "Basic", "Basic", "Basic", "Basic"]

            var party = [mage1, war1];
            var result
            expect(function () {
                result = simService.singleSimulation(party, dummyCopy)
            }).not.toThrow();

            var mageHero = result.heroes[0];
            var warHero = result.heroes[1];
            expect(mageHero.statistic.pdmgTaken).toBe(0)
            expect(mageHero.statistic.mdmgTaken).toBe(0)
            expect(warHero.statistic.pdmgTaken).toBe(50)
            expect(warHero.statistic.mdmgTaken).toBe(50)
        })
        it("works on aoe", function () {
            var dummyCopy = angular.copy(questDummy)
            dummyCopy.hp = 10
            dummyCopy.attackList = ["Dark Flame", "Basic", "Basic", "Basic", "Basic"]
            mage1.attackList = ["Silence", "Mind Blast II", "Mind Blast", "Basic", "Basic"]
            war1.attackList = ["Taunt", "Basic", "Basic", "Basic", "Basic"]

            var party = [mage1, war1];
            var result
            expect(function () {
                result = simService.singleSimulation(party, dummyCopy)
            }).not.toThrow();

            var mageHero = result.heroes[0];
            var warHero = result.heroes[1];
            expect(mageHero.statistic.pdmgTaken).toBe(0)
            expect(mageHero.statistic.mdmgTaken).toBe(0)
            expect(warHero.statistic.pdmgTaken).toBe(50)
            expect(warHero.statistic.mdmgTaken).toBe(50)

        })
    })

    describe("Cheap shot", function(){
        it("should deal only true damage", function(){
            var rogue = angular.copy(rogue100crit)
            rogue.attackList = ["Cheap Shot", "Basic", "Basic", "Basic", "Basic"]
            var dummyCopy = angular.copy(questDummy)
            dummyCopy.hp = 100

            var result
            expect(function () {
                result = simService.singleSimulation([null, rogue], dummyCopy)
            }).not.toThrow();

            var rogueHero = result.heroes[0];
            var expectedDmg = 660 * 1.1 * 0.5
            expect(rogueHero.statistic.pdmgDeal).toBeCloseTo(expectedDmg, 2)
            expect(rogueHero.statistic.mdmgDeal).toBeCloseTo(expectedDmg, 2)

        })
    })
});