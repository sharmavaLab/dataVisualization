function doInit(){
  var currentNodeData = readNodeDetails("textData");
  populateNodeMap(currentNodeData);
}

function populateNodeMap(data){ // starting point for creating the structures.
  var valueArray = new Array();
   for(var x=0;x<data.length;x++){
        var tuple = data[x];
        var newNodeObject = new NodeStructure();
        newNodeObject.bacteria_id = tuple.bacteria_id;
        newNodeObject.gene_begin = tuple.gene_begin;
        newNodeObject.gene_end = tuple.gene_end;
        newNodeObject.gene_direction = tuple.gene_direction;
        newNodeObject.gene_name = tuple.gene_name;
        newNodeObject.CRISPR_type = tuple.CRISPR_type;
        valueArray.push(newNodeObject);        
     }
     nodeMap[tuple.bacteria_id] = valueArray;

     createTheLayout(tuple.bacteria_id,"displayBlock");
}
//Refer this map for picking the color for the arrows for the nodes internal structure
var colorMap = {
"subtype-aferr" : "#87CEEB",
"subtype-Dpsyc/I-C-variant" : "#FF00FF",
"subtype-I-A" : "#FF0000",
"subtype-I-B" : "#FF69B4",
"subtype-I-C" : "#F08080",
"subtype-I-E" : "#FF4500",
"subtype-I-F" : "#EE82EE",
"subtype-II-A" : "#008000",
"subtype-II-B" : "#ADFF2F",
"subtype-II-C" : "#2F4F4F",
"subtype-III-A" : "#00008B",
"subtype-III-B" : "#00FFFF",
"subtype-III-U" : "#20B2AA",
"subtype-I-U" : "#E9967A",
"subtype-Myxan" : "#FFD700",
"subtype-Pging" : "#DAA520",
"subtype-PreFran" : "#D2691E",
"type-II" : "#006400",
"type-I-U" : "#9932CC",
"universal" : "#000000",
"other" : "#9370DB",
"putative" : "#400000"
};

//NodeMap will contain the collection of the tuples for node construction
var nodeMap = new Object();


function NodeStructure(){
	var bacteria_id = null;//Alphanumric
	var	gene_begin= 0;//number
	var	gene_end= 0; //number
	var	gene_direction= null;//it will either be +(left to right) or - (right to left)
	var	gene_name= null;//string
	var	CRISPR_type= null;//color
}



function positiveDirection(symb){
   if(symb === "+"){
     return true;
   }
   return false;
}

function negativeDirection(symb){
  if(symb === "-"){
    return true;
  }
  return false;
}

function createTheLayout(id,locationId){
	var dataObject = nodeMap[id];
    if(dataObject){
     var prevEnd = null;
     var xCd =100;
     var yCd =100;
     
     var svgLayout  = d3.select('#'+locationId).append('svg');
     var height = 1000;
     var width = 1000;

     svgLayout.attr("height", height)
          .attr("width",width);
     }
     var linearScale = d3.scale.linear()
                   .domain([0,1000000])
                    .range([0,50000]);
     for(var x=0;x<dataObject.length;x++){
     	var temp = dataObject[x];
        var start = temp.gene_begin;
        var end =  temp.gene_end;
        var lengthOfShape = end-start;
        var color = colorMap[temp.CRISPR_type];
        var direction  = temp.gene_direction;

        if((prevEnd != null)){
            var dinstanceBetweenShapes = start - prevEnd;
            if(dinstanceBetweenShapes >=0){
              //TODO:Add logic for adjusting big distances
              //createLine
              var length = linearScale(linearScale(linearScale(dinstanceBetweenShapes)));
               createHyphen(xCd,yCd,length,"black",svgLayout)
              //update xCd
              xCd += length;
              prevEnd = null;
              x--;
            }else if(direction == "+"){
              var pstvArrowLength = linearScale(lengthOfShape);
              createForwardArrow(xCd,yCd,pstvArrowLength,color,svgLayout);
              xCd += pstvArrowLength;
              prevEnd = end;
            }else if(direction == "-"){
              var ngtvArrowLength = linearScale(lengthOfShape);
              createBackwardArrow(xCd,yCd,ngtvArrowLength,color,svgLayout);
              xCd += ngtvArrowLength;
              prevEnd = end;
            }
          //createShape(start,end,lengthOfShape,color,direction,prevEnd);
           
        }else{
          if(direction == "+"){
           var pstvArrowLength = linearScale(lengthOfShape);
           createForwardArrow(xCd,yCd,pstvArrowLength,color,svgLayout);
           xCd += linearScale(lengthOfShape);
          prevEnd = end;
        }else if(direction == "-"){
              var ngtvArrowLength = linearScale(lengthOfShape);
              createBackwardArrow(xCd,yCd,ngtvArrowLength,color,svgLayout);
              xCd += linearScale(lengthOfShape);
              prevEnd = end;
        }
        }
     }
  }

