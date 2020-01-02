/**
 * @fileoverview __render_layer_passes.jsx 
 * 
 * A script for rendering out separately tagged layers in one/more selected comps.
 * Just add "#somevalue" to any layer you want rendered.
 * Renders will be appended with that tag name.
 * e.g. all layers within a comp tagged "#audio" will be rendered together into [comp name][tag name].[file extension]
 * 
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

var renderLayerPasses = function() {
    app.beginUndoGroup("work_undo");

    return {
        arrSelectedComps: getSelectedComps(),
        main: function() {
            var compsChangedCounter = 0;
            for (var k = 0; k < this.arrSelectedComps.length; k++) {
                var selectedComp = this.arrSelectedComps[k];

                listOfTags = []
                layerSettings = []

                // loop all the layers and scrape a list of tags
                for (var i = 1; i <= selectedComp.numLayers; i++) {
                    if (selectedComp.layers[i].name.indexOf("#") > -1) {
                        tag = selectedComp.layers[i].name.slice(selectedComp.layers[i].name.indexOf("#"), selectedComp.layers[i].name.length);
                        if (listOfTags.indexOf(tag) == -1) {
                            listOfTags.push(tag);
                        }
                    }

                    // also store the enabled setting of each layer
                    // we want to restore the comp to original settings at the end of the entire process
                    layer = new Object();
                    layer.ref = selectedComp.layers[i];
                    layer.enabled = selectedComp.layers[i].enabled;
                    layer.audioEnabled = selectedComp.layers[i].audioEnabled;
                    layerSettings.push(layer);
                }

                if (listOfTags.length == 0) {
                    alert("There are no tagged layers to render in comp '" + selectedComp.name + "'. Please tag layers with #some_tag.");
                }

                // iterate the tags array and build up the render queue based on these layers
                for (t = 0; t < listOfTags.length; t++) {
                    for (var i = 1; i <= selectedComp.numLayers; i++) {
                        // layer name needs to contain hashtag
                        if (selectedComp.layers[i].name.indexOf(listOfTags[t]) > -1) {
                            //don't turn on visibility aka "enable" for matte channels
                            if (!selectedComp.layers[i].isTrackMatte) {
                                selectedComp.layers[i].enabled = true;
                            }

                            if (selectedComp.layers[i].hasAudio == true) {
                                selectedComp.layers[i].audioEnabled = true;
                            }

                        } else {
                            selectedComp.layers[i].enabled = false;
                            if (selectedComp.layers[i].audioEnabled == true) {
                                selectedComp.layers[i].audioEnabled = false;
                            }
                        }
                    }

                    // modify the render name to use the hashtag
                    tmpSelectedComp = selectedComp.duplicate();

                    // Clean up the name because After Effects automatically adds numbers
                    // at the end of names when duping comps.
                    // This will probably break if the comp has a version number at the end.
                    if (tmpSelectedComp.name.indexOf("_2") > -1) {
                        tmpSelectedComp.name = tmpSelectedComp.name.replace("_2", "");

                    } else if (tmpSelectedComp.name.indexOf(" 2") > -1) {
                        tmpSelectedComp.name = tmpSelectedComp.name.replace(" 2", "");
                    }

                    renderQueueItem = app.project.renderQueue.items.add(tmpSelectedComp);

                    // set the template accordingly
                    if ((listOfTags[t].indexOf("aud") > -1) ||
                        (listOfTags[t].indexOf("VO") > -1) ||
                        (listOfTags[t].indexOf("mus") > -1)) {
                        renderQueueItem.outputModule(1).applyTemplate("_wave");
                    } else {
                        renderQueueItem.outputModule(1).applyTemplate("_unmattedAlpha");
                    }

                    renderOutputModule = renderQueueItem.outputModule(1);
                    modifiedFileName = renderOutputModule.file.toString().slice(0, -4); //trim off the dot file extension
                    tagName = listOfTags[t].substring(1) + renderOutputModule.file.toString().slice(-4);
                    modifiedFileName += "_" + tagName;
                    renderOutputModule.file = new File(modifiedFileName);
                    tmpSelectedComp.name = tmpSelectedComp.name + " -- " + listOfTags[t].substring(1) + " -- remove after render";
                }

                // reset the layers enabled property to original
                for (i = 0; i < layerSettings.length; i++) {
                    layerSettings[i].ref.enabled = layerSettings[i].enabled;
                    if (layerSettings[i].audioEnabled == true) {
                        layerSettings[i].ref.audioEnabled = layerSettings[i].audioEnabled;
                    }
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
    searchAndReplaceBundle: [ // each nested pair = [searchString, replaceString]
        ["1", "_intro"],
        ["2", "_outro"],
        ["", ""], //etc
    ],
};

// *************************************************************************
// **************************** FUNCTION CALL ******************************
// *************************************************************************

renderLayerPasses().main();