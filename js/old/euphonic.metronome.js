;
var euphonic = euphonic || {};

metronome = (function(window, document, undefined) {
    "use strict";

    window.euphonic = window.euphonic || {};

    if(ephonic.Loop) return;

    euphonic.Loop = function(options) {
        var base = this,
            fps = 60,
            interval = 1000/fps,
            lastTime = (new Date()).getTime(),
            currentTime = 0,
            delta = 0,
            loopId = null,
            func = null,
            self = {
                frames: 0,
                maxFrames: -1
            };

        Object.assign(self, options);

        base.start = function(callback) {
            func = callback;

            if(arguments.length >= 2) {
                fps = arguments[1];
                interval = 1000/fps;
            }

            if(arguments.length >= 3) {
                self.maxFrames = arguments[2];
            }

            runLoop();
        }

        base.stop = function() {
            cancelAnimationFrame(loopId);
        }

        /*
         * Private Methods
         */

        var runLoop = function() {
            loopId = requestAnimationFrame(runLoop);

            currentTime = (new Date()).getTime();
            delta = (currentTime-lastTime);

            if(delta > interval) {
                func(self);
                lastTime = currentTime - (delta % interval);
                self.frames++;

                if(self.maxFrames >= 0) {
                    if(self.frames >= self.maxFrames) {
                        base.stop();
                    }
                }
            }
        }
    }

})(window, document);
