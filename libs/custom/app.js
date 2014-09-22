var lcsViz  = angular.module("lcs-viz-module",[]);

lcsViz.controller("lcs-viz-controller",function($scope,$http){
  
       $http.get("userData.json").then(function (response){
         $scope.data = response.data;
       });
});