inlets = 1;
outlets = 2;
setinletassist(0, "[index 0-based] [item list]");
setoutletassist(0, "item value");
setoutletassist(1, "bang - index not found");

/**
 * Receives a list if "index_to_get id 1 id 2 id 3,..."
 */
function get() {
    var args = arrayfromargs(messagename, arguments)
    var paramIndex = args[1];
    var list = args.splice(2);
    var idIndex = paramIndex * 2 + 1;
    if (idIndex < list.length) {
        outlet(0, list[idIndex]);
    } else {
        outlet(1, 'bang');
    }
}

function _log(msg) {
    post(msg + '\n')
}