inlets = 1;
outlets = 1;
setinletassist(0, "getNames");

function getNames(deviceId) {
    var device = LiveAPI('id ' + deviceId)
    // We start from 1 to skip the first param which is always "Device On"
    for (var i = 1; i < device.getcount('parameters'); i++) {
        var deviceParam = new LiveAPI(device.unquotedpath + ' parameters ' + i);
        post(deviceParam.get('name'))
        outlet(0, i, deviceParam.get('name'))
    }
}

