/**
 * An After Effects script for generating sequences from a comp.
 * Queues instances of comps using numbered guide layers as psuedo work areas.
 * Based on an original script by Christopher R. Green (crgreen.com).
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
 * Queues instances of comps using numbered guide layers as psuedo work areas.
 */
var nameOfFunction = function() {
    var queueWorkArea = queueWorkAreas;
    return {
        arrSelectedComps: getSelectedComps(),
        main: function(argument) {
            var selectedComp;
            var taskCount = 0;
            queueWorkArea.frameNamePattern = argument.frameNamePattern;

            for (var k = this.arrSelectedComps.length - 1; k >= 0; k--) {
                selectedComp = this.arrSelectedComps[k];

                for (var i = 1; i <= selectedComp.numLayers; i++) {
                    
                    // Select all the guide layers that are named as frame numbers.
                    if (selectedComp.layers[i].guideLayer == true) {
                        
                        // The layer name must be a simple int.
                        if (isNaN(selectedComp.layers[i].name) == false) {
                            queueWorkArea(selectedComp, selectedComp.layers[i]);
                            taskCount++;
                        }
                    }
                }
            }
            aalert(taskCount + ' work areas were queued to render.');
        }
    };
};

/**
 * Queue a comp based on the in/out of a layer.
 */
function queueWorkAreas(compToQueue, layer) {
    var frameNamePattern = arguments.callee.frameNamePattern;
    var baseName = compToQueue.name;
    var renderIn = layer.inPoint;
    var renderOut = layer.outPoint;
    var renderQueueItem = app.project.renderQueue.items.add(compToQueue);
    var outputModule = renderQueueItem.outputModule(1);
    var outputModuleFile = outputModule.file;
    var outputModuleFilePath = outputModule.file.toString();
    var outputModuleFilePathLength = outputModuleFilePath.length;
    var outputModuleFileName = outputModuleFile.name.toString();
    var outputModuleFileNameLength = outputModuleFileName.length;
    var outputModuleFileEnd = outputModuleFileName.slice((outputModuleFileNameLength - 4), outputModuleFileNameLength);
    var outputModuleFileHead = outputModuleFilePath.slice(0, (outputModuleFilePathLength - outputModuleFileNameLength));
    renderQueueItem.timeSpanStart = renderIn;
    renderQueueItem.timeSpanDuration = (renderOut - renderIn);
    baseName = compToQueue.name.replace(frameNamePattern, layer.name);
    outputModule.file = new File(outputModuleFileHead + baseName + outputModuleFileEnd);
}

/**
 * Anything to be passed to the script's main method is set here.
 */
var vars = {
    frameNamePattern: '[frame]'
};

/**
 * Runs the script.
 * Calls main and passes args (if any).
 */
nameOfFunction().main(vars);

app.endUndoGroup();