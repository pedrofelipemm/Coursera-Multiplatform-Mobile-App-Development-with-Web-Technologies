angular.module('conFusion.controllers', [])
    
    //TODO: extract to another file
    .filter('favoriteFilter', function () {
        return function (dishes, favorites) {
            var out = [];
            for (var i = 0; i < favorites.length; i++) {
                for (var j = 0; j < dishes.length; j++) {
                    if (dishes[j].id === favorites[i].id){
                        out.push(dishes[j]);
                    }
                }
            }
            return out;
    }})

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $localStorage) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.loginData = $localStorage.getObject('userinfo', '{}');
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
            $localStorage.storeObject('userinfo', $scope.loginData);

            $timeout(function() {
                $scope.closeLogin();
            }, 1000);
        };
    })

    .controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout',
        function ($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout) {

        $scope.baseURL = baseURL;
        $scope.shouldShowDelete = false;

        $scope.favorites = favorites;
        $scope.dishes = dishes;

        $scope.toggleDelete = function () {
            $scope.shouldShowDelete = !$scope.shouldShowDelete;
        }

        $scope.deleteFavorite = function (id) {
            favoriteFactory.deleteFromFavorites(id);
            $scope.shouldShowDelete = false;
        }

        $scope.deleteFavorite = function (index) {

            $ionicPopup.confirm({
                title: 'Confirm Delete',
                template: 'Are you sure you want to delete this item?'
            })
            .then(function (res) {
                if (res) {
                    console.log('Ok to delete');
                    favoriteFactory.deleteFromFavorites(index);
                } else {
                    console.log('Canceled delete');
                }
            });

            $scope.shouldShowDelete = false;
        }

    }])

    .controller('MenuController', ['$scope', 'favoriteFactory', 'baseURL', '$ionicListDelegate', 'dishes',
        function ($scope, favoriteFactory, baseURL, $ionicListDelegate, dishes) {
    
        $scope.baseURL = baseURL;
        $scope.tab = 1;
        $scope.filtText = '';
        $scope.showDetails = false;
        $scope.showMenu = false;
        $scope.message = "Loading ...";
        $scope.dishes = dishes;    
        
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

        $scope.addFavorite = function (index) {
            favoriteFactory.addToFavorites(index);
            console.log(favoriteFactory.getFavorites());
            $ionicListDelegate.closeOptionButtons();
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

    .controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicPopover', '$ionicModal', 
        function ($scope, $stateParams, dish, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal) {

        $scope.baseURL = baseURL;
        $scope.dish = dish;

        $scope.comment = {};
        $scope.showDish = false;
        $scope.message="Loading ...";
    
        $scope.dish = menuFactory.get({id:parseInt($stateParams.id,10)})
            .$promise.then(
                function(response){
                    $scope.dish = response;
                    $scope.showDish = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }
            );

        $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover = popover;    
        });

        $scope.openPopover = function($event) {
            $scope.popover.show($event);
        };

        $scope.closePopover = function($event) {
            $scope.popover.hide();
        };        

        $scope.addFavorite = function () {
            favoriteFactory.addToFavorites($scope.dish.id);
            console.log(favoriteFactory.getFavorites());
            $scope.closePopover();
        };

        $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.commentModal = modal;
        });

        $scope.showCommentModal = function() {
            $scope.commentModal.show();
        };

        $scope.closeCommentModal = function() {
            $scope.commentModal.hide();
        };

        $scope.doComment = function () {

            $scope.comment.date = new Date().toISOString();
            $scope.comment.rating = parseInt($scope.comment.rating);
            $scope.dish.comments.push($scope.comment);

            menuFactory.update({id: $scope.dish.id}, $scope.dish);

            $scope.comment = {rating: 5, comment: "", author: "", date: ""};

            $scope.closeCommentModal();
            $scope.popover.hide();
        };

    }])

    .controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {
            
        $scope.mycomment = {rating:5, comment:"", author:"", date:""};
    
        $scope.submitComment = function () {
                
            $scope.mycomment.date = new Date().toISOString();
            console.log($scope.mycomment);
                
            $scope.dish.comments.push($scope.mycomment);
            menuFactory.update({id:$scope.dish.id}, $scope.dish);
                
            $scope.commentForm.$setPristine();
                
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
        }
    }])

    .controller('IndexController', ['$scope', 'baseURL', 'dish', 'promotion', 'leader',
        function ($scope, baseURL, dish, promotion, leader) {

        $scope.baseURL = baseURL;
        $scope.showDish = false;
        $scope.message="Loading ...";

        $scope.dish = dish;
        $scope.leader = leader;
        $scope.promotion = promotion;
    }])

    .controller('AboutController', ['$scope', 'baseURL', 'leaders', function($scope, baseURL, leaders) {
        $scope.baseURL = baseURL;
        $scope.ourHistory = 'Started in 2010, Ristorante con Fusion quickly established itself as a culinary icon par excellence in Hong Kong. With its unique brand of world fusion cuisine that can be found nowhere else, it enjoys patronage from the A-list clientele in Hong Kong.  Featuring four of the best three-star Michelin chefs in the world, you never know what will arrive on your plate the next time you visit us.';
        $scope.leaders = leaders;
    }]);