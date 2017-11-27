(function(global) {
  class metatron extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });



      var zoom = 5;
      this.camera = new THREE.OrthographicCamera( -zoom * 16, zoom * 16 , zoom * 9, -zoom * 9, 1, 100000 );
      this.camera.position.z = 100;


      this.cube = new THREE.Mesh(new THREE.BoxGeometry(176, 99, 0.1),
                                 new THREE.MeshBasicMaterial({ color: 0x23132 }));
      this.cube.position.set(0,0,-10);
      this.scene.add(this.cube);

      var radius   = 30,
      segments = 64,
      material = new THREE.LineDashedMaterial( { color: 0x222222 } ),
      geometry = new THREE.CircleGeometry( radius, segments );

      // Remove center vertex
      geometry.vertices.shift();
      geometry.computeLineDistances();

      this.scene.add( new THREE.Line( geometry, material ) );

      var radius2  = 36,
      segments2 = 6,
      material2 = new THREE.LineBasicMaterial( { color: 0x222222 } ),
      geometry2 = new THREE.CircleGeometry( radius2, segments2 );

      geometry2.vertices.shift();
      geometry2.computeLineDistances();

      this.scene.add( new THREE.Line( geometry2, material2 ) );

      var radius3  = 10,
      segments3 = 6,
      material3 = new THREE.LineBasicMaterial( { color: 0x222222 } ),
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

 
      var line_material = new THREE.LineBasicMaterial( { color: 0x999999 } );
      var small_radius  = 10;
      var hex_segments = 6;
      var small_geometry = new THREE.CircleGeometry( small_radius, hex_segments );

      small_geometry.vertices.shift();
      small_geometry.computeLineDistances();

      this.center_rotation_container = new THREE.Object3D();

      this.small_center_hex = new THREE.Line( small_geometry, line_material );
      this.center_rotation_container.add(this.small_center_hex);
      this.small_center_hex.rotation.set(0, 0, Math.PI / 6);

      this.level1_hex1 = new THREE.Line( small_geometry, line_material );
      this.level1_hex2 = new THREE.Line( small_geometry, line_material );
      this.level1_hex3 = new THREE.Line( small_geometry, line_material );
      this.center_rotation_container.add(this.level1_hex1);
      this.center_rotation_container.add(this.level1_hex2);
      this.center_rotation_container.add(this.level1_hex3);

      this.level1_hex1.rotation.set(0, 0, Math.PI/6);
      this.level1_hex2.rotation.set(0, 0, -Math.PI/6);
      this.level1_hex3.rotation.set(0, 0, Math.PI/6);

      this.scene.add(this.center_rotation_container);

      var line_geometry = new THREE.Geometry();
      line_geometry.vertices.push(new THREE.Vector3(0, -30, 0));
      line_geometry.vertices.push(new THREE.Vector3(0, 30, 0));

      this.center_line1 = new THREE.Line( line_geometry, line_material );
      this.center_line2 = new THREE.Line( line_geometry, line_material );
      this.center_line3 = new THREE.Line( line_geometry, line_material );

      this.scene.add(this.center_line1);
      this.scene.add(this.center_line2);
      this.scene.add(this.center_line3);
      
      var circle_geometry = new THREE.CircleGeometry( 10, 128 );
      circle_geometry.vertices.shift();
      circle_geometry.computeLineDistances();
      this.center_circle = new THREE.Line( circle_geometry, line_material );
      this.scene.add(this.center_circle);
    }

    update(frame) {
      super.update(frame);

      var asmoothstep = function (start_frame, duration, frame) {
        return smoothstep(0, 1, (frame - start_frame) / duration);
      }

      // Square root of three divided by two. For a hex of diameter 1 this is the distance from the center to the edge.
      var r32 = 0.86602540378;

      this.level1_hex1.position.set(100, 0, 0);
      this.level1_hex2.position.set(100, 0, 0);
      this.level1_hex3.position.set(100, 0, 0);
      this.center_rotation_container.rotation.set(0, 0, Math.PI/3);
      this.center_line1.scale.set(0, 0, 0);
      this.center_line2.scale.set(0, 0, 0);
      this.center_line3.scale.set(0, 0, 0);
      this.center_circle.scale.set(0, 0, 0);

      if ( frame > FRAME_FOR_BEAN(22 * 48)) {
        var scale = asmoothstep(FRAME_FOR_BEAN(22 * 48), FRAME_FOR_BEAN(48), frame)
        this.small_center_hex.scale.set(scale, scale, scale);
      } 
      if (frame > FRAME_FOR_BEAN(23 * 48)) {
        var progress = asmoothstep(FRAME_FOR_BEAN(23 * 48), FRAME_FOR_BEAN(48), frame);
        this.level1_hex1.position.set(10 * r32 * progress, 10 / 2 * progress, 0);
        this.level1_hex2.position.set(-10 * r32 * progress, 10 / 2 * progress, 0);
        this.level1_hex3.position.set(0, -10 * progress, 0);

        var progress2 = asmoothstep(FRAME_FOR_BEAN(23 * 48), FRAME_FOR_BEAN(24), frame);
        this.center_line1.scale.set(progress2, progress2, progress2);
        this.center_line2.scale.set(progress2, progress2, progress2);
        this.center_line3.scale.set(progress2, progress2, progress2);

        var progress3 = asmoothstep(FRAME_FOR_BEAN(23.5 * 48), FRAME_FOR_BEAN(24), frame);
        this.center_line2.rotation.set(0, 0, progress3 * 2 * Math.PI / 3);
        this.center_line3.rotation.set(0, 0, -progress3 * 2 * Math.PI / 3);

        this.center_circle.scale.set(progress3 * 1.5, progress3 * 1.5, progress3 * 1.5);
      }
      if (frame > FRAME_FOR_BEAN(24 * 48)) {
        this.center_rotation_container.rotation.set(0, 0, Math.PI / 3 - 3 * Math.PI / 3 *asmoothstep(FRAME_FOR_BEAN(24*48), FRAME_FOR_BEAN(12), frame));
      }
    }
  }

  global.metatron = metatron;
})(this);
