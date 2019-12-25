function timeFilter(){
    function getReadableDuration(duration) {
        if (duration < 60) {
            return duration + "s"
        }
        var minutes = Math.floor(duration / 60);
        var result;
        if (duration < 600) { //less than 10 minutes
            result = minutes + "m ";
            var seconds = duration % 60;
            if (seconds > 0) {
                result += " " + seconds + "s";
            }
        } else if (duration < 600 * 60) {//less than 10 hours				
            result = "~" + Math.floor(minutes / 60) + "h";
            minutes = minutes % 60;
            if (minutes > 0) {
                result += " " + minutes + "m";
            }
        } else {//more than 10 hours
            result = "~" + Math.round(minutes / 60) + "h";
        }
        return result;
    }

    return function(input){
        return getReadableDuration(input)
    }
}

module.exports = timeFilter