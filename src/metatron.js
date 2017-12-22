(function(global) {

  function T(startBean, endBean, frame) {
    const startFrame = FRAME_FOR_BEAN(startBean);
    const endFrame = FRAME_FOR_BEAN(endBean);
    return (frame - startFrame) / (endFrame - startFrame);
  }

  class metatron extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.transparentMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthTest: true,
        depthWrite: true,
      });

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.canvasTexture = new THREE.CanvasTexture(this.canvas);
      this.canvasTexture.minFilter = THREE.LinearFilter;
      this.canvasTexture.magFilter = THREE.LinearFilter;
      this.resize();

      this.canvasCube = new THREE.Mesh(
          new THREE.BoxGeometry(160, 90, 1),
          new THREE.MeshBasicMaterial({
            map: this.canvasTexture,
            transparent: true,
          }));
      this.canvasCube.skipOverlayDrawing = true;
      const cubeScale = 1.161;
      this.canvasCube.scale.set(cubeScale, cubeScale, cubeScale);
      this.scene.add(this.canvasCube);

      //Camera
      var zoom = 5.8;
      this.camera = new THREE.OrthographicCamera( -zoom * 16, zoom * 16 , zoom * 9, -zoom * 9, 1, 100000 );
      this.camera.position.z = 10000;

      // Scene background
      this.cube = new THREE.Mesh(new THREE.BoxGeometry(196, 109, 0.1),
                                 new THREE.MeshBasicMaterial({ color: 0x77e15d }));
      this.cube.skipOverlayDrawing = true;
      this.cube.position.set(0,0,-100);
      this.scene.add(this.cube);

      this.line_width = .20;

      var line_material = this.transparentMaterial;
      var small_radius  = 10;
      var hex_segments = 6;
      var small_geometry = new THREE.CircleGeometry( small_radius, hex_segments );

      small_geometry.vertices.shift();
      small_geometry.computeLineDistances();

      this.center_rotation_container = new THREE.Object3D();

      this.small_center_hex = new THREE.Object3D();
      this.small_center_hex.add(new THREE.Line( small_geometry, line_material ));
      this.center_rotation_container.add(this.small_center_hex);
      this.small_center_hex.rotation.set(0, 0, Math.PI / 6);

      this.level1_hex1 = new THREE.Object3D();
      this.level1_hex1.add(new THREE.Line( small_geometry, line_material ));
      this.level1_hex2= new THREE.Object3D();
      this.level1_hex2.add(new THREE.Line( small_geometry, line_material ));
      this.level1_hex3 = new THREE.Object3D();
      this.level1_hex3.add(new THREE.Line( small_geometry, line_material ));
      this.center_rotation_container.add(this.level1_hex1);
      this.center_rotation_container.add(this.level1_hex2);
      this.center_rotation_container.add(this.level1_hex3);

      this.level1_hex1.rotation.set(0, 0, Math.PI/6);
      this.level1_hex2.rotation.set(0, 0, -Math.PI/6);
      this.level1_hex3.rotation.set(0, 0, Math.PI/6);

      this.scene.add(this.center_rotation_container);

      var line_geometry = new THREE.Geometry();
      line_geometry.vertices.push(new THREE.Vector3(0, -15, 0));
      line_geometry.vertices.push(new THREE.Vector3(0, 15, 0));

      this.center_line1 = new THREE.Object3D();
      this.center_line1.add( new THREE.Line( line_geometry, line_material ));
      this.center_line2 = new THREE.Object3D();
      this.center_line2.add( new THREE.Line( line_geometry, line_material ));
      this.center_line3 = new THREE.Object3D();
      this.center_line3.add( new THREE.Line( line_geometry, line_material ));

      this.scene.add(this.center_line1);
      this.scene.add(this.center_line2);
      this.scene.add(this.center_line3);
            
      var circle_geometry = new THREE.TorusGeometry( 10, this.line_width / 2, 10, 128 );
      circle_geometry.computeLineDistances();
      this.center_circle = new THREE.Mesh( circle_geometry, this.transparentMaterial);
      this.scene.add(this.center_circle);

      this.middle_center_hex = new THREE.Object3D();
      this.middle_center_hex.add(new THREE.Line( small_geometry, line_material ));
      this.outer_center_hex = new THREE.Object3D();
      this.outer_center_hex.add(new THREE.Line( small_geometry, line_material ));
      this.middle_center_hex.rotation.set(0, 0, Math.PI / 6);
      this.outer_center_hex.rotation.set(0, 0, Math.PI / 6);
      this.outer_center_hex.lineWidth = 2;
      this.scene.add(this.middle_center_hex);
      this.scene.add(this.outer_center_hex);
      
      // Square root of three divided by two. For a hex of diameter 1 this is the distance from the center to the edge.
      var r32 = 0.86602540378;
      r32 = Math.sqrt(3) / 2;

      var inner_distance = 5;
      var outer_distance = 15;
      var star_geometry = new THREE.Geometry();
      star_geometry.vertices.push(new THREE.Vector3(0, outer_distance, 0));
      star_geometry.vertices.push(new THREE.Vector3(-inner_distance * r32, inner_distance / 2, 0));
      star_geometry.vertices.push(new THREE.Vector3(-outer_distance * r32, -outer_distance / 2, 0));
      star_geometry.vertices.push(new THREE.Vector3(0, -inner_distance, 0));
      star_geometry.vertices.push(new THREE.Vector3(outer_distance * r32, -outer_distance / 2, 0));
      star_geometry.vertices.push(new THREE.Vector3(inner_distance * r32, inner_distance / 2, 0));
      star_geometry.vertices.push(new THREE.Vector3(0, outer_distance, 0));

      this.three_point_star = new THREE.Object3D();
      this.three_point_star.lineWidth = 1.5;
      this.three_point_star.add(new THREE.Line( star_geometry, line_material ));
      this.scene.add(this.three_point_star);

      var darker_line_material = line_material;
      var darker_line_material2 = line_material;
      var darker_line_material3 = line_material;
      var darker_line_material4 = line_material;

      var horizontal_distance1 = 15;
      var horizontal_distance2 = 10;
      var horizontal_distance3 = 15;

      var small_claw_geometry = new THREE.Geometry();
      
      small_claw_geometry.vertices.push(new THREE.Vector3(horizontal_distance1 * r32 + horizontal_distance3, horizontal_distance1 / 2, 0));
      small_claw_geometry.vertices.push(new THREE.Vector3(horizontal_distance2 * r32, horizontal_distance1 + horizontal_distance2 / 2, 0));
      small_claw_geometry.vertices.push(new THREE.Vector3(-horizontal_distance1 * r32, horizontal_distance1 / 2, 0));
      small_claw_geometry.vertices.push(new THREE.Vector3(-horizontal_distance1 * r32, -horizontal_distance1 / 2, 0));
      small_claw_geometry.vertices.push(new THREE.Vector3(horizontal_distance2 * r32, -(horizontal_distance1 + horizontal_distance2 / 2), 0));
      small_claw_geometry.vertices.push(new THREE.Vector3(horizontal_distance1 * r32 + horizontal_distance3, -horizontal_distance1 / 2, 0));
      small_claw_geometry.vertices.push(new THREE.Vector3(horizontal_distance2 * r32, -(horizontal_distance1 + horizontal_distance2 / 2), 0));
      small_claw_geometry.vertices.push(new THREE.Vector3(-horizontal_distance1 * r32, -horizontal_distance1 / 2, 0));
      small_claw_geometry.vertices.push(new THREE.Vector3(-horizontal_distance1 * r32, horizontal_distance1 / 2, 0));
      small_claw_geometry.vertices.push(new THREE.Vector3(horizontal_distance2 * r32, horizontal_distance1 + horizontal_distance2 / 2, 0));
      small_claw_geometry.vertices.push(new THREE.Vector3(horizontal_distance1 * r32 + horizontal_distance3, horizontal_distance1 / 2, 0));


      this.small_claw_r = new THREE.Object3D();
      this.small_claw_r.add(new THREE.Line( small_claw_geometry, darker_line_material ));
      this.small_claw_l = new THREE.Object3D();
      this.small_claw_l.add(new THREE.Line( small_claw_geometry, darker_line_material2 ));
      this.small_claw_r.position.set(30 * r32, 0, -1);
      this.small_claw_l.position.set(-30 * r32, 0, -1);
      this.small_claw_l.scale.set(-1, 1, 1);
      this.scene.add(this.small_claw_r);
      this.scene.add(this.small_claw_l);

      var claw_outer_distance = 50;

      var large_claw_geometry = new THREE.Geometry();

      large_claw_geometry.vertices.push(new THREE.Vector3(claw_outer_distance * r32, claw_outer_distance / 2, 0));
      large_claw_geometry.vertices.push(new THREE.Vector3(0, claw_outer_distance, 0));
      large_claw_geometry.vertices.push(new THREE.Vector3(-claw_outer_distance * r32, claw_outer_distance / 2, 0));
      large_claw_geometry.vertices.push(new THREE.Vector3(-claw_outer_distance * r32, -claw_outer_distance / 2, 0));
      large_claw_geometry.vertices.push(new THREE.Vector3(0, -claw_outer_distance, 0));
      large_claw_geometry.vertices.push(new THREE.Vector3(claw_outer_distance * r32, -claw_outer_distance / 2, 0));
      large_claw_geometry.vertices.push(new THREE.Vector3(0, -claw_outer_distance, 0));
      large_claw_geometry.vertices.push(new THREE.Vector3(-claw_outer_distance * r32, -claw_outer_distance / 2, 0));
      large_claw_geometry.vertices.push(new THREE.Vector3(-claw_outer_distance * r32, claw_outer_distance / 2, 0));
      large_claw_geometry.vertices.push(new THREE.Vector3(0, claw_outer_distance, 0));

      this.large_claw_r = new THREE.Object3D();
      this.large_claw_r.add(new THREE.Line( large_claw_geometry, darker_line_material3 ));
      this.large_claw_l = new THREE.Object3D();
      this.large_claw_l.add(new THREE.Line( large_claw_geometry, darker_line_material4 ));
      this.large_claw_r.position.set(claw_outer_distance * r32, 0, -1);
      this.large_claw_l.position.set(-claw_outer_distance * r32, 0, -1);
      this.large_claw_l.scale.set(-1, 1, 1);
      this.scene.add(this.large_claw_r);
      this.scene.add(this.large_claw_l);


      var cube_geometry = new THREE.Geometry();
      cube_geometry.vertices.push(new THREE.Vector3(-1, -1, -1));
      cube_geometry.vertices.push(new THREE.Vector3(1, -1, -1));
      cube_geometry.vertices.push(new THREE.Vector3(1, 1, -1));
      cube_geometry.vertices.push(new THREE.Vector3(-1, 1, -1));
      cube_geometry.vertices.push(new THREE.Vector3(-1, -1, -1));
      cube_geometry.vertices.push(new THREE.Vector3(-1, -1, 1));
      cube_geometry.vertices.push(new THREE.Vector3(1, -1, 1));
      cube_geometry.vertices.push(new THREE.Vector3(1, -1, -1));
      cube_geometry.vertices.push(new THREE.Vector3(1, -1, 1));
      cube_geometry.vertices.push(new THREE.Vector3(1, 1, 1));
      cube_geometry.vertices.push(new THREE.Vector3(1, 1, -1));
      cube_geometry.vertices.push(new THREE.Vector3(1, 1, 1));
      cube_geometry.vertices.push(new THREE.Vector3(-1, 1, 1));
      cube_geometry.vertices.push(new THREE.Vector3(-1, 1, -1));
      cube_geometry.vertices.push(new THREE.Vector3(-1, 1, 1));
      cube_geometry.vertices.push(new THREE.Vector3(-1, -1, 1));
      
      this.spin_cube = new THREE.Object3D();

      var cube_line_material = line_material;

      this.inner_cube = new THREE.Line(cube_geometry, cube_line_material);
      this.middle_cube = new THREE.Line(cube_geometry, cube_line_material);
      this.outer_cube = new THREE.Line(cube_geometry, cube_line_material);

      this.middle_cube_3d = new THREE.Mesh(
          new THREE.BoxGeometry(2, 2, 2),
          new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
            depthWrite: false,
            depthTest: false,
          }));
      //this.scene.add(this.middle_cube_3d);
      //this.middle_cube_3d.render_3d = true;

      var inner_size = 9.2;
      var middle_size = 15.3;
      var outer_size = 24.7;

      var sizes = [inner_size, middle_size, outer_size];
      var scalers = [1.2, 1.8, 2.2];

      var spin_cube_material = this.transparentMaterial;
      
      for (var i = 0; i < 3; i++) {  
        var scaler = scalers[i];
        var spin_cube_geometry = new THREE.CylinderGeometry( this.line_width * scaler, this.line_width * scaler, 2 * sizes[i], 12);
        var edge1 = new THREE.Mesh(spin_cube_geometry, spin_cube_material);
        var edge2 = new THREE.Mesh(spin_cube_geometry, spin_cube_material);
        var edge3 = new THREE.Mesh(spin_cube_geometry, spin_cube_material);
        var edge4 = new THREE.Mesh(spin_cube_geometry, spin_cube_material);
        var edge5 = new THREE.Mesh(spin_cube_geometry, spin_cube_material);
        var edge6 = new THREE.Mesh(spin_cube_geometry, spin_cube_material);
        var edge7 = new THREE.Mesh(spin_cube_geometry, spin_cube_material);
        var edge8 = new THREE.Mesh(spin_cube_geometry, spin_cube_material);
        var edge9 = new THREE.Mesh(spin_cube_geometry, spin_cube_material);
        var edge10 = new THREE.Mesh(spin_cube_geometry, spin_cube_material);
        var edge11 = new THREE.Mesh(spin_cube_geometry, spin_cube_material);
        var edge12 = new THREE.Mesh(spin_cube_geometry, spin_cube_material);


        edge1.position.set(sizes[i], 0, sizes[i]);
        edge2.position.set(sizes[i], 0, -sizes[i]);
        edge3.position.set(-sizes[i], 0, sizes[i]);
        edge4.position.set(-sizes[i], 0, -sizes[i]);

        edge5.position.set(sizes[i], sizes[i], 0);
        edge5.rotation.set(Math.PI / 2, 0, 0);
        edge6.position.set(sizes[i], -sizes[i], 0);
        edge6.rotation.set(Math.PI / 2, 0, 0);
        edge7.position.set(-sizes[i], sizes[i], 0);
        edge7.rotation.set(Math.PI / 2, 0, 0);
        edge8.position.set(-sizes[i], -sizes[i], 0);
        edge8.rotation.set(Math.PI / 2, 0, 0);

        edge9.position.set(0, sizes[i], sizes[i]);
        edge9.rotation.set(0, 0, Math.PI / 2);
        edge10.position.set(0, sizes[i], -sizes[i]);
        edge10.rotation.set(0, 0, Math.PI / 2);
        edge11.position.set(0, -sizes[i], sizes[i]);
        edge11.rotation.set(0, 0, Math.PI / 2);
        edge12.position.set(0, -sizes[i], -sizes[i]);
        edge12.rotation.set(0, 0, Math.PI / 2);

        if(i == 2) {
          const hack = new THREE.Object3D();
          hack.add(edge1);
          hack.add(edge2);
          hack.add(edge3);
          hack.add(edge4);
          hack.add(edge5);
          hack.add(edge6);
          hack.add(edge7);
          hack.add(edge8);
          hack.add(edge9);
          hack.add(edge10);
          hack.add(edge11);
          hack.add(edge12);
          this.hack = hack;
          this.scene.add(hack);
        } else {
          this.spin_cube.add(edge1);
          this.spin_cube.add(edge2);
          this.spin_cube.add(edge3);
          this.spin_cube.add(edge4);
          this.spin_cube.add(edge5);
          this.spin_cube.add(edge6);
          this.spin_cube.add(edge7);
          this.spin_cube.add(edge8);
          this.spin_cube.add(edge9);
          this.spin_cube.add(edge10);
          this.spin_cube.add(edge11);
          this.spin_cube.add(edge12);
        }
      }

      var vertex_distance = [inner_size, middle_size, outer_size];
      var sphere_geometry = new THREE.SphereGeometry( 2.5, 16, 16 );
      this.vertex_balls = [];
      for (var cube_num = 0; cube_num < 4; cube_num++)
      {
        for(var x = -1; x <= 1; x += 2)
        {
          for(var y = -1; y <= 1; y += 2)
          {
            for(var z = -1; z <= 1; z += 2)
            {

              var vertex_ball = new THREE.Mesh(sphere_geometry, line_material);
              vertex_ball.position.set(x * vertex_distance[cube_num], y * vertex_distance[cube_num], z * vertex_distance[cube_num]);
              this.spin_cube.add(vertex_ball);
              this.vertex_balls.push(vertex_ball);
            }
          }
        }
      }

      this.inner_cube.scale.set(inner_size, inner_size, inner_size);
      this.middle_cube.scale.set(middle_size, middle_size, middle_size);
      this.outer_cube.scale.set(outer_size, outer_size, outer_size);

      this.spin_cube.add(this.inner_cube);
      this.spin_cube.add(this.middle_cube);
      this.spin_cube.add(this.outer_cube);
      this.spin_cube.position.set(0,0,0);
      this.scene.add(this.spin_cube);

      var spin = Math.PI / 4;

      this.spin_cube.rotation.set(spin * 0.7837 , spin , 0);

      //var ico_material = new THREE.MeshBasicMaterial({color: 0x999999});
      var ico_material = this.transparentMaterial;
      var central_ico_geometry = new THREE.IcosahedronGeometry(1, 0);
      central_ico_geometry.faces.splice(0,20);
      this.ico = new THREE.Mesh(central_ico_geometry, ico_material);
      this.ico.render_3d = true;
      this.ico.rotation.set(1.015, 0, 0);
      this.ico.position.set(200, 0, 0);
      var scale = 23.5;
      this.ico.scale.set(scale, scale, scale);
      this.ico_container = new THREE.Object3D();
      this.ico_container.add(this.ico);
      this.scene.add(this.ico_container);

      this.slam_icos = [];
      this.slam_ico_containers = [];
      var ico_geometry = new THREE.IcosahedronGeometry(1, 0);
      for (var i = 0; i < 20; i++)
      {
        var slam_ico_geometry = new THREE.IcosahedronGeometry(1, 0);
        slam_ico_geometry.faces.splice(0,20);
        slam_ico_geometry.faces.push(ico_geometry.faces[i]);

        this.slam_icos.push(new THREE.Mesh(slam_ico_geometry, ico_material));
        this.slam_icos[i].render_3d = true;
        this.slam_icos[i].rotation.set(1.015, 0, 0);
        //this.slam_icos[i].position.set(Math.sin(i) * 70, Math.cos(i) * 30, 0);
        var scale = 23.5;
        this.slam_icos[i].scale.set(scale, scale, scale);
        this.slam_ico_containers.push(new THREE.Object3D());
        this.slam_ico_containers[i].add(this.slam_icos[i]);
        this.scene.add(this.slam_ico_containers[i]);
      }

      //prepare the actually visible geometries
      this.star_arr = this.add_lines_for_geometry(star_geometry, this.three_point_star, 1);
      /*
      this.add_lines_for_geometry(this.small_center_hex.children[0].geometry, this.small_center_hex, 0.7);
      this.add_lines_for_geometry(this.level1_hex1.children[0].geometry, this.level1_hex1, 1);
      this.add_lines_for_geometry(this.level1_hex2.children[0].geometry, this.level1_hex2, 1);
      this.add_lines_for_geometry(this.level1_hex3.children[0].geometry, this.level1_hex3, 1);
      this.add_lines_for_geometry(this.center_line1.children[0].geometry, this.center_line1, 1);
      this.add_lines_for_geometry(this.center_line2.children[0].geometry, this.center_line2, 1);
      this.add_lines_for_geometry(this.center_line3.children[0].geometry, this.center_line3, 1);
      this.add_lines_for_geometry(this.middle_center_hex.children[0].geometry, this.middle_center_hex, 0.6);
      this.add_lines_for_geometry(this.outer_center_hex.children[0].geometry, this.outer_center_hex, 0.4);
      */
      /*this.add_lines_for_geometry(this.small_claw_r.children[0].geometry, this.small_claw_r, 1);
      this.add_lines_for_geometry(this.small_claw_l.children[0].geometry, this.small_claw_l, 1);
      this.add_lines_for_geometry(this.large_claw_r.children[0].geometry, this.large_claw_r, 1);
      this.add_lines_for_geometry(this.large_claw_l.children[0].geometry, this.large_claw_l, 1);*/
      

      /*
      this.three_point_star.children[0].visible = false;
      this.small_center_hex.children[0].visible = false;
      this.level1_hex1.children[0].visible = false;
      this.level1_hex2.children[0].visible = false;
      this.level1_hex3.children[0].visible = false;
      this.center_line1.children[0].visible = false;
      this.center_line2.children[0].visible = false;
      this.center_line3.children[0].visible = false;
      this.middle_center_hex.children[0].visible = false;
      this.outer_center_hex.children[0].visible = false;

      this.small_claw_r.children[0].visible = false;
      this.small_claw_l.children[0].visible = false;
      this.large_claw_r.children[0].visible = false;
      this.large_claw_l.children[0].visible = false;
      */
      this.small_claw_r.children[0].position.set(0,0,0);
      this.small_claw_l.children[0].position.set(0,0,0);
      this.large_claw_r.children[0].position.set(0,0,0);
      this.large_claw_l.children[0].position.set(0,0,0);

    }


    add_lines_for_geometry(geometry, container, scaler) {
      var arr = [];
      for(var i = 0; i < geometry.vertices.length;  i++) {
        var cur_x = geometry.vertices[i].x;
        var cur_y = geometry.vertices[i].y;
        var next_x = geometry.vertices[(i + 1)%geometry.vertices.length].x;
        var next_y = geometry.vertices[(i + 1)%geometry.vertices.length].y;

        var angle = Math.atan2(next_x - cur_x, next_y - cur_y);

        arr.push(new THREE.Geometry());
        arr[i].vertices.push(new THREE.Vector3(cur_x - this.line_width * scaler * Math.sin(angle + Math.PI/2), cur_y - this.line_width * Math.cos(angle + Math.PI/2),0));
        arr[i].vertices.push(new THREE.Vector3(next_x - this.line_width * scaler * Math.sin(angle + Math.PI/2), next_y - this.line_width * Math.cos(angle + Math.PI/2),0));
        arr[i].vertices.push(new THREE.Vector3(next_x + this.line_width * scaler * Math.sin(angle + Math.PI/2), next_y + this.line_width * Math.cos(angle + Math.PI/2),0));
        arr[i].vertices.push(new THREE.Vector3(cur_x + this.line_width * scaler * Math.sin(angle + Math.PI/2), cur_y + this.line_width * Math.cos(angle + Math.PI/2),0));

        arr[i].faces.push( new THREE.Face3( 0, 2, 1 ) );
        arr[i].faces.push( new THREE.Face3( 0, 3, 2 ) );

        arr[i].faces[0].color = new THREE.Color(0x999999);
        arr[i].faces[1].color = new THREE.Color(0x999999);

        //container.add(new THREE.Mesh( arr[i], new THREE.MeshBasicMaterial({side: THREE.DoubleSide, vertexColors: THREE.FaceColors})));
        container.add(new THREE.Mesh( arr[i], this.transparentMaterial));
      }

      return arr;
    }


    update_geometry_lines(geometry, arr) {

      for(var i = 0; i < geometry.vertices.length;  i++) {
        var cur_x = geometry.vertices[i].x;
        var cur_y = geometry.vertices[i].y;
        var next_x = geometry.vertices[(i + 1)%geometry.vertices.length].x;
        var next_y = geometry.vertices[(i + 1)%geometry.vertices.length].y;

        var angle = Math.atan2(next_x - cur_x, next_y - cur_y);

        //arr[i].vertices.push(new THREE.Vector3(cur_x - this.line_width * Math.sin(angle + Math.PI/2), cur_y - this.line_width * Math.cos(angle + Math.PI/2),0));
        arr[i].vertices[0].x = cur_x - this.line_width * Math.sin(angle + Math.PI/2);
        arr[i].vertices[0].y = cur_y - this.line_width * Math.cos(angle + Math.PI/2);
        //arr[i].vertices.push(new THREE.Vector3(next_x - this.line_width * Math.sin(angle + Math.PI/2), next_y - this.line_width * Math.cos(angle + Math.PI/2),0));
        arr[i].vertices[1].x = next_x - this.line_width * Math.sin(angle + Math.PI/2);
        arr[i].vertices[1].y = next_y - this.line_width * Math.cos(angle + Math.PI/2);
        //arr[i].vertices.push(new THREE.Vector3(next_x + this.line_width * Math.sin(angle + Math.PI/2), next_y + this.line_width * Math.cos(angle + Math.PI/2),0));
        arr[i].vertices[2].x = next_x + this.line_width * Math.sin(angle + Math.PI/2);
        arr[i].vertices[2].y = next_y + this.line_width * Math.cos(angle + Math.PI/2);
        //arr[i].vertices.push(new THREE.Vector3(cur_x + this.line_width * Math.sin(angle + Math.PI/2), cur_y + this.line_width * Math.cos(angle + Math.PI/2),0));
        arr[i].vertices[3].x = cur_x + this.line_width * Math.sin(angle + Math.PI/2);
        arr[i].vertices[3].y = cur_y + this.line_width * Math.cos(angle + Math.PI/2);

        arr[i].verticesNeedUpdate = true;
      }
    }    

    update(frame) {
      super.update(frame);
      demo.nm.nodes.bloom.opacity = 0;
      this.frame = frame;

      var asmoothstep = function (start_frame, duration, frame) {
        return smoothstep(0, 1, (frame - start_frame) / duration);
      };

      // Square root of three divided by two. For a hex of diameter 1 this is the distance from the center to the edge.
      var r32 = 0.86602540378;

      this.small_center_hex.position.set(0, 0, 0);
      this.level1_hex1.position.set(200, 0, 0);
      this.level1_hex2.position.set(200, 0, 0);
      this.level1_hex3.position.set(200, 0, 0);
      this.level1_hex1.scale.set(1, 1, 1);
      this.level1_hex2.scale.set(1, 1, 1);
      this.level1_hex3.scale.set(1, 1, 1);
      this.level1_hex1.rotation.set(0, 0, Math.PI/6);
      this.level1_hex2.rotation.set(0, 0, -Math.PI/6);
      this.level1_hex3.rotation.set(0, 0, Math.PI/6);
      this.center_rotation_container.rotation.set(0, 0, Math.PI/3);
      this.center_line1.scale.set(0, 0, 0);
      this.center_line2.scale.set(0, 0, 0);
      this.center_line3.scale.set(0, 0, 0);
      this.center_line1.rotation.set(0, 0, 0);
      this.center_line2.rotation.set(0, 0, 0);
      this.center_line3.rotation.set(0, 0, 0);
      this.center_circle.scale.set(0, 0, 0);
      this.middle_center_hex.position.set(200, 0, 0);
      this.outer_center_hex.position.set(200, 0, 0);
      this.outer_center_hex.rotation.set(0, 0, Math.PI / 6);
      this.level1_hex1.scale.set(1, 1, 1);
      this.level1_hex2.scale.set(1, 1, 1);
      this.level1_hex3.scale.set(1, 1, 1);
      this.three_point_star.children[0].geometry.vertices[1].x = 0;
      this.three_point_star.children[0].geometry.vertices[1].y = 0;
      this.three_point_star.children[0].geometry.vertices[3].y = 0;
      this.three_point_star.children[0].geometry.vertices[5].x = 0;
      this.three_point_star.children[0].geometry.vertices[5].y = 0;
      this.three_point_star.rotation.set(0, 0, 0);
      this.three_point_star.position.set(200, 0, 0);
      this.spin_cube.position.set(200, 0, 0);
      this.spin_cube.rotation.set(Math.PI / 4 * 0.7837 , Math.PI / 4 , 0);
      this.hack.rotation.copy(this.spin_cube.rotation);
      this.hack.scale.copy(this.spin_cube.scale);
      this.hack.position.copy(this.spin_cube.position);
      this.ico.position.set(200, 0, 0);
      for(var i = 0; i < 20; i++)
      {
        this.slam_icos[i].position.set(200, 0, 0);
      }

      const base = 22 * 48;
      if ( frame >= FRAME_FOR_BEAN(22 * 48)) {
        var scale = elasticOut(0.0000001, 1, 1.1, T(base, base + 12, frame));
        this.small_center_hex.scale.set(scale, scale, scale);
      } 
      if (frame >= FRAME_FOR_BEAN(22 * 48 + 9)) {
        const progress = elasticOut(0, 1, 1.1, T(base + 9, base + 9 + 12, frame));
        this.level1_hex1.position.set(10 * r32 * progress, 10 / 2 * progress, 100);
        this.level1_hex2.position.set(-10 * r32 * progress, 10 / 2 * progress, 100);
        this.level1_hex3.position.set(0, -10 * progress, 100);

        const progress2 = elasticOut(0, 1, 1, T(base + 24, base + 24 + 12, frame));
        this.center_line1.scale.set(progress2, progress2, progress2);
        this.center_line2.scale.set(progress2, progress2, progress2);
        this.center_line3.scale.set(progress2, progress2, progress2);

        const progress3 = elasticOut(0, 1, 1, T(base + 24 + 9, base + 24 + 9 + 12, frame));
        this.center_line2.rotation.set(0, 0, progress3 * 2 * Math.PI / 3);
        this.center_line3.rotation.set(0, 0, -progress3 * 2 * Math.PI / 3);

        this.center_circle.scale.set(progress3 * 1.5, progress3 * 1.5, progress3 * 1.5);

        const l1h1 = easeOut(0, 1, T(1128, 1128 + 3, frame));
        const l1h2 = easeOut(0, 1, T(1128 + 3, 1128 + 6, frame));
        const l1h3 = easeOut(0, 1, T(1128 + 6, 1128 + 9, frame));
        const l1h4 = easeOut(0, 1, T(1128 + 9, 1128 + 12, frame));

        this.level1_hex1.position.x += Math.cos(1 * Math.PI / 3 + 0.5) * l1h1 * 10;
        this.level1_hex1.position.y += Math.sin(1 * Math.PI / 3 + 0.5) * l1h1 * 10;
        this.level1_hex2.position.x += Math.cos(3 * Math.PI / 3 + 0.5) * l1h2 * 10;
        this.level1_hex2.position.y += Math.sin(3 * Math.PI / 3 + 0.5) * l1h2 * 10;
        this.level1_hex3.position.x += Math.cos(5 * Math.PI / 3 + 0.5) * l1h3 * 10;
        this.level1_hex3.position.y += Math.sin(5 * Math.PI / 3 + 0.5) * l1h3 * 10;

        this.level1_hex1.position.x += Math.cos(3 * Math.PI / 3 + 0.5) * l1h4 * 10;
        this.level1_hex1.position.y += Math.sin(3 * Math.PI / 3 + 0.5) * l1h4 * 10;
        this.level1_hex2.position.x += Math.cos(5 * Math.PI / 3 + 0.5) * l1h4 * 10;
        this.level1_hex2.position.y += Math.sin(5 * Math.PI / 3 + 0.5) * l1h4 * 10;
        this.level1_hex3.position.x += Math.cos(1 * Math.PI / 3 + 0.5) * l1h4 * 10;
        this.level1_hex3.position.y += Math.sin(1 * Math.PI / 3 + 0.5) * l1h4 * 10;

      }
      if (frame >= FRAME_FOR_BEAN(23 * 48)) {
        this.center_rotation_container.rotation.set(
            0,
            0,
            Math.PI / 3 - 3 * Math.PI / 3 *
              (easeOut(0, 0.5, T(23 * 48, 23 * 48 + 9 + 9, frame)) +
               easeIn(0, 0.5, T(23 * 48, 23 * 48 + 9, frame))));


        const scale = 1 + 0.5 * easeOut(0, 1, T(24 * 48 - 6, 24 * 48, frame));
        this.small_center_hex.scale.set(scale, scale, scale);


        var scale2 = 1.5 + 2.55  * elasticOut(0, 1, 1.1, T(24 * 48, 24 * 48 + 9, frame));
        this.center_circle.scale.set(scale2, scale2, scale2);


      }
      if (frame > FRAME_FOR_BEAN(24 * 48)) {
        this.middle_center_hex.position.set(0, 0, 0);
        this.outer_center_hex.position.set(0, 0, 0);

        let scale = 2 + 0.5 * elasticOut(0, 1, 1.1, T(24 * 48 + 9, 24 * 48 + 9 + 9, frame));
        const scale2 = 2 + 2 * elasticOut(0, 1, 1.1, T(24 * 48 + 24, 24 * 48 + 24 + 9, frame));

        this.middle_center_hex.scale.set(scale, scale, scale);
        this.outer_center_hex.scale.set(scale2, scale2, scale2);

        scale *= 1.065;
        this.center_line1.scale.set(scale, scale, scale);
        this.center_line2.scale.set(scale, scale, scale);
        this.center_line3.scale.set(scale, scale, scale);

        var ball_scale = elasticOut(0, 1, 1.1, T(25 * 48, 25 * 48 + 9, frame));
        for (var i = 0; i < 24; i++)
        {
          this.vertex_balls[i].scale.set ( ball_scale, ball_scale, ball_scale );
        }
      }
      if (frame >= FRAME_FOR_BEAN(25 * 48)) {
        this.spin_cube.position.set(0, 0, 200);
        this.small_center_hex.position.set(200, 0, 0);
        this.middle_center_hex.position.set(200, 0, 0);
        this.outer_center_hex.position.set(200, 0, 0);
        this.center_line1.position.set(200, 0, 0);
        this.center_line2.position.set(200, 0, 0);
        this.center_line3.position.set(200, 0, 0);
        const progress = easeIn(0, 1., T(25 * 48, 25 * 48 + 24, frame));
        var spin = Math.PI / 4 + 2 * Math.PI * progress;
        this.spin_cube.rotation.set(spin -0.1698 , spin , 0);

        this.level1_hex1.rotation.set(2 * Math.PI * progress, 2 * Math.PI * progress , Math.PI/6);
        this.level1_hex2.rotation.set(2 * Math.PI * progress, 2 * Math.PI * progress , Math.PI/6);
        this.level1_hex3.rotation.set(2 * Math.PI * progress, 2 * Math.PI * progress , Math.PI/6);

        this.center_rotation_container.rotation.z = easeOut(
            0, Math.PI * 5, T(26 * 48 - 24, 26 * 48, frame));

      }

      var grow = 25.70;
      if (frame >= FRAME_FOR_BEAN(grow * 48))
      {
        var ball_scale = 1 + 0.8 * elasticOut(0, 1, 1.1, T(grow * 48, grow * 48 + 36, frame));
        for (var i = 0; i < 24; i++)
        {
          this.vertex_balls[i].scale.set ( ball_scale, ball_scale, ball_scale );
        }
      }

      var disapear = 25.81;
      if (frame >= FRAME_FOR_BEAN(disapear * 48))
      {
        var ball_scale = 1.8 * (1 - elasticOut(0, 1, 1.1, T(disapear * 48, disapear * 48 + 24, frame)));
        for (var i = 0; i < 24; i++)
        {
          this.vertex_balls[i].scale.set ( ball_scale, ball_scale, ball_scale );
        }
      }
      if (frame >= FRAME_FOR_BEAN(26 * 48 -3)) {
        this.center_rotation_container.rotation.z = 0;
        this.spin_cube.position.set(200, 0, 0);
        this.small_center_hex.position.set(0, 0, 0);
        this.middle_center_hex.position.set(0, 0, 0);
        this.outer_center_hex.position.set(0, 0, 0);
        this.center_line1.position.set(0, 0, 0);
        this.center_line2.position.set(0, 0, 0);
        this.center_line3.position.set(0, 0, 0);
      }
      if (frame >= FRAME_FOR_BEAN(26 * 48 - 3)) {
        var start = 26.5;
        // Distance from main center to center of the level 1 hexes.
        var distance3 = 10 + 5 * easeIn(0, 1, T(start * 48 - 3, start * 48, frame));
        var distance2 = 10 + 5 * easeIn(0, 1, T(start * 48 + 6 -3, start * 48 + 6, frame));
        var distance1 = 10 + 5 * easeIn(0, 1, T(start * 48 + 9 -3, start * 48 + 9, frame));
        this.level1_hex1.position.set(distance1 * r32, distance1 / 2, 0);
        this.level1_hex2.position.set(-distance2 * r32, distance2 / 2, 0);
        this.level1_hex3.position.set(0, -distance3, 0);

        this.three_point_star.position.set(0, 0, 0);

        this.three_point_star.children[0].geometry.vertices[1].x = -(distance3 - 10) * r32;
        this.three_point_star.children[0].geometry.vertices[1].y = (distance3 - 10) / 2;
        this.three_point_star.children[0].geometry.vertices[3].y = -(distance2 - 10);
        this.three_point_star.children[0].geometry.vertices[5].x = (distance1 - 10) * r32;
        this.three_point_star.children[0].geometry.vertices[5].y = (distance1 - 10) / 2;

        this.three_point_star.rotation.set(0, 0, - 3 * Math.PI / 3 *
            easeOut(0, 1, T(start * 48 + 24 - 8, start * 48 + 24 - 2, frame)));

        // Scale of the level 1 hexes.
        var scale3 = 1 + 0.5 * easeIn(0, 1, T(start * 48 + 24 -3, start * 48 + 24, frame));
        const scale2 = 1 + 0.5 * easeIn(0, 1, T(26 * 48 + 24 + 9 -3, start * 48 + 24 + 9, frame));
        var scale1 = 1 + 0.5 * easeIn(0, 1, T(start * 48 + 24 + 18 -3, start * 48 + 24 + 18, frame));
        this.level1_hex1.scale.set(scale1, scale1, scale1);
        this.level1_hex2.scale.set(scale2, scale2, scale2);
        this.level1_hex3.scale.set(scale3, scale3, scale3);
      }
      if (frame >= FRAME_FOR_BEAN(27)) {
        const scale = 1 + 0.67 * easeOut(0, 1, T(27 * 48 + 6 -3, 27 * 48 + 6, frame));
        this.three_point_star.scale.set(scale, scale, scale);


        var claw_progress1 = asmoothstep(FRAME_FOR_BEAN(1322), FRAME_FOR_BEAN(9), frame);
        var claw_progress2 = asmoothstep(FRAME_FOR_BEAN(1322), FRAME_FOR_BEAN(9), frame);
        var claw_progress3 = asmoothstep(FRAME_FOR_BEAN(1330), FRAME_FOR_BEAN(7), frame);
        var claw_progress4 = asmoothstep(FRAME_FOR_BEAN(1330), FRAME_FOR_BEAN(7), frame);
        /*var claw_progress1 = asmoothstep(FRAME_FOR_BEAN(26.75 * 48), FRAME_FOR_BEAN(12), frame);
        var claw_progress2 = asmoothstep(FRAME_FOR_BEAN(26.875 * 48), FRAME_FOR_BEAN(12), frame);
        var claw_progress3 = asmoothstep(FRAME_FOR_BEAN(27 * 48), FRAME_FOR_BEAN(12), frame);
        var claw_progress4 = asmoothstep(FRAME_FOR_BEAN(27.125 * 48), FRAME_FOR_BEAN(12), frame);*/

        
        /*this.small_claw_r.children[1].material.color.r = this.cube.material.color.r + 0.15 * claw_progress1;
        this.small_claw_r.children[1].material.color.g = this.cube.material.color.g + 0.15 * claw_progress1;
        this.small_claw_r.children[1].material.color.b = this.cube.material.color.b + 0.15 * claw_progress1;

        this.small_claw_l.children[1].material.color.r = this.cube.material.color.r + 0.15 * claw_progress2;
        this.small_claw_l.children[1].material.color.g = this.cube.material.color.g + 0.15 * claw_progress2;
        this.small_claw_l.children[1].material.color.b = this.cube.material.color.b + 0.15 * claw_progress2;

        this.large_claw_r.children[1].material.color.r = this.cube.material.color.r + 0.15 * claw_progress3;
        this.large_claw_r.children[1].material.color.g = this.cube.material.color.g + 0.15 * claw_progress3;
        this.large_claw_r.children[1].material.color.b = this.cube.material.color.b + 0.15 * claw_progress3;

        this.large_claw_l.children[1].material.color.r = this.cube.material.color.r + 0.15 * claw_progress4;
        this.large_claw_l.children[1].material.color.g = this.cube.material.color.g + 0.15 * claw_progress4;
        this.large_claw_l.children[1].material.color.b = this.cube.material.color.b + 0.15 * claw_progress4;

        for(var i = 1; i<this.small_claw_r.children.length; i++) {
          // claw 1
          this.small_claw_r.children[i].geometry.faces[0].color.setRGB( this.cube.material.color.r + 0.15 * claw_progress1,
                                                                        this.cube.material.color.g + 0.15 * claw_progress1,
                                                                        this.cube.material.color.b + 0.15 * claw_progress1);
          this.small_claw_r.children[i].geometry.colorsNeedUpdate = true;
          this.small_claw_r.children[i].geometry.faces[1].color.setRGB( this.cube.material.color.r + 0.15 * claw_progress1,
                                                                        this.cube.material.color.g + 0.15 * claw_progress1,
                                                                        this.cube.material.color.b + 0.15 * claw_progress1);
          this.small_claw_r.children[i].geometry.colorsNeedUpdate = true;
          // claw 2
          this.small_claw_l.children[i].geometry.faces[0].color.setRGB( this.cube.material.color.r + 0.15 * claw_progress2,
                                                                        this.cube.material.color.g + 0.15 * claw_progress2,
                                                                        this.cube.material.color.b + 0.15 * claw_progress2);
          this.small_claw_l.children[i].geometry.colorsNeedUpdate = true;
          this.small_claw_l.children[i].geometry.faces[1].color.setRGB( this.cube.material.color.r + 0.15 * claw_progress2,
                                                                        this.cube.material.color.g + 0.15 * claw_progress2,
                                                                        this.cube.material.color.b + 0.15 * claw_progress2);
          this.small_claw_l.children[i].geometry.colorsNeedUpdate = true;
        }

        for(var i = 1; i<this.large_claw_r.children.length; i++) {
          // claw 3
          this.large_claw_r.children[i].geometry.faces[0].color.setRGB( this.cube.material.color.r + 0.15 * claw_progress3,
                                                                        this.cube.material.color.g + 0.15 * claw_progress3,
                                                                        this.cube.material.color.b + 0.15 * claw_progress3);
          this.large_claw_r.children[i].geometry.colorsNeedUpdate = true;
          this.large_claw_r.children[i].geometry.faces[1].color.setRGB( this.cube.material.color.r + 0.15 * claw_progress3,
                                                                        this.cube.material.color.g + 0.15 * claw_progress3,
                                                                        this.cube.material.color.b + 0.15 * claw_progress3);
          this.large_claw_r.children[i].geometry.colorsNeedUpdate = true;
          // claw 4
          this.large_claw_l.children[i].geometry.faces[0].color.setRGB( this.cube.material.color.r + 0.15 * claw_progress4,
                                                                        this.cube.material.color.g + 0.15 * claw_progress4,
                                                                        this.cube.material.color.b + 0.15 * claw_progress4);
          this.large_claw_l.children[i].geometry.colorsNeedUpdate = true;
          this.large_claw_l.children[i].geometry.faces[1].color.setRGB( this.cube.material.color.r + 0.15 * claw_progress4,
                                                                        this.cube.material.color.g + 0.15 * claw_progress4,
                                                                        this.cube.material.color.b + 0.15 * claw_progress4);
          this.large_claw_l.children[i].geometry.colorsNeedUpdate = true;
        }*/
        


        
        /*this.small_claw_r.position.set(30 * r32 - 8 * (1 - claw_progress1), 0, -1);
        this.small_claw_l.position.set(-30 * r32 + 8 * (1 - claw_progress2), 0, -1);
        this.large_claw_r.position.set(50 * r32 - 8 * (1 - claw_progress3), 0, -1);
        this.large_claw_l.position.set(-50 * r32 + 8 * (1 - claw_progress4), 0, -1);*/
        //TODO: Elastic
        claw_progress1 = elasticOut(0, 1, 1, claw_progress1);
        claw_progress2 = elasticOut(0, 1, 1, claw_progress2);
        claw_progress3 = elasticOut(0, 1, 1, claw_progress3);
        claw_progress4 = elasticOut(0, 1, 1, claw_progress4);
        this.small_claw_r.position.set(30 * r32 + 20  * (1 - claw_progress1), 0, -1);
        this.small_claw_r.scale.set(claw_progress1, claw_progress1, claw_progress1);
        this.small_claw_l.position.set(-30 * r32 - 20 * (1 - claw_progress2), 0, -1);
        this.small_claw_l.scale.set(-claw_progress2, claw_progress2, claw_progress2);
        this.large_claw_r.position.set(50 * r32 + 20 * (1 - claw_progress3), 0, -1);
        this.large_claw_r.scale.set(claw_progress3, claw_progress3, claw_progress3);
        this.large_claw_l.position.set(-50 * r32 - 20 * (1 - claw_progress4), 0, -1);
        this.large_claw_l.scale.set(-claw_progress4, claw_progress4, claw_progress4);
      }

      if (frame >= FRAME_FOR_BEAN(27.5 * 48)) {
        this.ico.position.set(200, 0, 0);
        this.ico_container.rotation.set(0, frame / 50, 0);

        for(var i = 0; i < 20; i++)
        {
          this.slam_icos[i].scale.set(23.5, 23.5, 23.5);
          this.slam_icos[i].position.set(0, 0, 0);
          var slam_progress = asmoothstep(FRAME_FOR_BEAN(28 * 48 + i * 2), FRAME_FOR_BEAN(12), frame);
          slam_progress = elasticOut(0, 1, 1, slam_progress);
          var direction = (i % 2) * 2 - 1
          this.slam_ico_containers[i].position.set((120 - slam_progress * 120) * direction, 0, 0);
          this.slam_ico_containers[i].rotation.set(0, frame / 50, 0);
        }
      }

      if (frame >= FRAME_FOR_BEAN(28 * 48 )){
        this.middle_center_hex.overrideColor ='rgb(255,73,130)';// 0xff4982;
      }else{
        this.middle_center_hex.overrideColor = 'white'; //stateless, yo!
      }

      if (frame >= FRAME_FOR_BEAN(29 * 48)) {

        for(var i = 0; i < 20; i++)
        {
          this.slam_icos[i].position.set(0, 0, 0);
          var scale = 23.5;
          var slam_progress = asmoothstep(FRAME_FOR_BEAN(29 * 48), FRAME_FOR_BEAN(12), frame);
          slam_progress = elasticOut(0, 1, 1, slam_progress);
          slam_progress = slam_progress * 10  + scale;
          this.slam_icos[i].scale.set(slam_progress, slam_progress, slam_progress);
          var direction = (i % 2) * 2 - 1
          //this.slam_ico_containers[i].position.set((120 - slam_progress * 120) * direction, 0, 0);
          this.slam_ico_containers[i].rotation.set(0, frame / 50, 0);
        }
      }
      //this.spin_cube.rotation.set(Math.sin(frame/100), Math.sin(frame/120), Math.sin(frame/140))


      var start_clock = 3677;
      var start_expand = 3726;
      if (frame > start_clock) {
        var rotation = (frame - start_clock) / (start_expand - start_clock) * Math.PI * 3;
        this.center_line1.rotation.set(0, 0, rotation);
        this.center_line2.rotation.set(0, 0, rotation + 2 * Math.PI / 3);
        this.center_line3.rotation.set(0, 0, rotation - 2 * Math.PI / 3);
        this.outer_center_hex.rotation.set(0, 0, rotation + Math.PI / 6);

      }

      this.update_geometry_lines(this.three_point_star.children[0].geometry, this.star_arr);


      this.three_point_star.children[1].geometry.verticesNeedUpdate = true;

      this.middle_cube_3d.scale.copy(this.middle_cube.scale);
      this.middle_cube_3d.rotation.copy(this.spin_cube.rotation);
    }

    draw3d(child) {
      this.ctx.fillStyle = 'rgb(255, 73, 130)';
      const lightVector = new THREE.Vector3(1, 1, 1);
      lightVector.normalize();
      const viewVector = new THREE.Vector3(-1, 1, 1);
      viewVector.normalize();
      for(let i = 0; i < child.geometry.faces.length; i++) {
        const face = child.geometry.faces[i];
        const a = child.geometry.vertices[face.a].clone();
        const b = child.geometry.vertices[face.b].clone();
        const c = child.geometry.vertices[face.c].clone();
        a.applyMatrix4(child.matrixWorld);
        b.applyMatrix4(child.matrixWorld);
        c.applyMatrix4(child.matrixWorld);
        const u = b.clone();
        u.sub(a);
        const v = c.clone();
        v.sub(a);
        const normal = new THREE.Vector3(
          u.y * v.z - u.z * v.y, 
          u.z * v.x - u.x * v.z, 
          u.x * v.y - u.y * v.x);
        normal.normalize();

        if(normal.z <= 0) {
          continue;
        }

        let light = clamp(0, normal.dot(lightVector), 1);
        light += 0.3;
        light = clamp(0, light, 1);
        this.ctx.fillStyle = `rgb(${255 * light | 0}, ${73 * light | 0}, ${130 * light | 0})`;
        this.ctx.strokeStyle = this.ctx.fillStyle;
        this.ctx.lineWidth = 0.3;
        this.ctx.beginPath();
        this.ctx.moveTo(a.x, -a.y);
        this.ctx.lineTo(b.x, -b.y);
        this.ctx.lineTo(c.x, -c.y);
        this.ctx.lineTo(a.x, -a.y);
        this.ctx.lineTo(b.x, -b.y);
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgb(255, 73, 130)';
        this.ctx.lineWidth = 0.5;
        this.ctx.stroke();
      }
    }

    draw(object, method) {
      this.ctx.strokeStyle = 'white';
      this.ctx.fillStyle = 'rgb(55, 60, 63)';
      this.ctx.lineWidth = 1.5;
      object.traverseVisible(child => {
        if(child.lineWidth) {
          this.ctx.lineWidth = child.lineWidth;
        }
        if(child.overrideColor){
          this.ctx.strokeStyle = child.overrideColor;
        }
        if(child.skipOverlayDrawing) {
          return;
        }
        if(child.render_3d) {
          return;
        }
        if(!(child.geometry && child.geometry.vertices.length)) {
          return;
        }
        this.ctx.beginPath();
        child.updateMatrix();
        for(let j = 0; j < child.geometry.vertices.length + 2; j++) {
          const vertex = child.geometry.vertices[
            j % child.geometry.vertices.length].clone();
          vertex.applyMatrix4(child.matrixWorld);
          const x = vertex.x;
          const y = -(vertex.y);
          if(j == 0) {
            this.ctx.moveTo(x, y);
          } else {
            this.ctx.lineTo(x, y);
          }
        }
        if(method == 'stroke') {
          this.ctx.stroke();
          this.ctx.strokeStyle = 'white'; //reset colour
        } else {
          this.ctx.fill();
        }
      });
    }

    render(renderer) {
      this.scene.updateMatrixWorld();
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.save();
      this.ctx.scale(GU, GU);
      this.ctx.fillStyle = 'rgb(55, 60, 63)';
      const t = T(1248 - 6, 1248, this.frame);
      this.ctx.fillRect(0, easeIn(9, 4.5, t), 16, 9);
      this.ctx.font = 'bold 0.6pt schmalibre';
      this.ctx.textAlign = 'left';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillStyle = 'rgb(55, 60, 63)';
      const t3 = T(1320 - 6, 1320, this.frame);
      if(BEAN >= 1272) {
        this.ctx.fillText('JUST', easeOut(0, 7, t3) + 2 * 16 / 3 - 0.75, 3.75);
      }
      if(BEAN >= 1272 + 18) {
        this.ctx.fillStyle = 'white';
        this.ctx.fillText('REVISION', easeOut(0, 7, t3) + 2 * 16 / 3 -0.75, 4.75);
      } else if(BEAN >= 1272 + 9) {
        this.ctx.fillStyle = 'white';
        this.ctx.fillText('REV', easeOut(0, 7, t3) + 2 * 16 / 3 - 0.75, 4.75);
      }

      const t2 = T(1248 + 9 - 6, 1248 + 9, this.frame);
      let x = easeIn(8, 16 / 3, t2);
      x = easeOut(x, 8, t3);
      this.ctx.translate(x, 4.5);
      this.ctx.scale(1 / 12, 1 / 12);
      this.draw(this.scene, 'fill');
      this.draw(this.scene, 'stroke');
      /*if(BEAN >= 1200 && BEAN < 1248 + 9) {
        this.draw3d(this.middle_cube_3d);
      }*/
      if(BEAN >= 1344) {
        this.draw3d(this.ico);
        for(var i = 0; i < 20; i++)
        {
          this.draw3d(this.slam_icos[i]);
        }
      }
      this.ctx.restore();
      this.canvasTexture.needsUpdate = true;
      super.render(renderer);
    }

    resize() {
      super.resize();
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }
  }

  global.metatron = metatron;
})(this);
