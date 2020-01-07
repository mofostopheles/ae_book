/**
 * An After Effects script for updating a set of layers with properties from a master layer.
 * v2.2
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
            var layersChangedCounter;
            var arrayOfItems;
            var targetFound;

            for (var k = 0; k < this.arrSelectedComps.length; k++) {
                targetComp = this.arrSelectedComps[k];
                masterLayer = targetComp.selectedLayers[0]; // we only use first one
                if (masterLayer == null) {
                    aalert('Please select a master layer in "' + targetComp.name + '".');
                } else {
                    layersChangedCounter = 0; // track how many layers get changed
                    arrayOfItems = []; // build an array of target layers
                    targetFound = false;

                    for (var j = 1; j <= targetComp.layers.length; j++) {
                        if (targetComp.layers[j].name.indexOf(layerNameToFind) !== -1) {
                            arrayOfItems.push(targetComp.layers[j]);
                            targetFound = true;
                        }
                    }

                    if (masterLayer.name === layerNameToFind) {
                        aalert('Master layer has the same name as target layers. Make master layer name unique.');
                        return;
                    }

                    var dupeLayer;
                    var targetLayerScale;
                    var targetLayerPosition;
                    var targetThreeDLayer;
                    var targetKeyArray;
                    var targetStartTime;
                    var targetLayerLabel;
                    var alertMessage;

                    // iterate over the target layers
                    for (var jj = 0; jj <= arrayOfItems.length - 1; jj++) {
                        // clone the master and move it next to the target
                        dupeLayer = masterLayer.duplicate();
                        dupeLayer.moveAfter(arrayOfItems[jj]);

                        // collect properties that we want to persist
                        targetLayerScale = arrayOfItems[jj].scale.value;
                        targetLayerPosition = arrayOfItems[jj].position.value;
                        targetThreeDLayer = arrayOfItems[jj].threeDLayer;
                        targetKeyArray = getKeyframesFromProperty(
                            arrayOfItems[jj],
                            'Position',
                            arrayOfItems[jj].position.numKeys
                        );
                        targetStartTime = arrayOfItems[jj].startTime;
                        targetLayerLabel = arrayOfItems[jj].label;

                        // transfer properties to the cloned layer
                        dupeLayer.startTime = targetStartTime;
                        dupeLayer.scale.setValue(targetLayerScale);
                        dupeLayer.threeDLayer = targetThreeDLayer;
                        dupeLayer.position.setValue(targetLayerPosition);
                        applyKeyframesToProperty(
                            dupeLayer,
                            'Position',
                            targetKeyArray
                        );
                        dupeLayer.label = targetLayerLabel;
                        dupeLayer.name = renameTo;
                        dupeLayer.enabled = true;
                        dupeLayer.guideLayer = false;

                        // truncate the array
                        arrayOfItems[jj].remove();

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
    layerRenameTo: 'new_name' // Optional. Set this to rename target layers.
};

/**
 * Runs the script.
 * Calls main and passes args (if any).
 */
updatePropsFromAnimationMaster().main(vars.layerNameToFind, vars.layerRenameTo);

app.endUndoGroup();
