/**
 * Builds a boids-like animation.
 * For use with comp "animation_sample" or one of its variants.
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
 * Adds comp layers to a selected comp. Builds the boids sample animation.
 */
var buildBoids = function() {
    return {
        arrSelectedComps: getSelectedComps(),
        main: function(argument) {
            var selectedComp;
            var taskCount = 0;
            var numberOfBoids = argument.numberOfBoids;
            var numberOfBoidDots = argument.numberOfBoidDots;
            var samples = "5;";
            var timeFrame = "0.5;";
            var boidDotTimeFrame = "0.2;";
            var delay = "0."
            var smoothPosition = "index + 1;";
            var timeFrameTransform = 9.1;
            var avoidAmount = argument.avoidAmount;
            var avoidanceThreshold = argument.avoidanceThreshold;
            var numberOfChasers = argument.numberOfChasers;

            for (var i = 0; i < this.arrSelectedComps.length; i++) {
                selectedComp = this.arrSelectedComps[i];

                for (var j = 0; j < numberOfBoids; j++) {
                    var boidComp = getComp("boid");
                    var boidDotComp = getComp("boid_dot");
                    var boidPlusComp = getComp("boid_plus");

                    delay = "0." + (j + 1).toString() + ";";
                    timeFrame = (randRange(1, 9) / timeFrameTransform).toString() + ";";
                    smoothPosition = (j + 1).toString() + ";";

                    var boidExpression = "var samples = " + samples + NEW_LINE +
                        "var timeframe = " + timeFrame + NEW_LINE +
                        "var delay = " + delay + NEW_LINE +
                        "var smoothPosition = " + smoothPosition + NEW_LINE +
                        "for(var n = 0; n < samples; n++){" + NEW_LINE +
                        "\tsmoothPosition += thisComp.layer('boid_leader').transform.position.valueAtTime(time - delay - timeframe / 2 + timeframe / samples * n);" + NEW_LINE +
                        "}" + NEW_LINE +
                        "smoothPosition = smoothPosition/samples";

                    var rotExpression = "thisPoint=position;" + NEW_LINE +
                        "thatPoint = thisComp.layer('boid_leader').position;" + NEW_LINE +
                        "delta=sub(thisPoint, thatPoint);" + NEW_LINE +
                        "angle=Math.atan2(delta[1], delta[0]);" + NEW_LINE +
                        "radiansToDegrees(angle)";

                    var newBoidLayer = selectedComp.layers.add(boidComp);

                    // Make one of the followers red
                    if (j === 3) {
                        newBoidLayer.property("Effects").addProperty("Change to Color");
                        newBoidLayer.effect("Change to Color")("To").setValue([255, 0, 0]);
                        newBoidLayer.effect("Change to Color")("Change").setValue(4);
                        newBoidLayer.name = "boid_follower_red_" + j.toString();
                    } else if (j === 2) {
                        timeFrame = "2;";
                        newBoidLayer.property("Effects").addProperty("Change to Color");
                        newBoidLayer.effect("Change to Color")("To").setValue([255, 255, 0]);
                        newBoidLayer.effect("Change to Color")("Change").setValue(4);
                        newBoidLayer.name = "boid_follower_yellow_" + j.toString();
                    } else {
                        newBoidLayer.name = "boid_follower_" + j.toString();
                    }

                    newBoidLayer.rotation.expression = rotExpression;
                    newBoidLayer.position.expression = boidExpression;
                    taskCount++;
                }

                for (var k = 0; k < numberOfBoidDots; k++) {
                    var boidComp = getComp("boid");
                    var boidDotComp = getComp("boid_dot");
                    var boidPlusComp = getComp("boid_plus");

                    delay = "0.0" + (k + 1).toString() + ";";
                    boidDotTimeFrame = (randRange(1, 20) / timeFrameTransform).toString() + ";";
                    smoothPosition = "0." + (k + 1).toString() + ";";

                    var newBoidDotLayer;
                    if (k === 4) {
                        boidDotTimeFrame = "4;";
                        newBoidDotLayer = selectedComp.layers.add(boidPlusComp);
                        newBoidDotLayer.name = "boid_plus_" + k.toString();
                    } else {
                        newBoidDotLayer = selectedComp.layers.add(boidDotComp);
                        newBoidDotLayer.name = "boid_dot_follower_" + k.toString();
                    }

                    var boidDotExpression = "var samples = " + samples + NEW_LINE +
                        "var timeframe = " + boidDotTimeFrame + NEW_LINE +
                        "var delay = " + delay + NEW_LINE +
                        "var smoothPosition = " + smoothPosition + NEW_LINE +
                        "for(var n = 0; n < samples; n++){" + NEW_LINE +
                        "\t" + "smoothPosition += thisComp.layer('boid_leader').transform.position.valueAtTime(time - delay - timeframe / 2 + timeframe/samples * n);" + NEW_LINE +
                        "}" + NEW_LINE +
                        "smoothPosition = smoothPosition/samples";

                    newBoidDotLayer.rotation.expression = rotExpression;
                    newBoidDotLayer.position.expression = boidDotExpression;
                    taskCount++;
                }


                var plusMinus = "-";
                var avoidance = "";
                for (var m = 1; m < selectedComp.layers.length; m++) {

                    if (m % 2 == 0) {
                        plusMinus = "+";
                    } else {
                        plusMinus = "-";
                    }
                    avoidAmount += 1;
                    avoidance = "for(var n = 1; n <= thisComp.numLayers; n++){" + NEW_LINE +
                        "    if ((thisLayer !== thisComp.layer(n)) && " + NEW_LINE +
                        "    (thisComp.layer(n).name.indexOf('boid_chaser') == -1)){" + NEW_LINE +
                        "        var delta = sub(thisLayer.position, thisComp.layer(n).position);" + NEW_LINE +
                        "        if ((delta[0] < " + avoidanceThreshold.toString() + ") || (delta[1] < " + avoidanceThreshold + ")) {" + NEW_LINE +
                        "            smoothPosition = [smoothPosition[0]" + plusMinus + avoidAmount.toString() + ",smoothPosition[1]" + plusMinus + avoidAmount.toString() + "];" + NEW_LINE +
                        "        }" + NEW_LINE +
                        "    }" + NEW_LINE +
                        "}" + NEW_LINE +
                        "smoothPosition;";

                    var es = selectedComp.layers[m].position.expression;
                    es += NEW_LINE;
                    if ((selectedComp.layers[m].name !== "boid_pointer") &&
                        (selectedComp.layers[m].name !== "boid_leader"))
                        selectedComp.layers[m].position.expression = es + avoidance;
                }

                for (var k = 0; k < numberOfChasers; k++) {
                    var boidChaserComp = getComp("boid_chaser");
                    var boidChaserExpression = "var samples = 5;" + NEW_LINE +
                        "var timeFrame = .1" + k.toString() + ";" + NEW_LINE +
                        "var delay = 0." + (k + 1).toString() + k.toString() + ";" + NEW_LINE +
                        "var smoothPosition = 0;" + NEW_LINE +
                        "for(var n = 0; n < samples; n++){" + NEW_LINE +
                        "smoothPosition += thisComp.layer('boid_leader').transform.position.valueAtTime(time-delay-timeFrame/2+timeFrame/samples*n)};" + NEW_LINE +
                        "smoothPosition = smoothPosition/samples;";

                    var newBoidChaserLayer = selectedComp.layers.add(boidChaserComp);
                    newBoidChaserLayer.name = "boid_chaser_" + k.toString();

                    newBoidChaserLayer.rotation.expression = rotExpression  + "- 90;";
                    newBoidChaserLayer.position.expression = boidChaserExpression;
                    taskCount++;
                }


                for (var k = 1; k <= numberOfBoidDots*3; k++) {
                    var boidChaserComp = getComp("boid_dot");
                    var boidChaserExpression = "var samples = 5;" + NEW_LINE +
                        "var timeFrame = .1;" + NEW_LINE +
                        "var delay = 0." + (k*2).toString() + ";" + NEW_LINE +
                        "var smoothPosition = 0.5;" + NEW_LINE +
                        "for(var n = 0; n < samples; n++){" + NEW_LINE +
                        "smoothPosition += thisComp.layer('boid_leader').transform.position.valueAtTime(time-delay-timeFrame/2+timeFrame/samples*n)};" + NEW_LINE +
                        "smoothPosition = smoothPosition/samples;";

                    var newBoidChaserLayer = selectedComp.layers.add(boidChaserComp);
                    newBoidChaserLayer.name = "boid_micro_dot_" + k.toString();

                    newBoidChaserLayer.position.expression = boidChaserExpression;
                    taskCount++;
                }


            }
            aalert(taskCount + ' layers were created.');
        }
    };
};

/**
 * Anything to be passed to the script's main method is set here.
 */
var vars = {
    numberOfBoids: 7,
    numberOfBoidDots: 5,
    numberOfChasers: 5,
    avoidanceThreshold: 80,
    avoidAmount: 2
};

/**
 * Runs the script.
 * Calls main and passes args (if any).
 */
buildBoids().main(vars);

app.endUndoGroup();