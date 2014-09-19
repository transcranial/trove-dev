var app = angular.module('troveApp');

app.config(function($routeProvider) {
	$routeProvider
	.when('/dashboard/disease', {
		templateUrl:'app/disease/disease.html',
		controller:'DiseaseCtrl'
	});
});

app.factory('diseaseValues', function() {
	return {
		'BODY CT' : [
			{"SBO":7},
			{"Appendicitus":3},
			{"Cholycystitis":3},
			{"Pancreatitis":2},
			{"Colitis":5},
			{"Liver lesions":5},
			{"Pancreas lesions":3},
			{"Nephrolithiases":5},
			{"Renal mass":3},
			{"Hydronephrosis":5},
			{"Adnexal mass":2},
			{"Peritoneal disease":3},
			{"GI malignancy":5},
			{"GU malignancy":2}
		],
		'GI' : [
			{"Post-surgical leak":2},
			{"Reflux":5},
			{"Hiatal hernia":5},
			{"Dysmotility":5},
			{"Penetration/Aspiration":5},
			{"Esophageal obstruction (partial)": 2},
			{"Bladder leak": 2},
			{"Uterine anomalies": 1},
			{"Blocked/Absent Fallopian tube": 1},
			{"SBO": 5},
			{"Ileus": 5},
			{"Pneumoperitneum":3},
			{"Gallstone":3},
			{"Kidney stone":3},
			{"Enteric tube position": 5},
			{"Foreign body retained": 1},
			{"Foreign body ingested": 1}
		],
		'US': [
			{"Thyroid nodules":3},
			{"DVT":3},
			{"Cholycystitis":2},
			{"Hydronephrosis":3},
			{"Renal stone":2},
			{"Liver lesions":3},
			{"Carotid stenosis":2},
			{"Varicocele":3},
			{"Ovary/Testicular Torsion": 2},
			{"Ectopic":2},
			{"Ovarian mass": 2},
			{"Endometrial disease": 2},
			{"Fibroids":3},
			{"Ascites/FAST":3},
			{"Transplant kidney pathology": 3},
			{"Aortic aneurysm":2}
		],
		'NUCS':[
			{"Graves":10},
			{"Thyroiditis":5},
			{"Thyroid adenoma":2},
			{"Metastatic throid uptake":10},
			{"Cholycystitis":5},
			{"Decreased GB EF":5},
			{"Osteomyelitis":3},
			{"Bone metastases":10},
			{"Pulmonary embolism": 5},
			{"Alzheimers":3},
			{"Renal dysfunction": 10},
			{"Neuroendocrine tumor": 2},
			{"Metastatic cancer (PET)":10},
			{"Gastroparesis":10}
		],
		'BONE':[
			{"Postop fracture evaluation":5},
			{"Pelvic fracture":5},
			{"Shoulder dislocation":5},
			{"Avascular necrosis":3},
			{"Hip fracture":5},
			{"Ankle fracture": 5},
			{"Osteomyelitis":3},
			{"Bone tumor":3},
			{"Pathologic fracture":3},
			{"Hardware complications": 5},
			{"Wrist fracture":5},
			{"Arthritis":5}
		],
		'CHEST INPT':[
			{"Sarcoid": 2},
			{"Mesothelioma":1},
			{"Benign fibrous tumor of the pleura":1},
			{"Lung cancer, primary or metastatic":3},
			{"Lymphoma":2},
			{"PCP": 2},
			{"PE": 4},
			{"Thymoma":1},
			{"Thyroid goiter/cancer":1},
			{"Pneumothorax":3},
			{"Pulmonary edema":4},
			{"Pneumonia, all":4},
			{"Interstitial lung disease":3},
			{"Septic emboli":2},
			{"Silicosis":1},
			{"Hypersensitivity pneumonitis": 1},
			{"Diffuse alveolar hemorrhage": 2},
			{"Pulmonary alveolar proteinosis": 1},
			{"TB": 3},
			{"Lymphangiomyomatosis":1},
			{"Pulmonary sequestration":1}
		]
	}
});


