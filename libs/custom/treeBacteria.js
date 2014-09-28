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

d3.json("dendrogram02Bacteria.json", function(error, json){
   getXYfromJSONTree(json);
   var nodes = cluster.nodes(json);
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
    });