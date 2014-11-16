var loginControllers = angular.module('loginControllers',[]); 
var jsons=[];
loginControllers.controller('FileUploadCtrl',['$scope', '$rootScope', 'uploadManager',function ($scope, $rootScope, uploadManager) {
    $scope.files = [];
    $scope.percentage = 0;
    $scope.upload = function () {
        uploadManager.upload();
        $scope.files = [];
    };

    $rootScope.$on('fileAdded', function (e, call) {
		
        $scope.files.push(call);
        $scope.$apply();
    });
	$rootScope.$on('getJson', function (e, call) {
        //console.log(call);
		jsons.push(call);
    });

    $rootScope.$on('uploadProgress', function (e, call) {
        $scope.percentage = call;
        $scope.$apply();
    });
}]);

loginControllers.controller("LoginController",function($scope,$http,$location,sessionService){
	
       $scope.login = function(){
	   if( typeof $scope.entered_username === 'undefined' || typeof $scope.entered_password === 'undefined');
	   else{
			var hash_password = sha256_digest($scope.entered_password);
			 $http.post('./../Server/authenticate.php', {'uname': $scope.entered_username, 'pswd': hash_password}
                    ).success(function(data, status, headers, config) {
					
                        if(data == "User Present"){
							$scope.isValid = false;
							//alert("User present");//redirect
							sessionService.set('user',$scope.entered_username);
							alert(sessionService.get('user'));
							$location.path('/dashboard');
							
						}
						else{
							
							$scope.isValid = true;
						}
                    }).error(function(data, status) { // called asynchronously if an error occurs
// or server returns response with an error status.
                       alert("error");
                    });
		}
	};
	
	$scope.register = function() {
		if( typeof $scope.fname === 'undefined' || typeof $scope.lname === 'undefined' ||typeof $scope.username === 'undefined' || typeof $scope.email === 'undefined' ||typeof $scope.password === 'undefined'){
			alert("Please enter all fields");
		}
		else{
			var hash_password= sha256_digest($scope.password);
			$http.post('./../Server/addUser.php', {'fname': $scope.fname, 'lname': $scope.lname, 'uname':$scope.username, 'email':$scope.email, 'password':hash_password}
                    ).success(function(data, status, headers, config) {
						console.log(data);
                        if(data == "Success"){
							$scope.isAdded = true;
							$scope.duplicate = false;
							$scope.closeModal  = true;
						}
						else{
							$scope.isAdded = false;
							$scope.duplicate = true;
							$scope.closeModal = false;
						}
                    }).error(function(data, status) { 
                       alert("error");
                    });
			
		}

	};
});

loginControllers.controller("dashboardController",function($scope,$http,$location,sessionService){

 $scope.user = sessionService.get('user');

 if($scope.user === null){
	$location.path('/login');
 }
//$http.get("userDataAAA.json").then(function (response){
		 //console.log(response);
         //$scope.data = demo;//response.data;
		 //console.log(JSON.stringify($scope.data));
  //     });
$scope.logout= function(){

	sessionService.destroy('user');
	$location.path('/login');

};
$('#visualize').on('shown.bs.modal', function () {
    $(this).find('.modal-dialog').css({width:'auto',
                               height:'auto', 
                              'max-height':'100%'});
							  });
$scope.doVisualize = function(dataVar) {
            //alert("I'm global foo!"+dataVar[0]);
			//console.log(JSON.stringify(dataVar));
			console.log(jsons[dataVar]);
			console.log(dataVar);
			dataVar = jsons[dataVar];
var width = 1000;
var height = 1000;

var cluster = d3.layout.cluster()
   .size([height, width-200]);

var diagonal = d3.svg.diagonal()
   .projection (function(d) { return [x(d.y), d.x];});

var svg = d3.select("#visualizeBody").append("svg")
   .attr("width",width)
   .attr("height",height)
   .attr("transform", "rotate(0)")//change
   .append("g")
   .attr("transform","translate(100,0)");

var xs = [];
var ys = [];

function getXYfromJSONTree(node){
   xs.push(node.x);
   ys.push(node.y);
   if(typeof node.children != 'undefined'){
      for ( j in node.children){
         getXYfromJSONTree(node.children[j]);
      }
   }
}

var ymax = Number.MIN_VALUE;
var ymin = Number.MAX_VALUE;

//d3.json("dendrogram02Bacteria.json", function(error, json){
   getXYfromJSONTree(dataVar);
   var nodes = cluster.nodes(dataVar);
   var links = cluster.links(nodes);
   nodes.forEach( function(d,i){
      if(typeof xs[i] != 'undefined'){
         d.x = xs[i];
      }
      if(typeof ys[i] != 'undefined'){
         d.y = ys[i];
      }
   });
   nodes.forEach( function(d){
      if(d.y > ymax)
         ymax = d.y;
      if(d.y < ymin)
         ymin = d.y;
   });
   x = d3.scale.linear().domain([ymin, ymax]).range([0, width-200]);
   xinv = d3.scale.linear().domain([ymax, ymin]).range([0, width-200]);
   var link = svg.selectAll(".link")
      .data(links)
      .enter().append("path")
      .attr("class","link")
      .attr("d", diagonal);
   var node = svg.selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class","node")
      .attr("transform", function(d) {
         return "translate(" + x(d.y) + "," + d.x + ")";
      });
   node.append("circle")
      .attr("r", 4.5);
   node.append("text")
      .attr("dx", function(d) { return d.children ? -8 : 8; })
      .attr("dy", 2)
      .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
      .text( function(d){ return d.name;});
   var g = d3.select("svg").append("g")
      .attr("transform","translate(100,100)");
    //});
        };
});