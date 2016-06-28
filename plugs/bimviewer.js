wg.registerPlugin('bimviewer', {

  Geo: function() {

    function Geo(file) {

      THREE.BufferGeometry.call(this);

      this.materials = [];

      var indices = file.body.indices,
        positions = file.body.vertices,
        normals = file.body.normals;

      var uvs, colors;
  
      var uvMaps = file.body.uvMaps;

      if (uvMaps !== undefined && uvMaps.length > 0) {

        uvs = uvMaps[0].uv;

      }

      var attrMaps = file.body.attrMaps;

      if (attrMaps !== undefined && attrMaps.length > 0 && attrMaps[0].name === 'Color') {

        colors = attrMaps[0].attr;

      }

      this.setIndex(new THREE.BufferAttribute(indices, 1));
      this.addAttribute('position', new THREE.BufferAttribute(positions, 3));

      if (normals !== undefined) {

        this.addAttribute('normal', new THREE.BufferAttribute(normals, 3));

      } else {

        this.computeVertexNormals();
      }

      if (uvs !== undefined) {

        this.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));
      }

      if (colors !== undefined) {

        this.addAttribute('color', new THREE.BufferAttribute(colors, 4));
      }
    };
    Geo.prototype = Object.create(THREE.BufferGeometry.prototype);
    Geo.prototype.constructor = Geo;
    return Geo
  }(),

  // 添加选中物体的方法
  addMesh: function() {
    
    var tempMat4 = new THREE.Matrix4();

    var tmlib = new THREE.MeshLambertMaterial({
          color: 0xffffff
      });


    return function( geo, mat, t, ops, node, db, lib ) {

      var mt = null,cs = {};





      if( mat ){

            if( !(mt = lib.get(mat.id)) ){

              cs = mat.tp < 1.0 ?  {
                opacity:mat.tp,
                transparent:true,
                color:  mat.color ? parseInt(mat.color, 16) : 0xaaaaaa
              }:{
                color:  mat.color ? parseInt(mat.color, 16) : 0xaaaaaa
              };
              lib.set(mat.id,mt = new THREE.MeshLambertMaterial(cs) );
              // lib.set(mat.id,mt = new THREE.MeshNormalMaterial(cs) );
            }
      }else {

        console.log(mat)
        mt = tmlib;
        
      }

      var mesh = new THREE.Mesh(new this.Geo(geo), mt);

      mesh.ElementID = ops.eid;

      tempMat4.set(
        t[0],
        t[1],
        t[2],
        t[3],
        t[4],
        t[5],
        t[6],
        t[7],
        t[8],
        t[9],
        t[10],
        t[11],
        t[12],
        t[13],
        t[14],
        t[15]
      );
      mesh.applyMatrix(tempMat4);
      node.add(mesh);
      return mesh;
    }

  }(),

  // 获取Id事件方法
  findById: function(id) {

    var ar = [];
    for (var i = 0, l = this.ray.length; i < l; i++)
    // console.log(this.ray)
      if (this.ray[i].ElementID == id) ar.push(this.ray[i]);
      // console.log(ar)
    return ar;
  },




  getSelectObj:function(){




  },

  canlHighLight:function(o){



    if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

  },


  
  
  init: function(o) {
    var me = this;
    var api = o.api = o.api||{};

    api._select = api._select||[];
    var ray = api.ray = api.ray||[];
    var mlib = new Map();
    var batch = api.batch = {

      batch1: new THREE.Object3D,
      batch2: new THREE.Object3D,
      batch3: new THREE.Object3D,
      batch4: new THREE.Object3D

    };

    if (o.ops.treedom) o.once('loadtree', function(a) {
      api.tree = o.tree = $('#' + o.ops.treedom).jstree({
        'core': {
          "themes": {
            dots: true,
            stripes: true,
            icons: false,
            "variant": "large"
          },
          'data': a
        }
      });
    });

  var radialObj = $('#indicatorContainer').data('radialIndicator');
//now you can use instance to call different method on the radial progress.
//like
//  $('#indicatorContainer').radialIndicator({
//       barColor: '#4DF4F9',
//       barWidth: 8,
//       initValue: 1,
//       roundCorner : true,
//       percentage: true
//   });

    o.on('modelLoaded', function() {
      
      radialObj.animate(100);

      // console.log(me.tree)
      //监听 树中操作事件
      var iss = false;
      api.tree.on('changed.jstree', function(e, data) {
        // console.log(data)
        //判断是否双击
        if (iss) {
          o.emit('treedouble', data.instance.get_node(data.selected[0]) )
        } else {
          o.emit('treeclick', data.instance.get_node(data.selected[0]) )
          iss = true;
          setTimeout(function() {
            iss = false;
          }, 500);
        }
      });

    });


    o.on('start', function() {

      o.renderer.setClearColor(0x6baedd);

      o.scene.add(new THREE.AmbientLight(0x404040));


      // var light = new THREE.DirectionalLight(0xffffff);
      // light.position.set(0, 1, 0);
      

        var light = new THREE.DirectionalLight( 0xefefff, 1.5 );
        // var light = new THREE.DirectionalLight( 0xFFFF26, 1.5 );
                light.position.set( 1, 1, 1 ).normalize();


      o.scene.add(light);

      var body = new THREE.Object3D;

      body.rotation.x = -Math.PI / 2;
      // console.log(o.camera);
      // 初始化加载场景中的模型
      body.matrixAutoUpdate = false;
      batch.batch1.matrixAutoUpdate = false;
      batch.batch2.matrixAutoUpdate = false;
      batch.batch3.matrixAutoUpdate = false;
      batch.batch4.matrixAutoUpdate = false;

      body.add(batch.batch1);
      body.add(batch.batch2);
      body.add(batch.batch3);
      body.add(batch.batch4);

      o.scene.add(body);

      body.updateMatrix();


  


// var uniforms = {
//   offset:{
//         type: "f",
//         value: 2
//       }
//     };

// var outShader ={

//         vertex_shader: [
//             "uniform float offset;",
//             "void main() {",
//                 "vec4 pos = modelViewMatrix * vec4( position + normal * offset, 1.0 );",
//                 "gl_Position = projectionMatrix * pos;",
//             "}"
//         ].join("\n"),

//         fragment_shader: [
//             "void main(){",
//                 "gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );",
//             "}"
//         ].join("\n")
// };




//  var matShader = new THREE.ShaderMaterial({
//         uniforms: uniforms,
//         vertexShader: outShader.vertex_shader,
//         fragmentShader: outShader.fragment_shader
//         });



    // mesh3.quaternion = mesh1.quaternion;
    // outScene.add mesh3

    // var gm = new THREE.SphereGeometry(10, 20, 10);

      
      
  
      // var out = new THREE.Mesh(gm, matShader);
      

    // out.material.depthWrite = false; 

    //   var _s = new THREE.Scene();
    //   _s.add(out);
      
    var gm = new THREE.CubeGeometry( 10, 10, 10 );
                
var mt1 = new THREE.MeshBasicMaterial( { 
  opacity:0.6,
  transparent:true,
  color: 0x00a0e9
  // side: THREE.BackSide 
});


o.hmat = mt1;

var ss = new THREE.Scene();

o.sbody = new THREE.Object3D;

      o.sbody.rotation.x = -Math.PI / 2;
     ss.add(o.sbody) ;
      
      
      // var object = new THREE.Mesh(gm, mt1);
      // var _s1 = new THREE.Scene();
      
      // _s1.add(object);

// o.sbody.add(object);

      o.on('last',function(){


        // o.renderer.clear(0,true);

         // o.getRenderer().render( _s, o.getCamera());

        o.renderer.clearDepth();

        // o.renderer.render(_s,o.getCamera());
        o.renderer.render(ss,o.getCamera());

        // console.log(1)
      });


      o.on('draw',function(){


        // o.renderer.render(_s,o.getCamera());

         o.getRenderer().clear();

      })



      // 鼠标事件
      // 鼠标移动事件
      var ismove = false;
      // 旋转部分隐藏事件
      var isdon = false;
      // 聚焦事件
      var isup = false;
      // 判断是不是鼠标右键事件
      var isRightBtnEvn = false;
      // 判断点击的是否为右键菜单的选项
      var isMenuItem = false;

      var start = { x: 0, y: 0 };
      var mouse = new THREE.Vector2();


      o.on('mousedown', function(e) {
        isMenuItem = false;

        if (e.clientX > 320) {
          // 事件对象兼容性方法
          if (window.event) e = window.event;
          start.x = e.clientX;
          start.y = e.clientY;
          isdon = true;
          isup = true;
          // 当点击的是右键事件就让变量为true
          if (e.button == 2) isRightBtnEvn = true;

          // 获取当前事件目标的方法
          var target = e.target || e.srcElement;

          if (target.tagName == 'A' ) {
              isMenuItem = true;
              console.log(target.innerHTML);
              document.getElementById('rightMenu').style.display = 'none';
          }
        }
      });

      o.on('mousemove', function(e) {
       
        if (!isdon) return;
        if (Math.abs(start.x - e.clientX) > 1 || Math.abs(start.y - e.clientY) > 1) {
        
          if (ismove) return;
          isup = false;
          ismove = true;
          api.hideLevel(wg.CONST.DEF_LEVEL);
         
        }
      });

      var wt=wg.CONST.WHEEL,ws=false;

      o.on('tick', function(e){
        
        
        // if (!ismove) {
        //   isup = false;
        //   ismove = true;
        //   api.hideLevel(wg.CONST.DEF_LEVEL);
        // }
        
        

        if(!ws)return;
        wt-=e;
        if(wt<0){
          ws = false;
          api.showLevel(wg.CONST.DEF_LEVEL);
        }
        
        
        
        
      });

      o.on('mousewheel', function(e) {
          

          if(!ws){
            api.hideLevel(wg.CONST.DEF_LEVEL);
          }
          wt=wg.CONST.WHEEL;
          ws=true;
      });


      o.on('mouseup', function(e) {
        // 事件对象兼容性方法
        if (window.event) e = window.event; 
        // console.log(e.button);
        if (isRightBtnEvn) {
          if (!ismove) {
            // 调用右键显示菜单方法
            api.mouseDownEvent('rightMenu',e);
            
          }
          api.showLevel(wg.CONST.DEF_LEVEL);
          isdon = false;
          ismove = false;
          isRightBtnEvn = false;
        } else {
          if (e.clientX > 320){
            isdon = false;
            ismove = false;
            isRightBtnEvn = false;
            api.showLevel(wg.CONST.DEF_LEVEL);
            if (isMenuItem) return;
            if (!isup) return;
            api.clearSelect();
            var ins = api.raycaster(e);
            if(ins.length>0){
              api.setSelect( [ins[0].object],true );
            }
          }
        }

        
      });

    });
    // 窗口尺寸改变事件end



    o.on('progress', function(map) {
      map.forEach((v, k) => {

        var ar = o.db.que.get(k);

        ar.map(m => {
          // console.log( m.mat, o.db.mat )
          ray.push(me.addMesh(v, o.db.mat.get(m.mat), m.t, m, batch[m.group], o.db,mlib))
        });
      });
    });
    
    

    
    
    o.on("treeclick",function(e){
      
      console.log(api)
      //取消所有物体高亮
      // api.calHighlight(api.ray);
      api.clearSelect();
      if(e.children.length == 0){
        var pro = api.setSelect([e.id])
        // api.setHighlight(pro[0])
        api.zoom(pro[0])
      }
      
    });
    
    
    
    
    
    

  }
  
});
