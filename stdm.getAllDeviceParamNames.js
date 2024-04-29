inlets = 1;
outlets = 2;
setinletassist(0, "getNames");
setoutletassist(0, "[param index] [param name]");
setoutletassist(1, "bang when done");

function getNames(deviceId) {
    var device = LiveAPI('id ' + deviceId)
    // We start from 1 to skip the first param which is always "Device On"
    for (var i = 1; i < device.getcount('parameters'); i++) {
        var deviceParam = new LiveAPI(device.unquotedpath + ' parameters ' + i);
        outlet(0, i, deviceParam.get('name'))
    }
    outlet(1, 'bang')
}

