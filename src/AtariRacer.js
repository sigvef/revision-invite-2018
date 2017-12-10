(function (global) {
  const box = new THREE.BoxBufferGeometry(1, 1, 1);
  const padding = 0.0;
  const initialBean = 864;

  const whiteColor = 0xffffff;
  const grayColor = 0x373c3f;
  const greenColor = 0x77e15d;
  const pinkColor = 0xff4982;

  const pinkMaterial = new THREE.MeshBasicMaterial({ color: pinkColor });
  const greenMaterial = new THREE.MeshBasicMaterial({ color: greenColor });

  class AtariRacer extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.camera.position.z = 38;

      const grid = new THREE.Object3D();
      const [gridWidth, gridHeight] = [15, 31];
      for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < gridHeight; y++) {
          if (!(x === 0 || x === gridWidth - 1 || y === 0 || y === gridHeight - 1)) {
            continue;
          }

          const mesh = new THREE.Mesh(box, greenMaterial);
          mesh.position.x = x * (1 + padding);
          mesh.position.y = y * (1 + padding);
          grid.add(mesh);
        }
      }

      grid.position.x = -((gridWidth - 1) * (1 + padding)) / 2;
      grid.position.y = -((gridHeight - 1) * (1 + padding)) / 2;
      this.scene.add(grid);

      this.racingCar = this.createRacer();
      this.scene.add(this.racingCar);

      const rCar = this.fromCoordinates([[1, 0], [2, 0], [0, -1], [0, -2], [0, -3], [0, -4]]);
      const eCar = this.fromCoordinates([[1, 0], [2, 0], [0, -1], [1, -2], [2, -2], [0, -3], [1, -4], [2, -4]]);
      const vCar = this.fromCoordinates([[0, 0], [2, 0], [0, -1], [2, -1], [0, -2], [2, -2], [0, -3], [2, -3], [1, -4]]);
      const iCar = this.fromCoordinates([[0, 0], [2, 0], [1, -1], [1, -2], [1, -3], [0, -4], [2, -4]]);
      const sCar = this.fromCoordinates([[1, 0], [2, 0], [0, -1], [0, -2], [1, -2], [2, -2], [2, -3], [1, -4], [0, -4]]);
      const i2Car = this.fromCoordinates([[0, 0], [2, 0], [1, -1], [1, -2], [1, -3], [0, -4], [2, -4]]);
      const oCar = this.fromCoordinates([[1, 0], [0, -1], [2, -1], [0, -2], [2, -2], [0, -3], [2, -3], [1, -4]]);
      const nCar = this.fromCoordinates([[0, 0], [1, -1], [1, -2], [1, -3], [2, -4]])

      const allIncoming = [
        [this.createRacer(), [0, -1]],
        [this.createRacer(), [0, 1]],
        [rCar, [2, 1]],
        [eCar, [4, -1]],
        [this.createRacer(), [5, 1]],
        [vCar, [6, 0]],
        [iCar, [7, 0]],
        [sCar, [9, -1]],
        [i2Car, [10, -1]],
        [this.createRacer(), [11, -1]],
        [this.createRacer(), [13, 0]],
        [this.createRacer(), [13, 1]],
        [oCar, [15, -1]],
        [nCar, [16, 1]],
      ]

      this.incomingCars = new THREE.Object3D();
      for (let [incoming, [heightIndex, position]] of allIncoming) {
        incoming.position.y = heightIndex * (5 + 2);
        incoming.position.x = position * 4 - 1;
        this.incomingCars.add(incoming);
      }
      this.scene.add(this.incomingCars);

      this.incomingCarsPosition = [
        {
          frame: FRAME_FOR_BEAN(864),
          x: 0,
          y: 0,
        },
        {
          frame: FRAME_FOR_BEAN(1056),
          x: 0,
          y: -allIncoming.length * 10 * 1,
        },
      ]

      this.throb = 0;

      this.carPositions = [
        {
          frame: FRAME_FOR_BEAN(900),
          x: -5,
          y: -9,
        },
        {
          frame: FRAME_FOR_BEAN(930),
          x: -5,
          y: -9,
        },
        {
          frame: FRAME_FOR_BEAN(938),
          x: 3,
          y: -9,
        },
        {
          frame: FRAME_FOR_BEAN(970),
          x: 3,
          y: -9,
        },
        {
          frame: FRAME_FOR_BEAN(978),
          x: -5,
          y: -9,
        },
        {
          frame: FRAME_FOR_BEAN(1010),
          x: -5,
          y: -9,
        },
        {
          frame: FRAME_FOR_BEAN(1018),
          x: 3,
          y: -9,
        }
      ];
    }


    createRacer() {
      const racer = this.fromCoordinates([[1, 0], [0, -1], [1, -3], [2, -1], [1, -2], [1, -3], [0, -4], [2, -4]]);
      racer.traverse(obj => obj.material = pinkMaterial);
      return racer;
    }

    fromCoordinates(coordinates) {
      const wrapper = new THREE.Object3D();
      for (let [x, y] of coordinates) {
        const bit = new THREE.Mesh(box, greenMaterial);
        bit.position.x = x * (1 + padding);
        bit.position.y = y * (1 + padding);
        wrapper.add(bit);
      }

      return wrapper;
    }

    animate(positions, frame, easingFn) {
      const idx = positions.findIndex(point => point.frame > frame);

      if (idx === -1) {
        return positions[0];
      }

      const current = positions[idx]
      const prev = positions[Math.max(0, idx - 1)];

      const x = easingFn(prev.x, current.x, (frame - prev.frame) / (current.frame - prev.frame));
      const y = easingFn(prev.y, current.y, (frame - prev.frame) / (current.frame - prev.frame));
      return { x, y };
    }

    gridify(coordinate) {
      return easeIn(coordinate | 0, (coordinate | 0) + Math.sign(coordinate), Math.pow(Math.sign(coordinate) * (coordinate % 1.0), 4.0));
    }

    update(frame) {
      super.update(frame);

      demo.nm.nodes.bloom.opacity = 0.5;

      this.throb *= 0.96;
      if (BEAT && BEAN % 12 == 0) {
        this.throb = 1.0;
      }

      const position = this.animate(this.carPositions, frame, easeOut);
      this.racingCar.position.x = this.gridify(position.x);
      this.racingCar.position.y = this.gridify(position.y);

      const incomingCarsPosition = this.animate(this.incomingCarsPosition, frame, lerp);
      this.incomingCars.position.x = this.gridify(incomingCarsPosition.x);
      this.incomingCars.position.y = this.gridify(incomingCarsPosition.y);
    }

    render(renderer) {
      renderer.setClearColor(0x00000, 1.0);
      super.render(renderer);
    }
  }

  global.AtariRacer = AtariRacer;
})(this);
