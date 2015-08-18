/* global ons */
angular.module('Musplay.controllers.Main', [])

    .controller('MainController', function ($scope) {
    })

    .controller('AppController', function ($scope) {
        $scope.navToView = function (dest) {
            $scope.mainViewNavigator.pushPage(dest + ".html");
        }
        $scope.viewLoaded = function () {
            console.log("moo1");
        }
        ons.ready(function () {
            // Actually myNavigator object sits in the root scope
            //$scope.mainViewNavigator.pushPage("homeView.html");
        });

    })

    .controller('homeViewController', function ($scope) {
        $scope.viewLoaded = function () {
            console.log("moo2");
        }
    })
    
    .controller('detailViewController', function($scope){
        
        $scope.moosaData = [];
        $scope.attack = function () {
            console.log('fired Attack');
            window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "www/", gotDir, fail);

            /* Yes, this works too for our specific example...
            $.get("index.html", function(res) {
                console.log("index.html", res);
            });
            */

        }

        function fail(e) {
            console.log("FileSystem Error");
            console.dir(e);
        }

        function gotDir(dirEntry) {
            // Get a directory reader
            var directoryReader = dirEntry.createReader();

            // Get a list of all the entries in the directory
            directoryReader.readEntries(function (entries) {
                var i;
                for (i = 0; i < entries.length; i++) {
                    $scope.moosaData.push(entries[i].name);
                }
            }, function (error) {
                alert("Failed to list directory contents: " + error.code);
            });

        }
    });