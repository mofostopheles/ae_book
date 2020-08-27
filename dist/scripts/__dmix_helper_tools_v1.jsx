/** * An After Effects script with UI for: *          - soloing layers containing localization hashtags *          - calling the render layers script *          - calling the cleanup render queue script *          - anything else that is super tedious * This is intended for DMIX comps where all localized layers appear in one comp,  * and this tool allows you to solo those locales while working.  * ---------- * change log * ---------- * 8/26/2020 - added more country codes * */// Copyright © 2020, Arlo Emerson// arloemerson@gmail.com/*    This program is free software: you can redistribute it and/or modify    it under the terms of the GNU Lesser General Public License as published by    the Free Software Foundation, either version 3 of the License, or    (at your option) any later version.    This program is distributed in the hope that it will be useful,    but WITHOUT ANY WARRANTY; without even the implied warranty of    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the    GNU Lesser General Public License for more details.    You should have received a copy of the GNU Lesser General Public License    along with this program.  If not, see <https://www.gnu.org/licenses/>.*/#include './__common.jsx';/** * Function with inner main function. Invoked at bottom of this file. * UI with calls to swap a collection of comps' layer sources with * something from the project library. */var launchToolUI = function() {    var WINDOW_TITLE = 'Directors Mix Helper Tools';    return {        /**         * that is the 'this' context, set accordingly at bottom of this file depending         * on if this is a object panel or non-modal window.         */        main: function(that) {            var displayObject = (that instanceof Panel) ? that : new Window('palette', WINDOW_TITLE);            displayObject.spacing = 0;            displayObject.margins = 20;            var groupContainer = displayObject.add('group');            groupContainer.name = 'groupContainer';            groupContainer.orientation = 'column';            groupContainer.alignment = ['fill', 'fill'];            groupContainer.alignChildren = ['left', 'top'];            groupContainer.spacing = 15;            groupContainer.margins = [0, 0, 0, 0];            var groupRow1 = groupContainer.add('group');            groupRow1.alignment = ['fill', 'top'];            // checkboxes here            // ------------------ ROW 1 ------------------             var cbxEN_US = groupRow1.add('checkbox');             cbxEN_US.text = 'en-us';            cbxEN_US.value = true;            cbxEN_US.alignment = ['fill', 'center'];                        var cbxES_US = groupRow1.add('checkbox');             cbxES_US.text = 'es-us';            cbxES_US.value = true;            cbxES_US.alignment = ['fill', 'center'];            var cbxEN_CA = groupRow1.add('checkbox');             cbxEN_CA.text = 'en-ca';            cbxEN_CA.value = true;            cbxEN_CA.alignment = ['fill', 'center'];            var cbxFR_CA = groupRow1.add('checkbox');             cbxFR_CA.text = 'fr-ca';            cbxFR_CA.value = true;            cbxFR_CA.alignment = ['fill', 'center'];            // ------------------ ROW 2 ------------------             var groupRow1a = groupContainer.add('group');            groupRow1a.alignment = ['fill', 'top'];            var cbxEN_UK = groupRow1a.add('checkbox');             cbxEN_UK.text = 'en-uk';            cbxEN_UK.value = true;            cbxEN_UK.alignment = ['fill', 'center'];            var cbxDE_DE = groupRow1a.add('checkbox');             cbxDE_DE.text = 'de-de';            cbxDE_DE.value = true;            cbxDE_DE.alignment = ['fill', 'center'];            var cbxES_ES = groupRow1a.add('checkbox');             cbxES_ES.text = 'es-es';            cbxES_ES.value = true;            cbxES_ES.alignment = ['fill', 'center'];            var cbxFR_FR = groupRow1a.add('checkbox');             cbxFR_FR.text = 'fr-fr';            cbxFR_FR.value = true;            cbxFR_FR.alignment = ['fill', 'center'];            // ------------------ ROW 3 ------------------             var groupRow1b = groupContainer.add('group');            groupRow1b.alignment = ['fill', 'top'];            var cbxSV_SE = groupRow1b.add('checkbox');             cbxSV_SE.text = 'sv-se';            cbxSV_SE.value = true;            cbxSV_SE.alignment = ['fill', 'center'];            var cbxDA_DK = groupRow1b.add('checkbox');             cbxDA_DK.text = 'da-dk';            cbxDA_DK.value = true;            cbxDA_DK.alignment = ['fill', 'center'];            var cbxNL_NL = groupRow1b.add('checkbox');             cbxNL_NL.text = 'nl-nl';            cbxNL_NL.value = true;            cbxNL_NL.alignment = ['fill', 'center'];            var cbxFI_FI = groupRow1b.add('checkbox');             cbxFI_FI.text = 'fi-fi';            cbxFI_FI.value = true;            cbxFI_FI.alignment = ['fill', 'center'];            // ------------------ ROW 4 ------------------             var groupRow1c = groupContainer.add('group');            groupRow1c.alignment = ['fill', 'top'];            var cbxNB_NO = groupRow1c.add('checkbox');             cbxNB_NO.text = 'nb-no';            cbxNB_NO.value = true;            cbxNB_NO.alignment = ['fill', 'center'];            var cbxFR_BE = groupRow1c.add('checkbox');             cbxFR_BE.text = 'fr-be';            cbxFR_BE.value = true;            cbxFR_BE.alignment = ['fill', 'center'];            var cbxNL_BE = groupRow1c.add('checkbox');             cbxNL_BE.text = 'nl-be';            cbxNL_BE.value = true;            cbxNL_BE.alignment = ['fill', 'center'];            var cbxXX_XX = groupRow1c.add('checkbox');             cbxXX_XX.text = 'xx-xx';            cbxXX_XX.value = true;            cbxXX_XX.alignment = ['fill', 'center'];            // ------------------ ROW 5  ------------------             // BUTTONS            var groupRow2 = groupContainer.add('group');            groupRow2.alignment = ['fill', 'top'];            var resetAllLayersOnButton = groupRow2.add('button');            resetAllLayersOnButton.text = 'All On';            resetAllLayersOnButton.alignment = ['right', 'center'];            resetAllLayersOnButton.preferredSize = [100, 20];            var allLayersOffButton = groupRow2.add('button');            allLayersOffButton.text = 'All Off';            allLayersOffButton.alignment = ['right', 'center'];            allLayersOffButton.preferredSize = [100, 20];            var groupRow3 = groupContainer.add('group');            groupRow3.alignment = ['fill', 'top'];            var renderLayersButton = groupRow3.add('button');            renderLayersButton.text = 'Render layers';            renderLayersButton.alignment = ['right', 'center'];            renderLayersButton.preferredSize = [100, 20];            var cleanupRenderQueueButton = groupRow3.add('button');            cleanupRenderQueueButton.text = 'Cleanup Queue';            cleanupRenderQueueButton.alignment = ['right', 'center'];            cleanupRenderQueueButton.preferredSize = [100, 20];            // var groupRow4 = groupContainer.add('group');            // groupRow4.alignment = ['fill', 'top'];            // var lblStatus = groupRow4.add('statictext');            // lblStatus.text = '-';            // lblStatus.alignment = ['left', 'center'];            resetAllLayersOnButton.onClick = function() {                setAllLocalesOn();            };            allLayersOffButton.onClick = function() {                setAllLocalesOff();            };            renderLayersButton.onClick = function() {                renderLayerPasses().main();            };            cleanupRenderQueueButton.onClick = function() {                cleanupLayerPasses().main('remove after render');            };            cbxEN_US.onClick = function() {                toggleVisibility("en-us");            };                        cbxES_US.onClick = function() {                toggleVisibility("es-us");            };                        cbxEN_CA.onClick = function() {                toggleVisibility("en-ca");            };                        cbxFR_CA.onClick = function() {                toggleVisibility("fr-ca");            };                        cbxEN_UK.onClick = function() {                toggleVisibility("en-uk");            };                        cbxDE_DE.onClick = function() {                toggleVisibility("de-de");            };                        cbxES_ES.onClick = function() {                toggleVisibility("es-es");            };                        cbxFR_FR.onClick = function() {                toggleVisibility("fr-fr");            };///            cbxSV_SE.onClick = function() {                toggleVisibility("sv-se");            };            cbxDA_DK.onClick = function() {                toggleVisibility("da-dk");            };            cbxNL_NL.onClick = function() {                toggleVisibility("nl-nl");            };            cbxFI_FI.onClick = function() {                toggleVisibility("fi-fi");            };///            cbxNB_NO.onClick = function() {                toggleVisibility("nb-no");            };            cbxNL_BE.onClick = function() {                toggleVisibility("nl-be");            };            cbxFR_BE.onClick = function() {                toggleVisibility("fr-be");            };            cbxXX_XX.onClick = function() {                toggleVisibility("xx-xx");            };            // if (getSelectedComps().length === 0) {            //     lblStatus.text = '** Please select a comp in the project pane.';            // }            displayObject.layout.layout(true);            return displayObject;        }    };};function toggleVisibility(strCode) {    var arrSelectedComps = getSelectedComps();    if (arrSelectedComps.length >= 1) {        // limit this activity to the first comp only        var firstComp = arrSelectedComps[0];        for (var i = 1; i <= firstComp.layers.length; i++) {            if (firstComp.layers[i].name.indexOf(strCode) !== -1) {                //toggle vis on this layer                firstComp.layers[i].enabled = !firstComp.layers[i].enabled;            }        }    }}function setAllLocalesOn() {    var arrSelectedComps = getSelectedComps();    if (arrSelectedComps.length >= 1) {        // limit this activity to the first comp only        var firstComp = arrSelectedComps[0];        for (var i = 1; i <= firstComp.layers.length; i++) {            if ((firstComp.layers[i].name.indexOf("en-us") !== -1) ||                 (firstComp.layers[i].name.indexOf("es-us") !== -1) ||                (firstComp.layers[i].name.indexOf("en-ca") !== -1) ||                 (firstComp.layers[i].name.indexOf("en-uk") !== -1) ||                 (firstComp.layers[i].name.indexOf("fr-ca") !== -1) ||                 (firstComp.layers[i].name.indexOf("fr-fr") !== -1) ||                 (firstComp.layers[i].name.indexOf("de-de") !== -1) ||                 (firstComp.layers[i].name.indexOf("es-es") !== -1) ||                (firstComp.layers[i].name.indexOf("sv-se") !== -1) ||                (firstComp.layers[i].name.indexOf("da-dk") !== -1) ||                (firstComp.layers[i].name.indexOf("nl-nl") !== -1) ||                (firstComp.layers[i].name.indexOf("fi-fi") !== -1) ||                (firstComp.layers[i].name.indexOf("nb-no") !== -1) ||                (firstComp.layers[i].name.indexOf("nl-be") !== -1) ||                (firstComp.layers[i].name.indexOf("fr-be") !== -1) ||                (firstComp.layers[i].name.indexOf("xx-xx") !== -1)                ) {                //toggle vis on this layer                firstComp.layers[i].enabled = true;            }        }    }    //reset checkboxes to checked    setCheckboxes(true);}function setAllLocalesOff() {    var arrSelectedComps = getSelectedComps();    if (arrSelectedComps.length >= 1) {        // limit this activity to the first comp only        var firstComp = arrSelectedComps[0];        for (var i = 1; i <= firstComp.layers.length; i++) {            if ((firstComp.layers[i].name.indexOf("en-us") !== -1) ||                 (firstComp.layers[i].name.indexOf("es-us") !== -1) ||                (firstComp.layers[i].name.indexOf("en-ca") !== -1) ||                 (firstComp.layers[i].name.indexOf("en-uk") !== -1) ||                 (firstComp.layers[i].name.indexOf("fr-ca") !== -1) ||                 (firstComp.layers[i].name.indexOf("fr-fr") !== -1) ||                 (firstComp.layers[i].name.indexOf("de-de") !== -1) ||                 (firstComp.layers[i].name.indexOf("es-es") !== -1) ||                (firstComp.layers[i].name.indexOf("sv-se") !== -1) ||                (firstComp.layers[i].name.indexOf("da-dk") !== -1) ||                (firstComp.layers[i].name.indexOf("nl-nl") !== -1) ||                (firstComp.layers[i].name.indexOf("fi-fi") !== -1) ||                (firstComp.layers[i].name.indexOf("nb-no") !== -1) ||                (firstComp.layers[i].name.indexOf("nl-be") !== -1) ||                (firstComp.layers[i].name.indexOf("fr-be") !== -1) ||                (firstComp.layers[i].name.indexOf("xx-xx") !== -1)                ) {                //toggle vis on this layer                firstComp.layers[i].enabled = false;            }        }    }    //reset checkboxes to checked    setCheckboxes(false);}function setCheckboxes(boolVal) {    for (var i=0;i<displayObject.children[0].children[0].children.length;i++) {        // 1st group of checkboxes        displayObject.children[0].children[0].children[i].value = boolVal;         // 2nd group of checkboxes        displayObject.children[0].children[1].children[i].value = boolVal;         // 3rd group of checkboxes        displayObject.children[0].children[2].children[i].value = boolVal;         // 4th group of checkboxes        displayObject.children[0].children[3].children[i].value = boolVal;     }}/** * Runs the script. * Calls main and passes args (if any). */var displayObject = launchToolUI().main(this);/** * Logic for displaying either a panel or non modal window. */if (displayObject.toString() === '[object Panel]') {    displayObject;} else {    displayObject.show();}// code below is copied directly from "__render_layer_passes_v2.jsx" and "__cleanup_layer_passes.jsx"var renderLayerPasses = function() {    return {        arrSelectedComps: getSelectedComps(),        main: function() {            var compsChangedCounter = 0;            var listOfTags;            var layerSettings;            var selectedComp;            for (var i = 0; i < this.arrSelectedComps.length; i++) {                selectedComp = this.arrSelectedComps[i];                listOfTags = [];                layerSettings = [];                // loop all the layers and scrape a list of tags                for (var j = 1; j <= selectedComp.numLayers; j++) {                    if (selectedComp.layers[j].name.indexOf('#') > -1) {                        tag = selectedComp.layers[j].name.slice(selectedComp.layers[j].name.indexOf('#'), selectedComp.layers[j].name.length);                        if (listOfTags.indexOf(tag) === -1) {                            listOfTags.push(tag);                        }                    }                    // also store the enabled setting of each layer                    // we want to restore the comp to original settings at the end of the entire process                    layer = {};                    layer.ref = selectedComp.layers[j];                    layer.enabled = selectedComp.layers[j].enabled;                    layer.audioEnabled = selectedComp.layers[j].audioEnabled;                    layerSettings.push(layer);                }                if (listOfTags.length === 0) {                    alert('There are no tagged layers to render in comp "' + selectedComp.name + '". Please tag layers with #some_tag.');                }                // iterate the tags array and build up the render queue based on these layers                for (var j = 0; j < listOfTags.length; j++) {                    for (var k = 1; k <= selectedComp.numLayers; k++) {                        // layer name needs to contain hashtag                        if (selectedComp.layers[k].name.indexOf(listOfTags[j]) > -1) {                            // don't turn on visibility aka 'enable' for matte channels                            if (!selectedComp.layers[k].isTrackMatte) {                                selectedComp.layers[k].enabled = true;                            }                            if (selectedComp.layers[k].hasAudio === true) {                                selectedComp.layers[k].audioEnabled = true;                            }                        } else {                            selectedComp.layers[k].enabled = false;                            if (selectedComp.layers[k].audioEnabled === true) {                                selectedComp.layers[k].audioEnabled = false;                            }                        }                    }                    // modify the render name to use the hashtag                    dupeSelectedComp = selectedComp.duplicate();                    // Clean up the name because After Effects automatically adds numbers                    // at the end of names when duping comps.                    // This will probably break you if the comp has a version number higher than 2.                    if (dupeSelectedComp.name.indexOf('_2') > -1) {                        dupeSelectedComp.name = dupeSelectedComp.name.replace('_2', '');                    } else if (dupeSelectedComp.name.indexOf(' 2') > -1) {                        dupeSelectedComp.name = dupeSelectedComp.name.replace(' 2', '');                    }                    renderQueueItem = app.project.renderQueue.items.add(dupeSelectedComp);                    // set the template accordingly                    if ((listOfTags[j].indexOf('aud') > -1) ||                        (listOfTags[j].indexOf('VO') > -1) ||                        (listOfTags[j].indexOf('mus') > -1)) {                        renderQueueItem.outputModule(1).applyTemplate('_wave');                    } else if (listOfTags[j].indexOf('seq') > -1) {                        renderQueueItem.outputModule(1).applyTemplate('_pngSequence');                    } else {                        renderQueueItem.outputModule(1).applyTemplate('_unmattedAlpha');                    }                    renderOutputModule = renderQueueItem.outputModule(1);                    modifiedFileName = renderOutputModule.file.toString().slice(0, -4); // trim off the dot file extension                    tagName = listOfTags[j].substring(1) + renderOutputModule.file.toString().slice(-4);                    modifiedFileName += '_' + tagName;                    renderOutputModule.file = new File(modifiedFileName);                    dupeSelectedComp.name = dupeSelectedComp.name + ' -- ' + listOfTags[j].substring(1) + ' -- remove after render';                }                // reset the layers enabled property to original                for (var j = 0; j < layerSettings.length; j++) {                    layerSettings[j].ref.enabled = layerSettings[j].enabled;                    if (layerSettings[j].audioEnabled === true) {                        layerSettings[j].ref.audioEnabled = layerSettings[j].audioEnabled;                    }                }                compsChangedCounter++;            }            aalert(compsChangedCounter + ' comp/s total touched.');        }    };};/** * Function with inner main function. Invoked at bottom of this file. * Removes unwanted comps from project pane. */var cleanupLayerPasses = function() {    return {        main: function(stringToFind) {            var allComps = app.project.items;            var removedCount = 0;            var item;            for (var i = allComps.length; i >= 1; i--) {                item = allComps[i];                if (item.name.indexOf(stringToFind) > -1) {                    item.remove();                    removedCount++;                }            }            aalert(removedCount + ' items were removed.');        }    };};