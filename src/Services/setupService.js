setS.$inject = ['classInfoService'];
function setS(cInfoService) {
    var self = this;

    self.all = [];
    self.maxHeroCount = 12;

    self.addHero = function (classId, stats) {
        if (self.all.length >= self.maxHeroCount) {
            throw "Attempt to add more than " + self.maxHeroCount + " heroes!";
        }
        self.all.push(cInfoService.createHero(classId, stats));
    }

    self.findHeroPositionById = function (id) {
        let i = 0;
        while (i < self.all.length && self.all[i].id !== id) {
            i++;
        }

        return i > self.all.length ? -1 : i;
    }

    self.removeHero = function (pos) {
        self.all.splice(pos, 1);
    }

    self.loadSetup = function (data) {
        angular.copy(data, self.all);
        cInfoService.fixIdsAfterLoading(self.all);
        console.log('loaded', self.all);
    }
}


module.exports = setS;