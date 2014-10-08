var lcsViz  = angular.module("lcs-viz-module",[]);

lcsViz.controller("lcs-viz-controller",function($scope,$http){
	
       $http.get("userData.json").then(function (response){
         $scope.data = response.data;
       });
});
lcsViz.controller("lcs-login-controller",function($scope,$http){
	
       $scope.login = function() {
	   if( typeof $scope.entered_username === 'undefined' || typeof $scope.entered_password === 'undefined');
	   else{
				/* var request = $http({
                    method: "post",
                    url: "./../Server/demo.php",
                    data:$.param({"username":"someuser","password": "somepass"}),
					headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
                });
 
                // Store the data-dump of the FORM scope.
                request.success(
                    function( html ) {
					
						alert(html);
                        $scope.cfdump = html;
 
                    }
			);*/
			
			 $http.post('./../Server/authenticate.php', {'uname': $scope.entered_username, 'pswd': $scope.entered_password}
                    ).success(function(data, status, headers, config) {
                        if(data == "User Present"){
							$scope.isValid = false;
							alert("User present");
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
});


lcsViz.run(function($rootScope) {
 $rootScope.doVisualize = function(dataVar) {
            //alert("I'm global foo!"+dataVar[0]);
var width = 1000;
var height = 1000;

var cluster = d3.layout.cluster()
   .size([height, width-200]);

var diagonal = d3.svg.diagonal()
   .projection (function(d) { return [x(d.y), d.x];});

var svg = d3.select("#visualizeBody").append("svg")
   .attr("width",width)
   .attr("height",height)
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
   getXYfromJSONTree(dataVar[0]);
   var nodes = cluster.nodes(dataVar[0]);
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