app.directive("bulletChart", function ($window) {
	return {
        restrict: "E",
        scope: {
        	directiveData:"="
        },
        link: function (scope, elem, attrs) {

// Chart design based on the recommendations of Stephen Few. Implementation
// based on the work of Clint Ivy, Jamie Love, and Jason Davies.
// http://projects.instantcognition.com/protovis/bulletchart/

        	var margin = {top: 5, right: 40, bottom: 20, left: 220},
			width = 960 - margin.left - margin.right,
			height = 50 - margin.top - margin.bottom;
			//width = elem.parent().width() - margin.left - margin.right,
			//height = elem.parent().height() - margin.top - margin.bottom;

			/*
			scope.data = [
				{"title":"Revenue","subtitle":"","ranges":[0,3],"measures":[1],"markers":[3]},
				{"title":"Profit","subtitle":"%","ranges":[0,3],"measures":[3,0],"markers":[3]},
				{"title":"Order Size","subtitle":"US$, average","ranges":[0,2],"measures":[0,0],"markers":[2]},
				{"title":"New Customers lalalaala","subtitle":"count","ranges":[0,3],"measures":[2,0],"markers":[3]},
				{"title":"Satisfaction","subtitle":"out of 5","ranges":[0,7],"measures":[5,0],"markers":[7]}
			]
			*/

			var chart = d3.bullet()
			.width(width)
			.height(height);

			var svg = null;
			var bullet = null;
			var title = null;

			scope.$watchCollection("directiveData", function(newValue,OldValue) {
				svg = d3.select(elem[0]).selectAll("svg");
				svg.remove();

				svg = d3.select(elem[0]).selectAll("svg")
				.data(scope.directiveData)
				.enter()
				.append("svg")
				.attr("class", "bullet")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
				.call(chart);


				title = svg.append("g")
				.style("text-anchor", "end")
				.attr("transform", "translate(-6," + height / 2 + ")");

				title.append("text")
				.attr("class", "title")
				.text(function(d) { return d.title; });

				title.append("text")
				.attr("class", "subtitle")
				.attr("dy", "1em")
				.text(function(d) { return d.subtitle; });
			});
        }
    };
});

app.controller('DiseaseCtrl', function ($scope, $location, diseaseValues) {
	var temp_rotation = null;
	var temp_pathology = null;
	var temp_pathology_req = -1;
	for (key in diseaseValues) {
		temp_rotation = diseaseValues[key];
		console.log(temp_rotation);
		for (var i = 0; i < temp_rotation.length; i++) {
			temp_pathology = temp_rotation[i];
			for (key2 in temp_pathology) {
				var temp_array = key2.split(' ');
				temp_rotation[i]["subtitle"] = "";
				temp_rotation[i]["title"]    = "";
				if (temp_array.length < 2) {
					temp_rotation[i]["title"] = key2;
					temp_rotation[i]["subtitle"] = '';
				} else {
					temp_rotation[i]["title"] = temp_array[0] + " " + temp_array[1]
					for (y = 2; y < temp_array.length; y++) {
						temp_rotation[i]["subtitle"] += temp_array[y] + " ";
					}
				}
				temp_rotation[i]["ranges"] = [0,temp_pathology[key2] + 3];
				temp_rotation[i]["measures"] = [1,Math.floor(Math.random()*temp_pathology[key2]) + 3,Math.floor(Math.random()*temp_pathology[key2]) + 3];
				temp_rotation[i]["markers"] = [temp_pathology[key2]];
			}
		}
		temp_rotation.sort(function(a,b) {
			return b["markers"] - a["markers"];
		});
	}
	
	$scope.rotation_id = null;	

	$scope.getSelected = function(rotation_id) {
		return (rotation_id == $scope.rotation_id) ? 'selectedRotation': '';
	}

	$scope.updateChart = function(rotation_id) {
		console.log('did i get called');
		$scope.rotation_id = rotation_id;
		$scope.data = diseaseValues[rotation_id];
	};

	$scope.updateChart('BODY CT');
});

