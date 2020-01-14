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

#include './__common.jsx';

app.beginUndoGroup('work_undo');

/**
 * Function with inner main function. Invoked at bottom of this file.
 * Loops selected comps and renames them according to main's params.
 */
var searchAndReplaceCompNames = function() {
    return {
        arrSelectedComps: getSelectedComps(),
        /**
         * Takes two params for string match and replace
         */
        main: function(stringToFind, stringReplacement) {
            var compsChangedCounter = 0;
            var selectedComp;
            for (var i = 0; i < this.arrSelectedComps.length; i++) {
                selectedComp = this.arrSelectedComps[i];
                if (selectedComp.name.indexOf(stringToFind) > -1) {
                    selectedComp.name = selectedComp.name.replace(stringToFind, stringReplacement);
                    compsChangedCounter++;
                }
            }
            aalert(compsChangedCounter + ' comp/s total touched.');
        }
    };
};

/**
 * Anything to be passed to the script's main method is set here.
 */
var vars = {
    stringToFind: '-lc-CC', // String to find in selected comps.
    stringReplacement: '-fr-CA' // String to replace found result.
};

/**
 * Runs the script.
 * Calls main and passes args (if any).
 */
searchAndReplaceCompNames().main(vars.stringToFind, vars.stringReplacement);

app.endUndoGroup();
