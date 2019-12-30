﻿// __generate_javascript_from_captured_properties_v2.jsx
// v.2

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
// AfterFX -r X:\path_to_book\__generate_javascript_from_captured_properties_v2.jsx
// Note: You first might need to add AfterFX to your computer's path variable.
var capturePropertyValuesFromComps = function() {
    app.beginUndoGroup("work_undo");

    return {
        arrSelectedComps: getSelectedComps(),
        main: function(pLayerToFind) {

            var tmpFile = new File("./prop_vals.txt"); //writes a file to same location as this script
            var txtContents = "";
            txtContents += "///////////////////// BEGIN AUTO-GENERATED CODE /////////////////////";
            txtContents += newLine;
            txtContents += "// this block generated by '__generate_javascript_from_captured_properties_v2.jsx'";
            txtContents += newLine;
            tmpFile.open("w");

            for (var k = this.arrSelectedComps.length - 1; k >= 0; k--) {
                var selectedComp = this.arrSelectedComps[k];

                //loop layers, find the target layer
                for (var j = 1; j <= selectedComp.layers.length; j++) {
                    if (selectedComp.layers[j].name.indexOf(pLayerToFind) != -1) {

                        var layer = selectedComp.layers[j];

                        //determine what comp size we are in 
                        if (selectedComp.name.indexOf("120x600") > -1) {
                            txtContents += newLine;
                            txtContents += "if (selectedComp.name.indexOf(\"120x600\") > -1) {";
                            txtContents += getCodeBlock(layer);
                        } else if (selectedComp.name.indexOf("160x600") > -1) {
                            txtContents += newLine;
                            txtContents += "} else if (selectedComp.name.indexOf(\"160x600\") > -1) {";
                            txtContents += getCodeBlock(layer);
                        } else if (selectedComp.name.indexOf("300x250") > -1) {
                            txtContents += newLine;
                            txtContents += "} else if (selectedComp.name.indexOf(\"300x250\") > -1) {";
                            txtContents += getCodeBlock(layer);
                        } else if (selectedComp.name.indexOf("300x600") > -1) {
                            txtContents += newLine;
                            txtContents += "} else if (selectedComp.name.indexOf(\"300x600\") > -1) {";
                            txtContents += getCodeBlock(layer);
                        } else if (selectedComp.name.indexOf("320x480") > -1) {
                            txtContents += newLine;
                            txtContents += "} else if (selectedComp.name.indexOf(\"320x480\") > -1) {";
                            txtContents += getCodeBlock(layer);
                        } else if (selectedComp.name.indexOf("336x280") > -1) {
                            txtContents += newLine;
                            txtContents += "} else if (selectedComp.name.indexOf(\"336x280\") > -1) {";
                            txtContents += getCodeBlock(layer);
                        } else if (selectedComp.name.indexOf("320x100") > -1) {
                            txtContents += newLine;
                            txtContents += "} else if (selectedComp.name.indexOf(\"320x100\") > -1) {";
                            txtContents += getCodeBlock(layer);
                        } else if (selectedComp.name.indexOf("480x320") > -1) {
                            txtContents += newLine;
                            txtContents += "} else if (selectedComp.name.indexOf(\"480x320\") > -1) {";
                            txtContents += getCodeBlock(layer);
                        } else if (selectedComp.name.indexOf("970x250") > -1) {
                            txtContents += newLine;
                            txtContents += "} else if (selectedComp.name.indexOf(\"970x250\") > -1) {";
                            txtContents += getCodeBlock(layer);
                            txtContents += newLine;
                            txtContents += "}"; // close the entire statement
                        }
                    }
                }
            }
            // write out the contents and close
            txtContents += newLine;
            txtContents += "///////////////////// END AUTO-GENERATED CODE /////////////////////";
            tmpFile.write(txtContents);
            tmpFile.close();
            aalert("Done.");
        },
    }

    app.endUndoGroup();
};

function getCodeBlock(pLayer) {
    var txtContents = newLine;
    txtContents += "newX = " + pLayer.position.value[0] + ";";
    txtContents += newLine;
    txtContents += "newY = " + pLayer.position.value[1] + ";";
    txtContents += newLine;
    txtContents += "newScale = [" + pLayer.scale.value.toString() + "];";
    return txtContents;
}

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

var getComp = function(pCompName) {
    for (var i = 1; i <= app.project.numItems; i++) {
        if ((app.project.item(i) instanceof CompItem) && (app.project.item(i).name == pCompName)) {
            return app.project.item(i);
        }
    }
    return null;
}

function aalert(pArg) {
    if (verbose) {
        alert(pArg);
    }
}

// *************************************************************************
// ************************* USER DEFINED VARIABLES ************************
// *************************************************************************
var newLine = "\n";
var verbose = true; // Set to false to silence alerts.
var vars = {
    layerNameToFind: "gradient_overlay",
}

// *************************************************************************
// **************************** FUNCTION CALL ******************************
// *************************************************************************
capturePropertyValuesFromComps().main(vars.layerNameToFind);