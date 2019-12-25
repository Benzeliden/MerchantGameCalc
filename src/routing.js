routing.$inject = ["$urlRouterProvider", "$stateProvider"];
function routing($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise("/party-simulation");

  $stateProvider.state("partySim", {
      url: "/party-simulation",
      component: "partySimulation"
  });
  $stateProvider.state("soloMage", {
      url: "/solo-mage",
      component: "soloMage"
  });
  $stateProvider.state("changelog", {
      url: "/changelog",
      component: "changelog"
  });
  $stateProvider.state("crafterSim", {
      url: "/crafter-simulation",
      component: "crafterSim"
  });
  $stateProvider.state("enchanterSim", {
      url: "/enchanter-simulation",
      component: "enchanterSim"
  });
}

transitionEvents.$inject = ["$transitions", "$urlService", "$window"];
function transitionEvents($transitions, $urlService, $window){

    $transitions.onSuccess({}, function(trans){

        try{
            if($window.ga){                
                $window.ga('set', 'page', $urlService.path());     
                $window.ga('send', 'pageview');     
            }else{
                console.log("debug mode",'set', 'page', $urlService.path())
            }
        }catch(e){            
        }
    })
}

export { routing, transitionEvents };