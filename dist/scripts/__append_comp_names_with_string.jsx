// __append_comp_names_with_string.jsx

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

// Run this script from the command line with:
// AfterFX -r X:\path_to_book\__append_comp_names_with_string.jsx
// Note: You first might need to add AfterFX to your computer's path variable.
var appendCompNamesWithString = function() {
    app.beginUndoGroup("work_undo");

    return {
        arrSelectedComps: getSelectedComps(),
        main: function(pStringToAppend) {

            var compsChangedCounter = 0;
            for (var k = 0; k < this.arrSelectedComps.length; k++) {
                var selectedComp = this.arrSelectedComps[k];
                selectedComp.name = selectedComp.name + pStringToAppend;
                compsChangedCounter++;
            }

            aalert(compsChangedCounter + " comp/s total touched.");
        },
    }

    app.endUndoGroup();
};

// *************************************************************************
// **************************** HELPER METHODS *****************************
// *************************************************************************

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
}

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
    stringToAppend: "-lc-CC", // String to append to selected comps.
}

// *************************************************************************
// **************************** FUNCTION CALL ******************************
// *************************************************************************
appendCompNamesWithString().main(vars.stringToAppend);