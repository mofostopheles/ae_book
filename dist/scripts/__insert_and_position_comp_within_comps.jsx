/**
 * An After Effects script for inserting and positioning comps.
 * Consumes the auto-generated JavaScript from __generate_javascript_from_captured_properties.jsx.
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
 * Places compToPlace and positions it per auto-generated JavaScript.
 */
var insertAndPositionCompWithinComps = function() {
    return {
        arrSelectedComps: getSelectedComps(),
        /**
         * compToPlace The comp to place.
         */
        main: function(compToPlace) {
            if (compToPlace === '') {
                aalert('Need a comp name for this to work.');
                return;
            }

            var compsChangedCounter = 0;
            var selectedComp;
            var newLayer;
            var newX;
            var newY;
            var newScale;
            for (var i = 0; i < this.arrSelectedComps.length; i++) {
                selectedComp = this.arrSelectedComps[i];
                newLayer = selectedComp.layers.add(getComp(compToPlace));
                newLayer.threeDLayer = false;
                newLayer.blendingMode = BlendingMode.MULTIPLY;
                newLayer.label = 5;
                newX = 0;
                newY = 0;
                newScale = 0;

                ///////////////////// BEGIN AUTO-GENERATED CODE /////////////////////
                // this block generated by '__generate_javascript_from_captured_properties.jsx'

                if (selectedComp.name.indexOf('120x600') > -1) {
                    newX = 120;
                    newY = 92.75;
                    newScale = [26.0937004089356, 59.2187004089355, 100];
                } else if (selectedComp.name.indexOf('160x600') > -1) {
                    newX = 160;
                    newY = 103;
                    newScale = [34.7916679382324, 68.75, 100];
                } else if (selectedComp.name.indexOf('300x250') > -1) {
                    newX = 303;
                    newY = 129;
                    newScale = [64.375, 83.125, 100];
                } else if (selectedComp.name.indexOf('300x600') > -1) {
                    newX = 297;
                    newY = 171.375;
                    newScale = [67.916633605957, 114.583297729492, 100];
                } else if (selectedComp.name.indexOf('320x100') > -1) {
                    newX = 316;
                    newY = 48;
                    newScale = [68.8333358764648, 36.75, 100];
                } else if (selectedComp.name.indexOf('320x480') > -1) {
                    newX = 319;
                    newY = 152.5;
                    newScale = [70.3125, 109.0625, 100];
                } else if (selectedComp.name.indexOf('336x280') > -1) {
                    newX = 331;
                    newY = 99.625;
                    newScale = [72.2396011352539, 68.4896011352539, 100];
                } else if (selectedComp.name.indexOf('480x320') > -1) {
                    newX = 472.25;
                    newY = 121;
                    newScale = [104.791664123535, 83.125, 100];
                }
                ///////////////////// END AUTO-GENERATED CODE /////////////////////

                // update the newly added layer...
                newLayer.position.setValue([newX, newY]);
                newLayer.scale.setValue(newScale);
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
    compToPlace: 'gradient_overlay' // Comp name to insert in selected comps.
};

/**
 * Runs the script.
 * Calls main and passes args (if any).
 */
insertAndPositionCompWithinComps().main(vars.compToPlace);

app.endUndoGroup();
