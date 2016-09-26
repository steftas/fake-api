// Define the `test app` module
var testApp = angular.module('hotelsTest', []);

// Define the controller
testApp.controller('testController', ['$scope', '$http',  function testController($scope, $http) {
    $scope.hotels = [];
    
    $scope.comments = {};
    //get hotels
    $scope.getHotels = function(minStars, maxPrice) {
      $scope.hotelError = false;

      $scope.getHotelsService(minStars, maxPrice, function(data) {
        $scope.hotels = data;
        $scope.orderProp = 'rating';
      });
    }

    //get hotels service
    $scope.getHotelsService = function(minStars, maxPrice, callback) {
      $http({
          method : "GET",
          url : "http://fake-hotel-api.herokuapp.com/api/hotels",
          params: { 
            count: 5,
            min_stars: minStars,
            max_price: maxPrice
          },
          dataType: 'json',
          headers: {
              'Content-Type': 'application/json'
          },
          }).then(function(res) {
              if(callback) {
                callback(res.data);
              }
          }).catch(function(e) {
            $scope.hotelError = true;
            $scope.error = "Sorry, something failed! Please refresh your page. :(";
          });
    }

    //get review by id
    $scope.getReviews = function(id, index) {
      $scope.reviewError = false;

      $scope.getReviewByIdService(id, function(data) {
        $scope.comments[index] = data;
        if (data.length == 0) {
            $scope.reviewError = true;
            $scope.error = "There is no review for this hotel.";
        }
      });
    }

    //get review by id service
    $scope.getReviewByIdService = function(id, callback) {
      $http({
          method : "GET",
          url : "http://fake-hotel-api.herokuapp.com/api/reviews",
          params: { hotel_id: id },
          dataType: 'json',
          headers: {
              'Content-Type': 'application/json'
          },
          }).then(function(res) {
              if(callback) {
                callback(res.data);
              }
          }).catch(function(e) {
            $scope.reviewError = true;
            $scope.error = "Sorry, something failed! :(";
          });
    }
}]);

testApp.directive('loading', ['$http' ,function ($http) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };
            scope.$watch(scope.isLoading, function (v) {
                if(v){
                    elm.show();
                }else{
                    elm.hide();
                }
            });
        }
    };
}]);