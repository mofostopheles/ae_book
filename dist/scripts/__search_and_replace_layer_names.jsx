/**
 * An After Effects script for replacing layer names. 
 */

// Copyright © 2019, Arlo Emerson
// arloemerson@gmail.com

/*
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

/**
 * Function with inner main function. Invoked at bottom of this file.
 * Loops selected comps' layers, performs name replacement based on 
 * search and replace params passed to main.
 */
var searchAndReplaceLayerNames = function() {
    app.beginUndoGroup("work_undo");

    return {
        arrSelectedComps: getSelectedComps(),
        /**
         * pSearchAndReplaceBundle is a two-dimensional array
         * where each item contains search/replace pairs.
         */
        main: function(pSearchAndReplaceBundle) {
            var compsChangedCounter = 0;
            for (var k = 0; k < this.arrSelectedComps.length; k++) {
                var selectedComp = this.arrSelectedComps[k];
                for (var j = 1; j <= selectedComp.layers.length; j++) {
                    var layer = selectedComp.layers[j];
                    var changeMade = false;
                    for (var ii = 0; ii < pSearchAndReplaceBundle.length; ii++) {
                        if (layer.name.indexOf(pSearchAndReplaceBundle[ii][0]) > -1) {
                            checkLock(layer);
                            layer.name = layer.name.replace(
                                pSearchAndReplaceBundle[ii][0],
                                pSearchAndReplaceBundle[ii][1]
                            );
                            changeMade = true;
                            checkLock(layer);
                        }
                    }
                }
                if (changeMade) {
                    compsChangedCounter++;
                }
            }
            aalert(compsChangedCounter + " comp/s total touched.");
        },
    }
    app.endUndoGroup();
};

/**
 * pFunction is a function containing the layer object.
 * Stores the state of the layer's lock state.
 */
function runCheckLock(pFunction) {
    var layerWasLocked = {
        state: false
    };

    return function() {
        var layer = arguments[0];
        if (layer.locked) {
            layer.locked = false;
            layerWasLocked.state = true;
            return;
        }
        if (layerWasLocked.state) {
            layer.locked = true;
            layerWasLocked.state = false;
        }
    }
}

/**
 * Convenience function for calling runCheckLock. 
 * pLayer is the current layer in the callee's loop.
 */
var checkLock = runCheckLock(function(pLayer) {});

// *************************************************************************
// **************************** HELPER METHODS *****************************
// *************************************************************************

/**
 * Returns an array of selected comps.
 */
var getSelectedComps = function() {
    var arrSelectedComps = new Array();
    for (var i = app.project.items.length; i >= 1; i--) {
        item = app.project.items[i];
        if ((item instanceof CompItem) && item.selected) {
            arrSelectedComps[arrSelectedComps.length] = item;
        }
    }

    if (arrSelectedComps.length < 1) {
        aalert("Please select at least one comp.");
    }
    return arrSelectedComps;
};

/**
 * Wraps an alert with verbose flag.
 */
function aalert(pArg) {
    if (verbose) {
        alert(pArg);
    }
}

// *************************************************************************
// ************************* USER DEFINED VARIABLES ************************
// *************************************************************************

var verbose = true; // Set to false to silence alerts.

var vars = {
    searchAndReplaceBundle: [ // each nested pair = [searchString, replaceString]
        ["1", "_intro"],
        ["2", "_outro"],
        ["", ""], //etc
    ],
};

// *************************************************************************
// **************************** FUNCTION CALL ******************************
// *************************************************************************

searchAndReplaceLayerNames().main(vars.searchAndReplaceBundle);