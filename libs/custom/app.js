var dataVisualization = angular.module("dataVisualization", [
    'ngRoute',
    'ngCookies',
    'loginControllers'
]);

/*getContents = function(){
			var start =  0;
			var stop = file.size - 1;
			var reader = new FileReader();
			var _contents;
			var blob= file.slice(0, file.size);
			reader.readAsBinaryString(blob);
			reader.onloadend = function(evt) {
			if (evt.target.readyState == FileReader.DONE) { // DONE == 2
				//file contents
				_contents = evt.target.result;
				console.log(_contents);
				//return contents;
				}
			};
			return _contents;
		}*/

dataVisualization.factory('uploadManager', function($rootScope) {
    var _files = [];
    return {
        add: function(file) {
            _files.push(file);
            $rootScope.$broadcast('fileAdded', file.files[0].name);
        },
        clear: function() {
            _files = [];
        },
        files: function() {
            var fileNames = [];
            $.each(_files, function(index, file) {
                fileNames.push(file.files[0].name);
            });
            return fileNames;
        },
        upload: function() {
            $.each(_files, function(index, file) {
                file.submit();
            });
            this.clear();
        },
        setProgress: function(percentage) {
            $rootScope.$broadcast('uploadProgress', percentage);
        },
		convertXml2JSon: function(formated_Xml){
		 formated_Xml = formated_Xml.replace(/>\s*/g, '>');  // Replace "> " with ">"
		formated_Xml = formated_Xml.replace(/\s*</g, '<');  // Replace "< " with "<"
		if(formated_Xml.indexOf("<phylogeny")>0){
			formated_Xml= formated_Xml.slice(formated_Xml.indexOf("<phylogeny"), formated_Xml.length );
			formated_Xml = formated_Xml.slice(formated_Xml.indexOf(">")+1,formated_Xml.indexOf("</phylogeny>"));
		}
		    formated_Xml= StringToXML(formated_Xml.trim());
			//console.log(formated_Xml);
			var data = xmlToJson(formated_Xml);
			//console.log(data);
			var y_value= 0
			var output_Json =create_Json(data,y_value);
			//console.log(output_Json);
			var final_Json=JSON.stringify(output_Json);
			//console.log(final_Json);
			$rootScope.$broadcast('getJson', output_Json);
		}
    };
});
function xmlToJson(xml){
   var obj = {};
	//console.log(xml);
  if (xml.nodeType == 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
    obj["@attributes"] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) { // text
    obj = xml.nodeValue;
  }

  // do children
  if (xml.hasChildNodes()) {
    for(var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof(obj[nodeName]) == "undefined") {
        if(nodeName=="#text")
          return xmlToJson(item);
        else
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof(obj[nodeName].push) == "undefined") {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
}
function create_Json(converted_Data,y_value){

  if (converted_Data === undefined)
    return ;

	//console.log(whatIsIt(converted_Data));
  //check if the input is an object 
  if( whatIsIt(converted_Data)== "Object"){ 
  
    for (var element in converted_Data) {
		
      switch(element){  //cannot have a default case, it fails when element is branch_length

        case "clade": //console.log("entered the clade");
                      var temp_Object = {name: "clade", y:y_value+10};
                      var retruned_Result= create_Json(converted_Data[element],y_value+10);
                      if(whatIsIt(retruned_Result)=="Object")
                        temp_Object.children = Array(retruned_Result);
                      else
                      temp_Object.children =retruned_Result;
                      return temp_Object;
                      
        case "sequence": //console.log("entered the sequence");
                        var temp_Object = {name: converted_Data.sequence.name, y: parseInt(converted_Data["branch_length"])+10+y_value};
                        //temp_Object.children.push(converted_Data[element],y_value+10);
                        return temp_Object;
      }



    }
  }

  //if the input converted_Data is an Array
  else if(whatIsIt(converted_Data)=="Array"){
  
  // console.log("this is an array"); 
    var storage= new Array();
    for(var i=0;i<converted_Data.length;i++){
     // console.log("running the loop "+i+" time");
      storage.push(create_Json(converted_Data[i],y_value));
    }
	//console.log(storage);
    return storage.slice();
  }
  else{
	console.log("none");
	return;
  }

  
}
function StringToXML(oString) {
  //code for IE
  if (window.ActiveXObject) {
  var oXML = new ActiveXObject("Microsoft.XMLDOM"); oXML.loadXML(oString);
  return oXML;
  }
  // code for Chrome, Safari, Firefox, Opera, etc.
  else {
  return (new DOMParser()).parseFromString(oString, "text/xml");
  }
}
function whatIsIt(object) {
    if (object === null) {
        return "null";
    }
    else if (object === undefined) {
        return "undefined";
    }
    else if (object.constructor === String) {
        return "String";
    }
    else if (object.constructor === Array) {
        return "Array";
    }
    else if (object.constructor === Object) {
        return "Object";
    }
    else {
        return "don't know";
    }
}
dataVisualization.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/login', {
        templateUrl: '../html/loginPartial.htm',
        controller: 'LoginController'
    }).
    when('/dashboard', {
        templateUrl: '../html/dashboardPartial.htm',
        controller: 'dashboardController'
    }).
    otherwise({
        redirectTo: '/login'
    });
}]);
dataVisualization.factory('sessionService', ['$http', function() {
    return {
        set: function(key, value) {
            return sessionStorage.setItem(key, value);
        },
        get: function(key, value) {
            return sessionStorage.getItem(key, value);
        },
        destroy: function(key, value) {
            return sessionStorage.removeItem(key);
        }
    };

}]);
dataVisualization.directive('upload', ['uploadManager', function factory(uploadManager) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).fileupload({
                dataType: 'text',
                add: function(e, data) {
                    var file = data.files[0];
                    console.log(file);
					if(file.type=="text/xml"){
					$('#uploadError').empty();
                    var blob = file.slice(0, file.size);
                    var reader = new FileReader();
					uploadManager.add(data);
                    reader.readAsBinaryString(blob);
                    reader.onloadend = function(evt) {
                        if (evt.target.readyState == FileReader.DONE) { // DONE == 2
                            uploadManager.convertXml2JSon(evt.target.result);
							
                        }
                    };
					}
					else{
						//alert("PLease add oinly xml");
						$('#uploadError').append('<div class="alert alert-danger" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>Please upload XML file only!!!</div>');
					}
                },
                progressall: function(e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    uploadManager.setProgress(progress);
                },
                done: function(e, data) {
                    uploadManager.setProgress(0);
                }
            });
        }
    };
}]);