const AgregatedStatistic = require("./agregatedStatistic")

class AgregatedResult {
    constructor(result, gradeService) {
        this.totalRuns = 0;
        this.heroes = []
        this.grades = [0, 0, 0, 0, 0, 0]
        this.timePerGrade = [0, 0, 0, 0, 0, 0]

        for (let i = 0; i < result.heroes.length; i++) {
            this.heroes[i] = new AgregatedStatistic(result.heroes[i])
        }

        this.isWinBest = this.isWinWorst = result.isWin
        this.gradeBest = this.gradeWorst = gradeService.gradeToNum(result.grade)
        this.grades[this.gradeBest] = 1;
        this.durationBest = this.durationWorst = result.duration
        this.timePerGrade[this.gradeBest] = result.time
        this.speedBonus = result.speedBonus
        this.gradeService = gradeService
        this.totalRuns++;
    }

    addResult(result) {
        this.totalRuns++;
        for (let i = 0; i < result.heroes.length; i++) {
            this.heroes[i].addHero(result.heroes[i])
        }
        if (result.isWin) {
            this.isWinBest = result.isWin;
        }
        if (!result.isWin) {
            this.isWinWorst = result.isWin;
        }
        let resGrade = this.gradeService.gradeToNum(result.grade)

        this.grades[resGrade]++;
        if (this.gradeWorst > resGrade) {
            this.gradeWorst = resGrade;
        } else if (this.gradeBest < resGrade) {
            this.gradeBest = resGrade;
        }
        if (this.durationWorst < result.duration) {
            this.durationWorst = result.duration;
        } else if (this.durationBest > result.duration) {
            this.durationBest = result.duration;
        }
        this.timePerGrade[resGrade] += result.time
    }

    computeResult() {
        if (this.grades[0] == 0) {
            this.resultText = "Success";
        } else if (this.grades[0] == this.totalRuns) {
            this.resultText = "Fainted";
        } else {
            this.resultText = 100 * (this.totalRuns - this.grades[0]) / this.totalRuns + " % Success"
        }
        let grade = ""
        let newTimePerGrade = []
        for (let i = 0; i < this.grades.length; i++) {
            let c = this.grades[i]
            if (c > 0) {
                grade += this.gradeService.numToGrade(i) + " " + (100 * this.grades[i] / this.totalRuns) + "%. "
                
                newTimePerGrade.push({
                    grade : this.gradeService.numToGrade(i),
                    time: Math.round(this.timePerGrade[i] / c)
                })
            }
        }
        this.timePerGrade = newTimePerGrade
        this.grade = grade

        if (this.durationBest == this.durationWorst) {
            this.duration = this.durationBest;
        } else {
            this.duration = "from " + this.durationBest + " to " + this.durationWorst
        }

        for (let i = 0; i < this.heroes.length; i++) {
            this.heroes[i].finalize()
        }
    }
}

module.exports = AgregatedResult