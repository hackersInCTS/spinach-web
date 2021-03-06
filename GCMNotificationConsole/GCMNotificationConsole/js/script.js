// View models
var MapViewModel = function () {
    this.location = "New York, NY";
    this.zoom = 14;
    this.width = 288;
    this.height = 200;
    this.markers = ["New York, NY"];
    this.sensor = true;
    this.getMapUrl = function () {
        return 'https://maps.googleapis.com/maps/api/staticmap?center=' + this.location +
            '&zoom=' + this.zoom + '&size=' + this.width + 'x' + this.height +
            '&markers=' + this.markers.join('|') + '&sensor=' + this.sensor;
    };
};

//Namespaced JS
var Swoosh = Swoosh || {};

Swoosh.Common = (function ($) {
    return {
        alert: function (message) {
            try {
                navigator.notification.alert(message, $.noop, "Swoosh");
            }
            catch (e) {
                alert(message);
            }
        },
        getQueryStringValue: function (name) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(window.location.search);
            if (results == null)
                return "";
            else
                return decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    };
}(jQuery));

Swoosh.Home = (function ($) {
    return {
        deviceReady: function () {
            Parse.initialize("yMQl1IsnmiQZGS8TC1Y3mt4OQ05KwVxAZUvCvlD7", "qTKk5cT5J0xRifoYGm1BPyY9nE7jPWEkDSRA31aN");
            Swoosh.Device.register();
            var pushedMessage = Swoosh.Common.getQueryStringValue("jsonData");
            console.log(pushedMessage);
            if (pushedMessage !== "") {
                Swoosh.PushNotification.show(JSON.parse(pushedMessage).message);
            }
        },
        currentLocationClick: function () {
            $('#CurrentLocationFlag').val(true);
            Swoosh.Home.goToMapPage();
        },
        goToMapPage: function () {
            Swoosh.Map.resetMaps();
            $.mobile.changePage($('#map'));
        },
        getCurrentAcceleration: function () {
            var alertAcceleration = function (acceleration) {
                Swoosh.Common.alert('Acceleration X: ' + acceleration.x + '\n' +
                    'Acceleration Y: ' + acceleration.y + '\n' +
                    'Acceleration Z: ' + acceleration.z + '\n' +
                    'Timestamp     : ' + acceleration.timestamp + '\n');
            };
            var alertAccelerationError = function () {
                Swoosh.Common.alert('onError!');
            };
            Swoosh.Accelerometer.getAcceleration(alertAcceleration, alertAccelerationError);
        },
        getSpeedAndLocation: function () {
            Swoosh.Map.getSpeedAndLocation();
        }
    };
}(jQuery));

Swoosh.LocationDialog = (function ($) {
    return {
        plotSpecificLocationClick: function (e) {
            if ($('#address').val()) {
                $('#CurrentLocationFlag').val(false);
                Swoosh.Home.goToMapPage();
            } else {
                e.preventDefault();
            }
        }
    };
}(jQuery));

