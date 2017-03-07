module.config(['$stateProvider',
	function ($stateProvider) {

        $stateProvider.state('newLabel', {
            url: '/newLabel',
            templateUrl: 'partial/newLabel.html',
            controller: 'newLabelController'
        });
}]);

module.controller('labelController', function ($scope, dataService, $state, $stateParams) {
    dataService.loadTaskData()
        .then(function (data) {
            $scope.data = dataService.getAllLabels();
        }, function (error) {
            console.log(error);
        });


    //Getter Functions
    this.getAllTasks = function () {
        return arrAllTasks;
    };

    $scope.getTasksLengthForLabel = function (label) {
        return dataService.getTasksForLabel(label).length;
    };

    $scope.getPendingTasksLength = function () {
        return dataService.getTaskByCompletionStatus(false).length;
    };

    $scope.getCompleteTasksLength = function () {
        return dataService.getTaskByCompletionStatus(true).length;
    };

    $scope.getStarredTasksLength = function () {
        return dataService.getStarredTasks().length;
    };

    $scope.getAllTasksLength = function () {
        return dataService.getAllTasks().length;
    };

    //Setter Functions
    $scope.setLabel = function (label) {
        dataService.setSelectedLabel(label);
        $state.transitionTo('showTasks', $stateParams, {
            reload: true
        });
    };
});

module.controller('newLabelController', ['$scope', '$state', '$stateParams', 'dataService',
    function ($scope, $state, $stateParams, dataService) {

        $scope.name = "";
        $scope.color = "";

        $scope.setColor = function (value) {
            $scope.color = value;
        };

        $scope.saveLabel = function () {

            var label = {
                "name": $scope.name,
                "color": $scope.color
            };

            dataService.addNewLabel(label);

            dataService.setSelectedLabel($scope.name);
            $state.transitionTo('showTasks', $stateParams, {
                reload: true
            });

        };

    }]);
