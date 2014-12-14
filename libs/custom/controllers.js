var loginControllers = angular.module('loginControllers',[]); 
var jsons=[];
var _user;
loginControllers.controller('FileUploadCtrl',['$http','$scope', '$rootScope', 'uploadManager','sessionService',function ($http,$scope, $rootScope, uploadManager,sessionService) {
    $scope.files = [];
    $scope.percentage = 0;
    $scope.upload = function () {

	 
	console.log("here in upload"+sessionService.get('user'));
		$http.post('./../Server/addUserUpload.php', {'uname':sessionService.get('user'),'uploads': jsons}
                    ).success(function(data, status, headers, config) {
						console.log("in succcess of uploads");
						console.log(data);
                    }).error(function(data, status) { 
						console.log("in Error of uploads");
						console.log(data);
                    });
    };

    $rootScope.$on('fileAdded', function (e, call) {
		
        $scope.files.push(call);
        $scope.$apply();
    });
	$rootScope.$on('getJson', function (e, call) {
        //console.log(call);
		var uploadObject={};
		uploadObject.treeData = call[0];
		uploadObject.xmlFilename = call[1];
		jsons.push(uploadObject);
		//console.log(JSON.stringify(uploadObject));
    });
	$rootScope.$on('getNode', function (e, call) {
		var index  = call[0];
		var nodeData = call[1];
		var fileName = call[2];
		//console.log(nodeData);
		nodeData =  textToJSONParser(nodeData);
		 //console.log(nodeData);
		var nodeMap = populateNodeDetailsMap(nodeData);
		 console.log(nodeMap);
		jsons[index].nodes = nodeMap;
		jsons[index].nodeFilename = fileName;
		//jsons.push(call);
    });
    $rootScope.$on('uploadProgress', function (e, call) {
		
        $scope.percentage = call;
        $scope.$apply();
    });
	$rootScope.$on('uploadFile', function (e, call) {
        
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
			$scope.passwordMatch = false;
			$scope.duplicate = false;
			if($scope.password === $scope.password_confirmation ){
			var hash_password= sha256_digest($scope.password);
			$http.post('./../Server/addUser.php', {'fname': $scope.fname, 'lname': $scope.lname, 'uname':$scope.username, 'email':$scope.email, 'password':hash_password}
                    ).success(function(data, status, headers, config) {
						console.log(data);
                        if(data == "Success"){
							$scope.isAdded = true;
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
			else{
				$scope.passwordMatch = true;
			}
		}

	};
	$('#register').on('hidden.bs.modal', function () {
		console.log("ended regiter modal");
})
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
$('#visualize').on('hidden.bs.modal', function () {
  console.log("here closed modal");
  $('#visualizeBody').empty();
  $('#displayBlock').empty();
})
$('#visualize').on('shown.bs.modal', function () {
    $(this).find('.modal-dialog').css({width:'auto',
                               height:'auto', 
                              'max-height':'100%'});
							  });
$scope.doVisualize = function(index) {
            //alert("I'm global foo!"+dataVar[0]);
			//console.log(jsons[index].nodes);
			console.log(jsons);
			var dataVar = jsons[index].treeData;
			var nodeMap = (jsons[index].nodes);
var width = 1000;
var height = 1000;

var cluster = d3.layout.cluster()
   .size([height, width-200]);

var diagonal = d3.svg.diagonal()
   .projection (function(d) { return [x(d.y), d.x];});

var svg = d3.select("#visualizeBody").append("svg")
   .attr("width",10000)
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
      .attr("r", 7.5)
	  .on("click",function(d){
	  $('#displayBlock').empty();
	  var key = getKeyFromName(d.name);
	  //console.log(nodeMap);
	  //console.log(nodeMap[key]);
	  if(nodeMap == undefined || nodeMap[key] == undefined){
		$('#displayBlock').append('<div style="max-width: 800px;" class="alert alert-danger" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><b> &nbsp;No node data found for <strong>'+ d.name +'</strong> &nbsp;&nbsp;</b></div>');
	  }
	  else{
	   doInit(nodeMap[key]);
	   }
	  });
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
function textToJSONParser(data){
//remove all the tabs from the data
 //alert("came here");
 //sconsole.log(data);
  data = data.replace(/\t/g, ' ');
  data = data.replace(/\r/g, '');
  //split the recieved data into multiple rows
  var split_Rows = data.split(/\n/g);
  // extract the first row of the data to fetch the ROW HEADERS from the file
  var first_Row=split_Rows[0].split(' ');
  var final_Object = [];
  for(var i=1; i< split_Rows.length;i++){
    var new_Row = split_Rows[i].split(' ');  
    if( new_Row.length >1){  //if the row is not empty
      var interm_Object ={};
      for(var j=0; j <first_Row.length;j++){
        interm_Object[first_Row[j]] = new_Row[j]; //create object[key] =value  for the whole row
      }
      //console.log(interm_Object); 
      final_Object.push(interm_Object); //add the create object for the particular row into the array
    }
  }
  return final_Object;
}
function populateNodeDetailsMap(jsonObject){
	var nodeDetailsMap = new Object(); 
   for(var z=0;z<jsonObject.length;z++){
        var temp  = jsonObject[z];

        if(nodeDetailsMap[temp.bacteria_id]){
            var nodeArray = nodeDetailsMap[temp.bacteria_id];
            nodeArray.push(temp);
        }else{
          nodeDetailsMap[temp.bacteria_id] = [temp];
        }
   }

   return nodeDetailsMap ;
}
function getKeyFromName(name){
var regExp = /\(([^)]+)\)/;
var matches = regExp.exec(name);
if(matches == undefined)
return null;
else
return matches[1];
}