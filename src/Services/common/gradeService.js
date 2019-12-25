service.$inject = ["baseFuncService"];
function service(baseFuncService) {
    var self = this

    function getStartingGrade(quest, party) {
        let avgLevel = party.reduce((prev, cur) => prev + cur.level, 0) / party.length;

        let grade = baseFuncService.round(1.3 + (avgLevel + quest.region * 5) / (quest.levelReq + quest.region * 5), 2)
        grade = baseFuncService.clamp(grade, 1, 4.5);
        if (quest.isRare) {
            grade -= 0.5;
        }
        return grade
    }

    function getFinalGrade(quest, turns, startGrade) {
        let grade = 0
        switch (quest.questType) {
            case 1:
                grade = baseFuncService.clamp(4 - turns, -1, 2);
                break;
            case 2:
                grade = (4 + quest.region * 2 - turns) / 4;
                break;
            case 3:
                grade = (8 + quest.region * 3 - turns) / 4;
                break;
            case 4:
                grade = (12 + quest.region * 3 - turns) / 4
                break;
            case 5:
                grade = (16 + quest.region * 4 - turns) / 4
                break;
            case 6:
                grade = (20 + quest.region * 5 - turns) / 4
                break;
        }

        grade += startGrade
        return baseFuncService.clamp(baseFuncService.round(grade), 1, 5)
    }

    const gradeArray = ["F", "D", "C", "B", "A", "S"]
    const gradeMapping = {
        "F": 0,
        "D": 1,
        "C": 2,
        "B": 3,
        "A": 4,
        "S": 5,
    }

    self.getGrade = function (quest, turns, party) {
        let grade = getStartingGrade(quest, party);

        grade = getFinalGrade(quest, turns, grade);

        return self.numToGrade(grade);
    }

    self.numToGrade = function(grade){
        return gradeArray[grade]
    }

    self.gradeToNum = function (grade) {
        return gradeMapping[grade]
    }
}

module.exports = service