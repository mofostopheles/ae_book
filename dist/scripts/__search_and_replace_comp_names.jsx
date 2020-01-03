/**
 * An After Effects script for replacing comp names. 
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
 * Loops selected comps and renames them according to main's params.
 */
var searchAndReplaceCompNames = function() {
    app.beginUndoGroup("work_undo");

    return {
        arrSelectedComps: getSelectedComps(),
        /**
         * Takes two params for string match and replace
         */
        main: function(pStringToFind, pStringReplacement) {
            var compsChangedCounter = 0;
            for (var k = 0; k < this.arrSelectedComps.length; k++) {
                var selectedComp = this.arrSelectedComps[k];
                if (selectedComp.name.indexOf(pStringToFind) > -1) {
                    selectedComp.name = selectedComp.name.replace(pStringToFind, pStringReplacement);
                    compsChangedCounter++;
                }
            }

            aalert(compsChangedCounter + " comp/s total touched.");
        },
    }

    app.endUndoGroup();
};

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
    stringToFind: "-lc-CC", // String to find in selected comps.
    stringReplacement: "-fr-CA", // String to replace found result.
}

// *************************************************************************
// **************************** FUNCTION CALL ******************************
// *************************************************************************

searchAndReplaceCompNames().main(vars.stringToFind, vars.stringReplacement);