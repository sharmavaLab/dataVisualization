var dataVisualization  = angular.module("dataVisualization",[
	'ngRoute',
	'ngCookies',
	'loginControllers'
]);
dataVisualization.factory('uploadManager', function ($rootScope) {
    var _files = [];
    return {
        add: function (file) {
            _files.push(file);
            $rootScope.$broadcast('fileAdded', file.files[0].name);
        },
        clear: function () {
            _files = [];
        },
        files: function () {
            var fileNames = [];
            $.each(_files, function (index, file) {
                fileNames.push(file.files[0].name);
            });
            return fileNames;
        },
        upload: function () {
            $.each(_files, function (index, file) {
                file.submit();
            });
            this.clear();
        },
        setProgress: function (percentage) {
            $rootScope.$broadcast('uploadProgress', percentage);
        }
    };
});

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
dataVisualization.directive('upload', ['uploadManager', function factory(uploadManager) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).fileupload({
                dataType: 'text',
                add: function (e, data) {
				var file = data.files[0];
				console.log(file);
    var start =  0;
    var stop = file.size - 1;

    var reader = new FileReader();

    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) { // DONE == 2
        console.log( evt.target.result);
       
      }
    };

    var blob= file.slice(start, stop+1);
    reader.readAsBinaryString(blob);
  
                    uploadManager.add(data);
                },
                progressall: function (e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    uploadManager.setProgress(progress);
                },
                done: function (e, data) {
                    uploadManager.setProgress(0);
                }
            });
        }
    };
}]);


