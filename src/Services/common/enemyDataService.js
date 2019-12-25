enemyDataService.$inject = [];
function enemyDataService() {
    var self = this;
    self.data = require("../../data/enemyData.json")
}

module.exports = enemyDataService;