inlets = 1;
outlets = 1;
setinletassist(0, "parameters [id x id y ...]");
setoutletassist(0, "{value_changed [value] [paramIndex]}");

var logStartTime = Date.now();
// This caches params from ALL devices and ALL tracks
// to improve performance. Creating and changing LiveAPI is slow.
/**
 * Maps paramId -> ParamData
 * type ParamData = {
 *    api: LiveAPI,
 *    index: number,
 *    feedbackEnabled: boolean
 *    expectedOnChangedCount: number
 * }
 */
var paramsById = {}
var activeParamsById = {} // Maps paramId -> true-stub (Using object instead of Set())
var activeParamsByIndex = {} // Maps paramIndex -> true-stub (Using object instead of Set())

function init() {
    paramsById = {}
    activeParamsById = {}
}

/**
 * Called with a paramId list of the current seleected device's parameters
 */
function parameters() {
    _resetLogTime()

    Object.keys(paramsById).length
    _log("messagename: " + messagename)
    _log("arguments: " + arguments)
    var args = arrayfromargs(arguments)
    _log("args: " + args)
    activeParamsById = {}
    activeParamsByIndex = {}
    for (var paramIndex = 0; paramIndex < args.length / 2; paramIndex++) {
        var paramId = args[((paramIndex) * 2) + 1];
        var param = _getOrCreateParam({ paramIndex: paramIndex, paramId: paramId })
        activeParamsById[paramId] = param;
        activeParamsByIndex[paramIndex] = param;
        _log("paramIndex=" + paramIndex + ", paramId=" + paramId + ", value=" + param.api.get("value"))

    }
    // while (paramIndex < paramsById.length) {
    //     // params[paramIndex].api.id = 0;
    //     log("paramIndex=" + paramIndex + ", Disconnecting")
    //     paramIndex++;
    // }
}

/**
 * Sets the value of a parameter.
 * Also disabled feedback.
 * We wait (100ms) for the feedback to be enabled by an enable_feedback massage.
 * We don't do timer in Javascript.
 * @param {*} paramIndex 
 * @param {*} midiValue 
 */
function set_value(paramIndex, midiValue) {
    var param = activeParamsByIndex[paramIndex];
    if (param) {
        _log("setValue: paramIndex =" + paramIndex + ", value =" + midiValue + ", expectedOnChangedCount = " + param.expectedOnChangedCount)
        // Disabling feedback to avoid feedback loop
        // We wait (100ms) for the feedback to be enabled by an enable_feedback massage.
        _setFeedbackEnabled(paramIndex, false)
        param.expectedOnChangedCount = param.expectedOnChangedCount + 1;
        param.api.set("value", _normalizeMidiValue(midiValue))
    } else {
        _log("Ignoring setValue for inactive paramIndex=" + paramIndex)
    }
}

function enable_feedback(paramIndex) {
    _setFeedbackEnabled(paramIndex, true);
}

/**
 * PRIVATE
 */

function _getOrCreateParam(paramData) {
    var paramIndex = paramData.paramIndex;
    var paramId = paramData.paramId;
    // if (api) {
    //     api.disconnect();
    // }
    var param = paramsById[paramId];
    if (!param) {
        _log("** paramId=" + paramId + ", Creating API Object")
        param = {}
        paramsById[paramId] = param;
        param.api = new LiveAPI(_onParamValueChanged, "id " + paramId);
        param.api.property = "value";
        param.index = paramIndex; // 0-based index within device
        param.expectedOnChangedCount = 0;
    }
    return param
}

function _onParamValueChanged(args) {
    var param = activeParamsById[this.id]
    if (!param) {
        _log("Ignoring callback for inactive paramId=" + this.id)
        return
    }
    _log("callback: id=" + this.id + " index=" + param.index + " value=" + args[1] + ", [value_changed], expectedOnChangedCount = " + param.expectedOnChangedCount)
    // if (param.feedbackEnabled) {
    if (param.expectedOnChangedCount <= 0) {
        _log("-- callback: fire feedback");
        param.expectedOnChangedCount = param.expectedOnChangedCount - 1;
        outlet(0, ["value_changed", args[1], param.index]);
    } else {
        _log("-- Ignoring callback for paramId=" + this.id + " due to expectedOnChangedCount = " + param.expectedOnChangedCount)
        param.expectedOnChangedCount = param.expectedOnChangedCount - 1;
    }
}

function _setFeedbackEnabled(paramIndex, enabled) {
    var param = activeParamsByIndex[paramIndex];
    if (param) {
        param.feedbackEnabled = enabled;
    } else {
        _log("Ignoring _setFeedbackEnabled for inactive paramIndex=" + paramIndex)
    }
}

function _resetLogTime() {
    logStartTime = Date.now();
}
function _now() {
    return Date.now();
}

function _log(msg) {
    var elapsed = ((_now() - logStartTime) / 1000).toFixed(1);
    post("[" + elapsed + "] " + msg + '\n')
}

function _normalizeMidiValue(value) {
    return value / 127;
}
