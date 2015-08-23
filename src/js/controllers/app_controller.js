/* global Media */
angular.module('Musplay.controllers')

    .controller('AppController', function ($scope, $timeout) {
        $scope.navToView = function (dest) {
            if (dest === 'player')
                $scope.mainViewNavigator.setActiveTab(1);
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
            audioTools.startAudio($scope.currentSong.path);
            $scope.navToView('player');
        }
        $scope.currentSong = {
            name: "",
            path: ""
        }
        $scope.mediaStatusEasy = 0;
        var audioTools = {
            startAudio: function (src) {
                // Create Media object from src
                audioTools.stopAudio();
                appVarObj.my_media = new Media(src, audioTools.onSuccess, audioTools.onError, function (newStatus) {
                    appVarObj.mediaStatus = newStatus;
                    switch (appVarObj.mediaStatus) {
                        case 0:
                        case 3:
                        case 4:
                            appVarObj.mediaStatusEasy = 0;
                            break;
                        default:
                            appVarObj.mediaStatusEasy = 1;
                            break;
                    }
                    $timeout(function () {
                        $scope.mediaStatus = newStatus;
                        $scope.mediaStatusEasy = appVarObj.mediaStatusEasy;
                    });
                });
                // Play audio
                audioTools.playAudio();
            },
            playAudio: function () {
                if (appVarObj.my_media) {
                    appVarObj.my_media.play();
                    if (appVarObj.mediaTimer == null) {
                        appVarObj.mediaTimer = setInterval(function () {
                            appVarObj.my_media.getCurrentPosition(
                                // success callback
                                function (position) {
                                    if (position > -1) {
                                        $timeout(function () {
                                            audioTools.setAudioPosition((position) + " sec");
                                        });

                                    }
                                },
                                // error callback
                                function (e) {
                                    console.log("Error getting pos=" + e);
                                    audioTools.setAudioPosition("Error: " + e);
                                }
                                );
                        }, 1000);
                    }
                }
            },
            pauseAudio: function () {
                if (appVarObj.my_media) {
                    appVarObj.my_media.pause();
                }
            },
            stopAudio: function () {
                if (appVarObj.my_media) {
                    appVarObj.my_media.stop();
                }
                clearInterval(appVarObj.mediaTimer);
                appVarObj.mediaTimer = null;
                audioTools.setAudioPosition("0 sec")
            },
            onSuccess: function () {
                console.log("playAudio():Audio Success");
            },
            onError: function (error) {
                alert('code: ' + error.code + '\n' +
                    'message: ' + error.message + '\n');
            },
            setAudioPosition: function (position) {
                $timeout(function () {
                    $scope.mediaPos = position;
                });

            }
        }
        $scope.audioCtrls = {
            pauseAudio: function () {
                audioTools.pauseAudio();
            },
            stopAudio: function () {
                audioTools.stopAudio();
            },
            playToggle: function () {
                if (appVarObj.mediaStatusEasy === 0)
                    audioTools.playAudio();
                else
                    audioTools.pauseAudio();
            }
        }
    })