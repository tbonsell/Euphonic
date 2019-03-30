;
var euphonic = euphonic || {};

euphonic.instrument = (function (window, document, undefined) {

    /**
     * Create a public object
     */
    var instrument = {};

    /**
     * Load Dependencies
     */
    var chord = euphonic.chord || {};

    /**
     * Private Variables
     */

     var instrumentPath = 'instruments/';

     var instruments = {
            'bass' : {
                'type' : 'string',
                'gui' : {
                    'width' : 960,
                    'height' : 200,
                    'detail' : 4,
                    'backgroundColor' : '#755628',
                    'stringColor' : ['#958963','#c8bb93'],
                    'fretColor' : ['#888888','#CCCCCC']
                },
                'strings' : {
                    'count' : 4,
                    'semitones' : 12,
                    'spacing' : 5,
                    'baseNote' : 'E',
                    'baseOctave' : 1,
                }
            },
            'five string bass' : {
                'type' : 'string',
                'gui' : {
                    'width' : 960,
                    'height' : 200,
                    'detail' : 4,
                    'backgroundColor' : '#755628',
                    'stringColor' : ['#958963','#c8bb93'],
                    'fretColor' : ['#888888','#CCCCCC']
                },
                'strings' : {
                    'count' : 5,
                    'semitones' : 12,
                    'spacing' : 5,
                    'baseNote' : 'B',
                    'baseOctave' : 0,
                    'detail' : 6,
                }
            },
            'six string bass' : {
                'type' : 'string',
                'gui' : {
                    'width' : 960,
                    'height' : 200,
                    'detail' : 10,
                    'backgroundColor' : '#755628',
                    'stringColor' : ['#958963','#c8bb93'],
                    'fretColor' : ['#888888','#CCCCCC']
                },
                'strings' : {
                    'count' : 6,
                    'semitones' : 12,
                    'spacing' : 5,
                    'baseNote' : 'B',
                    'baseOctave' : 0,
                    'detail' : 10,
                }
            }
            // 'five string banjo' : {
            //     'type' : 'string',
            //     'strings' : {
            //         'count' : 5,
            //         'semitones' : 12,
            //         'spacing' : 0,
            //         'base' : ['note' : ['G', 'C', 'G', 'B', 'D'], 'octave' : [4, 3, 3, 3, 4]],
            //         'droneAt' : 5
            //     }
            // },
            // 'guitar' : {
            //     'type' : 'string',
            //     'semitones' : 20,
            //     'strings' : ['E', 'A', 'D', 'G', 'B', 'E'],
            //     'octaves' : [2, 2, 3, 3, 3, 4]
            // },
            // 'violin' : {
            //     'type' : 'string',
            //     'semitones' : 13,
            //     'strings' : ['G', 'D', 'A', 'E'],
            //     'octaves' : [3, 4, 4, 5]
            // },
            // 'viola' : {
            //     'type' : 'string',
            //     'semitones' : 13,
            //     'strings' : ['C', 'G', 'D', 'A'],
            //     'octaves' : [3, 3, 4, 4]
            // },
            // 'cello' : {
            //     'type' : 'string',
            //     'semitones' : 27,
            //     'strings' : ['C', 'G', 'D', 'A'],
            //     'octaves' : [2, 2, 3, 3]
            // },
            // 'ukulele' : ['G', 'C', 'E', 'A'],
            // 'banjo' : ['G', 'C', 'G', 'B', 'D'],
            // 'mandolin' : ['G', 'D', 'A', 'E'],

        };


    /**
     * Public Methods
     */
    instrument.set = function() {
        var set = this;

        return set;
    }

    instrument.get = function() {
        var get = this;

        get.instrument = function(name) {
            return getInstrument(name);
        }

        return get;
    }

    instrument.load = function() {
        var load = this;

        load.instrument = function(name) {
            euphonic.loadScript(instrumentPath+name+'.js', function() {
                var options = euphonic.instrument[name].info;

                euphonic.instrument[name].render(name.replace(' ', '-').toLowerCase()+'-render');
                // createOptions(name+'Options', options);
            });
        }

        return load;
    }

    // instrument.render = function() {
    //     var render = this;
    //
    //     render.string = function(el, name) {
    //         //return renderStringInstrument(el, name);
    //         // euphonic.loadScript('instruments/bass.js', function() {
    //         //     euphonic.instrument.bass.render('svg', {'stringCount':4});
    //         // });
    //     }
    //
    //     return render;
    // }


    /**
     * Private Methods
     */

    var createOptions = function(options) {
        for(property in options.options) {
            var el = document.createElement(options.options[property].input);
            el.id = property;
            myDiv.appendChild(selectList);
        }
    }

    var getStrings = function(obj) {
        var ret = [],
            count = chord.get().toneValues()[obj.strings.baseNote];

        for(var i = 0; i < obj.strings.count; i++) {
            ret.push(chord.get().toneValueMap().sharp[count]);
            count = euphonic.mod(count + obj.strings.spacing, 12);
        }

        return ret;
    }

    var renderStringInstrument = function(el, obj) {
        if(obj.type == 'string') {
             var s = SVG('svg').size(obj.gui.width, obj.gui.height),
            //     // neckGradient = s.gradient("l(1, 1, 1, 0)"+obj.gui.stringColor)
                stringGradient = s.gradient('linear', function(stop) {
                    stop.at(0, obj.gui.stringColor[0]);
                    stop.at(1, obj.gui.stringColor[1]);
                }).from(0, 1).to(0, 0),
                fretGradient = s.gradient('linear', function(stop) {
                    stop.at(0, obj.gui.fretColor[0]);
                    stop.at(1, obj.gui.fretColor[1]);
                }),
                dropShadow = function(add) {
                    var blur = add.offset(2, 2).in(add.sourceAlpha).gaussianBlur(4);
                    add.blend(add.source, blur);
                    this.size('500%','500%');
                },
                stringCount = obj.strings.count,
                stringDetail = obj.gui.detail,
                semitoneCount = obj.strings.semitones,
                str = getStrings(obj),
                stringOpen = obj.gui.height / 5,
                el = document.querySelector(el);
            //
            // el.style.height = obj.gui.height + 'px';
            //
            s.rect(obj.gui.width, obj.gui.height).move(0, 0).attr({fill: obj.gui.backgroundColor});
            s.rect(stringOpen, obj.gui.height).move(0, 0).attr({fill: "#333333"}).filter(dropShadow);
            s.rect(2, obj.gui.height).move(stringOpen, 0).attr({
                fill: fretGradient
            });

            // Render the semitone markers or frets
            var semObj = [];
            for(var i = 0; i < semitoneCount; i++) {
                semObj[i] = {
                    x : i*((obj.gui.width-stringOpen)/semitoneCount)+(((obj.gui.width-stringOpen)/semitoneCount))+(stringOpen - 3),
                    y : 0,
                    w : 3,
                    h : obj.gui.height
                };
                // s.rect(i*(920/semitoneCount)+(460/semitoneCount)-1, 0, 3, 200).attr({
                s.rect(semObj[i].w, semObj[i].h).move(semObj[i].x, semObj[i].y).attr({
                    fill: fretGradient
                }).filter(dropShadow);
            }

            // Render the strings
            var strObj = [];
            for(var i = 0; i < stringCount; i++) {
                strObj[i] = {
                    x : 0,
                    y : i*(obj.gui.height/stringCount)+((obj.gui.height/2)/stringCount)-i*(i/(stringDetail/2)),
                    w : obj.gui.width,
                    h : 4 + i*(i/stringDetail)
                };
                s.rect(strObj[i].w, strObj[i].h).move(strObj[i].x, strObj[i].y).attr({
                    fill: stringGradient
                }).filter(dropShadow);
            }

            // Render the note labels
            var circleDiameter = 140 / stringCount;
            for(var i = 0; i < stringCount; i++) {
                for(var j = 0; j < semitoneCount; j++) {
                    s.circle(circleDiameter).move(semObj[j].x-stringOpen-semitoneCount, (strObj[i].y-circleDiameter/2)+strObj[i].h/2).attr({
                        fill: '#CCCCCC',
                        opacity: 0.25
                    });
                    //s.text(j*((obj.gui.width - stringOpen) / semitoneCount) + stringOpen*2, obj.gui.height - sobj[i].y, obj.strings.strings[i]);
                }
            }
        //     console.log(obj.strings.strings);
         }

         console.log(s.svg());
    }

    /**
     * Return Public Object
     */
    return instrument;

})(window, document);
