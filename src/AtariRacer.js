(function (global) {
  const box = new THREE.BoxBufferGeometry(1, 1, 1);
  const padding = 0.0;
  //const whiteColor = 0xffffff;
  //const grayColor = 0x373c3f;
  const greenColor = 0x77e15d;
  const pinkColor = 0xff4982;

  const pinkMaterial = new THREE.MeshStandardMaterial({
    color: pinkColor,
    emissive: pinkColor,
    roughness: 1,
    metalness: 0,
  });
  const greenMaterial = new THREE.MeshStandardMaterial({
    color: greenColor,
    emissive: greenColor,
    roughness: 1,
    metalness: 0,
  });
  const baseBean = 864;

  class AtariRacer extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.carRotationThrob = 0;
      const directionalLight = new THREE.DirectionalLight();
      directionalLight.position.set(1, 1, 1);
      directionalLight.intensity = 1;
      this.scene.add(directionalLight);
      const ambientLight = new THREE.AmbientLight();
      ambientLight.intensity = 0.25;
      this.scene.add(ambientLight);

      const floodLight = new THREE.DirectionalLight();
      floodLight.position.set(0, 0, -1);
      floodLight.intensity = 1000;
      this.scene.add(floodLight);

      this.levelBG = new THREE.Mesh(
        new THREE.BoxGeometry(15, 72, 0.01),
        new THREE.MeshBasicMaterial({
          color: 0,
          opacity: 0.3,
          transparent: true,
        }));

      this.levelBG.position.x = -21;

      this.scene.add(this.levelBG);

      this.cameraShakeThrob = 0;

      this.camera.fov = 18;
      this.camera.updateProjectionMatrix();

      this.cameraPreviousPosition = new THREE.Vector3(0, 0, 0);
      this.cameraShakePosition = new THREE.Vector3(0, 0, 0);
      this.cameraShakeVelocity = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAcceleration = new THREE.Vector3(0, 0, 0);
      this.cameraShakeRotation = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAngularVelocity = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAngularAcceleration = new THREE.Vector3(0, 0, 0);

      const colorfactor = 4;
      this.ps = new ParticleSystem({
        //color: new THREE.Color(1 / colorfactor, 73 / 255 / colorfactor, 130 / 255 / colorfactor),
        color: new THREE.Color(1 / colorfactor, 1 / colorfactor, 1 / colorfactor),
        decayFactor: 0.9,
        gravity: 0.1,
      });
      //this.scene.add(this.ps.particles);

      this.baseQuaternion = this.camera.quaternion.clone();

      this.racingGridFrame = new THREE.Object3D();
      const [gridWidth, gridHeight] = [15, 36];
      const actualGridHeight = gridHeight + 20;
      for (let y = 0; y < actualGridHeight; y++) {
        const meshLeft = new THREE.Mesh(box, greenMaterial);
        meshLeft.position.x = 0;
        meshLeft.position.y = y * (1 + padding);
        meshLeft.scale.set(0.8, 0.8, 0.8);
        this.racingGridFrame.add(meshLeft);

        const meshRight = new THREE.Mesh(box, greenMaterial);
        meshRight.position.x = gridWidth - 1;
        meshRight.position.y = y * (1 + padding);
        meshRight.scale.set(0.8, 0.8, 0.8);
        this.racingGridFrame.add(meshRight);
      }

      const racingGridHeight = (gridHeight - 1) * (1 + padding);
      const actualRacinigGridHeightAsStuffDependsOnTheOldVariableNotChanging = (actualGridHeight - 1) * (1 + padding);
      this.racingGridFrame.position.x = -((gridWidth - 1) * (1 + padding)) / 2;
      this.racingGridFrame.position.y = -actualRacinigGridHeightAsStuffDependsOnTheOldVariableNotChanging / 2;

      this.playerRacingCar = this.createRacer(1, pinkMaterial);

      this.importantFrames = [
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
        [0, 4, 864 - 6],
        [0, 9, 864],
        [0, 3, 864 + 9],
        [2, -4, 864 + 24],
        [1, -5, 864 + 24 + 9],
        [0, 5, 864 + 24 + 9 + 9],
        [1, 2, 864 + 48 + 12],
        [2, -4, 864 + 48 + 12 + 6],
        [2, 1, 864 + 48 + 24],
        [0, -4, 864 + 48 + 24 + 4],
        [0, 2, 864 + 48 + 24 + 10],
        [1, -6, 864 + 48 + 48],
        [2, -6, 960 + 9],
        [2, -9, 960 + 9 + 9],
        [0, -9, 960 + 24],
        [1, -9, 960 + 24 + 3],
        [1, -2, 960 + 24 + 9],
        [0, -4, 960 + 48],
        [2, -7, 960 + 48 + 12],
        [0, -6, 960 + 48 + 24],
        [1, -6, 960 + 48 + 36 + 6],
        [1, 20, 960 + 48 + 48],
        /*
        [2, -9, 9999],
        [0, -9, 9999],
        [1, -9, 9999],
        [1, 20, 9999],
        */
      ];

      const beanWhenTheCarsTouch = 876;
      this.carPositions = [];
      for (let [index, [x, y, bean]] of rawCarPositions.entries()) {
        this.carPositions.push({
          frame: FRAME_FOR_BEAN(bean),
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
        const incoming = this.createRacer(1.0, greenMaterial);
        incoming.position.y = posY * offsetBetweenEachIncomingCar;
        incoming.position.x = posX * 4 - 4;
        for (let cube of incoming.children) {
          cube.scale.set(0.8, 0.8, 0.8);
        }
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
      this.bg.scale.set(2, 2, 2);

      this.throb = 0;
    }

    createStar(scale = 1.0) {
      const star = this.fromCoordinates([[1, 0], [0, -1], [1, -1], [2, -1], [1, -2], [0, -3], [1, -3], [2, -3], [1, -4]], scale);
      star.traverse(obj => obj.material = pinkMaterial);
      return star;
    }

    createRacer(scale = 1.0, material) {
      const racer = this.fromCoordinates([[1, 0], [0, -1], [1, -1], [2, -1], [1, -2], [0, -3], /*[1, -3], */[2, -3]], scale);
      racer.traverse(obj => obj.material = material);
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

    animate(positions, frame, easingFn, incomingRacecarMode) {
      const idx = positions.findIndex(point => point.frame > frame);

      if (idx === -1) {
        const lastPosition = positions[positions.length - 1];
        if (lastPosition.frame <= frame) {
          return lastPosition;
        } else {
          return positions[0];
        }
      }

      const current = positions[idx];
      const prev = positions[Math.max(0, idx - 1)];

      let mixer = (frame - prev.frame) / 60 / 60 * 115 / 4 * 48 / 9;
      if (incomingRacecarMode) {
        mixer = (frame - prev.frame) / (current.frame - prev.frame);
      }
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

      this.cameraShakeThrob *= 0.9;
      this.carRotationThrob *= 0.8;

      greenMaterial.emissiveIntensity *= 0.95;
      pinkMaterial.emissiveIntensity *= 0.95;
      greenMaterial.emissiveIntensity = Math.max(0.5, greenMaterial.emissiveIntensity);
      pinkMaterial.emissiveIntensity = Math.max(0.5, pinkMaterial.emissiveIntensity);

      const baseBean = 864;
      if (BEAT) {
        switch (BEAN) {
          case baseBean:
          case baseBean + 24:
          case baseBean + 24 + 9:
          case baseBean + 48 + 24:
          case 960 + 18:
          case 960 + 24 + 9:
          case 960 + 48 + 12:
            this.carRotationThrob = 1;
            break;
          case baseBean + 9:
          case baseBean + 24 + 9 + 9:
          case baseBean + 48 + 12:
          case 960:
          case 960 + 24:
          case 960 + 48:
          case 960 + 48 + 12 + 12 - 2:
            this.carRotationThrob = -1;
            break;
        }
        switch (BEAN) {
          case baseBean:
          case baseBean + 9:
          case baseBean + 24:
          case baseBean + 24 + 9:
          case baseBean + 24 + 9 + 9:
          case 1008:
            greenMaterial.emissiveIntensity = 1;
            pinkMaterial.emissiveIntensity = 1;
            this.cameraShakeThrob = 1;
            this.cameraShakeVelocity.x = (this.camera.position.x -
              this.cameraPreviousPosition.x) * 0.5;
            this.cameraShakeVelocity.y = (this.camera.position.y -
              this.cameraPreviousPosition.y) * 0.5;
            this.cameraShakeVelocity.z = (this.camera.position.z -
              this.cameraPreviousPosition.z) * 0.5;
            this.cameraShakeAngularVelocity.x = (Math.random() - 0.5) * 0.02;
            this.cameraShakeAngularVelocity.y = (Math.random() - 0.5) * 0.02;
            this.cameraShakeAngularVelocity.z = (Math.random() - 0.5) * 0.02;
        }
      }

      const cameraPosition = new THREE.Vector3(0, 0, 110);
      const cameraQuaternion = this.baseQuaternion;
      this.cameraShakeVelocity.x += 2 * (Math.random() - 0.5) * this.cameraShakeThrob;
      this.cameraShakeVelocity.y += 2 * (Math.random() - 0.5) * this.cameraShakeThrob;
      this.cameraShakeVelocity.z += 2 * (Math.random() - 0.5) * this.cameraShakeThrob;
      cameraPosition.x += 20 * (Math.random() - 0.5) * this.cameraShakeThrob * this.cameraShakeThrob;
      cameraPosition.y += 20 * (Math.random() - 0.5) * this.cameraShakeThrob * this.cameraShakeThrob;
      cameraPosition.z += 20 * (Math.random() - 0.5) * this.cameraShakeThrob * this.cameraShakeThrob;

      this.cameraShakeAcceleration.x = -this.cameraShakePosition.x * 0.05;
      this.cameraShakeAcceleration.y = -this.cameraShakePosition.y * 0.05;
      this.cameraShakeAcceleration.z = -this.cameraShakePosition.z * 0.05;
      this.cameraShakeAngularAcceleration.x = -this.cameraShakeRotation.x * 0.05;
      this.cameraShakeAngularAcceleration.y = -this.cameraShakeRotation.y * 0.05;
      this.cameraShakeAngularAcceleration.z = -this.cameraShakeRotation.z * 0.05;
      this.cameraShakeVelocity.add(this.cameraShakeAcceleration);
      this.cameraShakeAngularVelocity.add(this.cameraShakeAngularAcceleration);
      this.cameraShakeVelocity.multiplyScalar(0.85);
      this.cameraShakeAngularVelocity.multiplyScalar(0.85);
      this.cameraShakePosition.add(this.cameraShakeVelocity);
      this.cameraShakeRotation.add(this.cameraShakeAngularVelocity);

      this.cameraPreviousPosition.copy(this.camera.position);
      this.camera.position.copy(cameraPosition);
      this.camera.position.add(this.cameraShakePosition);
      this.camera.quaternion.copy(cameraQuaternion);
      this.camera.rotation.x += this.cameraShakeRotation.x;
      this.camera.rotation.y += this.cameraShakeRotation.y;
      this.camera.rotation.z += this.cameraShakeRotation.z;

      var { x, y } = this.animate(this.racingWrapperPositions, frame, easeOut);
      this.racingWrapper.position.x = x;
      this.racingWrapper.position.y = y;

      const morphRacingWrapperMixer = (frame - FRAME_FOR_BEAN(1008 - 12)) / (FRAME_FOR_BEAN(1008) - FRAME_FOR_BEAN(1008 - 12));

      this.camera.rotation.z = easeIn(0, Math.PI / 2.0, morphRacingWrapperMixer);
      this.camera.position.x = easeIn(0, -21, morphRacingWrapperMixer);
      this.camera.position.z = easeIn(cameraPosition.z, 47, morphRacingWrapperMixer);
      this.largeLettersWrapperObject.position.x = easeIn(0, 10, morphRacingWrapperMixer);

      const scale = Math.max(Math.sqrt(this.throb), 0.01);

      this.playerRacingCar.rotation.y = 0;
      var { x, y } = this.animate(this.carPositions, frame, easeOut);
      this.playerRacingCar.rotation.y = Math.PI * 2 * this.carRotationThrob;
      this.playerRacingCar.position.x = x;
      this.playerRacingCar.position.y = y;
      const vector = new THREE.Vector3(0, 0, 0);
      this.scene.updateMatrixWorld();
      for (let cube of this.playerRacingCar.children) {
        cube.scale.set(scale, scale, scale);
        cube.scale.set(0.8, 0.8, 0.8);
      }

      this.playerRacingCar.updateMatrixWorld();
      vector.setFromMatrixPosition(this.playerRacingCar.matrixWorld);
      for (let i = 0; i < this.cameraShakeThrob * 100; i++) {
        this.ps.spawn({
          x: (Math.random() - 0.5) * 80,
          y: (Math.random() - 0.5) * 45,
          z: -(Math.random()) * 10,
        }, { x: 0, y: 2.5 * (Math.random() - .5), z: 0 }, 0.5);
      }
      this.ps.update();

      var { x, y } = this.animate(this.incomingCarsPosition, frame, lerp, 1);
      this.incomingCars.position.x = x;
      this.incomingCars.position.y = y;

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
      this.ps.render();
      renderer.setClearColor(0x00000, 1.0);
      super.render(renderer);
    }
  }

  global.AtariRacer = AtariRacer;
})(this);
