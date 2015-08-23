angular.module('Musplay.services.fileOps', [])
    .factory('saveFileData', function () {
        return function (filename, data, success, fail) {
            window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, successFSU, function (e) {
                console.log(e);
            });
            function successFSU(fsDir) {
                fsDir.getDirectory('musplay', { create: true }, gotDir, function (e) {
                    console.log(e);
                })
                function gotDir(dirEntry) {
                    dirEntry.getFile(filename, { create: true }, function (file) {
                        if (!file) return;
                        file.createWriter(function (fileWriter) {
                            var blob = new Blob([data], { type: 'text/plain' });
                            fileWriter.write(blob);
                            console.log("Finished Writing to file");
                        }, function (e) {
                            console.log(e);
                        });
                    });
                }
            }
        }
    })
    .factory('loadFileData', function () {
        return function (filename, success, fail) {
            window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, successFSU, function (e) {
                console.log(e);
            });
            function successFSU(fsDir) {
                fsDir.getDirectory('musplay', { create: true }, gotDir, function (e) {
                    console.log(e);
                    fail(e);
                })
                function gotDir(dirEntry) {
                    dirEntry.getFile(filename, {create: false}, function (fileEntry) {
                        console.log("REACHED HERE!!");
                        if (!fileEntry) {
                            fail(new Error("No File"))
                            return;
                        };
                        fileEntry.file(function (file) {
                            var reader = new FileReader();
                            reader.onloadend = function (e) {
                                success(JSON.parse(this.result));
                            }
                            reader.readAsText(file);
                        });

                    }, function(e){
                        fail(e)
                    });
                }
            }
        }
    })
    .factory('loadCacheMusicList', function (loadFileData) {
        return function (success, fail) {
            loadFileData('cache_data', success, fail);
        }
    })
    
