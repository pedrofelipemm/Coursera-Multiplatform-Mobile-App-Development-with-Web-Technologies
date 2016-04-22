angular.module('conFusion.controllers', [])

    .controller('AppCtrl', function($scope, $ionicModal, $timeout) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.loginData = {};
        $scope.reservation = {};

        $ionicModal.fromTemplateUrl('templates/reserve.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.reserveform = modal;
        });

        $scope.closeReserve = function() {
            $scope.reserveform.hide();
        };

        $scope.reserve = function() {
            $scope.reserveform.show();
        };

        $scope.doReserve = function() {
            console.log('Doing reservation', $scope.reservation);

            // Simulate a reservation delay. Remove this and replace with your reservation
            // code if using a server system
            $timeout(function() {
                $scope.closeReserve();
            }, 1000);
        };

        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.closeLogin = function() {
            $scope.modal.hide();
        };

        $scope.login = function() {
            $scope.modal.show();
        };

        $scope.doLogin = function() {
            console.log('Doing login', $scope.loginData);

            $timeout(function() {
                $scope.closeLogin();
            }, 1000);
        };
    })

  .controller('MenuController', ['$scope', 'menuFactory', 'baseURL', function($scope, menuFactory, baseURL) {
    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showMenu = false;
    $scope.message = "Loading ...";
            
    menuFactory.getDishes().query(
      function(response) {
        $scope.dishes = response;
        $scope.showMenu = true;
      },
      function(response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
      });

                
    $scope.select = function(setTab) {
      $scope.tab = setTab;
      
      if (setTab === 2) {
        $scope.filtText = "appetizer";
      } else if (setTab === 3) {
        $scope.filtText = "mains";
      } else if (setTab === 4) {
        $scope.filtText = "dessert";
      } else {
        $scope.filtText = "";
      }
    };

    $scope.isSelected = function (checkTab) {
      return ($scope.tab === checkTab);
    };
    
    $scope.toggleDetails = function() {
      $scope.showDetails = !$scope.showDetails;
    };
  }])

  .controller('ContactController', ['$scope', function($scope) {

    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
    
    $scope.channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];;
    $scope.invalidChannelSelection = false;
                        
  }])

  .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {
            
    $scope.sendFeedback = function() {
        
      console.log($scope.feedback);
        
      if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
        $scope.invalidChannelSelection = true;
        console.log('incorrect');
      } else {
        $scope.invalidChannelSelection = false;
        feedbackFactory.save($scope.feedback);
        $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
        $scope.feedback.mychannel="";
        $scope.feedbackForm.$setPristine();
        console.log($scope.feedback);
      } 
    };
  }])

  .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', 'baseURL', function($scope, $stateParams, menuFactory, baseURL) {
    $scope.baseURL = baseURL;            
    $scope.dish = {};
    $scope.showDish = false;
    $scope.message="Loading ...";
    
    $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id,10)})
      .$promise.then(
        function(response){
          $scope.dish = response;
          $scope.showDish = true;
        },
        function(response) {
          $scope.message = "Error: "+response.status + " " + response.statusText;
        }
      );
  }])

  .controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {
            
    $scope.mycomment = {rating:5, comment:"", author:"", date:""};
    
    $scope.submitComment = function () {
                
      $scope.mycomment.date = new Date().toISOString();
      console.log($scope.mycomment);
                
      $scope.dish.comments.push($scope.mycomment);
      menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);
                
        $scope.commentForm.$setPristine();
                
        $scope.mycomment = {rating:5, comment:"", author:"", date:""};
    }
  }])

  .controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', 'baseURL', function($scope, menuFactory, corporateFactory, baseURL) {

    $scope.baseURL = baseURL;
    $scope.leader = corporateFactory.get({id:3});
    $scope.showDish = false;
    $scope.message="Loading ...";
    $scope.dish = menuFactory.getDishes().get({id:0})
      .$promise.then(
        function(response){
          $scope.dish = response;
          $scope.showDish = true;
        },
        function(response) {
          $scope.message = "Error: "+response.status + " " + response.statusText;
        });
    $scope.promotion = menuFactory.getPromotion().get({id:0});
  }])

  .controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', function($scope, menuFactory, corporateFactory) {
                                        
    $scope.leader = corporateFactory.get({id:3});
    $scope.showDish = false;
    $scope.message="Loading ...";
    $scope.dish = menuFactory.getDishes().get({id:0})
      .$promise.then(
        function(response){
          $scope.dish = response;
          $scope.showDish = true;
        },  
        function(response) {
          $scope.message = "Error: "+response.status + " " + response.statusText;
        }
      );
    $scope.promotion = menuFactory.getPromotion().get({id:0});         
  }])

  .controller('AboutController', ['$scope', 'corporateFactory', 'baseURL', function($scope, corporateFactory, baseURL) {
    $scope.baseURL = baseURL;
    $scope.ourHistory = 'Started in 2010, Ristorante con Fusion quickly established itself as a culinary icon par excellence in Hong Kong. With its unique brand of world fusion cuisine that can be found nowhere else, it enjoys patronage from the A-list clientele in Hong Kong.  Featuring four of the best three-star Michelin chefs in the world, you never know what will arrive on your plate the next time you visit us.';
    $scope.leaders = corporateFactory.query();
            
  }]);