(function (global) {
  const box = new THREE.BoxBufferGeometry(1, 1, 1);
  const padding = 0.0;
  //const whiteColor = 0xffffff;
  //const grayColor = 0x373c3f;
  const greenColor = 0x77e15d;
  const pinkColor = 0xff4982;

  const pinkMaterial = new THREE.MeshBasicMaterial({ color: pinkColor });
  const greenMaterial = new THREE.MeshBasicMaterial({ color: greenColor });
  const baseBean = 864;

  class AtariRacer extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.camera = new THREE.OrthographicCamera(-32, 32, 18, -18, 1, 1000);
      this.camera.position.z = 10;

      this.racingGridFrame = new THREE.Object3D();
      const [gridWidth, gridHeight] = [15, 36];
      for (let y = 0; y < gridHeight; y++) {
        const meshLeft = new THREE.Mesh(box, greenMaterial);
        meshLeft.position.x = 0;
        meshLeft.position.y = y * (1 + padding);
        this.racingGridFrame.add(meshLeft);

        const meshRight = new THREE.Mesh(box, greenMaterial);
        meshRight.position.x = gridWidth - 1;
        meshRight.position.y = y * (1 + padding);
        this.racingGridFrame.add(meshRight);
      }

      const racingGridHeight = (gridHeight - 1) * (1 + padding);
      this.racingGridFrame.position.x = -((gridWidth - 1) * (1 + padding)) / 2;
      this.racingGridFrame.position.y = -racingGridHeight / 2;

      this.playerRacingCar = this.createRacer();

      this.importantFrames = [
        -9,
        -6,
        0,
        9,
        24,
        24 + 9,
        24 + 9 + 9,
        61,
        //64, //
        67,
        74,
        //78,
        82,
        97,
        //101,
        106,
        114,
        121,
        //126,
        131,
        137,
        155,
      ].map(bean => FRAME_FOR_BEAN(bean + baseBean));

      const rawCarPositions = [
        [0, -9],
        [2, -9],
        [1, -9],
        [2, -9],
        [1, -9],
        [2, -9],
        [0, -9],
        [1, -9],
        [0, -9],
        [1, -9],
        [2, -9],
        [0, -9],
        [2, -9],
        [0, -9],
        [1, -9],
        [1, 20],
      ];

      const beanWhenTheCarsTouch = 876;
      this.carPositions = [];
      for (let [index, [x, y]] of rawCarPositions.entries()) {
        this.carPositions.push({
          frame: FRAME_FOR_BEAN(beanWhenTheCarsTouch + 12 * index - 2),
          x: x * 4 - 4,
          y,
        });
        this.carPositions.push({
          frame: FRAME_FOR_BEAN(beanWhenTheCarsTouch + 12 * index + 1),
          x: x * 4 - 4,
          y,
        });
      }

      const allIncoming = [
        [1, 1],
        [2, 1],
        [0, 2],
        [1, 2],
        [2, 3],
        [1, 4],
        [0, 5],
        [2, 5],
        [0, 6],
        [1, 6],
        [1, 7],
        [2, 7],
        [0, 8],
        [1, 9],
        [2, 10],
        [0, 11],
        [1, 12],
        [2, 12],
        [0, 13],
        [1, 13],
        [1, 14],
        [2, 14],
        [0, 15],
        [2, 15],
      ];

      this.incomingCars = new THREE.Object3D();
      const offsetBetweenEachIncomingCar = 4 * 5;
      for (let [posX, posY] of allIncoming) {
        const incoming = this.createRacer();
        incoming.position.y = posY * offsetBetweenEachIncomingCar;
        incoming.position.x = posX * 4 - 4;
        this.incomingCars.add(incoming);
      }
      const incomingCarsHeight = allIncoming.length * offsetBetweenEachIncomingCar;

      this.racingWrapper = new THREE.Object3D();
      this.racingWrapper.add(this.playerRacingCar);
      this.racingWrapper.add(this.racingGridFrame);
      this.racingWrapper.add(this.incomingCars);

      this.scene.add(this.racingWrapper);

      const baseIncomingDownwardsOffset = 9.5;
      this.incomingCarsPosition = [
        {
          frame: FRAME_FOR_BEAN(baseBean),
          x: 0,
          y: -baseIncomingDownwardsOffset,
        },
        {
          frame: FRAME_FOR_BEAN(baseBean + 12 * allIncoming.length),
          x: 0,
          y: -baseIncomingDownwardsOffset - incomingCarsHeight,
        },
      ];

      this.racingWrapperPositions = [
        {
          frame: FRAME_FOR_BEAN(baseBean),
          x: -21,
          y: racingGridHeight,
        },
        {
          frame: FRAME_FOR_BEAN(baseBean + 12),
          x: -21,
          y: 0,
        },
      ];

      const largeStarLeader = this.createStar(4.0);

      const largeRCar = this.fromCoordinates([[1, 0], [2, 0], [0, -1], [0, -2], [0, -3], [0, -4]], 4.0);
      const largeECar = this.fromCoordinates([[1, 0], [2, 0], [0, -1], [1, -2], [2, -2], [0, -3], [1, -4], [2, -4]], 4.0);
      const largeVCar = this.fromCoordinates([[0, 0], [2, 0], [0, -1], [2, -1], [0, -2], [2, -2], [0, -3], [2, -3], [1, -4]], 4.0);
      const largeICar = this.fromCoordinates([[0, 0], [2, 0], [1, -1], [1, -2], [1, -3], [0, -4], [2, -4]], 4.0);
      const largeSCar = this.fromCoordinates([[1, 0], [2, 0], [0, -1], [0, -2], [1, -2], [2, -2], [2, -3], [1, -4], [0, -4]], 4.0);
      const largeI2Car = this.fromCoordinates([[0, 0], [2, 0], [1, -1], [1, -2], [1, -3], [0, -4], [2, -4]], 4.0);
      const largeOCar = this.fromCoordinates([[1, 0], [0, -1], [2, -1], [0, -2], [2, -2], [0, -3], [2, -3], [1, -4]], 4.0);
      const largeNCar = this.fromCoordinates([[1, 0], [0, -1], [0, -2], [0, -3], [0, -4], [2, -1], [2, -2], [2, -3], [2, -4]], 4.0);

      const largeStarMid1 = this.createStar(4.0);

      const largeTwo = this.fromCoordinates([[1, 0], [0, -1], [2, -1], [2, -2], [1, -3], [0, -4], [1, -4], [2, -4]], 4.0);
      const largeZero = this.fromCoordinates([[1, 0], [0, -1], [2, -1], [0, -2], [2, -2], [0, -3], [2, -3], [1, -4]], 4.0);
      const largeOne = this.fromCoordinates([[1, 0], [0, -1], [1, -1], [1, -2], [1, -3], [0, -4], [1, -4], [2, -4]], 4.0);
      const largeEight = this.fromCoordinates([[1, 0], [0, -1], [2, -1], [1, -2], [0, -3], [2, -3], [1, -4]], 4.0);

      this.largeLetters = [
        largeStarLeader,
        largeRCar,
        largeECar,
        largeVCar,
        largeICar,
        largeSCar,
        largeI2Car,
        largeOCar,
        largeNCar,
        largeStarMid1,
        largeTwo,
        largeZero,
        largeOne,
        largeEight,
        this.createStar(4.0),
      ];
      this.largeLettersWrapperObject = new THREE.Object3D();
      this.largeLetterAnimationPaths = [];
      for (let [i, largeLetter] of this.largeLetters.entries()) {
        this.largeLettersWrapperObject.add(largeLetter);
        const positions = [
          {
            frame: this.importantFrames[i + 0],
            x: 20,
            y: 30,
          },
          {
            frame: this.importantFrames[i + 1],
            x: 20,
            y: 0,
          },
          {
            frame: this.importantFrames[i + 2],
            x: 0,
            y: 0,
          },
          {
            frame: this.importantFrames[i + 3],
            x: 0,
            y: -30,
          }
        ];
        this.largeLetterAnimationPaths.push(positions);
      }

      this.scene.add(this.largeLettersWrapperObject);

      this.bg = new THREE.Mesh(
        new THREE.BoxGeometry(64 * 1.5, 36 * 1.5, 1),
        new THREE.ShaderMaterial(SHADERS.ataribackground));
      this.bg.position.z = -100;
      this.scene.add(this.bg);

      this.throb = 0;
    }

    createStar(scale = 1.0) {
      const star = this.fromCoordinates([[1, 0], [0, -1], [1, -1], [2, -1], [1, -2], [0, -3], [1, -3], [2, -3], [1, -4]], scale);
      star.traverse(obj => obj.material = pinkMaterial);
      return star;
    }

    createRacer(scale = 1.0) {
      const racer = this.fromCoordinates([[1, 0], [0, -1], [1, -1], [2, -1], [1, -2], [0, -3], /*[1, -3], */[2, -3]], scale);
      racer.traverse(obj => obj.material = pinkMaterial);
      return racer;
    }

    fromCoordinates(coordinates, scale = 1.0) {
      const wrapper = new THREE.Object3D();
      for (let [x, y] of coordinates) {
        const bit = new THREE.Mesh(box, greenMaterial);
        bit.position.x = x * (1 + padding) - 1;
        bit.position.y = y * (1 + padding) + 2;
        wrapper.add(bit);
      }

      if (scale) {
        wrapper.scale.set(scale, scale, scale);
      }

      return wrapper;
    }

    animate(positions, frame, easingFn) {
      const idx = positions.findIndex(point => point.frame > frame);

      if (idx === -1) {
        const lastPosition = positions[positions.length - 1];
        if (lastPosition.frame < frame) {
          return lastPosition;
        } else {
          return positions[0];
        }
      }

      const current = positions[idx];
      const prev = positions[Math.max(0, idx - 1)];

      const mixer = (frame - prev.frame) / (current.frame - prev.frame);
      const x = easingFn(prev.x, current.x, mixer);
      const y = easingFn(prev.y, current.y, mixer);
      return {
        x: this.gridify(x),
        y: this.gridify(y),
        mixer,
      };
    }

    gridify(coordinate) {
      return easeIn(coordinate | 0, (coordinate | 0) + Math.sign(coordinate), Math.pow(Math.sign(coordinate) * (coordinate % 1.0), 4.0));
    }

    update(frame) {
      super.update(frame);

      this.throb *= 0.96;
      if (BEAT && BEAN % 12 == 0) {
        this.throb = 1.0;
      }

      var { x, y } = this.animate(this.racingWrapperPositions, frame, easeOut);
      this.racingWrapper.position.x = x;
      this.racingWrapper.position.y = y;

      const morphRacingWrapperMixer = (frame - FRAME_FOR_BEAN(baseBean + 137)) / (FRAME_FOR_BEAN(baseBean + 140) - FRAME_FOR_BEAN(baseBean + 137));

      this.camera.rotation.z = lerp(0, Math.PI / 2.0, morphRacingWrapperMixer);
      this.camera.position.x = lerp(0, -21, morphRacingWrapperMixer);
      this.camera.left = lerp(-32, -16, morphRacingWrapperMixer);
      this.camera.right = lerp(32, 16, morphRacingWrapperMixer);
      this.camera.top = lerp(18, 9, morphRacingWrapperMixer);
      this.camera.bottom = lerp(-18, -9, morphRacingWrapperMixer);
      this.camera.updateProjectionMatrix();
      this.largeLettersWrapperObject.position.x = lerp(0, 10, morphRacingWrapperMixer);

      const scale = Math.max(Math.sqrt(this.throb), 0.01);
      for (let cube of this.racingGridFrame.children) {
        cube.scale.set(scale, scale, scale);
      }

      var { x, y } = this.animate(this.carPositions, frame, easeOut);
      this.playerRacingCar.position.x = x;
      this.playerRacingCar.position.y = y;
      for (let cube of this.playerRacingCar.children) {
        cube.scale.set(scale, scale, scale);
      }

      var { x, y } = this.animate(this.incomingCarsPosition, frame, lerp);
      this.incomingCars.position.x = x;
      this.incomingCars.position.y = y;
      for (let incoming of this.incomingCars.children) {
        for (let cube of incoming.children) {
          cube.scale.set(scale, scale, scale);
        }
      }

      for (let [i, letter] of this.largeLetters.entries()) {
        var { x, y, mixer, } = this.animate(this.largeLetterAnimationPaths[i], frame, easeOut);
        mixer = easeOut(0, 1, mixer);
        const scale = 4.0 * (mixer < 0.5 ? 1.0 - mixer : mixer);
        letter.scale.set(scale, scale, scale);
        letter.position.x = x;
        letter.position.y = y;
      }

      this.bg.material.uniforms.frame.value = frame;
    }

    render(renderer) {
      renderer.setClearColor(0x00000, 1.0);
      super.render(renderer);
    }
  }

  global.AtariRacer = AtariRacer;
})(this);
