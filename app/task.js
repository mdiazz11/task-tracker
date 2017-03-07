module.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider) {
    // Add the new state named newTask
    $stateProvider.state('showTasks', {
        url: '/taskList',
        templateUrl: 'partial/taskList.html',
        controller: 'taskListController'
    }).state('newTask', {
        url: '/newTask',
        templateUrl: 'partial/newTask.html',
        controller: 'newTaskController'
    }).state('editTask', {
        url: '/editTask',
        templateUrl: 'partial/editTask.html',
        controller: 'editTaskController'
    });

}]);

module.controller('taskListController', ['$scope', 'dataService', '$state', '$stateParams', '$rootScope', function ($scope, dataService, $state, $stateParams, $rootScope) {


    $scope.filterText = {
        name: ''
    };

    $rootScope.$watch('filter', function (data) {
        if ((data != undefined || data != null)) {
            $scope.filterText.name = data;
        }
    });

    /* Instead of this is common-service.js:
        this.getSelectedLabel=function(){
	       if(selectedLabel=="") {
		      selectedLabel = "All Tasks";
	       }
	       return selectedLabel;
        };
        
        Just do an OR. Empty string = 0, so it will default to "All Tasks"
    */

    $scope.label = dataService.getSelectedLabel() || "All Tasks";

    if ($scope.label == "All Pending") {
        $scope.tasks = dataService.getTaskByCompletionStatus(false);
    } else if ($scope.label == "Complete") {
        $scope.tasks = dataService.getTaskByCompletionStatus(true);
    } else if ($scope.label == "All Tasks") {
        $scope.tasks = dataService.getAllTasks();
    } else if ($scope.label == "Star") {
        $scope.tasks = dataService.getStarredTasks();
    } else {
        $scope.tasks = dataService.getTasksForLabel($scope.label);
    }

    $scope.updateTask = function (task) {
        dataService.updateTask(task);
    };

    $scope.deleteTask = function (task) {
        dataService.deleteTask(task);
    };

    $scope.createNewTask = function () {
        $state.transitionTo('newTask', $stateParams, {
            reload: true
        });
    };

    $scope.star = function (task) {
        task.star = !task.star
    }

    $scope.editTask = function (task) {
        dataService.setSelectedTask(task);
        $state.transitionTo('editTask', $stateParams, {
            reload: true
        });
    };

    $scope.createQuickTask = function () {

        if ($scope.txtTaskName.trim() != "") {
            $scope.task = {
                "id": (new Date()).getTime(),
                "name": $scope.txtTaskName,
                "due_date": null,
                "completed": false,
                "labelName": $scope.label,
                "star": false
            };
            dataService.addNewTask($scope.task);
            $scope.tasks = dataService.getTasksForLabel($scope.label);
            $scope.txtTaskName = "";
        }
    };



            }]);

module.controller('newTaskController', ['$scope', '$state', '$stateParams', 'dataService',
        function ($scope, $state, $stateParams, dataService) {

        $scope.name = "";
        $scope.due_date = "";
        $scope.labelName = dataService.getSelectedLabel();


        $scope.data = dataService.getAllLabels();

        $scope.saveTasks = function () {

            if ($scope.name.trim() != "") {

                $scope.task = {
                    "id": (new Date()).getTime(),
                    "name": $scope.name,
                    "due_date": $scope.due_date,
                    "completed": false,
                    "labelName": $scope.tempLabelName || $scope.labelName,
                    "star": false

                };
                dataService.addNewTask($scope.task);

                $state.transitionTo('showTasks', $stateParams, {
                    reload: true
                });
            }
        };


        //double check to see if index is appropriate
        $scope.setLabel = function (index) {
            $scope.tempLabelName = $scope.data[index].name;
        };
}]);

module.controller('editTaskController', ['$scope', '$state', '$stateParams', 'dataService',
        function ($scope, $state, $stateParams, dataService) {

        var taskToEdit = dataService.getSeletedTask();

        $scope.name = taskToEdit.name;
        $scope.due_date = taskToEdit.dueDate;
        $scope.labelName = taskToEdit.labelName;


        $scope.data = dataService.getAllLabels();

        $scope.saveTasks = function () {

            if ($scope.name.trim() != "") {

                $scope.task = {
                    "id": taskToEdit.id,
                    "name": $scope.name,
                    "due_date": $scope.due_date,
                    "completed": false,
                    "labelName": $scope.tempLabelName || $scope.labelName,
                    "star": false

                };
                dataService.updateTask($scope.task);

                $state.transitionTo('showTasks', $stateParams, {
                    reload: true
                });
            }
        };



        $scope.setLabel = function (index) {
            $scope.tempLabelName = $scope.data[index].name;
        };
}]);
