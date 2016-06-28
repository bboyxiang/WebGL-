wg.registerPlugin('addmesh', {

  init: function(o) {

    o.once('reday', function() {
    var params = { opacity: 0.5 };
      var material = new THREE.MeshLambertMaterial({ 
        color: 0xf08000, 
        // side: THREE.DoubleSide,
        opacity: params.opacity,
        premultipliedAlpha: true,
        transparent: true
    });

      var object = new THREE.Mesh(new THREE.SphereGeometry(75, 20, 10), material);

      var scene = this.scene;

      scene.add(object);

      scene.add(new THREE.AmbientLight(0x404040));
      var light = new THREE.DirectionalLight(0xffffff);
      light.position.set(0, 1, 0);
      scene.add(light);

      /*var renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.setClearColor( 0xf0f0f0 );
                // renderer.setPixelRatio( window.devicePixelRatio );
                renderer.setSize( window.innerWidth, window.innerHeight );*/

    });

  }

});
