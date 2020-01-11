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
            for (var i = 0; i < this.arrSelectedComps.length; i++) {
                selectedComp = this.arrSelectedComps[i];
                listOfTags = [];
                layerSettings = [];
                // loop all the layers and scrape a list of tags
                for (var j = 1; j <= selectedComp.numLayers; j++) {
                    if (selectedComp.layers[j].name.indexOf('#') > -1) {
                        tag = selectedComp.layers[j].name.slice(selectedComp.layers[j].name.indexOf('#'), selectedComp.layers[j].name.length);
                        if (listOfTags.indexOf(tag) === -1) {
                            listOfTags.push(tag);
                        }
                    }
                    // also store the enabled setting of each layer
                    // we want to restore the comp to original settings at the end of the entire process
                    layer = {};
                    layer.ref = selectedComp.layers[j];
                    layer.enabled = selectedComp.layers[j].enabled;
                    layer.audioEnabled = selectedComp.layers[j].audioEnabled;
                    layerSettings.push(layer);
                }

                if (listOfTags.length === 0) {
                    alert('There are no tagged layers to render in comp "' + selectedComp.name + '" Please tag layers with #some_tag.');
                }

                // iterate the tags array and build up the render queue based on these layers
                for (var j = 0; j < listOfTags.length; j++) {
                    for (var k = 1; k <= selectedComp.numLayers; k++) {
                        // layer name needs to contain hashtag
                        if (selectedComp.layers[k].name.indexOf(listOfTags[j]) > -1) {
                            // don't turn on visibility aka 'enable' for matte channels
                            if (!selectedComp.layers[k].isTrackMatte) {
                                selectedComp.layers[k].enabled = true;
                            }

                            if (selectedComp.layers[k].hasAudio === true) {
                                selectedComp.layers[k].audioEnabled = true;
                            }
                        } else {
                            selectedComp.layers[k].enabled = false;
                            if (selectedComp.layers[k].audioEnabled === true) {
                                selectedComp.layers[k].audioEnabled = false;
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
                    if ((listOfTags[j].indexOf('aud') > -1) ||
                        (listOfTags[j].indexOf('VO') > -1) ||
                        (listOfTags[j].indexOf('mus') > -1)) {
                        renderQueueItem.outputModule(1).applyTemplate('_wave');
                    } else {
                        renderQueueItem.outputModule(1).applyTemplate('_unmattedAlpha');
                    }

                    renderOutputModule = renderQueueItem.outputModule(1);
                    modifiedFileName = renderOutputModule.file.toString().slice(0, -4); // trim off the dot file extension
                    tagName = listOfTags[j].substring(1) + renderOutputModule.file.toString().slice(-4);
                    modifiedFileName += '_' + tagName;
                    renderOutputModule.file = new File(modifiedFileName);
                    dupeSelectedComp.name = dupeSelectedComp.name + ' -- ' + listOfTags[j].substring(1) + ' -- remove after render';
                }

                // reset the layers enabled property to original
                for (var j = 0; j < layerSettings.length; j++) {
                    layerSettings[j].ref.enabled = layerSettings[j].enabled;
                    if (layerSettings[j].audioEnabled === true) {
                        layerSettings[j].ref.audioEnabled = layerSettings[j].audioEnabled;
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
