/**
 * An After Effects script for updating a set of layers with properties from a master layer.
 * v2
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

// Run this script from the command line with:
// AfterFX -r X:\path_to_book\__update_props_from_animation_master.jsx
// Note: You first might need to add AfterFX to your computer's path variable.
var updatePropsFromAnimationMaster = function() {
    app.beginUndoGroup("work_undo");

    return {
        arrSelectedComps: getSelectedComps(),
        main: function(pLayerNameToFind, pLayerRename) {

            if (arguments[1] == "") {
                pLayerRename = pLayerNameToFind; // user did not set it
            }

            var compsChangedCounter = 0;
            for (var k = 0; k < this.arrSelectedComps.length; k++) {
                var targetComp = this.arrSelectedComps[k];
                var ableToUpdate = false;
                var masterLayer = targetComp.selectedLayers[0]; // we only use first one 

                if (masterLayer == null) {
                    aalert("Please select a master layer in '" + targetComp.name + "'.");
                } else {

                    // track how many layers get changed
                    var layersChangedCounter = 0;

                    // build an array of target layers
                    var arrayOfItems = [];
                    var targetFound = false;
                    for (var j = 1; j <= targetComp.layers.length; j++) {
                        if (targetComp.layers[j].name.indexOf(pLayerNameToFind) != -1) {
                            arrayOfItems.push(targetComp.layers[j]);
                            targetFound = true;
                        }
                    }

                    if (masterLayer.name == pLayerNameToFind) {
                        aalert('Master layer has the same name as target layers. Make master layer name unique.');
                        return;
                    }

                    // iterate over the target layers
                    for (var j = 0; j <= arrayOfItems.length - 1; j++) {

                        // clone the master and move it next to the target
                        var dupeLayer = masterLayer.duplicate();
                        dupeLayer.moveAfter(arrayOfItems[j]);

                        // collect properties that we want to persist
                        var targetLayerScale = arrayOfItems[j].scale.value;
                        var targetLayerPosition = arrayOfItems[j].position.value;
                        var targetStartTime = arrayOfItems[j].startTime;
                        var targetLayerLabel = arrayOfItems[j].label;

                        // transfer properties to the cloned layer
                        dupeLayer.startTime = targetStartTime;
                        dupeLayer.scale.setValue(targetLayerScale);
                        dupeLayer.position.setValue(targetLayerPosition);
                        dupeLayer.label = targetLayerLabel;
                        dupeLayer.name = pLayerRename;
                        dupeLayer.enabled = true;
                        dupeLayer.guideLayer = false;

                        // truncate the array
                        arrayOfItems[j].remove();

                        layersChangedCounter++;
                    }

                    var alertMessage = layersChangedCounter.toString() + " layer/s touched in '" + targetComp.name + "'.";
                    if (!targetFound) {
                        alertMessage += "\n" + "Could not find a layer with name '" + pLayerNameToFind + "'.";
                    }
                    aalert(alertMessage);
                }

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
}

function getKeyframesFromProperty(pLayer, pProperty, pNumKeys) {
    var targetKeyArray = new Array();
    for (var ki = 1; ki <= pNumKeys; ki++) {
        targetKeyArray[ki] = {
            keyValue: pLayer.property(pProperty).keyValue(ki),
            keyTime: pLayer.property(pProperty).keyTime(ki),
            keyInInterpolationType: pLayer.property(pProperty).keyInInterpolationType(ki),
            keyOutInterpolationType: pLayer.property(pProperty).keyOutInterpolationType(ki),
            keyInSpatialTangent: pLayer.property(pProperty).keyInSpatialTangent(ki),
            keyOutSpatialTangent: pLayer.property(pProperty).keyOutSpatialTangent(ki),
            keyInTemporalEase: pLayer.property(pProperty).keyInTemporalEase(ki),
            keyOutTemporalEase: pLayer.property(pProperty).keyOutTemporalEase(ki),
            keySpatialAutoBezier: pLayer.property(pProperty).keySpatialAutoBezier(ki),
            keySpatialContinuous: pLayer.property(pProperty).keySpatialContinuous(ki),
            keyTemporalAutoBezier: pLayer.property(pProperty).keyTemporalAutoBezier(ki),
            keyTemporalContinuous: pLayer.property(pProperty).keyTemporalContinuous(ki),
            keyRoving: pLayer.property(pProperty).keyRoving(ki),
        }
    }
    return targetKeyArray;
}

function applyKeyframesToProperty(pLayer, pProperty, pKeysArray) {
    for (var ki = 1; ki < pKeysArray.length; ki++) {
        pLayer.property(pProperty).setValueAtTime(pKeysArray[ki].keyTime, pKeysArray[ki].keyValue);
    }
    for (var ki = 1; ki < pKeysArray.length; ki++) {
        pKeysArray[ki].keyTemporalAutoBezier ? pLayer.property(pProperty).setTemporalAutoBezierAtKey(ki, pKeysArray[ki].keySpatialAutoBezier) : false;
        pKeysArray[ki].keyInSpatialTangent ? pLayer.property(pProperty).setSpatialTangentsAtKey(ki, pKeysArray[ki].keyInSpatialTangent, pKeysArray[ki].keyOutSpatialTangent) : false;
        pKeysArray[ki].keyInTemporalEase ? pLayer.property(pProperty).setTemporalEaseAtKey(ki, pKeysArray[ki].keyInTemporalEase, pKeysArray[ki].keyOutTemporalEase) : false;
        pKeysArray[ki].keySpatialContinuous ? pLayer.property(pProperty).setSpatialContinuousAtKey(ki, pKeysArray[ki].keySpatialContinuous) : false;
        pKeysArray[ki].keyRoving ? pLayer.property(pProperty).setRovingAtKey(ki, pKeysArray[ki].keyRoving) : false;
        pLayer.property(pProperty).setInterpolationTypeAtKey(ki, pKeysArray[ki].keyInInterpolationType, pKeysArray[ki].keyOutInterpolationType);
    }
}

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
    layerNameToFind: "animation_target", // The name of the layer/s to find.
    layerRenameTo: "", // Optional. Set this to rename target layers.
}

// *************************************************************************
// **************************** FUNCTION CALL ******************************
// *************************************************************************

updatePropsFromAnimationMaster().main(vars.layerNameToFind, vars.layerRenameTo);