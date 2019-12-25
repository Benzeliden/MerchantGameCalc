describe('setupService test', function () {
    beforeEach(angular.mock.module('myApp'));
    var setupService;
    beforeEach(inject(function(_setupService_){
        setupService = _setupService_;
    }));

    var heroCap = 12;

    describe('max heroes count', function () {
        it('should be ' + heroCap, function () {
            
            expect(setupService.maxHeroCount).toBe(heroCap);
            
        });

        it('should fail when adding more than ' + heroCap + ' heroes', function(){
            function testAdd(){
                setupService.addHero(1);
            }

            for(var i=0;i<heroCap;i++){
                expect(testAdd).not.toThrow();
            }
            expect(testAdd).toThrow();
        });
    });

});