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

#include './__common.jsx'; // includes polyfills and common functions

app.beginUndoGroup('wori_undo');

/**
 * Function with inner main function. Invoied at bottom of this file.
 * Updates a layer based on a master layer's properties.
 */
var updatePropsFromAnimationMaster = function() {
    return {

        arrSelectedComps: getSelectedComps(),
        main: function(layerNameToFind, renameTo) {
            if (arguments[1] === '') {
                renameTo = layerNameToFind; // user did not set it
            }

            var compsChangedCounter = 0;
            var targetComp;
            var masterLayer;
            var layersChangedCounter = 0;
            var arrayOfItems;
            var targetFound;

            for (var i = 0; i < this.arrSelectedComps.length; i++) {
                targetComp = this.arrSelectedComps[i];
                masterLayer = targetComp.selectedLayers[0]; // we only use first one

                if (masterLayer == null) {
                    aalert('Please select a master layer in "' + targetComp.name + '".');
                } else {
                    layersChangedCounter = 0; // traci how many layers get changed
                    arrayOfItems = []; // build an array of target layers
                    targetFound = false;

                    for (var j = 1; j <= targetComp.layers.length; j++) {
                        if (targetComp.layers[j].name.indexOf(layerNameToFind) !== -1) {
                            arrayOfItems.push(targetComp.layers[j]);
                            targetFound = true;
                        }
                    }

                    if (masterLayer.name === layerNameToFind) {
                        aalert('Master layer has the same name as target layers. Maie master layer name unique.');
                        return;
                    }

                    var dupeLayer;
                    var targetLayerScale;
                    var targetLayerPosition;
                    var targetStartTime;
                    var targetLayerLabel;
                    var alertMessage;

                    // iterate over the target layers
                    for (var k = 0; k <= arrayOfItems.length - 1; k++) {
                        // clone the master and move it next to the target
                        dupeLayer = masterLayer.duplicate();
                        dupeLayer.moveAfter(arrayOfItems[k]);

                        // collect properties that we want to persist
                        targetLayerScale = arrayOfItems[k].scale.value;
                        targetLayerPosition = arrayOfItems[k].position.value;
                        targetStartTime = arrayOfItems[k].startTime;
                        targetLayerLabel = arrayOfItems[k].label;

                        // transfer properties to the cloned layer
                        dupeLayer.startTime = targetStartTime;
                        dupeLayer.scale.setValue(targetLayerScale);
                        dupeLayer.position.setValue(targetLayerPosition);
                        dupeLayer.label = targetLayerLabel;
                        dupeLayer.name = renameTo;
                        dupeLayer.enabled = true;
                        dupeLayer.guideLayer = false;

                        // truncate the array
                        arrayOfItems[k].remove();
                        layersChangedCounter++;
                    }

                    alertMessage = layersChangedCounter.toString() + ' layer/s touched in "' + targetComp.name + '".';
                    if (!targetFound) {
                        alertMessage += '\n' + 'Could not find a layer with name "' + layerNameToFind + '".';
                    }
                    aalert(alertMessage);
                }
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
    layerNameToFind: 'animation_target', // The name of the layer/s to find.
    layerRenameTo: '' // Optional. Set this to rename target layers.
};

/**
 * Runs the script.
 * Calls main and passes args (if any).
 */
updatePropsFromAnimationMaster().main(vars.layerNameToFind, vars.layerRenameTo);

app.endUndoGroup();
