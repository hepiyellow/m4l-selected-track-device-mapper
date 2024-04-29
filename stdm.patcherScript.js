inlets = 1;
outlets = 3;
setinletassist(0, "something");
setoutletassist(0, "to thispatcher object");
setoutletassist(1, "to live.thisdevice object");
setoutletassist(2, "visible_column_count [number];");

var p = this.patcher.parentpatcher;

var MARGIN_SMALL = 5
var SIZE_PANEL_WIDTH = 106
var patcher_rect_origin = { x: 200, y: 120 }
var presentation_rect_origin = { x: SIZE_PANEL_WIDTH + MARGIN_SMALL, y: MARGIN_SMALL }
var param_ui_size = { w: 166, h: 20 }
var PARAM_UI_MARGIN = { x: MARGIN_SMALL, y: 0 }
var PARAMS_PER_COLUMN = 8
var MAX_PARAM_UI_OBJECTS = 99; // (we want to save horizontal room, so param index label is limited to 2 digits)
var MIN_COLUMN_COUNT = 0
var MAX_COLUMN = Math.floor(MAX_PARAM_UI_OBJECTS / PARAMS_PER_COLUMN) //  13

// State

function moreParams(curColumnCount) {
    log('moreParams cur=' + curColumnCount)
    if (curColumnCount < MAX_COLUMN) {
        setVisibleParamColumnCount(curColumnCount + 1)
    }
}

function lessParams(curColumnCount) {
    if (curColumnCount > MIN_COLUMN_COUNT) {
        setVisibleParamColumnCount(curColumnCount - 1)
    }
}

function deleteParamUIObjects() {
    log('deleteParamUIObjects')
    for (var i = 0; i < MAX_PARAM_UI_OBJECTS; i++) {
        var paramIndex = i + 1
        log(_exists(paramIndex))
        if (_exists(paramIndex)) {
            outlet(0, ['script', 'delete', _createVarName(paramIndex)])
        }
    }
}

function createParamUIObjects(count) {
    for (var i = 0; i < MAX_PARAM_UI_OBJECTS; i++) {
        var paramIndex = i + 1
        if (paramIndex <= count) {
            if (_exists(paramIndex)) {
                continue
            } else {
                var row = i % PARAMS_PER_COLUMN
                var column = Math.floor(i / PARAMS_PER_COLUMN)
                _createParamUIBPatcher(column, row, paramIndex)
            }
        } else {
            if (_exists(paramIndex)) {
                outlet(0, ['script', 'delete', _createVarName(paramIndex)])
            }
        }
    }
}

function setVisibleParamUIObjects(count) {
    setVisibleParamColumnCount(Math.ceil(count / PARAMS_PER_COLUMN))
}

function setVisibleParamColumnCount(columnCount) {
    _updateDeviceWidth(columnCount)
    outlet(2, ['visible_column_count', columnCount]);
}

function _createParamUIBPatcher(column, row, paramIndex) {
    var varname = _createVarName(paramIndex)
    // var scriptList = ['script', 'new', varname, 'bpatcher', patcher_rect_origin.x + column * param_ui_size.w, patcher_rect_origin.y + row * param_ui_size.h, param_ui_size.w, param_ui_size.h, 0, 0, 'stdm.paramUI', 0, paramIndex]
    var scriptList = [
        'script',
        'newobject',
        'bpatcher',
        '@varname',
        varname,
        '@name',
        'stdm.paramUI',
        '@args',
        paramIndex,
        '@patching_rect',
        patcher_rect_origin.x + column * (param_ui_size.w + PARAM_UI_MARGIN.x),
        patcher_rect_origin.y + row * param_ui_size.h,
        param_ui_size.w,
        param_ui_size.h,
        '@presentation',
        1,
        '@presentation_rect',
        presentation_rect_origin.x + column * (param_ui_size.w + PARAM_UI_MARGIN.x),
        presentation_rect_origin.y + row * param_ui_size.h,
        param_ui_size.w,
        param_ui_size.h,
    ]

    outlet(0, scriptList)
}

function _exists(paramIndex) {
    var varname = _createVarName(paramIndex)
    var obj = p.getnamed(varname)
    return obj !== null
}

function _getParamUIObj(paramIndex) {
    var varname = _createVarName(paramIndex)
    return p.getnamed(varname)
}

function _getParamObjCount() {
    var count = 0
    for (var i = 0; i < MAX_PARAM_UI_OBJECTS; i++) {
        var paramIndex = i + 1
        if (_exists(paramIndex)) {
            count++
        }
    }
    return count

}

function _updateDeviceWidth(columns) {
    var width = SIZE_PANEL_WIDTH + MARGIN_SMALL + columns * (param_ui_size.w + PARAM_UI_MARGIN.x)
    outlet(1, ['setwidth', width])
}

function _createVarName(paramIndex) {
    return 'param_ui_' + paramIndex
}



function log(msg) {
    post(msg + '\n')
}