/*Dummy js object populated with the corresponding node details*/
// [
// {bacteria_id : "NC_002737", gene_begin:741835,gene_end:742623,gene_direction: "+",gene_name:"csm6", CRISPR_type: "subtype-III-A"},
// {bacteria_id : "NC_002737", gene_begin:854757,gene_end:858863,gene_direction: "+",gene_name:"csn1", CRISPR_type: "subtype-II-A"},
// {bacteria_id : "NC_002737", gene_begin:858863,gene_end:859732,gene_direction: "+",gene_name:"cas1_NMENI", CRISPR_type: "subtype-II-A"},
// {bacteria_id : "NC_002737", gene_begin:859729,gene_end:860070,gene_direction: "+",gene_name:"cas2", CRISPR_type: "subtype-II-A"},
// {bacteria_id : "NC_002737", gene_begin:860060,gene_end:860722,gene_direction: "+",gene_name:"csn2", CRISPR_type: "type-II-A"},
// {bacteria_id : "NC_002737", gene_begin:860825,gene_end:861256,gene_direction: "+",gene_name:"repeat", CRISPR_type: "num_repeat:7"},
// {bacteria_id : "NC_002737", gene_begin:1283506,gene_end:1283736,gene_direction: "+",gene_name:"repeat", CRISPR_type: "num_repeat:4"},
// {bacteria_id : "NC_002737", gene_begin:1283885,gene_end:1284178,gene_direction: "-",gene_name:"cas2", CRISPR_type: "universal"},
// {bacteria_id : "NC_002737", gene_begin:1284189,gene_end:1285214,gene_direction: "-",gene_name:"cas1_DVULG", CRISPR_type: "subtype-I-C"},
// {bacteria_id : "NC_002737", gene_begin:1285211,gene_end:1285885,gene_direction: "-",gene_name:"cas4", CRISPR_type: "cas"},
// {bacteria_id : "NC_002737", gene_begin:1285887,gene_end:1286735,gene_direction: "-",gene_name:"csd2", CRISPR_type: "subtype-I-C"},
// {bacteria_id : "NC_002737", gene_begin:1286740,gene_end:1288635,gene_direction: "-",gene_name:"csd1", CRISPR_type: "subtype-I-C"},
// {bacteria_id : "NC_002737", gene_begin:1288635,gene_end:1289363,gene_direction: "-",gene_name:"cas5d", CRISPR_type: "subtype-I-C"},
// {bacteria_id : "NC_002737", gene_begin:1289496,gene_end:1291904,gene_direction: "-",gene_name:"cas3_core", CRISPR_type: "subtype-I-C"}
// ];



//xCd,yCd,5,arrowTailLength,color,svgLayout
function createForwardArrow(x,y,l,color,svg){//TODO: make s value as variable
  var height = l/8;
  y = y-(height/2);
  svg.append("rect")
   .attr("x",x)
   .attr("y",y)
   .attr("width",l*.70)
   .attr("height",l/8)
   .attr("fill",color);
  
  createForwardTriangle(x+(l*.70),y,l*.30,height,color,svg);
}
function createForwardTriangle(x,y,l,h,color,svg){
    var xP1 = x;
    var yP1 = y+(h/2)-l;
    var xP2 = xP1+l;
    var yP2 = y + (h/2);
    var xP3 = xP1;
    var yP3 = y+(h/2)+l;

    // svg.append("polygon")
    //        .attr("points", "450,200 500,100 550,200");
    var pointString = xP1+","+yP1+" "+xP2+","+yP2+" "+xP3+","+yP3; 

    svg.append("polygon")
          .attr("points",pointString.toString())
           .attr("fill",color);
    x=xP2;
    y=yP2;
}



function createBackwardArrow(x,y,l,color,svg){//TODO: make s value as variable
  var height = l/8;
  createBackwardTriangle(x,y,l*.30,height,color,svg);
  
  svg.append("rect")
   .attr("x",x+(l*.30))
   .attr("y",y-(height/2))
   .attr("width",l*.70)
   .attr("height",height)
   .attr("fill",color);
}
function createBackwardTriangle(x,y,l,h,color,svg){
    var xP1 = x;
    var yP1 = y;
    var xP2 = xP1+l;
    var yP2 = yP1-l;
    var xP3 = xP1+l;
    var yP3 = yP1+l;

    // svg.append("polygon")
    //        .attr("points", "450,200 500,100 550,200");
    var pointString = xP1+","+yP1+" "+xP2+","+yP2+" "+xP3+","+yP3; 

    svg.append("polygon")
          .attr("points",pointString.toString())
           .attr("fill",color);
   // x=xP2;
}



function createSquare(x,y,s,color,svg){
   svg.append("rect")
   .attr("x",x)
   .attr("y",y)
   .attr("width",s)
   .attr("height",s)
   .attr("fill",color);
}

function createHyphen(x1,y1,s,color,svg){
    svg.append("line")
      .attr("x1",x1)
      .attr("x2",x1+s)
      .attr("y1",y1)
      .attr("y2",y1)
      .attr("stroke",color);
}

function readNodeDetails(id){
var raw_data= loadFile(id+".txt");
var returned_String=textToJSONParser(raw_data);
return JSON.parse(JSON.stringify(returned_String));
}

function loadFile(filename){
  //alert("load file");
  if (window.XMLHttpRequest){
    xhttp=new XMLHttpRequest();
    }
  else{ //code for IE5 and 6
    xhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

  xhttp.open("GET",filename,false);
  xhttp.send();
  return xhttp.responseText;
}

function textToJSONParser(data){
//remove all the tabs from the data
 // alert("came here")
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
      console.log(interm_Object); 
      final_Object.push(interm_Object); //add the create object for the particular row into the array
    }
  }
  return final_Object;
}
