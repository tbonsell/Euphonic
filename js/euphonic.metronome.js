;(function(window, document, undefined) {
    "use strict";

    euphonic.Metronome = function(options) {
        var base = this,
            fps = 60,
            bpm = 120,
            beats = 4,
            ticks = 1,
            interval = (((fps/bpm)*1000)*100000)/100000,//1000/fps,
            lastTime = (new Date()).getTime(),
            currentTime = 0,
            delta = 0,
            loopId = null,
            func = null,
            self = {
                frames: 0,
                maxFrames: -1,
                beat: 1,
                tick: 1
            };

        Object.assign(self, options);

        /**
         * Starts the metronome and sets the callback function, BPM and precision
         * @param  {Function} callback Function to be called
         * @param  {Number} BPM Sets the beats per minute
         * @param  {Precision} ticks Ticks per beat
         */
        base.start = function(callback) {
            func = callback;

            if(arguments.length >= 2) {
                bpm = arguments[1];
                interval = (((fps/bpm)*1000)*100000)/100000;
            }

            if(arguments.length >= 3) {
                ticks = arguments[2];
                interval /= ticks;
            }

            runLoop();
        }

        /**
         * Stops the runLoop associated with this metronome object
         */
        base.stop = function() {
            cancelAnimationFrame(loopId);
        }

        /*
         * Private Methods
         */

        /**
         * runLoop. Processes the metronome running at BPM * precision.
         */
        var runLoop = function() {
            loopId = requestAnimationFrame(runLoop);

            currentTime = (new Date()).getTime();
            delta = (currentTime-lastTime);

            if(delta > interval) {
                func(self);
                self.tick++;
                if(self.tick > ticks) {
                    self.beat = self.beat >= beats ? 1 : self.beat + 1;
                    self.tick = 1;
                }
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

var initRequestAnimationFrame = function() {
    var lastTime = 0,
        vendors = ['ms', 'moz', 'webkit', 'o'];

    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
            window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        }
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        }
    }
}

initRequestAnimationFrame();
