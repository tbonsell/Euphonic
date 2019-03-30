;
var euphonic = euphonic || {};

euphonic.chord = (function (window, document, undefined) {

    // Create a public object
    var chord = {},

        // Key mappings
        baseIntervals = ['1',null,'3',null,'5',null,null,null,null,null],
	    validKeys = ['A','A#','Bb','B','C','C#','Db','D','D#','Eb','E','F','F#','Gb','G','G#','Ab'],
	    validQualities = ['M','m','dim','aug','5'],
	    validIntervals = ['None','6','7','9','11','13','M7','M9','M11','M13','m6','m7','m9','m11','m13','m/M7'],
	    validFifths = ['None','b5','#5'],
	    validAdds = ['None','add4','add9'],
        validSustains = ['None','sus','sus2'],

        // Interval mappings
	    intervalValue = {
    		'1':0,'#1':1,'b2':1,'2':2,'#2':3,'b3':3,'3':4,'4':5,'#4':6,'b5':6,'5':7,'#5':8,
            'b6':8,'6':9,'#6':10,'b7':10,'7':11,'8':12,'#8':13,'b9':13,'9':14,'#9':15,
            'b10':15,'10':16,'11':17,'#11':18,'b12':18,'12':19,'#12':20,'b13':20,'13':21
	    },
        intervalSharp = {
            0:'1',1:'#1',2:'2',3:'#2',4:'3',5:'4',6:'#4',7:'5',8:'#5',9:'6',10:'#6',11:'7',
            12:'8',13:'#8',14:'9',15:'#9',16:'10',17:'11',18:'#11',19:'12',20:'#12',21:'13'
        },
	    intervalFlat = {
            0:'1',1:'b2',2:'2',3:'b3',4:'3',5:'4',6:'b5',7:'5',8:'b6',9:'6',10:'b7',11:'7',
            12:'8',13:'b9',14:'9',15:'b10',16:'10',17:'11',18:'b12',19:'12',20:'b13',21:'13'
        },

        // Tone mappings
	    toneValue = {
            'A':0,'A#':1,'Bb':1,'B':2,'B#':3,'Cb':2,'C':3,'C#':4,'Db':4,'D':5,'D#':6,
            'Eb':6,'E':7,'E#':8,'Fb':7,'F':8,'F#':9,'Gb':9,'G':10,'G#':11,'Ab':11
        },
	    toneSharp = {0:'A',1:'A#',2:'B',3:'B#',4:'C#',5:'D',6:'D#',7:'E',8:'E#',9:'F#',10:'G',11:'G#'},
	    toneFlat = {0:'A',1:'Bb',2:'B',3:'C',4:'Db',5:'D',6:'Eb',7:'E',8:'F',9:'Gb',10:'G',11:'Ab'},
        toneNeutral = {0:'A',1:'A#',2:'B',3:'C',4:'C#',5:'D',6:'Eb',7:'E',8:'F',9:'F#',10:'G',11:'G#'},

        // Chord data
        chordData = {
            'C':{'a':'#','n':0,'r':'Am'},'G':{'a':'#','n':1,'r':'Em'},'D':{'a':'#','n':2,'r':'Bm'},
            'A':{'a':'#','n':3,'r':'F#m'},'E':{'a':'#','n':4,'r':'C#m'},'B':{'a':'#','n':5,'r':'G#m'},
            'Gb':{'a':'b','n':6,'r':'Ebm'},'Db':{'a':'b','n':5,'r':'Bbm'},'Ab':{'a':'b','n':4,'r':'Fm'},
            'Eb':{'a':'b','n':3,'r':'Cm'},'Bb':{'a':'b','n':2,'r':'Gm'},'F': {'a':'b','n':1,'r':'Dm'},
            'Cb':{'a':'b','n':7,'r':'Abm'},'F#':{'a':'#','n':6,'r':'D#m'},'C#':{'a':'#','n':7,'r':'A#m'},
            'Am':{'a':'#','n':0,'r':'C'},'Em':{'a':'#','n':1,'r':'G'},'Bm':{'a':'#','n':2,'r':'D'},
            'F#m':{'a':'#','n':3,'r':'A'},'C#m':{'a':'#','n':4,'r':'E'},'G#m':{'a':'#','n':5,'r':'B'},
            'D#m':{'a':'#','n':6,'r':'F#'},'Bbm':{'a':'b','n':5,'r':'Db'},'Fm':{'a':'b','n':4,'r':'Ab'},
            'Cm':{'a':'b','n':3,'r':'Eb'},'Gm':{'a':'b','n':2,'r':'Bb'},'Dm':{'a':'b','n':1,'r':'F'},
            'Abm':{'a':'b','n':7,'r':'Cb'},'Ebm':{'a':'b','n':6,'r':'Gb'},'A#m':{'a':'#','n':7,'r':'C#'}
        },

        // Private variables
	    currentChord = null,
	    currentIntervals = null,

        // Regular expressions
        regEx = {
            'isChordStrict': /^([a-gA-G][#|b]?)(M|m|dim|aug|sus|5)?(6|7|9|11|13|M6|M7|M9|M11|M13|m6|m7|m9|m11|m13)?(b5|#5)?(add4|add9)?/,
            'isChord': /^([A-G][#b]?)(.*)/,
            'isRoot': /^([A-G][#b]?)(M|m)?/,
            'isNote': /[A-G]/
        },

        // Private options
        settings = {
            key: 'C',
            quality: 'M',
            interval: null,
            fifth: null,
            add: null,
            sustain: null,
            octave: 3,
            accidental: 'auto',
            optional: false
        };


    // Public setters
    chord.set = function() {
        var set = this;

        set.chord = function(options) {
    		setChord(options);
        }
        set.octave = function(oct) {
        	settings.octave = oct < 0 ? 0 : oct;
        }
        set.accidental = function(accidental) {
            settings.accidental = /[#b]/.test(accidental) ? accidental : settings.accidental;
        }

        return set;
    }

    // Public getters
    chord.get = function() {
        var get = this;

        get.chord = function() {
            return currentChord;
        }
        get.key = function() {
            return settings.key + settings.quality.replace('M', '');
        }
        get.tones = function() {
            var arg = arguments.length === 1 ? arguments[0] : currentIntervals;
            return getTones(arg);
        }
        get.intervalList = function() {
            return intervalValue;
        }
        get.intervals = function() {
            return currentIntervals;
        }
        get.semitones = function() {
            var arg = arguments.length === 1 ? arguments[0] : currentIntervals;
            return getSemitones(arg);
        }
        get.notes = function() {
            var arg = arguments.length === 1 ? arguments[0] : currentIntervals;
        	return getNotes(arg);
        }
        get.details = function() {
            return settings;
        }
        get.accidental = function() {
            var arg = arguments.length === 1 ? arguments[0] : settings.key;
            return getAccidental(arg);
        }
        get.relative = function() {
            var arg = arguments.length === 1 ? arguments[0] : currentChord;
            return getRelative(arg);
        }
        get.toneValues = function() {
            return toneValue;
        }
        get.toneValueMap = function() {
            return {'sharp' : toneSharp, 'flat' : toneFlat};
        }
        get.chordData = function() {
            if(arguments.length === 1) {
                return chordData[arguments[0].replace('M','')];
            } else {
                return chordData;
            }
        }
        get.chordOptions = function() {
            return {
                'keys' : validKeys,
                'qualities' : validQualities,
                'intervals' : validIntervals,
                'fifths' : validFifths,
                'adds' : validAdds,
                'sustains' : validSustains
            };
        }

        return get;
    }

    chord.shift = function(name, steps) {
		var t = parseChord(name);
		if (t === null) {
			return null;
		}
        var ret = t.map(function(n){
            var tone = (((n.toneValue + steps) % 12) + 12) % 12;
            for (var key in toneValue) {
    			if (tone == toneValue[key]) {
    				return key + n.suffix;
    			}
    		}
    		return null;
        }, this).join("/");

		return ret;
	};


    // Private methods

    var setChord = function(options) {
        Object.assign(settings, options);

        currentIntervals = baseIntervals.slice();

        setQuality();
        setInterval();
        setFifth();
        setAdd();
        filterChord();
        setSustain();

        currentChord = [
            settings.key,
            settings.quality.replace('M', ''),
            settings.interval,
            settings.fifth,
            settings.add,
            settings.sustain
        ].join('');

        return this;
    }

    /**
	 * @desc sets the chord quality (major, minor, sustained etc.)
	 * @return object - parent object
	 */
    var setQuality = function() {
    	if(settings.quality) {
			switch(settings.quality) {
				case 'm' 	: currentIntervals[2] = 'b3'; break;
				case 'dim' 	: currentIntervals[2] = 'b3'; currentIntervals[4] = 'b5'; break;
				case 'aug' 	: currentIntervals[4] = '#5'; break;
				case '5' 	: currentIntervals[2] = null;
                case 'M'	:
                default     : break;
			}
		}
	}

    /**
	 * @desc sets the chord interval (7, M7, 9 etc)
	 */
	var setInterval = function() {
		if(settings.interval) {
			switch(settings.interval) {
				case 'M7' 	: currentIntervals[6] = '7'; break;
				case 'M9' 	: currentIntervals[6] = '7'; currentIntervals[7] = '9'; break;
				case 'M11'	: currentIntervals[6] = '7'; currentIntervals[7] = '*9'; currentIntervals[8] = '11'; break;
				case 'M13'	: currentIntervals[7] = '*9'; currentIntervals[8] = '*11'; currentIntervals[9] = '13'; break;
				case 'M6'	:
				case 'm6'	:
				case '6' 	: currentIntervals[5] = '6'; break;
				case 'm7'	: currentIntervals[2] = 'b3'; currentIntervals[6] = 'b7'; break;
				case '7' 	: if(currentIntervals[2] == 'b3' && currentIntervals[4] == 'b5') { currentIntervals[6] ='6'; } else { currentIntervals[6] = 'b7'; } break;
				case 'm9'	:
				case '9'	: currentIntervals[6] = 'b7'; currentIntervals[7] = '9'; break;
				case 'm11'	:
				case '11'	: currentIntervals[6] = 'b7'; currentIntervals[7] = '*9'; currentIntervals[8] = '11'; break;
				case 'm13'	:
				case '13'	: currentIntervals[6] = 'b7'; currentIntervals[7] = '*9'; currentIntervals[8] = '*11'; currentIntervals[9] = '13'; break;
                case 'm/M7' : currentIntervals[2] = 'b3'; currentIntervals[6] = '7';
                default     : null; break;
			}
		}
	}

	/**
	 * @desc updates the fifth interval of the chord
	 */
	var setFifth = function() {
		if(settings.fifth) {
			switch(settings.fifth) {
				case 'b5' 	: currentIntervals[4] = 'b5'; break;
				case '#5'	: currentIntervals[4] = '#5'; break;
				case '5'	: currentIntervals[4] = '5'; break;
                default     : break;
			}
		}
	}

	/**
	 * @desc adds a 4th or 9th to the chord
	 */
	var setAdd = function() {
		if(settings.add) {
			switch(settings.add.replace('add', '')) {
				case '4' 	: currentIntervals[3] = '4'; break;
				case '9'	: currentIntervals[7] = '9'; break;
                default     : break;
			}
		}
	}

    /**
	 * @desc sets the chord sustain (sus, sus2)
	 * @return object - parent object
	 */
    var setSustain = function() {
    	if(settings.sustain) {
			switch(settings.sustain) {
                case 'sus2' : currentIntervals[2] = null; currentIntervals[1] = '2'; break;
                case 'sus4' :
                case 'sus'  : currentIntervals[2] = null; currentIntervals[3] = '4'; break;
                default     : break;
			}
		}
	}

    /**
	 * @desc filters the chord intervals removing special markers indicating if the interval is optional or not
	 */
	var filterChord = function() {
    	// Remove optional intervals from the chord if requested
    	currentIntervals = currentIntervals.map(function(n) {
    		if(n) {
	    		if(!/[*]/.test(n)) {
                    // If optional identifier does not exist...
	    			return n;
	    		} else {
                    // If optional identifier does exist...
	    			if(settings.optional) {
	    				return n.replace('*','');
	    			}
	    		}
    		}
    	}, this).filter(function(n) {
    		if(n) {
    			return n;
    		}
    	});
    }

    /**
	 * @desc find the actual notes represented for each interval
	 * @param array - array of intervals
	 * @return array - array of notes as strings
	 */
     var getNotes = function(arg) {
         var semitones = getSemitones(arg),
             accidental = settings.accidental == 'auto' ? getAccidental(settings.key) : settings.accidental,
             notes = semitones.map(function(n) {
                 switch(accidental) {
                     case 'b' : return toneFlat[(n+toneValue[settings.key])%12]; break;
                     case '#' : return toneSharp[(n+toneValue[settings.key])%12]; break;
                     default : return toneNeutral[(n+toneValue[settings.key])%12];
                 }
   		    }, this);

   		return notes;
   	}

    /**
	 * @desc gets the numeric semitone values based on an array of intervals
	 * @param array - array of intervals
	 * @return array - array of numeric semitone values
	 */
  	var getSemitones = function(arg) {
        return arg.map(function(n) {
			if(/[*]/.test(n)) {
    			return intervalValue[n.replace('*','')];
    		} else {
    			return intervalValue[n];
    		}
		}, this);
	}

    /**
	 * @desc adds the octave and key note numeric values to each interval semitone
	 * @param array - array of intervals
	 * @return array - array of numeric semitones with the octave and key note offset
	 */
	var getTones = function(arg) {
        var semitones = getSemitones(arg);

        var offset = semitones.map(function(n) {
			return n + toneValue[settings.key] + settings.octave * 12 + 1;
		}, this);

		return offset;
    }

    var parseChord = function(name) {
        var arr = name.split("/");

        var ret = arr.map(function(n) {
            var m = n.match(regEx.isChord);
            if (!m || m.length < 1) {
    			return null;
    		}
            return {
    			toneValue: toneValue[m[1]],
    			prefix: m[1],
    			suffix: m[2]
    		};
        }, this);

        return ret;
    }

    var getRelative = function(majorKey) {
        if(chordData.hasOwnProperty(majorKey.replace('M', ''))) {
            return chordData[majorKey.replace('M', '')].r;
        } else {
            return false;
        }
    }

    var getAccidental = function(key) {
        if(!regEx.isRoot.test(key)) {
            key = settings.key + settings.quality;
        }
        var m = key.charAt(1) == 'm' ? 2 : key.charAt(2) == 'm' ? 3 : 0;
        if(m > 0) {
            return chordData[key.substring(0,m)].a;
        }
        return /[#]/.test(key) ? '#' : /[b]/.test(key) ? 'b' : '';
    }


    // Return public object
    return chord;

})(window, document);
