inlets = 1;
outlets = 1;
setinletassist(0, "track id");

function getDeviceByName(trackId, deviceName) {
    var track = new LiveAPI('id ' + trackId);
    outlet(0, 'start');
    for (var i = 0; i < track.getcount('devices'); i++) {
        var device = new LiveAPI(track.unquotedpath + ' devices ' + i);
        if (device.get('name') === deviceName) {
            sendOutDeviceId(device.id);
            return;
        }
        if (device.type === 'RackDevice') {
            findDeviceWithinRack(device, deviceName);
        }
    }
}

function findDeviceWithinRack(rack, deviceName) {
    for (var i = 0; i < rack.getcount('chains'); i++) {
        var chain = new LiveAPI(rack.unquotedpath + ' chains ' + i);
        for (var i = 0; i < chain.getcount('devices'); i++) {
            var device = new LiveAPI(chain.unquotedpath + ' devices ' + i);
            if (device.get('name') == deviceName) {
                sendOutDeviceId(device.id);
                return;
            }
            if (device.type === 'RackDevice') {
                findDeviceWithinRack(device, deviceName);
            }
        }
    }
}

function sendOutDeviceId(id) {
    outlet(0, ['id', Number(id)]);
}