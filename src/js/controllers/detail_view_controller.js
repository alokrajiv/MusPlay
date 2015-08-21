angular.module('Musplay.controllers')

    .controller('detailViewController', function ($scope) {

        var audioTools = {
            startAudio: function (src) {
                // Create Media object from src
                audioTools.stopAudio();
                appVarObj.my_media = new Media(src, audioTools.onSuccess, audioTools.onError, function (newStatus) {
                    appVarObj.mediaStatus = newStatus;
                });

                // Play audio
                appVarObj.my_media.play();

                // Update appVarObj.my_media position every second
                if (appVarObj.mediaTimer == null) {
                    appVarObj.mediaTimer = setInterval(function () {
                        appVarObj.my_media.getCurrentPosition(
                            // success callback
                            function (position) {
                                if (position > -1) {
                                    audioTools.setAudioPosition((position) + " sec");
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
            },
            playAudio: function () {
                if (appVarObj.my_media) {
                    appVarObj.my_media.play();
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
            },
            onSuccess: function () {
                console.log("playAudio():Audio Success");
            },
            onError: function (error) {
                alert('code: ' + error.code + '\n' +
                    'message: ' + error.message + '\n');
            },
            setAudioPosition: function (position) {
                $scope.mediaPos = position;
                $scope.$digest();
            }
        }
        audioTools.startAudio($scope.currentSong.path);

        $scope.audioCtrls = {
            pauseAudio: function () {
                audioTools.pauseAudio();
            },
            playToggle: function () {
                switch (appVarObj.mediaStatus) {
                    case 0:
                    case 3:
                    case 4:
                        audioTools.playAudio();
                        break;
                    default:
                        audioTools.pauseAudio();
                        break;
                }
            }
        }
    })