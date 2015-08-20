/* global appVarObj */
/* global ons */
appVarObj = {
    currentQueue : [],
    my_media : null,
    mediaTimer : null,
    mediaStatus : null
}
angular.module('Musplay.controllers.Main', [])

    .controller('MainController', function ($scope) {
    })

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


    .controller('homeViewController', function ($scope) {

        $scope.moosaData = [];
        $scope.dataLoadStatus = "0";
        $scope.cacheData = function () {
            window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + "uttapi/", function (dir) {
                console.log("got main dir", dir);
                dir.getFile("log.txt", { create: true }, function (file) {
                    console.log("got the file", file);
                    logOb = file;
                    writeLog("123124");
                });
            });
            function writeLog(str) {
                if (!logOb) return;
                var log = str;
                console.log("going to log " + log);
                logOb.createWriter(function (fileWriter) {

                    //fileWriter.seek(fileWriter.length);

                    var blob = new Blob([log], { type: 'text/plain' });
                    fileWriter.write(blob);
                    console.log("ok, in theory i worked");
                }, fail);
            }
        }
        $scope.attack = function () {
            $scope.moosaData = [];
            $scope.dataLoadStatus = "Loading ...";
            window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, gotDir, fail);
        }
        ons.ready(function () {
            $scope.attack();
        });
        function fail(e) {
            console.log("FileSystem Error");
            console.dir(e);
        }

        function gotDir(dirEntry) {
            var directoryReader = dirEntry.createReader();
            directoryReader.readEntries(function (entries) {
                for (var i = 0; i < entries.length; i++) {
                    var entry = entries[i];
                    if (entry.isDirectory) {
                        gotDir(entry);
                    }
                    else if (isAudioFile(entry)) {
                        $scope.moosaData.push({
                            name: entry.name,
                            path: entry.toInternalURL()
                        });
                        $scope.moosaData.sort();
                        $scope.dataLoadStatus = $scope.moosaData.length;
                    }
                }
                $scope.$digest();
            }, function (error) {
                alert("Failed to list directory contents: " + error.code);
            });

        }
    })

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
    });

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