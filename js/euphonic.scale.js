;
var euphonic = euphonic || {};

euphonic.scale = (function (window, document, undefined) {

    // Create a public object
    var scale = {};

    var chord = euphonic.chord || {};

    // Private variables
    var scales = {
        'Major'				: ['1','2','3','4','5','6','7','8'],
        'Natural Minor'		: ['1','2','b3','4','5','b6','b7','8'],
        'Major Pentatonic'	: ['1','2','3','5','6','8'],
        'Minor Pentatonic'	: ['1','b3','4','5','b7','8'],
        'Blues'				: ['1','b3','4','b5','5','b7','8'],
        'Major Blues'		: ['1','2','b3','3','4','b5','5','6','b7','8'],
        'Minor Blues'		: ['1','2','b3','4','b5','5','b6','b7','8'],
        'Ionian Mode'		: ['1','2','3','4','5','6','7','8'],
        'Dorian Mode'		: ['1','2','b3','4','5','6','b7','8'],
        'Phrygian Mode'		: ['1','b2','b3','4','5','b6','b7','8'],
        'Lydian Mode'		: ['1','2','3','#4','5','6','7','8'],
        'Mixolydian Mode'	: ['1','2','3','4','5','6','b7','8'],
        'Aeolian Mode'		: ['1','2','b3','4','5','b6','b7','8'],
        'Locrian Mode'		: ['1','b2','b3','4','b5','b6','b7','8'],
        'Harmonic Minor'	: ['1','2','b3','4','5','b6','7','8'],
        'Phrygian Dominant'	: ['1','b2','3','4','5','b6','b7','8'],
        'Melodic Minor'     : ['1','2','b3','4','5','6','7','8'],
        'Bepop'				: ['1','2','3','4','5','#5','6','7','8'],
        'Chromatic'			: ['1','b2','2','b3','3','4','b5','5','b6','6','b7','7','8'],
        'Whole Tone'		: ['1','2','3','b5','b6','b7','8'],
        'Diminished'		: ['1','2','b3','4','b5','b6','6','7','8'],
        'Augmented'			: ['1','b3','3','5','#5','7','8'],
        'Enigmatic'			: ['1','b2','3','b5','#5','b7','7','8'],
        'Leading Tone'		: ['1','2','3','b5','#5','b7','7','8'],
        'Overtone'			: ['1','2','3','b5','5','#5','b7','8']
    },
    modes = [
        'Ionian Mode',
        'Dorian Mode',
        'Phygian Mode',
        'Lydian Mode',
        'Mixolydian Mode',
        'Aeolian Mode',
        'Locrian Mode'
    ],
    currentScale = "Major",
    currentKeySignature = null,
    currentIntervals = null;


    scale.set = function() {
        var set = this;
        set.scale = function(name) {
            setScale(name);
        }
        set.new = function(scale) {
            if(scale) {
                Object.assign(scales, scale);
        	}
        }

        return set;
    }

    scale.get = function() {
        var get = this;

        /**
    	 * @desc gets the name of the currently selected scale
    	 * @return string - scale name
    	 */
        get.scale = function() {
            return currentScale;
        }

        /**
         * @desc gets the tones for the current or specified scale
         * @param mixed - can be either an array of intervals or a scale name (optional)
         * @return array - array of intervals
         */
        get.tones = function() {
            var arg = arguments.length === 1 ? arguments[0] : currentIntervals;
            return getScaleInfo(arg, chord.get().tones);
        }

        /**
    	 * @desc gets the intervals for the current or specified scale
    	 * @param mixed - can be either an array of intervals or a scale name (optional)
    	 * @return array - array of intervals
    	 */
        get.intervals = function() {
            var arg = arguments.length === 1 ? arguments[0] : currentIntervals;
            return getScaleInfo(arg, chord.get().intervals);
        }

        /**
    	 * @desc gets the semitones for the current or specified scale
    	 * @param mixed - can be either an array of intervals or a scale name (optional)
    	 * @return array - array of semitones
    	 */
        get.semitones = function() {
            var arg = arguments.length === 1 ? arguments[0] : currentIntervals;
            return getScaleInfo(arg, chord.get().semitones);
        }

        /**
    	 * @desc gets the notes for the current or specified scale
    	 * @param mixed - can be either an array of intervals or a scale name (optional)
    	 * @return array - array of notes
    	 */
        get.notes = function() {
            var arg = arguments.length === 1 ? arguments[0] : currentIntervals;
            return getScaleInfo(arg, chord.get().notes);
        }

        /**
    	 * @desc gets the steps for the current or specified scale
    	 * @param mixed - can be either an array of intervals or a scale name (optional)
    	 * @return array - array of steps
    	 */
        get.steps = function() {
            var arg = arguments.length === 1 ? arguments[0] : currentIntervals;
            return getScaleInfo(arg, getSteps);
        }

        /**
    	 * @desc gets the keysignature for the current or specified scale
    	 * @return object - object containing
    	 */
        get.keySignature = function() {
            var ret = currentKeySignature;
            if(currentKeySignature.accidentals > 0) {
                if(currentKeySignature.type == 'auto') {
                    ret.type = chord.get().accidental()
                } else {
                    ret.type = currentKeySignature.type;
                }
            } else {
                ret.type = '';
            }

            return ret;
        }

        /**
    	 * @desc returns a list of scale names that are compatible with the selected intervals
         * @param array intervals - small array of intervals
    	 * @return array - set of compatible scale names
    	 */
        get.validScales = function() {
            var arg = arguments.length === 1 ? arguments[0] : chord.get().intervals();
            return filterScales(arg);
        }

        return get;
    }

    /**
	 * @desc sets the current scale. this does not check if the selected scale is compatible with the selected chord
	 * @param string name - name of the chord to set
	 * @return object - parent object
	 */
    var setScale = function(name) {
    	if(scales[name]) {
    		currentIntervals = scales[name];
    		currentScale = name;
    	}

    	// set the key signature
    	var scaleNotes = chord.get().notes(currentIntervals);
	    var count = 0;
        var chordDetails = chord.get().details();
        var accidental = chord.get().accidental();
	    for(var i = 0; i < scaleNotes.length - 1; i++) {
			if(scaleNotes[i].indexOf(accidental) >= 0) {
				count += 1;
			}
		}
		currentKeySignature = {"accidentals" : count, "type" : chordDetails.accidental};
    }

    /**
	 * @desc returns a list of scale names that are compatible with the selected intervals
     * @param array intervals - small array of intervals
	 * @return array - set of compatible scale names
	 */
    var filterScales = function(intervals) {
    	var matches = 0,
    		results = [];

        if(intervals != null) {
        	for(var scale in scales) {
        		for(var i = 0; i < intervals.length; i++) {
        			if(scales[scale].indexOf(intervals[i]) >= 0) {
        				matches += 1;
        			}
        		}
        		if(matches == intervals.length) {
        			results[results.length] = scale;
        		}
        		matches = 0;
        	}
        }

    	return results;
  	}

    /**
	 * @desc private - creates an array of whole/half steps between each interval (whole step = 2, half step = 1)
     * @param array intervals - intervals
	 * @return array - set of compatible scale names
	 */
    var getSteps = function(intervals) {
        var arr = [],
            int = chord.get().intervalList();
        for(var i = 1; i < intervals.length; i++) {
            arr.push(int[intervals[i]] - int[intervals[i-1]]);
        }

        return arr;
    }

    /**
	 * @desc private - returns the value of the requested function.
     *       if val is a string, a scale name is assumed and the appropriate interval array is used.
     * @param mixed val - either a scale name or an array of intervals
     * @param function func - function to be called
	 * @return array - array of appropriate scale info depending on the called function
	 */
    var getScaleInfo = function(val, func) {
        if(typeof val == 'string') {
            if(typeof scales[val] == 'undefined') {
                return null;
            } else {
                return func(scales[val]);
            }
        } else {
            return func(val);
        }
    }

    // Return public object
    return scale;

})(window, document);