Swoosh.Map = (function ($) {
    return {
        initialize: function () {
            if ($('#CurrentLocationFlag').val() === 'true') {
                Swoosh.Map.getCurrentPositionAndGeocode();
            } else {
                Swoosh.Map.getSpecificLocation();
            }
        },
        resetMaps: function () {
            $('#mapPlotImg').attr('src', '');
            $('#LocationMarker').empty();
        },
        getSpecificLocation: function () {
            var userInput = $('#address').val();
            $('#address').val('');
            var onGeocodeSuccess = function (location) {
                var mapViewModel = new MapViewModel();
                mapViewModel.location = location.latitude + ', ' + location.longitude;
                mapViewModel.markers = [location.address];
                $('#LocationMarker').text(location.address);
                Swoosh.Map.plotMap(mapViewModel);
            };
            var onGeocodeError = function (mapViewModel) {
                return function (errorReason) {
                    console.log(errorReason);
                };
            };
            Swoosh.GoogleMaps.geocode(userInput, onGeocodeSuccess, onGeocodeError);
        },
        getCurrentPosition: function (onSuccess) {
            var onGetPositionError = function (error) {
                Swoosh.Common.alert('Code   : ' + error.code + '\n' +
                    'Message: ' + error.message + '\n');
            };
            var geoLocationOptions = {
                maximumAge: 1000,
                timeout: 3000,
                enableHighAccuracy: true
            };
            navigator.geolocation.getCurrentPosition(onSuccess, onGetPositionError, geoLocationOptions);
        },
        getCurrentPositionAndGeocode: function () {
            var onReverseGeocodeSuccess = function (mapViewModel) {
                return function (resolvedCity) {
                    $('#LocationMarker').text(resolvedCity);
                    Swoosh.Map.plotMap(mapViewModel);
                };
            };
            var onReverseGeocodeError = function (mapViewModel) {
                return function (errorReason) {
                    console.log(errorReason);
                    Swoosh.Map.plotMap(mapViewModel);
                };
            };
            var onGetPositionSuccess = function (position) {
                var mapViewModel = new MapViewModel();
                var location = position.coords.latitude + ', ' + position.coords.longitude;
                mapViewModel.location = location;
                mapViewModel.markers = [location];
                Swoosh.GoogleMaps.reverseGeocode(position.coords.latitude,
                    position.coords.longitude,
                    onReverseGeocodeSuccess(mapViewModel),
                    onReverseGeocodeError(mapViewModel));
            };
            Swoosh.Map.getCurrentPosition(onGetPositionSuccess);
        },
        getSpeedAndLocation: function () {
            var onGetSpeedAndLocationSuccess = function (position) {
                Swoosh.Common.alert('Latitude : ' + position.coords.latitude + '\n' +
                    'Longitude: ' + position.coords.longitude + '\n' +
                    'Speed    : ' + position.coords.speed + '\n');
            };
            Swoosh.Map.getCurrentPosition(onGetSpeedAndLocationSuccess);
        },
        plotMap: function (mapViewModel) {
            $('#mapPlotImg').attr('src', mapViewModel.getMapUrl());
        }
    };
}(jQuery));

Swoosh.AccelerationDialog = (function ($) {
    return {
        watchAcceleration: function () {
            var interval = parseInt($('#interval :radio:checked').val(), 10);
            var options = { frequency: interval };
            var onSuccess = function (acceleration) {
                Swoosh.Common.alert('Acceleration X: ' + acceleration.x + '\n' +
                    'Acceleration Y: ' + acceleration.y + '\n' +
                    'Acceleration Z: ' + acceleration.z + '\n' +
                    'Timestamp: ' + acceleration.timestamp + '\n');
            };
            var onError = function (error) {
                Swoosh.Common.alert('error!');
            };
            if (interval) {
                $('#startWatchButton').hide();
                $('#clearWatchButton').show();
                Swoosh.Accelerometer.watchAcceleration(onSuccess, onError, options);
            }
        }
    };
}(jQuery));

Swoosh.Parse = (function ($) {

    return {
        createObject: function (typeName) {
            var type = Parse.Object.extend(typeName);
            return new type();
        },
        saveObject: function (parseObject, attributes, onSuccess, onError) {
            parseObject.save(attributes, {
                success: onSuccess,
                error: onError
            });
        }
    };
}(jQuery));

Swoosh.Parse.Photo = (function ($) {
    var photo = "";

    var onImageSave = function (imageObject) {
        photo = "";
        alert("Saved image");
    };

    var onError = function (imageObject, error) {
        alert(JSON.stringify(error));
    };

    return {
        setPhoto: function (item) {
            photo = item;
        },
        uploadPhoto: function () {
            if (photo !== "") {
                var image = Swoosh.Parse.createObject("Image");
                Swoosh.Parse.saveObject(image, { item: photo }, onImageSave, onError);
            }
        }
    };
}(jQuery));

Swoosh.Parse.Audio = (function ($) {
    var audio = "";

    var onAudioSave = function (imageObject) {
        audio = "";
        alert("Saved audio");
    };

    var onError = function (imageObject, error) {
        alert(JSON.stringify(error));
    };

    return {
        uploadAudio: function (mediaFile) {
            audio = $.extend({}, mediaFile);

            var reader = new FileReader();
            reader.onloadend = function (evt) {
                audio.stream = evt.target.result;
                var audioObject = Swoosh.Parse.createObject("Audio");
                Swoosh.Parse.saveObject(audioObject, audio, onAudioSave, onError);
            };
            reader.readAsDataURL(mediaFile.fullPath);
        }
    };
}(jQuery));

