wg.registerPlugin('bimapi', {

  init: function(o) {


    var sxdom = document.getElementById(o.ops.propertydom);

    var api = wg.fn.copyObj(o.api, {

      raycaster: function() {

        var mouse = new THREE.Vector2();
        return function(e) {

          mouse.x = ((e.clientX - o.rect.left) / o.rect.width) * 2 - 1;
          mouse.y = -((e.clientY - o.rect.top) / o.rect.height) * 2 + 1;
          return wg.fn.raycaster(mouse, o.getCamera(), o.api.ray);

        }
      }(),
      //设置高亮
      setHighlight: function(mesh) {
          
          
          

        if (mesh instanceof THREE.Mesh) {
            
          var mm = mesh.clone();
          mm.material = o.hmat;
          o.sbody.add(mm);
          mesh.currentHex = mm;
            
            
        //   mesh.currentHex = mesh.material.emissive.getHex();
        //   mesh.material.emissive.setHex(wg.CONST.HCOLOR);
        } else {
          console.log('设置高亮失败，类型不对', mesh.ElementID)
        }
        
        
        
        
        
      },


      //取消高亮self
      calHighlight: function(mesh) {

        if (mesh.length > 0 ) {
          for (var i = 0, len = mesh.length; i < len; i++) {
              
              
            
            
            api.calHighlight(mesh[i]);
              
            // mesh[i].material.emissive.setHex(mesh.currentHex);
          };
        } else if (mesh instanceof THREE.Mesh && mesh.currentHex !== undefined) {
            
            
            
        //   mesh.material.emissive.setHex(mesh.currentHex);
          
          
         
            o.sbody.remove(mesh.currentHex);

        }
      },

      // 鼠标右键点击事件
      mouseDownEvent: function( menuID, e) {
        // console.log(o) // Viewer
        var menu = document.getElementById(menuID); //获取菜单对象
        var domEle = document.getElementById('body');
        var leftValue = parseInt(o.api.getCss(domEle, 'left'));
        var rightMenuW = parseInt(o.api.getCss(menu, 'width'));

        var rightMenuH = (menu.children[0].children.length + 1) * 24 + 10;

        // 设置右击菜单的left值和top值
        var left,
            top;
        


            // 判断当点击的是右键是触发事件
          if (e.button == 2) { 
            // 取消鼠标默认事件的兼容方法
            document.oncontextmenu = function(e) {　　　　
              if (window.event) {　　　　
                e = window.event;　　　　　　　　
                e.returnValue = false; //对IE 中断 默认点击右键事件处理函数
                　　　　　　
              } else {　　　　　　　　
                e.preventDefault(); //对标准DOM 中断 默认点击右键事件处理函数
                　　　　　　
              };　　　　
            };

            // 设置菜单的位置
            // 设置菜单的位置的left值
            if (o.api.getWindowClient().w - e.clientX <= rightMenuW) {
                left = e.clientX + 2 - rightMenuW - leftValue;
            } else {
                left = e.clientX - 2 - leftValue;
            }

            // 设置菜单的位置的top值
            if (o.api.getWindowClient().h - e.clientY <= rightMenuH) {
                top = e.clientY + 2 - rightMenuH;
            } else {
                top = e.clientY - 2;
            }

            menu.style.cssText = 'display:block;top:' + top + 'px;' + 'left:' + left + 'px;'　　　　 
          } else {
            // 当点击的是其他键是隐藏菜单
            menu.style.display = "none";
          }
        //设置 鼠标移出菜单时 隐藏菜单
        menu.onmouseleave = function() { 

          setTimeout(function() {
            menu.style.display = "none";
          }, 200);　　
        }

        return;
      },

      // 获取某元素当前属性
      getCss: function(obj,key){
        return obj.currentStyle ? obj.currentStyle[key] : document.defaultView.getComputedStyle(obj,false)[key];
      },
      
      // 获取当前窗口的宽高
      getWindowClient: function () {
        // 获取窗口宽度
        if (window.innerWidth)
        winWidth = window.innerWidth;
        else if ((document.body) && (document.body.clientWidth))
        winWidth = document.body.clientWidth;
        // 获取窗口高度
        if (window.innerHeight)
        winHeight = window.innerHeight;
        else if ((document.body) && (document.body.clientHeight))
        winHeight = document.body.clientHeight;
        // 通过深入 Document 内部对 body 进行检测，获取窗口大小
        if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth)
        {
        winHeight = document.documentElement.clientHeight;
        winWidth = document.documentElement.clientWidth;
        }

        return {w: winWidth, h: winHeight};
      },









      //获取选择对象
      getSelect: function(i) {
        if (wg.fn.isN(i)) {
          return api._select[i]
        } else {
          return api._select
        }
      },
      //设置选择对象
      setSelect: function(arr, idormesh) {

        if (!idormesh) arr.map((m, i, a) => { a[i] = api.getById(m) });
        arr.map((m, i) => { api.setHighlight(m) });
        api._select = arr;

        if(arr.length==1){
            api.getProperty(arr[0].ElementID).then(m=>{
                if(typeof m=='string'){
                    m = JSON.parse(m)
                }
                sxdom.innerHTML = api.renderProperty(m.$values);
            });
        }
        
        
        

        return arr

      },
      addSelect: function(ops, idormesh) {
        var obj = !idormesh ? api.getById(ops) : ops;
        api._select.push(obj);
        api.setHighlight(obj);
      },
      removeSelcet: function(mesh) {

        var idx = null;

        if (mesh instanceof THREE.Mesh && (idx = api._select.indexOf(mesh)) > -1) {
          api._select.splice(idx, 1);
          api.calHighlight(mesh);
        }

      },
      clearSelect: function(arr) {
          
         

        api._select.map(m => { api.calHighlight(m) });
        api._select = [];

      },

      hideLevel: function(arr) {
        arr.map(m => {
          if (api.batch[m]) api.batch[m].visible = false
        });
      },
      showLevel: function(arr) {
        arr.map(m => {
          if (api.batch[m]) api.batch[m].visible = true
        });
      },

      hide: function() {

      },
      show: function() {

      },
      showAll: function() {

      },
      hideAll: function() {

      },

      getProperty: function(id) {

           return wg.fn.getJSON(wg.config.gurl +'?ProjectID='+
            o.ops.appkey+'&ElementID='+id)
      },

      renderProperty:function(d){
            var s = '';
            d.map(m=>{
                s+= '<tr><td>'+m.Name+'</td><td>'+m.Value+'</td></tr>';
            })
            return s

      },

            // 聚焦事件方法
            zoom: function(m) {

                
        var helper = new THREE.BoundingBoxHelper(m);
        var camera =camera = o.getCamera();
        var correctForDepth = 1.3;
        helper.update();
        var boundingSphere = helper.box.getBoundingSphere();
        var center = boundingSphere.center;
        var radius = boundingSphere.radius;

        camera.position.x = center.x+radius*4;
        camera.position.y = center.y+radius*4;
        camera.position.z = center.z+radius*4;

        var distance = center.distanceTo(camera.position) - radius;
        var realHeight = Math.abs(helper.box.max.y - helper.box.min.y);
        var fov = 2 * Math.atan(realHeight * correctForDepth / ( 2 * distance )) * ( 180 / Math.PI );
        // camera.fov = fov;

      
               o.orbit.target = helper.position;
                camera.updateProjectionMatrix();
               
               return;
                
                
                
                
                // console.log(m);
                var helper = new THREE.BoundingBoxHelper(m);
                var camera = o.getCamera();
                var correctForDepth = 1.3;
                helper.update();
                var boundingSphere = helper.box.getBoundingSphere();
                var center = boundingSphere.center;
                var radius = boundingSphere.radius;
                
                // 调整相机位置之前的坐标
                var beforeX = camera.position.x ;
                var beforeY = camera.position.y ;
                var beforeZ = camera.position.z ;
                
                //相机的目标位置
                var targetX = center.x + radius * 4 ;
                var targetY = center.y + radius * 4 ;
                var targetZ = center.z + radius * 4 ;
                
                //距离
                var distanceX = targetX - beforeX ; 
                var distanceY = targetY - beforeY ; 
                var distanceZ = targetZ - beforeZ ; 

                
                // easeOutElastic匀速  easeOutBounce弹簧  easeInQuad慢速  easeInCubic慢速2
                // animateX(distanceX , beforeX , 5000 , "easeOutElastic");
                // animateY(distanceY , beforeY , 5000 , "easeOutElastic");
                // animateZ(distanceZ , beforeZ , 5000 , "easeOutElastic");
               
               
               
               //运动函数X
    function animateX(juli,beforeX,duration,moveStyle){
        //案例: 将一个物体在5秒内从0px移动到400px
        var now = +new Date();//初始化计算now时间
        var tween;//默认动画没有走 进度是0
        var timer;
        //绑定事件
        timer = setInterval(move,16);
        //变速运动下计算动画时间进程
        function getTweenNew(now,pass,all,ease){
            var eases = {
                //线性匀速
                linear:function (t, b, c, d){
                    return (c - b) * (t/ d);
                },
                //弹性运动
                easeOutBounce:function (t, b, c, d) {
                    if ((t/=d) < (1/2.75)) {
                        return c*(7.5625*t*t) + b;
                    } else if (t < (2/2.75)) {
                        return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
                    } else if (t < (2.5/2.75)) {
                        return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
                    } else {
                        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
                    }
                },
                //其他
                swing: function (t, b, c, d) {
                    return this.easeOutQuad(t, b, c, d);
                },
                easeInQuad: function (t, b, c, d) {
                    return c*(t/=d)*t + b;
                },
                easeOutQuad: function (t, b, c, d) {
                    return -c *(t/=d)*(t-2) + b;
                },
                easeInOutQuad: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t + b;
                    return -c/2 * ((--t)*(t-2) - 1) + b;
                },
                easeInCubic: function (t, b, c, d) {
                    return c*(t/=d)*t*t + b;
                },
                easeOutCubic: function (t, b, c, d) {
                    return c*((t=t/d-1)*t*t + 1) + b;
                },
                easeInOutCubic: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t*t + b;
                    return c/2*((t-=2)*t*t + 2) + b;
                },
                easeInQuart: function (t, b, c, d) {
                    return c*(t/=d)*t*t*t + b;
                },
                easeOutQuart: function (t, b, c, d) {
                    return -c * ((t=t/d-1)*t*t*t - 1) + b;
                },
                easeInOutQuart: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
                    return -c/2 * ((t-=2)*t*t*t - 2) + b;
                },
                easeInQuint: function (t, b, c, d) {
                    return c*(t/=d)*t*t*t*t + b;
                },
                easeOutQuint: function (t, b, c, d) {
                    return c*((t=t/d-1)*t*t*t*t + 1) + b;
                },
                easeInOutQuint: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
                    return c/2*((t-=2)*t*t*t*t + 2) + b;
                },
                easeInSine: function (t, b, c, d) {
                    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
                },
                easeOutSine: function (t, b, c, d) {
                    return c * Math.sin(t/d * (Math.PI/2)) + b;
                },
                easeInOutSine: function (t, b, c, d) {
                    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
                },
                easeInExpo: function (t, b, c, d) {
                    return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
                },
                easeOutExpo: function (t, b, c, d) {
                    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
                },
                easeInOutExpo: function (t, b, c, d) {
                    if (t==0) return b;
                    if (t==d) return b+c;
                    if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                    return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
                },
                easeInCirc: function (t, b, c, d) {
                    return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
                },
                easeOutCirc: function (t, b, c, d) {
                    return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
                },
                easeInOutCirc: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                    return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
                },
                easeInElastic: function (t, b, c, d) {
                    var s=1.70158;var p=0;var a=c;
                    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                    if (a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                },
                easeOutElastic: function (t, b, c, d) {
                    var s=1.70158;var p=0;var a=c;
                    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                    if (a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
                },
                easeInOutElastic: function (t, b, c, d) {
                    var s=1.70158;var p=0;var a=c;
                    if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
                    if (a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                    return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
                },
                easeInBack: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    return c*(t/=d)*t*((s+1)*t - s) + b;
                },
                easeOutBack: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
                },
                easeInOutBack: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
                },
                easeInBounce: function (t, b, c, d) {
                    return c - this.easeOutBounce (d-t, 0, c, d) + b;
                },
                easeInOutBounce: function (t, b, c, d) {
                    if (t < d/2) return this.easeInBounce (t*2, 0, c, d) * .5 + b;
                    return this.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
                }
            }
            var yongshi = pass -now;
            return eases[ease](yongshi,0,1,all)
        }
        

        /*停止*/
        function stop(){
            clearInterval(timer);
        }
        
        
        
        //设置一个样式
        function setCameraPosition(juli , beforeX , tween){
             var a = juli*tween
            camera.position.x = beforeX + a ;
        };
        
        //  每次循环执行的代码
        function move() {
            //动画停止的条件
            if(tween>=1) {
                /*停止动画*/
                stop()
            }else {
                var pass = +new Date();
                /*计算动画时间进程*/
                tween = getTweenNew(now,pass,duration,moveStyle)
                /*动起来*/
                setCameraPosition(juli , beforeX ,tween);
            }
        }
    };               
               
               //运动函数Y
    function animateY(juli,beforeY,duration,moveStyle){
        //案例: 将一个物体在5秒内从0px移动到400px
        var now = +new Date();//初始化计算now时间
        var tween;//默认动画没有走 进度是0
        var timer;
        //绑定事件
        timer = setInterval(move,16);
        //变速运动下计算动画时间进程
        function getTweenNew(now,pass,all,ease){
            var eases = {
                //线性匀速
                linear:function (t, b, c, d){
                    return (c - b) * (t/ d);
                },
                //弹性运动
                easeOutBounce:function (t, b, c, d) {
                    if ((t/=d) < (1/2.75)) {
                        return c*(7.5625*t*t) + b;
                    } else if (t < (2/2.75)) {
                        return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
                    } else if (t < (2.5/2.75)) {
                        return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
                    } else {
                        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
                    }
                },
                //其他
                swing: function (t, b, c, d) {
                    return this.easeOutQuad(t, b, c, d);
                },
                easeInQuad: function (t, b, c, d) {
                    return c*(t/=d)*t + b;
                },
                easeOutQuad: function (t, b, c, d) {
                    return -c *(t/=d)*(t-2) + b;
                },
                easeInOutQuad: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t + b;
                    return -c/2 * ((--t)*(t-2) - 1) + b;
                },
                easeInCubic: function (t, b, c, d) {
                    return c*(t/=d)*t*t + b;
                },
                easeOutCubic: function (t, b, c, d) {
                    return c*((t=t/d-1)*t*t + 1) + b;
                },
                easeInOutCubic: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t*t + b;
                    return c/2*((t-=2)*t*t + 2) + b;
                },
                easeInQuart: function (t, b, c, d) {
                    return c*(t/=d)*t*t*t + b;
                },
                easeOutQuart: function (t, b, c, d) {
                    return -c * ((t=t/d-1)*t*t*t - 1) + b;
                },
                easeInOutQuart: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
                    return -c/2 * ((t-=2)*t*t*t - 2) + b;
                },
                easeInQuint: function (t, b, c, d) {
                    return c*(t/=d)*t*t*t*t + b;
                },
                easeOutQuint: function (t, b, c, d) {
                    return c*((t=t/d-1)*t*t*t*t + 1) + b;
                },
                easeInOutQuint: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
                    return c/2*((t-=2)*t*t*t*t + 2) + b;
                },
                easeInSine: function (t, b, c, d) {
                    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
                },
                easeOutSine: function (t, b, c, d) {
                    return c * Math.sin(t/d * (Math.PI/2)) + b;
                },
                easeInOutSine: function (t, b, c, d) {
                    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
                },
                easeInExpo: function (t, b, c, d) {
                    return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
                },
                easeOutExpo: function (t, b, c, d) {
                    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
                },
                easeInOutExpo: function (t, b, c, d) {
                    if (t==0) return b;
                    if (t==d) return b+c;
                    if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                    return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
                },
                easeInCirc: function (t, b, c, d) {
                    return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
                },
                easeOutCirc: function (t, b, c, d) {
                    return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
                },
                easeInOutCirc: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                    return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
                },
                easeInElastic: function (t, b, c, d) {
                    var s=1.70158;var p=0;var a=c;
                    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                    if (a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                },
                easeOutElastic: function (t, b, c, d) {
                    var s=1.70158;var p=0;var a=c;
                    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                    if (a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
                },
                easeInOutElastic: function (t, b, c, d) {
                    var s=1.70158;var p=0;var a=c;
                    if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
                    if (a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                    return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
                },
                easeInBack: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    return c*(t/=d)*t*((s+1)*t - s) + b;
                },
                easeOutBack: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
                },
                easeInOutBack: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
                },
                easeInBounce: function (t, b, c, d) {
                    return c - this.easeOutBounce (d-t, 0, c, d) + b;
                },
                easeInOutBounce: function (t, b, c, d) {
                    if (t < d/2) return this.easeInBounce (t*2, 0, c, d) * .5 + b;
                    return this.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
                }
            }
            var yongshi = pass -now;
            return eases[ease](yongshi,0,1,all)
        }
        

        /*停止*/
        function stop(){
            clearInterval(timer);
        }
        
        
        
        //设置一个样式
        function setCameraPosition(juli , beforeY , tween){
             var a = juli*tween
            camera.position.y = beforeY + a ;
        };
        
        //  每次循环执行的代码
        function move() {
            //动画停止的条件
            if(tween>=1) {
                /*停止动画*/
                stop()
            }else {
                var pass = +new Date();
                /*计算动画时间进程*/
                tween = getTweenNew(now,pass,duration,moveStyle)
                /*动起来*/
                setCameraPosition(juli , beforeY , tween);
            }
        }
    };               
               
               //运动函数Z
    function animateZ(juli,beforeZ,duration,moveStyle){
        //案例: 将一个物体在5秒内从0px移动到400px
        var now = +new Date();//初始化计算now时间
        var tween;//默认动画没有走 进度是0
        var timer;
        //绑定事件
        timer = setInterval(move,16);
        //变速运动下计算动画时间进程
        function getTweenNew(now,pass,all,ease){
            var eases = {
                //线性匀速
                linear:function (t, b, c, d){
                    return (c - b) * (t/ d);
                },
                //弹性运动
                easeOutBounce:function (t, b, c, d) {
                    if ((t/=d) < (1/2.75)) {
                        return c*(7.5625*t*t) + b;
                    } else if (t < (2/2.75)) {
                        return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
                    } else if (t < (2.5/2.75)) {
                        return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
                    } else {
                        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
                    }
                },
                //其他
                swing: function (t, b, c, d) {
                    return this.easeOutQuad(t, b, c, d);
                },
                easeInQuad: function (t, b, c, d) {
                    return c*(t/=d)*t + b;
                },
                easeOutQuad: function (t, b, c, d) {
                    return -c *(t/=d)*(t-2) + b;
                },
                easeInOutQuad: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t + b;
                    return -c/2 * ((--t)*(t-2) - 1) + b;
                },
                easeInCubic: function (t, b, c, d) {
                    return c*(t/=d)*t*t + b;
                },
                easeOutCubic: function (t, b, c, d) {
                    return c*((t=t/d-1)*t*t + 1) + b;
                },
                easeInOutCubic: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t*t + b;
                    return c/2*((t-=2)*t*t + 2) + b;
                },
                easeInQuart: function (t, b, c, d) {
                    return c*(t/=d)*t*t*t + b;
                },
                easeOutQuart: function (t, b, c, d) {
                    return -c * ((t=t/d-1)*t*t*t - 1) + b;
                },
                easeInOutQuart: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
                    return -c/2 * ((t-=2)*t*t*t - 2) + b;
                },
                easeInQuint: function (t, b, c, d) {
                    return c*(t/=d)*t*t*t*t + b;
                },
                easeOutQuint: function (t, b, c, d) {
                    return c*((t=t/d-1)*t*t*t*t + 1) + b;
                },
                easeInOutQuint: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
                    return c/2*((t-=2)*t*t*t*t + 2) + b;
                },
                easeInSine: function (t, b, c, d) {
                    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
                },
                easeOutSine: function (t, b, c, d) {
                    return c * Math.sin(t/d * (Math.PI/2)) + b;
                },
                easeInOutSine: function (t, b, c, d) {
                    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
                },
                easeInExpo: function (t, b, c, d) {
                    return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
                },
                easeOutExpo: function (t, b, c, d) {
                    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
                },
                easeInOutExpo: function (t, b, c, d) {
                    if (t==0) return b;
                    if (t==d) return b+c;
                    if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                    return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
                },
                easeInCirc: function (t, b, c, d) {
                    return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
                },
                easeOutCirc: function (t, b, c, d) {
                    return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
                },
                easeInOutCirc: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                    return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
                },
                easeInElastic: function (t, b, c, d) {
                    var s=1.70158;var p=0;var a=c;
                    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                    if (a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                },
                easeOutElastic: function (t, b, c, d) {
                    var s=1.70158;var p=0;var a=c;
                    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                    if (a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
                },
                easeInOutElastic: function (t, b, c, d) {
                    var s=1.70158;var p=0;var a=c;
                    if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
                    if (a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                    return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
                },
                easeInBack: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    return c*(t/=d)*t*((s+1)*t - s) + b;
                },
                easeOutBack: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
                },
                easeInOutBack: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
                },
                easeInBounce: function (t, b, c, d) {
                    return c - this.easeOutBounce (d-t, 0, c, d) + b;
                },
                easeInOutBounce: function (t, b, c, d) {
                    if (t < d/2) return this.easeInBounce (t*2, 0, c, d) * .5 + b;
                    return this.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
                }
            }
            var yongshi = pass -now;
            return eases[ease](yongshi,0,1,all)
        }
        

        /*停止*/
        function stop(){
            clearInterval(timer);
        }
        
        
        
        //设置一个样式
        function setCameraPosition(juli , beforeZ , tween2){
             var a = juli*tween2
            camera.position.z = beforeZ + a ;
            // console.log(camera.position.z)
            // console.log(tween2)
        };
        
        //  每次循环执行的代码
        function move() {
            //动画停止的条件
            if(tween>=1) {
                /*停止动画*/
                stop()
            }else {
                var pass = +new Date();
                /*计算动画时间进程*/
                tween = getTweenNew(now,pass,duration,moveStyle)
                
                // console.log(tween)
                /*动起来*/
                setCameraPosition(juli , beforeZ , tween);
            }
        }
    };               
               
               
               
               
               
               
               
        

                var distance = center.distanceTo(camera.position) - radius;
                var realHeight = Math.abs(helper.box.max.y - helper.box.min.y);
                var fov = 2 * Math.atan(realHeight * correctForDepth / (2 * distance)) * (180 / Math.PI);
                // camera.fov = fov;

                o.orbit.target = helper.position;
                camera.updateProjectionMatrix();
            },

      getById: function(id) {

        for (var i = 0, l = this.ray.length; i < l; i++)
          if (this.ray[i].ElementID == id) return this.ray[i];
      },

      // 获取Id事件方法
      findById: function(id) {

        var ar = [];
        for (var i = 0, l = this.ray.length; i < l; i++)
        // console.log(this.ray)
          if (this.ray[i].ElementID == id) ar.push(this.ray[i]);
          // console.log(ar)
        return ar;
      }





    });
  }
});
