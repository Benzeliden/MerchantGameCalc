localStorageService.$inject = ['$q'];
function localStorageService($q) {
    var self = this;
    const saveKey = "merchantSetupV2";

    self.isAvailable = test();
    self.checkPreviousSaveExist = function () {
        return localStorage.getItem(saveKey) !== undefined;
    }
    updateStatus();

    self.saveSetup = function (setup) {
        var deferred = $q.defer();
        if (!self.isAvailable) {
            deferred.reject("Storage is not available");
            return deferred.promise;
        }
        var json = JSON.stringify({
            setup: setup,
            //mage: mage
        });
        localStorage.setItem(saveKey, json);
        deferred.resolve();
        return deferred.promise;
    }

    self.loadSetup = function () {
        var deferred = $q.defer();
        if (!self.checkPreviousSaveExist()) {
            deferred.reject('Save doesn\'t exist');
            return deferred.promise;
        }
        var result = localStorage.getItem(saveKey);
        deferred.resolve(JSON.parse(result));
        return deferred.promise;
    }

    function test() {
        try {
            var x = "test_storage";
            localStorage.setItem(x, x);
            localStorage.removeItem(x);
            return true;
        } catch (e) {
            return false;
        }
    }

    function updateStatus() {
        if (!self.isAvailable) {
            self.status = "Local storage is not available";
        } else {
            if (localStorage.getItem(saveKey)) {
                self.status = "Previous save exist";
            } else {
                const previousVersions = ["merchantSetup"]
                //fallback
                let i = 0;
                while (i < previousVersions.length) {
                    var prevSave = localStorage.getItem(previousVersions[i])
                    if (prevSave) {
                        localStorage.setItem(saveKey, prevSave);
                        self.status = "Previous save exist";
                        break;
                    }
                    i++;
                }
                if (!self.status) {
                    self.status = "Previous save not exist";
                }
            }
        }
    }
}

module.exports = localStorageService;