inlets = 1;
outlets = 2;

setinletassist(0, "[track id] ...");
setoutletassist(0, "If track id matches this device track id, then [track id, device name]");
setoutletassist(1, "If track id does not match this device track id, then [track id, device name]");

function list(trackId, deviceName) {
    var thisDeviceTrackId = getThisDeviceTrackId();
    if (thisDeviceTrackId == trackId) {
        outlet(0, [trackId, deviceName]);
    } else {
        outlet(1, [trackId, deviceName]);
    }
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
