app.controller('EventListController', ['$scope','$interval','$window','dataService','$modal','$log', function($scope, $interval,$window,dataService,$modal,$log){
    
	//////////////////////// ADD BROADCAST USER EVENT to show on list
	
	
	$scope.isCollapsed = false;
	
	$scope.eventList = [];
	$scope.formattedEventList = [];
	$scope.listSelection=[];
	
	$scope.$on("broadcastRawEventList", function(){
		$scope.eventList = clone(dataService.rawEventList);
//		console.log($scope.eventList);
		formatEventList($scope.eventList)
	});
	
	$scope.$on("broadcastMapEvent", function(){
		var event = clone(dataService.rawEventList[dataService.rawEventList.length-1]);
		$scope.eventList.push(event);
		formatEvent(event);
	});
	$scope.$on("broadcastRampEvent", function(){
		var event = clone(dataService.rawEventList[dataService.rawEventList.length-1]);
		$scope.eventList.push(event);

		formatEvent(event);
	});
	
	$scope.$on("broadcastUserEvent", function(){
		var event = clone(dataService.rawEventList[dataService.rawEventList.length-1]);
		$scope.eventList.push(event);
		formatEvent(event);
	});

    
	function formatEvent(dataToFormat){ // modifies the raw events in a format easy to read for the display in a table
		var event={};
		
		event.id = $scope.formattedEventList.length;
		// converts ms to date and time
		event.time = (dataToFormat.timestamp != undefined)? new Date(dataToFormat.timestamp).toString() : -1;
		event.name = (dataToFormat.name != undefined)? dataToFormat.name : "";
		event.ramp_id = (dataToFormat.attributes.location != undefined)? dataService.rampLocationToId(dataToFormat.attributes.location) : -1;
		event.density = (dataToFormat.attributes.density != undefined)? dataToFormat.attributes.density.toFixed(2) : (dataToFormat.attributes.average_density != undefined)? dataToFormat.attributes.average_density.toFixed(2) : "";
		event.problem_id = (dataToFormat.attributes.problem_id != undefined)? dataToFormat.attributes.problem_id : "";
		
		$scope.formattedEventList.push(event);
	}
	function formatEventList(dataToFormat){
		for(var i=0; i<dataToFormat.length;i++)
		{
			formatEvent(dataToFormat[i]);
		}
	}
	
	$scope.onClickRow = function(rowItem) {
		var item = rowItem.entity;
 //       console.log(item);
		dataService.changeSelection(item);
    };
	// explain click
	$scope.onInspect = function(){
		console.log("clicked");
		$scope.open('lg','views/listModal.html','ListModalController')
	}
	// MODAL CONTROL POP
	$scope.open = function (size,template,controller) {

		var modalInstance = $modal.open({
			templateUrl: template,
			controller: controller,
			size: size,
			resolve: {
				items: function () {
				return $scope.items;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.response = selectedItem;
			console.log($scope.response);
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	
	};
	
	$scope.gridOptions = { 
        data: 'formattedEventList',
		enablePinning: true, // pin columns
		selectedItems: $scope.listSelection, // enables selection of row
		multiSelect: false,
		enableColumnResize: true,
		rowTemplate: '<div ng-click="onClickRow(row)" style="height: 100%" ng-class="{ selected: row.selected, green: row.getProperty(\'confirmed\') == 0}"><div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }">&nbsp;</div><div ng-cell></div></div></div>'
		/*
        showGroupPanel: true,
        jqueryUIDraggable: true*/
    };
	
}]);