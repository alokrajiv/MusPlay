angular.module('Musplay.controllers')

    .controller('AppController', function ($scope) {
        $scope.navToView = function (dest) {
            $scope.mainViewNavigator.pushPage(dest + ".html");
        }
        $scope.viewLoaded = function () {
        }
        ons.ready(function () {
            // Actually myNavigator object sits in the root scope
            //$scope.mainViewNavigator.pushPage("homeView.html");
        });
        $scope.playSong = function (name, path) {
            $scope.currentSong.name = name;
            $scope.currentSong.path = path;
            $scope.navToView('detailView');
        }
        $scope.currentSong = {
            name: "",
            path: ""
        }

    })