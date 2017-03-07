var module = angular.module('taskTracker');

module.service('dataService', function ($http, $q) {

    var arrLabels = [];
    var arrAllTasks = [];

    this.loadTaskData = function () {

        var defer = $q.defer();
        $http.get('data/data.json')
            .success(function (data) {
                defer.$$resolve(data);
                arrLabels = data.labels;
                arrAllTasks = data.tasks;
            })
            .error(function (data) {
                defer.reject("Error");
            });
        return defer.promise;
    };

    this.getAllLabels = function () {
        return arrLabels;
    };

    this.getAllTasks = function () {
        return arrAllTasks;
    };



    //MORE USEFUL USING CALL BACK FUNCTIONS?
    this.getTasksForLabel = function (label) {
        var tasks = [];
        angular.forEach(arrAllTasks, function (obj, key) {
            if (obj.labelName === label) {
                tasks.push(obj);
            }
        });

        return tasks;
    };

    this.getTaskByCompletionStatus = function (status) {
        var tasks = [];
        angular.forEach(arrAllTasks, function (task, key) {
            if (task.completed === status) {
                tasks.push(task);
            }
        });

        return tasks;
    };

    this.getStarredTasks = function () {
        var tasks = [];
        angular.forEach(arrAllTasks, function (obj, key) {
            if (obj.star) {
                tasks.push(obj);
            }
        });

        return tasks;

    }

    var selectedLabel = "";

    this.setSelectedLabel = function (label) {
        selectedLabel = label;
    };

    this.getSelectedLabel = function () {
        return selectedLabel;
    };

    //Index instead of for in?!?!
    /*Here is the function to update the task object. 
    In real application, you will be making a backend 
    call from here to update the status in database.
    */
    this.updateTask = function (updatedTask) {
        angular.forEach(arrAllTasks, function (task, key) {
            if (task.id === updatedTask.id) {
                arrAllTasks[key] = updatedTask;
            }
        });
    };

    this.deleteTask = function (updatedTask) {
        angular.forEach(arrAllTasks, function (task, key) {
            if (task.id === updatedTask.id) {
                arrAllTasks.splice(arrAllTasks[key], 1);
            }
        });
    };


    this.addNewLabel = function (label) {
        arrLabels.push(label);
    };

    this.addNewTask = function (tasks) {
        arrAllTasks.push(tasks);
    };


    //for editing a task

    var selectedTask;

    this.setSelectedTask = function (task) {
        selectedTask = task;
    }

    this.getSeletedTask = function () {
        return selectedTask;
    }
});
