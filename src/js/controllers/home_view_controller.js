angular.module('Musplay.controllers')

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
                        $scope.dataLoadStatus = $scope.moosaData.length;
                    }
                }
                $scope.$digest();
            }, function (error) {
                alert("Failed to list directory contents: " + error.code);
            });

        }
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