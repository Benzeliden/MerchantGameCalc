service.$inject = [];
function service() {
    var self = this

    //taken from merchant code
    self.round = function(value, decimalPoints){
        let p = decimalPoints || 0;
        let exp = Math.pow(10, p)
        return Math.floor(value * exp + 0.5) / exp
    }

    self.clamp = function(value, min, max){
        if (value < min){
            return min;
        }
        if (value > max){
            return max;
        }
        return value;
    }

    self.copyTable = function(t){
        let result = {}

        for (let prop in t){
            result[prop] = t[prop];
        }
        return result
    }
}

module.exports = service