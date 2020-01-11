/**
 * An After Effects script for appending strings to the end of comp names.
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

#include './__common.jsx'; // includes polyfills and common functions

app.beginUndoGroup('work_undo');

/**
 * Function with inner main function. Invoked at bottom of this file.
 * Appends comp names with main's params.
 */
var appendCompNamesWithString = function() {
    return {
        arrSelectedComps: getSelectedComps(),
        /**
         * stringToAppend The string to append to the selected comps names.
         */
        main: function(stringToAppend) {
            var compsChangedCounter = 0;
            var selectedComp;
            for (var i = 0; i < this.arrSelectedComps.length; i++) {
                selectedComp = this.arrSelectedComps[i];
                selectedComp.name = selectedComp.name + stringToAppend;
                compsChangedCounter++;
            }
            aalert(compsChangedCounter + ' comp/s total touched.');
        }
    };
};

/**
 * Anything to be passed to the script's main method is set here.
 */
var vars = {
    stringToAppend: '-es-US' // String to append to selected comps.
};

/**
 * Runs the script.
 * Calls main and passes args (if any).
 */
appendCompNamesWithString().main(vars.stringToAppend);

app.endUndoGroup();
