;
var euphonic = euphonic || {};

euphonic = (function (window, document, undefined) {

    // Create a public object
    var base = {};

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

    var formatString = function(s) {
        return s.replace('.js','').replace('.css','').replace('/','-');
    }

    var initRequestAnimationFrame = function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
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

    return base;

})(window, document);
