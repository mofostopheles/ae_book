/**
 * An After Effects script for rendering out separately tagged layers in one/more selected comps.
 * Just add '#somevalue' to any layer you want rendered. Renders will be appended with that tag name.
 * e.g. all layers tagged '#audio' will be rendered together into [comp name][tag name].[file extension]
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
 * Loops selected comps and creates render queue items based on tagged layers.
 */
var renderLayerPasses = function() {
    return {
        arrSelectedComps: getSelectedComps(),
        main: function() {
            var compsChangedCounter = 0;
            var selectedComp;
            var listOfTags;
            var layerSettings;
            var layer;
            for (var k = 0; k < this.arrSelectedComps.length; k++) {
                selectedComp = this.arrSelectedComps[k];
                listOfTags = [];
                layerSettings = [];
                // loop all the layers and scrape a list of tags
                for (var i = 1; i <= selectedComp.numLayers; i++) {
                    if (selectedComp.layers[i].name.indexOf('#') > -1) {
                        tag = selectedComp.layers[i].name.slice(selectedComp.layers[i].name.indexOf('#'), selectedComp.layers[i].name.length);
                        if (listOfTags.indexOf(tag) === -1) {
                            listOfTags.push(tag);
                        }
                    }
                    // also store the enabled setting of each layer
                    // we want to restore the comp to original settings at the end of the entire process
                    layer = {};
                    layer.ref = selectedComp.layers[i];
                    layer.enabled = selectedComp.layers[i].enabled;
                    layer.audioEnabled = selectedComp.layers[i].audioEnabled;
                    layerSettings.push(layer);
                }

                if (listOfTags.length === 0) {
                    alert('There are no tagged layers to render in comp "' + selectedComp.name + '" Please tag layers with #some_tag.');
                }

                // iterate the tags array and build up the render queue based on these layers
                for (t = 0; t < listOfTags.length; t++) {
                    for (var ii = 1; ii <= selectedComp.numLayers; ii++) {
                        // layer name needs to contain hashtag
                        if (selectedComp.layers[ii].name.indexOf(listOfTags[t]) > -1) {
                            // don't turn on visibility aka 'enable' for matte channels
                            if (!selectedComp.layers[ii].isTrackMatte) {
                                selectedComp.layers[ii].enabled = true;
                            }

                            if (selectedComp.layers[ii].hasAudio === true) {
                                selectedComp.layers[ii].audioEnabled = true;
                            }
                        } else {
                            selectedComp.layers[ii].enabled = false;
                            if (selectedComp.layers[ii].audioEnabled === true) {
                                selectedComp.layers[ii].audioEnabled = false;
                            }
                        }
                    }

                    // modify the render name to use the hashtag
                    dupeSelectedComp = selectedComp.duplicate();

                    // Clean up the name because After Effects automatically adds numbers
                    // at the end of names when duping comps.
                    // This will probably break you if the comp has a version number higher than 2.
                    if (dupeSelectedComp.name.indexOf('_2') > -1) {
                        dupeSelectedComp.name = dupeSelectedComp.name.replace('_2', '');
                    } else if (dupeSelectedComp.name.indexOf(' 2') > -1) {
                        dupeSelectedComp.name = dupeSelectedComp.name.replace(' 2', '');
                    }

                    renderQueueItem = app.project.renderQueue.items.add(dupeSelectedComp);

                    // set the template accordingly
                    if ((listOfTags[t].indexOf('aud') > -1) ||
                        (listOfTags[t].indexOf('VO') > -1) ||
                        (listOfTags[t].indexOf('mus') > -1)) {
                        renderQueueItem.outputModule(1).applyTemplate('_wave');
                    } else {
                        renderQueueItem.outputModule(1).applyTemplate('_unmattedAlpha');
                    }

                    renderOutputModule = renderQueueItem.outputModule(1);
                    modifiedFileName = renderOutputModule.file.toString().slice(0, -4); // trim off the dot file extension
                    tagName = listOfTags[t].substring(1) + renderOutputModule.file.toString().slice(-4);
                    modifiedFileName += '_' + tagName;
                    renderOutputModule.file = new File(modifiedFileName);
                    dupeSelectedComp.name = dupeSelectedComp.name + ' -- ' + listOfTags[t].substring(1) + ' -- remove after render';
                }

                // reset the layers enabled property to original
                for (i = 0; i < layerSettings.length; i++) {
                    layerSettings[i].ref.enabled = layerSettings[i].enabled;
                    if (layerSettings[i].audioEnabled === true) {
                        layerSettings[i].ref.audioEnabled = layerSettings[i].audioEnabled;
                    }
                }

                compsChangedCounter++;
            }
            aalert(compsChangedCounter + ' comp/s total touched.');
        }
    };
};

/**
 * Runs the script.
 * Calls main and passes args (if any).
 */
renderLayerPasses().main();

app.endUndoGroup();
