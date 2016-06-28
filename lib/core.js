;
"use strict";
var wg = wg || {};

+ function(z) {


  z.config = {

        server:'http://127.0.0.1/',
        rootPath:'GitHub/three.js-master/viewer/data/',
        discPath:'/projectDiscription/',
        modelPath:'/model/',
        viewPath:'/view/',
        texturesPath:'/textures/'

  };


  var CONST = z.CONST = {

      HEAD: document && (document.head || document.getElementsByTagName('head')[0]),

      BODY: document.body,

      PI_2: Math.PI * 2,

      RAD_TO_DEG: 180 / Math.PI,

      DEG_TO_RAD: Math.PI / 180,

      PLUG_PATH: 'plugs/',

      PLUG_SYN: false,

      BGCOLOR: 0x6baedd,

      // HCOLOR:0xFFB0B0,
      HCOLOR:0x8CB2FF,
      
      WHEEL:20,

      DEF_LEVEL:['batch2','batch3','batch4'],

      EVENTS: [ 'mousedown', 'mousemove','mouseup', 'mouseout', 'mousewheel', 'touchstart', 'touchend', 'touchmove'],

      TARGET_FPMS: 0.06
    },

    fn = z.fn = {

      isS: function(a) {
        return Object.prototype.toString.call(a) == '[object String]' },
      /**
       * 判断当前对象是否是 Function
       * @function
       * @param object {object} 需要更改的对象
       * @return {boolean}
       */
      isF: function(a) {
        return Object.prototype.toString.call(a) == '[object Function]' },
      /**
       * 判断当前对象是否是 Object
       * @function
       * @param object {object} 需要更改的对象
       * @return {boolean}
       */
      isO: function(a) {
        return Object.prototype.toString.call(a) == '[object Object]' },
      /**
       * 判断当前对象是否是 Number
       * @function
       * @param object {object} 需要更改的对象
       * @return {boolean}
       */
      isN: function(a) {
        return Object.prototype.toString.call(a) == '[object Number]' },
      /**
       * 判断当前对象是否是 Array
       * @function
       * @param object {object} 需要更改的对象
       * @return {boolean}
       */
      isA: function(a) {
        return Object.prototype.toString.call(a) == '[object Array]' },


      getu:function(name){

        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");  
        var r = window.location.search.substr(1).match(reg);  
        if (r!=null) return unescape(r[2]);  
        return null;  

      },

      loadScript: function(_url, __ck) {

        if (!_url) return;

        var

          script = document.createElement('script'),

          me = this,

          clearSE = function(_script) {
            _script.onload = null;
            _script.onerror = null;
            CONST.HEAD.removeChild(script);
          },

          _loadFn = function() {
            clearSE(script);
            __ck();
          };

        script.type = 'text/javascript';
        script.src = _url;
        script.onload = _loadFn;
        script.onerror = function() {
          console.log('加载js失败:' + _url)
          _loadFn();
        };
        CONST.HEAD.appendChild(script);
      },

      copyObj:function(a,b){
        for(var i in b)a[i] = b[i];
        return a

      },
      tlog: function(n) {
        var t = 0;
        return function(n) {

          return;
          console.log(n, Date.now() - t + 'ms');
          t = Date.now()
        }
      }(),


      getJSON:function( _url ){

        return new Promise(function(resolve, reject){

            var request = new XMLHttpRequest() ;
            request.open("GET", _url , true);
            request.onreadystatechange = function(){
                if (this.readyState == 4 && (this.status == 200 || this.status == 0) ){

                    try{
                        resolve(JSON.parse( request.responseText ));
                    }catch(e){
                        reject({e:e,url:_url})
                    }
                }
            }
            request.send();
        })

    },

      raycaster:function(){

        var _ray = new THREE.Raycaster();

        return function(point , camera, ray ){

          _ray.setFromCamera( point , camera );
          return _ray.intersectObjects( ray );

        }
      }(),
      multiplyMatrices: function(a, b) {

        var ae = a;
        var be = b;
        var te = a;

        var a11 = ae[0],
          a12 = ae[4],
          a13 = ae[8],
          a14 = ae[12];
        var a21 = ae[1],
          a22 = ae[5],
          a23 = ae[9],
          a24 = ae[13];
        var a31 = ae[2],
          a32 = ae[6],
          a33 = ae[10],
          a34 = ae[14];
        var a41 = ae[3],
          a42 = ae[7],
          a43 = ae[11],
          a44 = ae[15];

        var b11 = be[0],
          b12 = be[4],
          b13 = be[8],
          b14 = be[12];
        var b21 = be[1],
          b22 = be[5],
          b23 = be[9],
          b24 = be[13];
        var b31 = be[2],
          b32 = be[6],
          b33 = be[10],
          b34 = be[14];
        var b41 = be[3],
          b42 = be[7],
          b43 = be[11],
          b44 = be[15];

        te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

        te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

        te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

        te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

        return te;

      },
      makeRotationFromQuaternion: function(te, q) {

        var x = q.x,
          y = q.y,
          z = q.z,
          w = q.w || 1;
        var x2 = x + x,
          y2 = y + y,
          z2 = z + z;
        var xx = x * x2,
          xy = x * y2,
          xz = x * z2;
        var yy = y * y2,
          yz = y * z2,
          zz = z * z2;
        var wx = w * x2,
          wy = w * y2,
          wz = w * z2;

        te[0] = 1 - (yy + zz);
        te[4] = xy - wz;
        te[8] = xz + wy;

        te[1] = xy + wz;
        te[5] = 1 - (xx + zz);
        te[9] = yz - wx;

        te[2] = xz - wy;
        te[6] = yz + wx;
        te[10] = 1 - (xx + yy);

        // last column
        te[3] = 0;
        te[7] = 0;
        te[11] = 0;

        // bottom row
        te[12] = 0;
        te[13] = 0;
        te[14] = 0;
        te[15] = 1;

        return te;

      }

    };


  {

    var exarr = [],
      ms = {};

    Object.defineProperties(z, {

      'exports': {
        set: function(v) { exarr.push(v) },
        get: function() {
          var r = exarr.length > 1 ? exarr : exarr.length == 1 && exarr[0] || null;
          exarr = [];
          return r
        }
      },
      'require': {
        value: function() {
          var exe = function(_a) {
            fn.loadScript(_a.src, function() { _a.cak(ms[_a.name || _a.src] = z.exports) });
          };
          // b 是完成后， c是加载每个的回掉
          return function(a, b, c) {
            ms = {};
            if (fn.isA(a) && a.length) {

              var l = a.length,
                count = 0,
                syn = [],
                other = [],
                i = 0;
              a.forEach(function(m) { m.syn ? syn.push(m) : other.push(m) });

              ! function req(_i) {
                var me, _cak;
                if (i < syn.length) {
                  me = syn[_i];
                  _cak = me.cak;
                  me.cak = function(op) {
                    _cak(op);
                    count++;
                    c && c({ src: me.src, idx: count, length: l });
                    req(++i);
                  };
                  exe(me);
                } else if (other.length > 0) {
                  other.forEach(function(me) {
                    var __cak = me.cak;
                    me.cak = function(op) {
                      count++;
                      c && c({ src: me.src, idx: count, length: l });
                      __cak && __cak(op);
                      if (count >= l) b && b(ms);
                    }
                    exe(me);
                  });

                } else { b && b(ms) }
              }(i);

            } else { exe(a) }
          }
        }()
      }

    });


  };

  z.EventEmitter = function() {

    var has = Object.prototype.hasOwnProperty;

    var prefix = typeof Object.create !== 'function' ? '~' : false;

    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }

    function EventEmitter() {}


    EventEmitter.prototype._events = undefined;


    EventEmitter.prototype.eventNames = function eventNames() {
      var events = this._events,
        names = [],
        name;

      if (!events) return names;

      for (name in events) {
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
      }

      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }

      return names;
    };


    EventEmitter.prototype.listeners = function listeners(event, exists) {
      var evt = prefix ? prefix + event : event,
        available = this._events && this._events[evt];

      if (exists) return !!available;
      if (!available) return [];
      if (available.fn) return [available.fn];

      for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
        ee[i] = available[i].fn;
      }

      return ee;
    };


    EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;

      if (!this._events || !this._events[evt]) return false;

      var listeners = this._events[evt],
        len = arguments.length,
        args, i;
      // console.log(listeners)
      if ('function' === typeof listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

        switch (len) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }

        for (i = 1, args = new Array(len - 1); i < len; i++) {
          args[i - 1] = arguments[i];
        }

        listeners.fn.apply(listeners.context, args);
      } else {
        // console.log(len)
        var length = listeners.length,
          j;

        for (i = 0; i < length; i++) {
          if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

          switch (len) {
            case 1:
              listeners[i].fn.call(listeners[i].context);
              break;
            case 2:
              listeners[i].fn.call(listeners[i].context, a1);
              break;
            case 3:
              listeners[i].fn.call(listeners[i].context, a1, a2);
              break;
            default:
              if (!args)
                for (j = 1, args = new Array(len - 1); j < len; j++) {
                  args[j - 1] = arguments[j];
                }

              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }

      return true;
    };


    EventEmitter.prototype.on = function on(event, fn, context) {
      var listener = new EE(fn, context || this),
        evt = prefix ? prefix + event : event;

      if (!this._events) this._events = prefix ? {} : Object.create(null);
      if (!this._events[evt]) this._events[evt] = listener;
      else {
        if (!this._events[evt].fn) this._events[evt].push(listener);
        else this._events[evt] = [
          this._events[evt], listener
        ];
      }

      return this;
    };


    EventEmitter.prototype.once = function once(event, fn, context) {
      var listener = new EE(fn, context || this, true),
        evt = prefix ? prefix + event : event;

      if (!this._events) this._events = prefix ? {} : Object.create(null);
      if (!this._events[evt]) this._events[evt] = listener;
      else {
        if (!this._events[evt].fn) this._events[evt].push(listener);
        else this._events[evt] = [
          this._events[evt], listener
        ];
      }

      return this;
    };

    EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;

      if (!this._events || !this._events[evt]) return this;

      var listeners = this._events[evt],
        events = [];

      if (fn) {
        if (listeners.fn) {
          if (
            listeners.fn !== fn || (once && !listeners.once) || (context && listeners.context !== context)
          ) {
            events.push(listeners);
          }
        } else {
          for (var i = 0, length = listeners.length; i < length; i++) {
            if (
              listeners[i].fn !== fn || (once && !listeners[i].once) || (context && listeners[i].context !== context)
            ) {
              events.push(listeners[i]);
            }
          }
        }
      }


      if (events.length) {
        this._events[evt] = events.length === 1 ? events[0] : events;
      } else {
        delete this._events[evt];
      }

      return this;
    };

    EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
      if (!this._events) return this;

      if (event) delete this._events[prefix ? prefix + event : event];
      else this._events = prefix ? {} : Object.create(null);

      return this;
    };


    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    EventEmitter.prototype.addListener = EventEmitter.prototype.on;


    EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
      return this;
    };


    EventEmitter.prefixed = prefix;

    return EventEmitter

  }();

  class Ticker {

    constructor(autoStart) {

      var _this = this;

      this._tick = function _tick(time) {

        _this._requestId = null;

        if (_this.started) {
          _this.update(time);
          if (_this.started && _this._requestId === null && _this._emitter.listeners('tick', true)) {
            _this._requestId = requestAnimationFrame(_this._tick);
          }
        }
      };

      this._emitter = new z.EventEmitter();

      this._requestId = null;

      this._maxElapsedMS = 100;

      this.autoStart = !!autoStart;

      this.deltaTime = 1;

      this.elapsedMS = 1 / CONST.TARGET_FPMS;

      this.lastTime = 0;

      this.speed = 1;

      this.started = false;

    };

    get FPS() {
      return 1000 / this.elapsedMS };

    get minFPS() {
      return 1000 / this._maxElapsedMS };
    set minFPS(fps) {
      var minFPMS = Math.min(Math.max(0, fps) / 1000, CONST.TARGET_FPMS);
      this._maxElapsedMS = 1 / minFPMS;
    }

    _requestIfNeeded() {
      if (this._requestId === null && this._emitter.listeners('tick', true)) {
        this.lastTime = performance.now();
        this._requestId = requestAnimationFrame(this._tick);
      }
    };

    _cancelIfNeeded() {
      if (this._requestId !== null) {
        cancelAnimationFrame(this._requestId);
        this._requestId = null;
      }
    };

    _startIfPossible() {
      if (this.started) {
        this._requestIfNeeded();
      } else if (this.autoStart) {
        this.start();
      }
    };

    add(fn, context) {
      this._emitter.on('tick', fn, context);
      this._startIfPossible();
      return this;
    };

    addOnce(fn, context) {
      this._emitter.once('tick', fn, context);
      this._startIfPossible();
      return this;
    };

    remove(fn, context) {
      this._emitter.off('tick', fn, context);

      if (!this._emitter.listeners('tick', true)) {
        this._cancelIfNeeded();
      }

      return this;
    };

    start() {
      if (!this.started) {
        this.started = true;
        this._requestIfNeeded();
      }
    };

    stop() {
      if (this.started) {
        this.started = false;
        this._cancelIfNeeded();
      }
    };

    update(currentTime) {

      var elapsedMS;

      currentTime = currentTime || performance.now();
      elapsedMS = this.elapsedMS = currentTime - this.lastTime;

      if (elapsedMS > this._maxElapsedMS) {
        elapsedMS = this._maxElapsedMS;
      }

      this.deltaTime = elapsedMS * CONST.TARGET_FPMS * this.speed;

      this._emitter.emit('tick', this.deltaTime);

      this.lastTime = currentTime;
    };

  };


  z.Ticker = Ticker;


  var plugs = z.plugs = {};

  z.registerPlugin = function(name, obj = {}) {
    if (typeof name == 'string' && !plugs[name]) return plugs[name] = obj;
  };

  z.usePlugin = function(name, obj) {

    if (plugs[name])
      return plugs[name].init(obj);
    console.log('插件未注册!--> ' + name);

  };

  z.destroyPlugin = function(name, obj) {

    if (plugs[name])
      return plugs[name].destroy(obj);
    console.log('插件未注册!--> ' + name);

  };


  var defPlugins = z.defPlugins = {

    camera: function(o) {

      var c = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 99999999);
      c.position.set(0, 150, 500);



      o.on('resize', function(a) {
        c.aspect = a.width / a.height;
        c.updateProjectionMatrix();
      });


      return c

    },

    scene: function() {

      return new THREE.Scene();

    },

    renderer: function(obj) {


      var r = new THREE.WebGLRenderer({

// alpha    : true
        // depth :false
      });



      // 设置场景背景
      // r.setClearColor( 0xf0f0f0,1 );
// r.setClearColor(0xffffff, 1);
      r.autoClear = false;
// r.sortObjects = false;

      obj.on('resize', function(a) {
        r.setSize(a.width, a.height);
      });

      return r

    }


  };


  class Viewer extends z.EventEmitter {

    constructor(ops = {}) {

      super();

      var me = this;

      this.domElement = ops.dom && typeof ops.dom == 'string' ?

        document.getElementById(ops.dom) || document.body : document.body;

      this.ticker = new Ticker;
      this.ops = ops;

      this.api = {
        ray:[],
        _select:[]
      };

      this.domEvents = ops.domEvents || CONST.EVENTS;

      this.enabled = false;
      this.redayed = false;
      this.started = false;

      this.renderer =
        this.camera =
        this.scene =
        this.rect = null;

      this.needAddEvent = ops.needAddEvent === undefined ? true : ops.needAddEvent;

      if (typeof ops.reday == 'function') {
        this.once('reday', ops.reday);
      }

      if (ops.plugs && ops.plugs.length > 0) {
        var ps = [];
        ops.plugs.map(m => {
          if (plugs[m] === undefined) {
            ps.push({
              syn: CONST.PLUG_SYN,
              src: z.CONST.PLUG_PATH + m + '.js',
              cak: function() { plugs[m].init(me) }
            });
          } else {
            plugs[m] && plugs[m].init(me)
          }
        });

        if (ps.length > 0) {

          z.require(ps, function(m) {
            if (!me.redayed) me.emit('reday', me);
          });

        } else {
          if (!this.redayed) this.emit('reday', me);
        }
      } else {
        if (!this.redayed) this.emit('reday', me);
      }

    };

    resize() {

      this.rect = this.domElement.getBoundingClientRect()
      this.getRenderer().setSize( this.rect.width , this.rect.height );
      this.emit('resize', this.rect);

    };

    start() {

      if (this.started) return;

      this.started = true;

      this.renderer = this.renderer || defPlugins.renderer(this);
      // console.log(defPlugins.renderer(this))
      this.domElement.appendChild(this.renderer.domElement);

      this.camera = this.camera || defPlugins.camera(this);
      this.scene = this.scene || defPlugins.scene(this);
      this.rect = this.rect || this.domElement.getBoundingClientRect();

      window.addEventListener('resize', this.resize.bind(this), false);

      this.resize();

      var me = this;

      this.ticker.add(this.tick, this);

      this.ticker.add(function() {

        me.redraw();

      }, this);


      this.enabled = true;

      this.addInteractionEvent();

      this.ticker.start();

      this.emit('start');


    };

    addInteractionEvent() {

      if (!this.needAddEvent) return;
      this.needAddEvent = false;
      var dom = this.domElement,
        me = this;
      this._domEvents = function() {
        var evs = {};
        me.domEvents.map(m => {
          evs[m] = function(e) { me.emit(m, e) };
          dom.addEventListener(m, evs[m], false);
        })
        return evs
      }();

      function onContextMenu(event) {
        event.preventDefault();
      }

      dom.addEventListener('contextmenu', onContextMenu, false);

    };

    tick(time) {

      this.emit('tick', time);

    };

    update(time) {

      this.emit('update', time);

    };

    getRenderer() {
      return this.renderer
    };


    getScene() {
      return this.scene
    };

    getCamera() {
      return this.camera
    };

    redraw() {

      if (!this.enabled) return;
      this.emit('draw');

      this.getRenderer().render(this.getScene(), this.getCamera());

      
      
      this.emit('last');

    };

  };



  z.Viewer = Viewer;




}(wg);
