CIS.$inject = ["abilityInfoService"];
function CIS(abilityInfoService) {
	var self = this;
	var currentFreeId = 1;

	self.classData = require("../../data/classData.json");

	var defaultStats = {
		atk: 10, matk: 10, acc: 50, crit: 2, hp: 100, def: 100, mdef: 100, level: 60, critModItems: 0, speedMod: 0,
		atkPct: 0, matkPct: 0, accPct: 0, defPct: 0, mdefPct: 0, hpPct: 0, selectedPassive: "None"
	}

	self.createHero = function (classId, stats) {
		var index = classId - 1;
		var cD = self.classData[index];
		var finalStats = angular.extend({}, defaultStats, stats);

		return {
			name: cD.fullName,
			icon: cD.icon,
			id: currentFreeId++,
			classId: cD.id,

			selectedPassive: finalStats.selectedPassive,

			atk: self.fixNumber(finalStats.atk),
			matk: self.fixNumber(finalStats.matk),
			acc: self.fixNumber(finalStats.acc),
			crit: self.fixNumber(finalStats.crit),
			hp: self.fixNumber(finalStats.hp),
			def: self.fixNumber(finalStats.def),
			mdef: self.fixNumber(finalStats.mdef),

			atkPct: self.fixNumber(finalStats.atkPct),
			matkPct: self.fixNumber(finalStats.matkPct),
			accPct: self.fixNumber(finalStats.accPct),
			//crit: self.fixNumber(finalStats.crit),
			hpPct: self.fixNumber(finalStats.hpPct),
			defPct: self.fixNumber(finalStats.defPct),
			mdefPct: self.fixNumber(finalStats.mdefPct),

			critModItems: self.fixNumber(finalStats.critModItems),
			speedMod: self.fixNumber(finalStats.speedMod),

			level: self.fixNumber(finalStats.level)
		};
	}

	self.getDefaultStats = function () {
		return defaultStats;
	}

	self.getPossibleSkills = function (classId, level) {

		var classData = self.classData[classId - 1];
		let lvl = level || 60;
		if (!classData.skills || lvl < 10) {
			return abilityInfoService.getAbility("Basic")
		}

		let req = 5;
		let newList = []
		let i = 0;
		let skillCount = classData.skills.length;
		while (req < lvl && i < Math.min(7, skillCount)) {
			newList.push(abilityInfoService.getAbility(classData.skills[i]));
			i++;
			req += 5;
		}

		if (lvl > 50 && skillCount > 7) {
			newList.push(abilityInfoService.getAbility(classData.skills[7]));
		}

		return newList
	}

	self.getPassives = function (classId) {
		var classData = self.classData[classId - 1];
		return classData.passiveList;
	}

	self.getApAvailable = function (level) {
		if (level < 10) return 0;
		return Math.min(20, level / 2 | 0)
	}

	self.fixIdsAfterLoading = function (loaded) {
		currentFreeId = 1;
		angular.forEach(loaded, value => {
			value.id = currentFreeId++;
			if (!value.critModItems) {
				value.critModItems = 0;
			}
			if (!value.speedMod) {
				value.speedMod = 0;
			}
		});
	}

	//todo: separate service?
	self.fixNumber = function (num) {
		//todo: fix min\max
		if (!isFinite(num)) {
			return 0;
		}
		var parced = + num;
		if (parced < 0) {
			return 0;
		}
		if (parced > 9999) {
			return 9999;
		}

		return parced;
	}
}

module.exports = CIS;