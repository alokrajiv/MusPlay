angular.module('Musplay.services.main', ['Musplay.services.fileOps'])
    .factory('cacheMusicList', function (saveFileData) {
        return function (musicList) {
            saveFileData("cache_data", JSON.stringify({
                musicList: musicList,
                timeStamp: Math.floor((new Date).getTime() / 1000)
            }));
        };
    })

    .factory('loadCacheMusicList', function (loadFileData) {
        return function (success, fail) {
            loadFileData('cache_data', success, fail);
        }
    })

    .factory('searchLoadMusic', function () {
        return function (updates, success, fail) {
            var data = []
            var async_ctrl_no = 0;
            window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, gotDir, fail);
            function gotDir(dirEntry) {
                async_ctrl_no++;
                var directoryReader = dirEntry.createReader();
                directoryReader.readEntries(function (entries) {
                    for (var i = 0; i < entries.length; i++) {
                        var entry = entries[i];
                        if (entry.isDirectory) {
                            gotDir(entry);
                        }
                        else if (isAudioFile(entry)) {
                            data.push({
                                name: entry.name,
                                path: entry.toInternalURL()
                            });
                            updates(data);
                        }
                    }
                    async_ctrl_no--;
                    if (async_ctrl_no === 0) {
                        success(data);
                    };
                }, function (error) {
                    alert("Failed to list directory contents: " + error.code);
                    fail(error);
                });
            }
        }
    })