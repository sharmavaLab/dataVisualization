var dataVisualization  = angular.module("dataVisualization",[
	'ngRoute',
	'ngCookies',
	'loginControllers'
]);


dataVisualization.config(['$routeProvider',function($routeProvider){
	$routeProvider.
		when('/login',{
			templateUrl: '../html/loginPartial.htm',
			controller: 'LoginController'
		}).
		when('/dashboard',{
			templateUrl: '../html/dashboardPartial.htm',
			controller: 'dashboardController'
		}).
		otherwise({
			redirectTo:'/login'
		});
}]);
dataVisualization.factory('sessionService',['$http',function(){
	return{
		set:function(key,value){
			return sessionStorage.setItem(key,value);
		},
		get:function(key,value){
			return sessionStorage.getItem(key,value);
		},
		destroy:function(key,value){
			return sessionStorage.removeItem(key);
		}
	};

}]);

