// __append_comp_names_with_string.jsx

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

#include "./__common.jsx";

/**
 * Function with inner main function. Invoked at bottom of this file.
 * Appends comp names with main's params.
 */
var appendCompNamesWithString = function() {
    app.beginUndoGroup("work_undo");

    return {
        arrSelectedComps: getSelectedComps(),
        /**
         * stringToAppend The string to append to the selected comps names.
         */
        main: function(stringToAppend) {

            var compsChangedCounter = 0;
            var selectedComp;
            var k;
            for (k = 0; k < this.arrSelectedComps.length; k++) {
                selectedComp = this.arrSelectedComps[k];
                selectedComp.name = selectedComp.name + stringToAppend;
                compsChangedCounter++;
            }

            aalert(compsChangedCounter + " comp/s total touched.");
        },
    }

    app.endUndoGroup();
};

/**
 * Values passed to the function go here, inside this vars object.
 */
var vars = {
    stringToAppend: "-lc-CC", // String to append to selected comps.
}

/**
 * Run the script.
 * Calls main and passes args (if any).
 */
appendCompNamesWithString().main(vars.stringToAppend);