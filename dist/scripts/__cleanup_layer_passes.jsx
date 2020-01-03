/**
 * An After Effects script for removing unwanted comps from the project pane. 
 * Run this after using __render_layer_passes.jsx.
 */

// Copyright © 2020, Arlo Emerson
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
 * Removes unwanted comps from project pane.
 */
var cleanupLayerPasses = function() {
    app.beginUndoGroup("work_undo");

    return {
        arrSelectedComps: getSelectedComps(),
        main: function() {
            var allComps = app.project.items;
            var removedCount = 0;

            for (var i = allComps.length; i >= 1; i--) {
                item = allComps[i];
                if (item.name.indexOf("remove after render") > -1) {
                    item.remove();
                    removedCount++;
                }
            }
            aalert(removedCount + " items were removed.");
        },
    }
    app.endUndoGroup();
};

// *************************************************************************
// **************************** HELPER METHODS *****************************
// *************************************************************************

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

// *************************************************************************
// **************************** FUNCTION CALL ******************************
// *************************************************************************

cleanupLayerPasses().main();