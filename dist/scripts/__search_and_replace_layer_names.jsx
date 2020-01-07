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

#include './__common.jsx';

app.beginUndoGroup('work_undo');

/**
 * Function with inner main function. Invoked at bottom of this file.
 * Loops selected comps' layers, performs name replacement based on
 * search and replace params passed to main.
 */
var searchAndReplaceLayerNames = function() {

    return {
        arrSelectedComps: getSelectedComps(),
        /**
         * searchAndReplaceBundle is a two-dimensional array
         * where each item contains search/replace pairs.
         */
        main: function(searchAndReplaceBundle) {
            var compsChangedCounter = 0;
            var layer;
            var changeMade;
            var selectedComp;
            for (var k = 0; k < this.arrSelectedComps.length; k++) {
                selectedComp = this.arrSelectedComps[k];
                for (var j = 1; j <= selectedComp.layers.length; j++) {
                    layer = selectedComp.layers[j];
                    changeMade = false;
                    for (var ii = 0; ii < searchAndReplaceBundle.length; ii++) {
                        if (layer.name.indexOf(searchAndReplaceBundle[ii][0]) > -1) {
                            checkLock(layer);
                            layer.name = layer.name.replace(
                                searchAndReplaceBundle[ii][0],
                                searchAndReplaceBundle[ii][1]
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
            aalert(compsChangedCounter + ' comp/s total touched.');
        }
    };
};

/**
 * functionObject is a function containing the layer object.
 * Stores the state of the layer's lock state.
 */
function runCheckLock(functionObject) {
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
    };
}

/**
 * Convenience function for calling runCheckLock.
 * layer is the current layer in the callee's loop.
 */
var checkLock = runCheckLock(function(layer) {});

/**
 * Anything to be passed to the script's main method is set here.
 */
var vars = {
    searchAndReplaceBundle: [ // each nested pair = [searchString, replaceString]
        ['1', '_intro'],
        ['2', '_outro'],
        ['', ''] // etc
    ]
};

/**
 * Runs the script.
 * Calls main and passes args (if any).
 */
searchAndReplaceLayerNames().main(vars.searchAndReplaceBundle);
app.endUndoGroup();
