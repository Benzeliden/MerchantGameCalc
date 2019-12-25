service.$inject = [];
function service() {
    var self = this;

    var basicMage = {
        atk: 11,
        matk: 500,
        acc: 100,
        crit: 0,
        hp: 630,
        def: 100,
        mdef: 100,
        name: "Mage",
        level: 60,
        classId: 3
    }

    self.getMage = function () {
        return basicMage;
    }

    self.loadMage = function (mage) {
        angular.extend(basicMage, mage)
    }
}

module.exports = service;