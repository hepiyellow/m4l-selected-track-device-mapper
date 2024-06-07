inlets = 1;
outlets = 1;
setinletassist(0, "Messages {set_param_id, auto_learn_enabled, param_enabled}");
setoutletassist(0, "{id [param id]},{feedback_enabled [1|0]}"); // just a a number

// Arguments
var paramIndex = -1

// State
var autoLearnEnabled
var paramEnabled
var curParamId = 0

function reset() {
    curParamId = 0
    _sendParamIdDisabled()
}

function set_param_index(_paramIndex) {
    paramIndex = _paramIndex
}

function set_param_id(paramId) {
    _log("set_param_id: " + paramId)
    curParamId = paramId
    if (_isEnabled()) {
        _sendParamId()
    }
}

function auto_learn_enabled(enabled) {
    _log("auto_learn_enabled: " + enabled)
    if (enabled !== autoLearnEnabled) {
        autoLearnEnabled = enabled
        if (_isAssigned()) {
            _onEnabledChanged()
        }
    }
}

function param_enabled(enabled) {
    _log("param_enabled: " + enabled)
    if (enabled !== paramEnabled) {
        paramEnabled = enabled
        if (_isAssigned()) {
            _onEnabledChanged()
        }
    }
}


/*******************
 * PRIVATE
 ******************/
function _isEnabled() {
    return autoLearnEnabled || paramEnabled
}

function _isAssigned() {
    return curParamId > 0
}

function _onEnabledChanged() {
    if (_isEnabled()) {
        _sendParamId()
    } else {
        _sendParamIdDisabled()
    }

    _sendFeedbackEnabled(paramEnabled && !autoLearnEnabled)
}

/**
 * OUTLETS
 */
function _sendParamId() {
    _log("paramId = " + curParamId)
    outlet(0, ["id", curParamId])
}

function _sendParamIdDisabled() {
    outlet(0, ["id", 0])
}

function _sendFeedbackEnabled(enabled) {
    outlet(0, ["feedback_enabled", enabled])
}

/**
 * UTILITIES
 */
function _log(msg) {
    post('[PI= ' + paramIndex + '] ' + msg + '\n')
}
