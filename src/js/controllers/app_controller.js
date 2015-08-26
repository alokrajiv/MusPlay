/* global appVarObj */
/* global ons */
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
                                            audioTools.setAudioPosition((position));
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
                $scope.priceSlider.value = 0;
                audioTools.setAudioPosition(0);
            },
            onSuccess: function () {
                $timeout(function () {
                    $scope.mediaDur = appVarObj.my_media.getDuration();
                    console.log("playAudio():Audio Success " + $scope.mediaDur);
                });
            },
            onError: function (error) {
                alert('code: ' + error.code + '\n' +
                    'message: ' + error.message + '\n');
            },
            setAudioPosition: function (position) {
                $timeout(function () {
                    $scope.mediaPos = position;
                    $scope.mediaDur = appVarObj.my_media.getDuration();
                    $scope.priceSlider.value = Math.round((position * 100) / $scope.mediaDur);
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
        $scope.priceSlider = {
            floor: 0,
            ceil: 100,
            value: 0
        };

        $scope.$on("slideEnded", function () {
            audioTools.pauseAudio();
            appVarObj.my_media.seekTo($scope.priceSlider.value * 10 * $scope.mediaDur);
            audioTools.playAudio();
        })
    })