Swoosh.Parse.Video = (function ($) {
    var video = "";

    var onVideoSave = function (videoObject) {
        video = "";
        alert("Saved video");
    };

    var onError = function (videoObject, error) {
        alert(JSON.stringify(error));
    };

    return {
        uploadVideo: function (mediaFile) {
            video = $.extend({}, mediaFile);

            var reader = new FileReader();
            reader.onloadend = function (evt) {
                video.stream = evt.target.result;
                var videoObject = Swoosh.Parse.createObject("Video");
                Swoosh.Parse.saveObject(videoObject, video, onVideoSave, onError);
            };
            reader.readAsDataURL(mediaFile.fullPath);
        }
    };
}(jQuery));
Swoosh.GetPhotoDialog = (function ($) {
    return {
        fromLibrary: function () {
            Swoosh.GetPhotoDialog.getPhoto(navigator.camera.PictureSourceType.PHOTOLIBRARY);
        },
        fromCamera: function () {
            Swoosh.GetPhotoDialog.getPhoto(navigator.camera.PictureSourceType.CAMERA);
        },
        getPhoto: function (sourceType) {
            var destinationType,
                selectedDestinationType = $('#destinationType :radio:checked').val();
            if (selectedDestinationType === "0") {
                destinationType = navigator.camera.DestinationType.DATA_URL;
            } else if (selectedDestinationType === "1") {
                destinationType = navigator.camera.DestinationType.FILE_URI;
            } else {
                Swoosh.Common.alert('Please select the destination type (\'Data URL\' or \'File URI\')');
                return;
            }
            var cameraOptions = {
                quality: 75,
                destinationType: destinationType,
                sourceType: sourceType,
                allowEdit: true,
                encodingType: navigator.camera.EncodingType.JPEG,
                mediaType: navigator.camera.MediaType.PICTURE,
                correctOrientation: true,
                popoverOptions: {
                    //only relevant for iOS
                },
                saveToPhotoAlbum: false
            };
            var onGetPhotoSuccess = function (imageData) {
                var formattedImageData;
                if (destinationType === navigator.camera.DestinationType.DATA_URL) {
                    formattedImageData = 'data:image/jpeg;base64,' + imageData;
                    Swoosh.Parse.Photo.setPhoto(formattedImageData);
                } else {
                    var reader = new FileReader();
                    reader.onloadend = function (evt) {
                        Swoosh.Parse.Photo.setPhoto(evt.target.result);
                    };
                    reader.readAsDataURL(imageData);
                    formattedImageData = imageData;
                }

                $('#photoDisplay').attr('src', formattedImageData)
                    .css({
                        width: $(window).width() - 50
                    })
                    .show();
                $.mobile.changePage($('#showPhotoDialog'));
            };
            var onGetPhotoError = function (message) {
                console.log('navigator.camera.getPicture failed with message: ' + message);
            };
            navigator.camera.getPicture(onGetPhotoSuccess, onGetPhotoError, cameraOptions);
        }
    };
}(jQuery));

Swoosh.ShowPhotoDialog = (function ($) {
    return {
        close: function () {
            $('#photoDisplay').attr('src', '').hide();
        }
    };
}(jQuery));

Swoosh.QRCodeScanner = (function ($) {
    return {
        onScanSuccess: function (results) {
            Swoosh.Common.alert('Scan result: ' + results[0]);
        },
        onScanCancel: function () {
            console.log('QR Code Scan canceled.');
        },
        scan: function () {
            scanditSDK.scan(Swoosh.QRCodeScanner.onScanSuccess,
                Swoosh.QRCodeScanner.onScanCancel,
                "4ABoYAsrEeKA+T2bxul+mhOXR7pIOLby9vVmgFSTTOw",
                {
                    'beep': true,
                    'qr': true,
                    'scanningHotspot': '0.5/0.5',
                    'vibrate': true,
                    'torch': true,
                    'titleMessage': 'Scan the QR Code'
                }
            );
        }
    };
}(jQuery));

Swoosh.Capture = (function ($) {

    var captureVideoSuccess = function (mediaFiles) {
        if (jQuery.isArray(mediaFiles) && mediaFiles.length > 0) {
            Swoosh.Parse.Video.uploadVideo(mediaFiles[0]);
        }
    };

    var captureVideoError = function (error) {
        alert('Error in CaptureVideo function: ' + JSON.stringify(error));
    };

    var captureAudioSuccess = function (mediaFiles) {
        if (jQuery.isArray(mediaFiles) && mediaFiles.length > 0) {
            Swoosh.Parse.Audio.uploadAudio(mediaFiles[0]);
        }
    };

    var captureAudioError = function (error) {
        alert('Error in CaptureAudio function: ' + JSON.stringify(error));
    };

    return {
        captureAudio: function () {
            navigator.device.capture.captureAudio(
                captureAudioSuccess,
                captureAudioError,
                {
                    limit: 1
                });
        },
        captureVideo: function () {
            navigator.device.capture.captureVideo(
                captureVideoSuccess,
                captureVideoError,
                {
                    limit: 1
                });
        }
    };
}(jQuery));

