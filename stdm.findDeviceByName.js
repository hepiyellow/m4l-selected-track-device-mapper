inlets = 1;
outlets = 1;
setinletassist(0, "track id, targetDeviceName");

function getDeviceByName(trackId, deviceName) {
    var track = new LiveAPI('id ' + trackId);
    for (var i = 0; i < track.getcount('devices'); i++) {
        var device = new LiveAPI(track.unquotedpath + ' devices ' + i);
        if (device.get('name') == deviceName) {
            _sendOutDeviceId(device.id);
            return;
        }
        if (device.type == 'RackDevice') {
            _findDeviceWithinRack(device, deviceName);
        }
    }
}

function _findDeviceWithinRack(rack, deviceName) {
    for (var i = 0; i < rack.getcount('chains'); i++) {
        var chain = new LiveAPI(rack.unquotedpath + ' chains ' + i);
        for (var j = 0; j < chain.getcount('devices'); j++) {
            var device = new LiveAPI(chain.unquotedpath + ' devices ' + j);
            if (device.get('name') == deviceName) {
                _sendOutDeviceId(device.id);
                return;
            }
            if (device.type == 'RackDevice') {
                _findDeviceWithinRack(device, deviceName);
            }
        }
    }
}

function _sendOutDeviceId(id) {
    outlet(0, ['id', Number(id)]);
}

function log(msg) {
    post(msg + '\n')
}