inlets = 1;
outlets = 2;

setinletassist(0, "track id, targetDeviceName");
setinletassist(1, "bang - when no device found");
var p = this.time
function getTargetDeviceInLiveSet(deviceName) {
    log('getTargetDeviceInLiveSet() deviceName=' + deviceName)
    log('time=' + p)
    var thisTrackId = getThisDeviceTrackId();
    var song = new LiveAPI('live_set');
    var foundIds = [];
    for (var i = 0; i < song.getcount('tracks'); i++) {
        log('track ' + i)
        var track = new LiveAPI(song.unquotedpath + ' tracks ' + i);
        if (track.id == thisTrackId) {
            continue;
        }
        var deviceId = _doGetTargetDeviceInTrack(track.id, deviceName);
        log('deviceId=' + deviceId)
        if (deviceId !== undefined) {
            foundIds.push(deviceId);
        }
    }
    log('foundIds.len=' + foundIds.length)
    if (foundIds.length === 0) {
        outlet(1, 'bang');
    } else {
        // TODO: Check multiple devices with different param count
        _sendOutDeviceId(foundIds[0]);
    }
}

function getTargetDeviceInTrack(trackId, deviceName) {
    log('getTargetDeviceInTrack() trackId=' + trackId + ', deviceName=' + deviceName)
    const deviceId = _doGetTargetDeviceInTrack(trackId, deviceName)
    log('deviceId=' + deviceId)
    if (deviceId !== undefined) {
        _sendOutDeviceId(deviceId);
    } else {
        outlet(1, 'bang');
    }
}

function _doGetTargetDeviceInTrack(trackId, deviceName) {
    var track = new LiveAPI('id ' + trackId);
    for (var i = 0; i < track.getcount('devices'); i++) {
        var device = new LiveAPI(track.unquotedpath + ' devices ' + i);
        if (device.get('name') == deviceName) {
            return device.id;
        }
        if (device.type == 'RackDevice') {
            foundDeviceId = _findDeviceWithinRack(device, deviceName);
            if (foundDeviceId) {
                return foundDeviceId;
            }
        }
    }
    return undefined;
}

function _findDeviceWithinRack(rack, deviceName) {
    for (var i = 0; i < rack.getcount('chains'); i++) {
        var chain = new LiveAPI(rack.unquotedpath + ' chains ' + i);
        for (var j = 0; j < chain.getcount('devices'); j++) {
            var device = new LiveAPI(chain.unquotedpath + ' devices ' + j);
            if (device.get('name') == deviceName) {
                return device.id;
            }
            if (device.type == 'RackDevice') {
                var foundDeviceId = _findDeviceWithinRack(device, deviceName);
                if (foundDeviceId) {
                    return foundDeviceId;
                }
            }
        }
    }
    return undefined
}

function _sendOutDeviceId(id) {
    outlet(0, ['id', Number(id)]);
}

function getThisDeviceTrackId() {
    var thisDevice = new LiveAPI('this_device');
    var thisDevicePath = thisDevice.unquotedpath;
    var parts = thisDevicePath.split(' ')
    var parentTrackPath = parts.splice(0, parts.length - 2).join(' ')
    var parentTrack = new LiveAPI(parentTrackPath);
    return parentTrack.id;

}

function log(msg) {
    post(msg + '\n')
}