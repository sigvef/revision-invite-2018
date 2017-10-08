(function(global) {
  class metatron extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.cube = new THREE.Mesh(new THREE.BoxGeometry(176, 99, 0.1),
                                 new THREE.MeshBasicMaterial({ color: 0x23132 }));
      this.cube.position.set(0,0,-10);
      this.scene.add(this.cube);

      var radius   = 30,
      segments = 64,
      material = new THREE.LineDashedMaterial( { color: 0x999999 } ),
      geometry = new THREE.CircleGeometry( radius, segments );

      // Remove center vertex
      geometry.vertices.shift();
      geometry.computeLineDistances();

      this.scene.add( new THREE.Line( geometry, material ) );

      var radius2  = 36,
      segments2 = 6,
      material2 = new THREE.LineBasicMaterial( { color: 0x999999 } ),
      geometry2 = new THREE.CircleGeometry( radius2, segments2 );

      geometry2.vertices.shift();
      geometry2.computeLineDistances();

      this.scene.add( new THREE.Line( geometry2, material2 ) );

      var radius3  = 10,
      segments3 = 6,
      material3 = new THREE.LineBasicMaterial( { color: 0x999999 } ),
      geometry3 = new THREE.CircleGeometry( radius3, segments3 );

      geometry3.vertices.shift();
      geometry3.computeLineDistances();

      var hex1 = new THREE.Line( geometry3, material3 );
      var hex2 = new THREE.Line( geometry3, material3 );
      var hex3 = new THREE.Line( geometry3, material3 );
      var hex4 = new THREE.Line( geometry3, material3 );

      hex1.position.set(10,0,0);
      hex2.position.set(-10,0,0);
      hex3.position.set(0,12,0);
      hex4.position.set(0,-12,0);

      this.scene.add( hex1 );
      this.scene.add( hex2 );
      this.scene.add( hex3 );
      this.scene.add( hex4 );

      this.camera.position.z = 100;
    }

    update(frame) {
      super.update(frame);

    }
  }

  global.metatron = metatron;
})(this);
