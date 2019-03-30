;
var euphonic = euphonic || {};

euphonic.instrument.bass = (function (window, document, undefined) {

    /**
     * Create a public object
     */
    var instrument = {};

    /**
     * Information related to the instrument along with necessary options
     */
    instrument.info = {
        name: "Bass Guitar",
        type: "string",
        options: {
            stringCount: {
                input: 'select',
                label: 'String Count',
                default: 4,
                options: [4,5,6]
            },
            fretCount: {
                input: 'select',
                label: 'Fret Count',
                default: 12,
                options: [12,20]
            }
        }
    }

    instrument.options = {
        stringCount: 4,
        fretCount: 12
    }

    /**
     * Private variables
     */
    var settings = {
            strings: {
                '4': {
                    'width': 960,
                    'height': 200,
                    'notes':['E', 'A', 'D', 'G'],
                    'detail': 4
                },
                '5': {
                    'width': 960,
                    'height': 200,
                    'notes':['B', 'E', 'A', 'D', 'G'],
                    'detail': 6
                },
                '6': {
                    'width': 960,
                    'height': 200,
                    'notes':['B', 'E', 'A', 'D', 'G', 'C'],
                    'detail': 10},
            }
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

        return get;
    }

    instrument.render = function(el) {
        console.log(el);

        
    }


    /**
     * Private Methods
     */
    var render = function(el) {
        // var svg = SVG(el).size(options.width, options.height),
        //     group = svg.nested(),
        //
        //     opt = Object.assign(instrument.options, settings.strings[instrument.options.stringCount]),
        //
        //     dropShadow = function(add) {
        //         var blur = add.offset(2, 2).in(add.sourceAlpha).gaussianBlur(4);
        //         add.blend(add.source, blur);
        //         this.size('500%','500%');
        //     },
        //
        //     stringGradient = s.gradient('linear', function(stop) {
        //         stop.at(0, obj.gui.stringColor[0]);
        //         stop.at(1, obj.gui.stringColor[1]);
        //     }).from(0, 1).to(0, 0),
        //     fretGradient = s.gradient('linear', function(stop) {
        //         stop.at(0, obj.gui.fretColor[0]);
        //         stop.at(1, obj.gui.fretColor[1]);
        //     });
        //
        // group.rect(opt.width, opt.height).move(0, 0).attr({fill: obj.gui.backgroundColor});

        // if(obj.type == 'string') {
        //      var s = SVG('svg').size(obj.gui.width, obj.gui.height),
        //     //     // neckGradient = s.gradient("l(1, 1, 1, 0)"+obj.gui.stringColor)
        //         stringGradient = s.gradient('linear', function(stop) {
        //             stop.at(0, obj.gui.stringColor[0]);
        //             stop.at(1, obj.gui.stringColor[1]);
        //         }).from(0, 1).to(0, 0),
        //         fretGradient = s.gradient('linear', function(stop) {
        //             stop.at(0, obj.gui.fretColor[0]);
        //             stop.at(1, obj.gui.fretColor[1]);
        //         }),
        //         dropShadow = function(add) {
        //             var blur = add.offset(2, 2).in(add.sourceAlpha).gaussianBlur(4);
        //             add.blend(add.source, blur);
        //             this.size('500%','500%');
        //         },
        //         stringCount = obj.strings.count,
        //         stringDetail = obj.gui.detail,
        //         semitoneCount = obj.strings.semitones,
        //         str = getStrings(obj),
        //         stringOpen = obj.gui.height / 5,
        //         el = document.querySelector(el);
        //     //
        //     // el.style.height = obj.gui.height + 'px';
        //     //
        //     s.rect(obj.gui.width, obj.gui.height).move(0, 0).attr({fill: obj.gui.backgroundColor});
        //     s.rect(stringOpen, obj.gui.height).move(0, 0).attr({fill: "#333333"}).filter(dropShadow);
        //     s.rect(2, obj.gui.height).move(stringOpen, 0).attr({
        //         fill: fretGradient
        //     });
        //
        //     // Render the semitone markers or frets
        //     var semObj = [];
        //     for(var i = 0; i < semitoneCount; i++) {
        //         semObj[i] = {
        //             x : i*((obj.gui.width-stringOpen)/semitoneCount)+(((obj.gui.width-stringOpen)/semitoneCount))+(stringOpen - 3),
        //             y : 0,
        //             w : 3,
        //             h : obj.gui.height
        //         };
        //         // s.rect(i*(920/semitoneCount)+(460/semitoneCount)-1, 0, 3, 200).attr({
        //         s.rect(semObj[i].w, semObj[i].h).move(semObj[i].x, semObj[i].y).attr({
        //             fill: fretGradient
        //         }).filter(dropShadow);
        //     }
        //
        //     // Render the strings
        //     var strObj = [];
        //     for(var i = 0; i < stringCount; i++) {
        //         strObj[i] = {
        //             x : 0,
        //             y : i*(obj.gui.height/stringCount)+((obj.gui.height/2)/stringCount)-i*(i/(stringDetail/2)),
        //             w : obj.gui.width,
        //             h : 4 + i*(i/stringDetail)
        //         };
        //         s.rect(strObj[i].w, strObj[i].h).move(strObj[i].x, strObj[i].y).attr({
        //             fill: stringGradient
        //         }).filter(dropShadow);
        //     }
        //
        //     // Render the note labels
        //     var circleDiameter = 140 / stringCount;
        //     for(var i = 0; i < stringCount; i++) {
        //         for(var j = 0; j < semitoneCount; j++) {
        //             s.circle(circleDiameter).move(semObj[j].x-stringOpen-semitoneCount, (strObj[i].y-circleDiameter/2)+strObj[i].h/2).attr({
        //                 fill: '#CCCCCC',
        //                 opacity: 0.25
        //             });
        //             //s.text(j*((obj.gui.width - stringOpen) / semitoneCount) + stringOpen*2, obj.gui.height - sobj[i].y, obj.strings.strings[i]);
        //         }
        //     }
        // //     console.log(obj.strings.strings);
        //  }
        //
        //  console.log(s.svg());
    }

    /**
     * Return Public Object
     */
    return instrument;

})(window, document);
