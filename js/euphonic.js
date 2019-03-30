;
var euphonic = euphonic || {};

euphonic = (function(window, document, undefined) {

    var base = {};

    /**
     * Simple method that runs the callback function only after the page is fully loaded
     * @param {Function} func
     */
    base.ready = function(func) {
        if (typeof func !== 'function') return;
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            return func();
        }
        document.addEventListener('DOMContentLoaded', func, false);
    }

    base.isInteger = function(x) {
        return (typeof x === 'number') && (x % 1 === 0);
    }

    base.mod = function(n, m) {
        return ((n % m) + m) % m;
    }

    base.loadScript = function(script, callback) {
        var id = formatString(script),
            el = document.querySelector("#"+id);
        if(el === null) {
            el = document.createElement("script");
            el.src = script;
            el.id = id;
            el.onload = callback;
            document.body.appendChild(el);
        }
    }

    base.removeScript = function(script) {
        var el = document.querySelector("#"+formatString(script));
        if(el !== null) {
            document.body.removeChild(el);
        }
    }

    /*
     * Private Methods
     */

    var formatString = function(s) {
        return s.replace('.js','').replace('.css','').replace('/','-');
    }


    return base;

})(window, document);
