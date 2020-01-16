/**
 * An After Effects script template. Put description here.
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
 * Description here.
 */
var buildBoids = function() {
    return {

        arrSelectedComps: getSelectedComps(),
        main: function(argument) {
            var selectedComp;
            var taskCount = 0;
            var numberOfBoids = argument.numberOfBoids;
            var numberOfBoidDots = argument.numberOfBoidDots;
            var samples = "7;";
            var timeFrame = "0.5;";
            var boidDotTimeFrame = "0.2;";
            var delay = "0."
            var smoothPosition = "index + 1;";  

            for (var i = 0; i < this.arrSelectedComps.length; i++) {
                selectedComp = this.arrSelectedComps[i];
                var boidComp = getComp("boid");
                var boidDotComp = getComp("boid_dot");

                

                for (var j = 0; j < numberOfBoids; j++) {

                    delay = "0." + (j+1).toString() + ";";
                    timeFrame = "0." + (j+1).toString() + ";";
                    smoothPosition = (j+1).toString() + ";";

                    var boidExpression = "var samples = " + samples + NEW_LINE +
                        "var timeframe = " + timeFrame + NEW_LINE +
                        "var delay = " + delay + NEW_LINE +
                        "var smoothPosition = " + smoothPosition + NEW_LINE +
                        "for(var n = 0; n < samples; n++){" + NEW_LINE +
                        "smoothPosition += thisComp.layer('boid_leader').transform.position.valueAtTime(time-delay-timeframe/2+timeframe/samples*n)}" + NEW_LINE +
                        "smoothPosition = smoothPosition/samples";

                    var rotExpression = "thisPoint=position;" + NEW_LINE +
                        "thatPoint=thisComp.layer('boid_leader').position;" + NEW_LINE +
                        "delta=sub(thisPoint, thatPoint);" + NEW_LINE +
                        "angle=Math.atan2(delta[1], delta[0]);" + NEW_LINE +
                        "radiansToDegrees(angle);";



                    var newBoidLayer = selectedComp.layers.add(boidComp);
                    newBoidLayer.rotation.expression = rotExpression;
                    newBoidLayer.position.expression = boidExpression;
                    newBoidLayer.name = "boid_follower_" + j.toString();

                    // Make one of the followers red
                    if (j === 3) {
                        newBoidLayer.property("Effects").addProperty("Change to Color");
                        newBoidLayer.effect("Change to Color")("To").setValue([255, 0, 0]);
                        newBoidLayer.effect("Change to Color")("Change").setValue(4);
                    }

                }

                for (var k = 0; k < numberOfBoidDots; k++) {
                    delay = "0." + (k+1).toString() + ";";
                    boidDotTimeFrame = "0." + (k+1).toString() + ";";
                    smoothPosition = (k+1).toString() + ";";

                    var boidDotExpression = "var samples=" + samples + NEW_LINE +
                    "var timeframe = " + boidDotTimeFrame + NEW_LINE +
                    "var delay = " + delay + NEW_LINE +
                    "var smoothPosition = " + smoothPosition + NEW_LINE +
                    "for(var n = 0; n < samples; n++){" + NEW_LINE +
                    "smoothPosition += thisComp.layer('boid_leader').transform.position.valueAtTime(time-delay-timeframe/2+timeframe/samples*n)}" + NEW_LINE +
                    "smoothPosition = smoothPosition/samples";


                    var newBoidDotLayer = selectedComp.layers.add(boidDotComp);

                    newBoidDotLayer.rotation.expression = rotExpression;
                    newBoidDotLayer.position.expression = boidDotExpression;
                    newBoidDotLayer.name = "boid_dot_follower_" + k.toString();
                }
            }
            aalert(taskCount + ' items/s were touched.');
        }
    };
};

/**
 * Anything to be passed to the script's main method is set here.
 */
var vars = {
    numberOfBoids: 9,
    numberOfBoidDots: 5
};

/**
 * Runs the script.
 * Calls main and passes args (if any).
 */
buildBoids().main(vars);

app.endUndoGroup();