Swoosh.Accelerometer = (function ($) {
    var watchID;
    return {
        getAcceleration: function (onSuccess, onError) {
            navigator.accelerometer.getCurrentAcceleration(onSuccess, onError);
        },
        watchAcceleration: function (onSuccess, onError, options) {
            watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
        },
        clearWatch: function () {
            $('#startWatchButton').show();
            $('#clearWatchButton').hide();
            if (watchID) {
                navigator.accelerometer.clearWatch(watchID);
                watchID = null;
            }
        }
    };
}(jQuery));

Swoosh.Device = (function ($) {
    return {
        Class: Parse.Object.extend("SwooshDevice"),
        instance: null,
        getDeviceId: function () {
            return device.platform + "_" + device.name + "_" + device.uuid;
        },
        registerQuerySuccess: function (spinachDevice) {
            if (spinachDevice) {
                console.log('Successfully retrieved device... Dummy save' + JSON.stringify(spinachDevice));
                spinachDevice.save({
                    success: function (spinachDevice) {
                        console.log('Successfully updated device...' + JSON.stringify(spinachDevice));
                        Swoosh.Device.instance = spinachDevice;
                        navigator.splashscreen.hide();
                    },
                    error: function (error) {
                        console.log('Error in update-date: ' + JSON.stringify(error));
                        navigator.splashscreen.hide();
                    }
                });
            } else {
                console.log('Could not retrieve device... Registering with GCM before add...');
                Swoosh.GCM.register();
            }
        },
        register: function () {
            var query = new Parse.Query(Swoosh.Device.Class);
            query.equalTo('deviceId', Swoosh.Device.getDeviceId());
            query.first({
                success: Swoosh.Device.registerQuerySuccess,
                error: function (error) {
                    console.log('Error in find: ' + JSON.stringify(error));
                    navigator.splashscreen.hide();
                }
            });
        },
        add: function (apnsDeviceId, gcmDeviceId) {
            var spinachDevice = new Swoosh.Device.Class();
            spinachDevice.save(
                {
                    deviceId: Swoosh.Device.getDeviceId(),
                    name: device.name,
                    cordova: device.cordova,
                    platform: device.platform,
                    uuid: device.uuid,
                    version: device.version,
                    apnsDeviceId: apnsDeviceId,
                    gcmDeviceId: gcmDeviceId
                },
                {
                    success: function (spinachDevice) {
                        console.log("Added device...: " + JSON.stringify(spinachDevice));
                        Swoosh.Device.instance = spinachDevice;
                        Swoosh.Common.alert('Added device to database...');
                        navigator.splashscreen.hide();
                    },
                    error: function (error) {
                        console.log('Error adding device: ' + JSON.stringify(error));
                        navigator.splashscreen.hide();
                    }
                });
        },
        delete: function () {
            Swoosh.Device.instance.destroy({
                success: function (spinachDevice) {
                    console.log('Device deleted successfully: ' + JSON.stringify(spinachDevice));
                },
                error: function (spinachDevice, error) {
                    console.log('Error deleting device: ' + JSON.stringify(error));
                }
            });
        }
    };
}(jQuery));

Swoosh.GoogleMaps = (function ($) {
    return {
        geocode: function (address, onSuccess, onError) {
            var geoCoder = new google.maps.Geocoder();
            geoCoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var location = {
                        longitude: results[0].geometry.location.lng,
                        latitude: results[0].geometry.location.lat,
                        address: results[0].formatted_address
                    };
                    onSuccess(location);
                } else {
                    onError('Geocode was not successful for the following reason: ' + status);
                }
            });
        },
        reverseGeocode: function (latitude, longitude, onSuccess, onError) {
            var latLong = new google.maps.LatLng(latitude, longitude);
            var geoCoder = new google.maps.Geocoder();
            geoCoder.geocode({
                'latLng': latLong
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[4]) {
                        return onSuccess(results[4].formatted_address);
                    }
                } else {
                    onError("reverseGeocode failed due to: " + status);
                }
            });
        }
    };
}(jQuery));

Swoosh.PushNotification = (function ($) {
    return {
        show: function (message) {
            Swoosh.Common.alert(message);
        }
    };
}(jQuery));

