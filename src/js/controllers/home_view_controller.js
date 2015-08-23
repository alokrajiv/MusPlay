/* global ons */
angular.module('Musplay.controllers')

    .controller('homeViewController', function ($scope, $timeout, cacheMusicList, loadCacheMusicList, searchLoadMusic) {

        $scope.moosaData = [];
        $scope.dataLoadStatus = "";
        $scope.cacheData = function () {
            cacheMusicList($scope.moosaData);
        }
        $scope.loadFromCache = function () {
            loadCacheMusicList(success, fail);
            function success(data) {
                console.log("Loaded music list from cache!")
                $timeout(function () {
                    $scope.moosaData = data.musicList;
                });
            }
            function fail(e) {
                alert('failed to load data.started searching..!')
                $scope.attack();
            }
        }
        $scope.attack = function () {
            $scope.moosaData = [];
            $scope.dataLoadStatus = "Searching more ...";
            searchLoadMusic(updates, success, fail);
            function updates(data) {
                $timeout(function () {
                    $scope.moosaData = data;
                });
            }
            function success(data) {
                $scope.moosaData = data;
                $scope.dataLoadStatus = ""
                cacheMusicList(data);
            }
            function fail(e) {
                console.log("FileSystem Error");
                console.dir(e);
            }
        }
        ons.ready(function () {
            $scope.loadFromCache();
        });
    })

function isAudioFile(entry) {
    var entryName = entry.name;
    var extn = entryName.substr(entryName.lastIndexOf('.') + 1);
    var isAudio = false;
    switch (extn) {
        case 'mp3':
        case 'm4a':
        case 'wav':
            isAudio = true;
    }
    return isAudio;
}