Swoosh.GCM = (function ($) {
    return {
        gcmDeviceId: null,
        registerSuccess: function (obj) {
            console.log('Successfully registered. Waiting for GCM callback: ' + JSON.stringify(obj));
        },
        registerError: function (error) {
            console.log('Error in register: ' + JSON.stringify(error));
            navigator.splashscreen.hide();
        },
        register: function () {
            window.GCM.register("237121290143",
                Swoosh.GCM.registerSuccess,
                Swoosh.GCM.registerError);
        },
        unRegisterSuccess: function (obj) {
            console.log('Successfully unregistered. Waiting for GCM callback: ' + JSON.stringify(obj));
        },
        unRegisterError: function (error) {
            console.log('Error in unregister: ' + JSON.stringify(error));
        },
        unRegister: function () {
            Swoosh.Device.delete ();
            window.GCM.unregister("237121290143",
                Swoosh.GCM.unRegisterSuccess,
                Swoosh.GCM.unRegisterError);
        },
        callback: function (e) {
            console.log('GCM Event Received: ' + e.event);
            switch (e.event) {
                case 'registered':
                    Swoosh.Device.gcmDeviceId = e.regid;
                    if (Swoosh.Device.gcmDeviceId.length > 0) {
                        console.log('Received GCM Device ID: ' + Swoosh.Device.gcmDeviceId);
                        console.log('Calling \'Swoosh.Device.add\' with empty APNS ID and valid GCM Device ID');
                        Swoosh.Device.add('', e.regid);
                    }
                    break;
                case 'unregistered':
                    console.log('Received confirmation on Unregister');
                    Swoosh.Common.alert('Unregistered device successfully.');
                    break;
                case 'message':
                    Swoosh.PushNotification.show(e.message);
                    break;
                case 'error':
                    Swoosh.Common.alert('Error: ' + e.msg);
                    break;
                default:
                    Swoosh.Common.alert('An unknown event was received: ' + JSON.stringify(e));
                    break;
            }
        }

    };
}(jQuery));

Swoosh.Popup = (function ($) {
    return {
        preventDefault: function (touchEvent) {
            touchEvent.preventDefault();
        }
    }
}(jQuery));

//Page specific initialize events
$(document).on("pageshow", "#map", function () {
    Swoosh.Map.initialize();
});

//Document initialize events
$(document).ready(function () {
    $(document).on('deviceready', Swoosh.Home.deviceReady);
    $(document).on('click', '#CurrentLocation', Swoosh.Home.currentLocationClick);
    $(document).on('click', '#GetSpeedAndLocation', Swoosh.Home.getSpeedAndLocation);
    $(document).on('click', '#GetAcceleration', Swoosh.Home.getCurrentAcceleration);

    $(document).on('click', '#PlotSpecificLocationButton', Swoosh.LocationDialog.plotSpecificLocationClick);

    $(document).on('click', '#startWatchButton', Swoosh.AccelerationDialog.watchAcceleration);
    $(document).on('click', '#clearWatchButton', Swoosh.Accelerometer.clearWatch);

    $(document).on('click', '#ScanQRCodeButton', Swoosh.QRCodeScanner.scan);

    $(document).on('click', '#FromLibraryButton', Swoosh.GetPhotoDialog.fromLibrary);
    $(document).on('click', '#FromCameraButton', Swoosh.GetPhotoDialog.fromCamera);

    $(document).on('click', '#ShowPhotoCancelButton', Swoosh.ShowPhotoDialog.close);

    $(document).on('click', '#CaptureAudioButton', Swoosh.Capture.captureAudio);

    $(document).on('click', '#CaptureVideoButton', Swoosh.Capture.captureVideo);

    $(document).on('click', '#UnregisterGCMButton', Swoosh.GCM.unRegister);

    $(document).on('click', '#UploadPhoto', Swoosh.Parse.Photo.uploadPhoto);

    $("#popupPanel").on({
        popupbeforeposition: function () {
            var h = $(window).width();
            $("#popupPanel").css("width", h);
        }
    });

    $('#popupInvoker, #popupPanel').addSwipeEvents().bind('swipe', function (evt, touch) {
        if (touch.eventType === "swipeup") {
            $("#popupPanel").popup("open");
        } else if (touch.eventType === "swipedown") {
            $("#popupPanel").popup("close");
        }
    });

    $("#pageFooter, #popupPanel").on({
        vmouseover: function () {
            document.addEventListener('touchmove', Swoosh.Popup.preventDefault, false);
        },
        vmouseout: function () {
            document.removeEventListener('touchmove', Swoosh.Popup.preventDefault, false);
        }
    });
});