//var earthMesh = null;
class Application {
    constructor() {
        this.objects = [];
		this.up = new THREE.Vector3(0, 1, 0);
		this.actualCamera = null;
		this.monster = null;

		//this.showLoading();

		this.stats = null;
        this.createScene();

		// This handles window/viewport resize event
        window.addEventListener('resize', this.handleResize.bind(this), true);

		// This is to show the scene after data loading
		//window.addEventListener('load', this.start.bind(this), true);


		document.addEventListener('keydown', this.onKeyDown.bind(this), false);
    }

	onKeyDown(event) {
		switch(event.keyCode) {
			case 38: // Up
				break;

			case 37: // Left
				break;

			case 40: // Down
				break;

			case 39: // Right
				break;

			case 32: // Space
				break;

			// Weapons
			case 90: // Z
				this.monster;
				if (this.monster != null) {
					this.monster.weapons['w_bfg.md2']();
				}
				break;

			case 88: // X
				this.monster;
				if (this.monster != null) {
					this.monster.weapons['w_blaster.md2']();
				}
				break;

			case 67: // C
				this.monster;
				if (this.monster != null) {
					this.monster.weapons['w_chaingun.md2']();
				}
				break;

			case 86: // V
				this.monster;
				if (this.monster != null) {
					this.monster.weapons['w_glauncher.md2']();
				}
				break;

			case 66: // B
				this.monster;
				if (this.monster != null) {
					this.monster.weapons['w_hyperblaster.md2']();
				}
				break;

			case 78: // N
				this.monster;
				if (this.monster != null) {
					this.monster.weapons['w_machinegun.md2']();
				}
				break;

			case 77: // M
				this.monster;
				if (this.monster != null) {
					this.monster.weapons['w_railgun.md2']();
				}
				break;

			case 188: // ,
				this.monster;
				if (this.monster != null) {
					this.monster.weapons['w_rlauncher.md2']();
				}
				break;

			case 190: // .
				this.monster;
				if (this.monster != null) {
					this.monster.weapons['w_shotgun.md2']();
				}
				break;

			case 189: // -
				this.monster;
				if (this.monster != null) {
					this.monster.weapons['w_sshotgun.md2']();
				}
				break;

			// Animations
			case 81: // Q
				this.monster;
				if (this.monster != null) {
					this.monster.animations['run']();
				}
				break;


			case 87: // W
				this.monster;
				if (this.monster != null) {
					this.monster.animations['attack']();
				}
				break;

			case 69: // E
				this.monster;
				if (this.monster != null) {
					this.monster.animations['pain']();
				}
				break;

			case 82: // R
				this.monster;
				if (this.monster != null) {
					this.monster.animations['jump']();
				}
				break;

			case 84: // T
				this.monster;
				if (this.monster != null) {
					this.monster.animations['flip']();
				}
				break;

			case 89: // Y
				this.monster;
				if (this.monster != null) {
					this.monster.animations['salute']();
				}
				break;

			case 85: // U
				this.monster;
				if (this.monster != null) {
					this.monster.animations['taunt']();
				}
				break;

			case 73: // I
				this.monster;
				if (this.monster != null) {
					this.monster.animations['wave']();
				}
				break;

			case 79: // O
				this.monster;
				if (this.monster != null) {
					this.monster.animations['point']();
				}
				break;

			case 80: // P
				this.monster;
				if (this.monster != null) {
					this.monster.animations['crstand']();
				}
				break;

			case 65: // A
				this.monster;
				if (this.monster != null) {
					this.monster.animations['crwalk']();
				}
				break;

			case 83: // S
				this.monster;
				if (this.monster != null) {
					this.monster.animations['crattack']();
				}
				break;

			case 68: // D
				this.monster;
				if (this.monster != null) {
					this.monster.animations['crpain']();
				}
				break;

			case 70: // F
				this.monster;
				if (this.monster != null) {
					this.monster.animations['crdeath']();
				}
				break;

			case 71: // G
				this.monster;
				if (this.monster != null) {
					this.monster.animations['death']();
				}
				break;

			case 72: // H
				this.monster;
				if (this.monster != null) {
					this.monster.animations['stand']();
				}
				break;


			// Skins
			case 49: // 1
				this.monster;
				if (this.monster != null) {
					this.monster.skins['ctf_r.png']();
				}
				break;

			case 50: // 2
				this.monster;
				if (this.monster != null) {
					this.monster.skins['ratamahatta.png']();
				}
				break;

			case 51: // 3
				this.monster;
				if (this.monster != null) {
					this.monster.skins['ctf_b.png']();
				}
				break;

			case 52: // 4
				this.monster;
				if (this.monster != null) {
					this.monster.skins['dead.png']();
				}
				break;

			case 53: // 5
				this.monster;
				if (this.monster != null) {
					this.monster.skins['gearwhore.png']();
				}
				break;




			// Cameras
			case 97: // Numpad 1
				var cam = this.scene.getObjectByName('p1Cam');
				if (cam != null) {
					this.actualCamera = cam;
				}
				break;

			case 98: // Numpad 2
				var cam = this.scene.getObjectByName('p2Cam');
				if (cam != null) {
					this.actualCamera = cam;
				}
				break;

			case 27: // ESC
				break;

			case 220: // Backslash
			case 96: // Numpad 0
				this.actualCamera = this.camera;
				break;
		}
	}

	showLoading() {
		this.loadingStart = new Date().getTime();

		var loading = document.createElement('div');
		loading.id = 'loading';
		loading.style = 'z-index: 30000; width: 100vw; height: 100vh; background-color: #000000;';
		loading.innerHTML = '<div style="color: #2273b5; left: 50%; top: 50%; position: fixed;">\
								<div style="position: relative; left: -149px; top: -196px;">\
									<img src="assets/loading.jpg">\
									<br><div style="text-align: center;">\
										<i class="fa fa-spinner fa-spin fa-3x"></i>\
									</div>\
								</div>\
							</div>';
		document.body.appendChild(loading);
	}

	hideLoading() {
		document.getElementById('loading').style = 'display: none;';
		document.getElementById('viewport').style = '';
	}

	start() {
		var delta = (new Date().getTime() - this.loadingStart)/1000,
			$this = this;

		if (delta < 5) {
			delta = (5 - delta) * 1000;
		} else {
			delta = 0;
		}

		window.setTimeout(function() {
			$this.animate();

			$this.hideLoading();

			$this.showStats();
		}, delta);
	}

    createScene() {
		var $this = this;

        this.clock = new THREE.Clock();
        this.scene = new THREE.Scene();

        this.spline = null;

        // Camera Object
        var fov = 60,
            aspect = window.innerWidth / window.innerHeight,
            near = 0.1,
            far = 100000.00;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.up = this.up;
        // Rotation
        this.camera.rotation.set(-0.9166883171181628, -0.6489914033537467, -0.6675564662789654);
        // Position
        this.camera.position.set(-3026.8120542900024, 6831.494304004204, 6136.215049807313);

		//  Set default camera
		this.actualCamera = this.camera;

        this.controls = new THREE.OrbitControls(this.camera);
        this.controls.damping = 0.2;
        // Vertical
        this.controls.minPolarAngle = grausToRadianos(0);
        this.controls.maxPolarAngle = grausToRadianos(100);

        this.controls.keys = { LEFT: 65, UP: 87, RIGHT: 68, BOTTOM: 83 };

        this.renderer = new THREE.WebGLRenderer({
			antialias: true
		});
        this.renderer.setClearColor(new THREE.Color(0x000000));
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

		this.renderer.gammaInput = true;
		this.renderer.gammaOutput = true;

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.renderer.shadowMapSoft = true;
		this.renderer.shadowMapAutoUpdate = true;

		var viewport = document.createElement("div");
		viewport.id = 'viewport';
		viewport.style = 'display: block;';
		document.body.appendChild(viewport);

		document.getElementById('viewport').appendChild(this.renderer.domElement);

		//this.createPlacards();
		this.createLights();
		this.createStats();
		this.createWater();

        this.animate();
    }

	createWater() {
		this.effectController = {
			mouseSize: 20.0,
			viscosity: 0.03
		};

		this.initWater();

		this.waterValuesChanger();
	}

	createPlacards() {
	}

	createLights() {
	}

	createStats() {
		this.stats = new Stats();
	}

	showStats() {
		document.body.appendChild(this.stats.dom);
	}

    waterValuesChanger() {
        heightmapVariable.material.uniforms.mouseSize.value = this.effectController.mouseSize;
        heightmapVariable.material.uniforms.viscosityConstant.value = this.effectController.viscosity;
    }

    initWater() {
        var materialColor = 0x0040C0;

        var geometry = new THREE.PlaneBufferGeometry(4200, 3000, 50, 50);

        // material: make a ShaderMaterial clone of MeshPhongMaterial, with customized vertex shader
        var material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.ShaderLib['phong'].uniforms,
                {
                    heightmap: { value: null }
                }
            ]),
            vertexShader: document.getElementById('waterVertexShader').textContent,
            fragmentShader: THREE.ShaderChunk['meshphong_frag']
        });

        material.lights = true;

        // Material attributes from MeshPhongMaterial
        material.color = new THREE.Color(materialColor);
        material.specular = new THREE.Color(0x111111);
        material.side = THREE.FrontSide;
        material.shininess = 50;

        // Sets the uniforms with the material values
        material.uniforms.diffuse.value = material.color;
        material.uniforms.specular.value = material.specular;
        material.uniforms.shininess.value = Math.max(material.shininess, 1e-4);
        material.uniforms.opacity.value = material.opacity;

        // Defines
        material.defines.WIDTH = WIDTH.toFixed(1);
        material.defines.HEIGHT = HEIGHT.toFixed(1);
        material.defines.BOUNDS = BOUNDS.toFixed(1);

        waterUniforms = material.uniforms;

        waterMesh = new THREE.Mesh(geometry, material);
        //waterMesh.rotation.x = - Math.PI / 2;

        //waterMesh.position.set(1749.36, 288.95, 6.53);
        waterMesh.position.set(1705.74, 288.95, -35.53);
        waterMesh.rotation.set(grausToRadianos(-87.95), grausToRadianos(2.05), grausToRadianos(134.96));

        waterMesh.matrixAutoUpdate = false;
        waterMesh.updateMatrix();

        this.scene.add(waterMesh);

        // Mesh just for mouse raycasting
        var geometryRay = new THREE.PlaneBufferGeometry(BOUNDS, BOUNDS/1.5, 1, 1);
        meshRay = new THREE.Mesh(geometryRay, new THREE.MeshBasicMaterial({
                color: 0xFFFFFF,
                visible: false
            }));
        meshRay.rotation.x = - Math.PI / 2;
        meshRay.matrixAutoUpdate = false;
        meshRay.updateMatrix();
        this.scene.add(meshRay);


        // Creates the gpu computation class and sets it up
        gpuCompute = new GPUComputationRenderer(WIDTH, HEIGHT, this.renderer);

        var heightmap0 = gpuCompute.createTexture();

        this.fillTexture(heightmap0);

        heightmapVariable = gpuCompute.addVariable("heightmap", document.getElementById('heightmapFragmentShader').textContent, heightmap0);

        gpuCompute.setVariableDependencies(heightmapVariable, [heightmapVariable]);

        heightmapVariable.material.uniforms.mousePos = { value: new THREE.Vector2(10000, 10000) };
        heightmapVariable.material.uniforms.mouseSize = { value: 20.0 };
        heightmapVariable.material.uniforms.viscosityConstant = { value: 0.03 };
        heightmapVariable.material.defines.BOUNDS = BOUNDS.toFixed(1);

        var error = gpuCompute.init();
        if (error !== null) {
            console.error(error);
        }

        // Create compute shader to smooth the water surface and velocity
        smoothShader = gpuCompute.createShaderMaterial(document.getElementById('smoothFragmentShader').textContent, { texture: { value: null } });
    }

    waterNoise(waterMaxHeight, x, y, z) {
        var multR = waterMaxHeight,
            mult = 0.025,
            r = 0;

        for (var i=0; i<15; i++) {
            r += multR * simplex.noise3d(x * mult, y * mult, z * mult);
            multR *= 0.53 + 0.025 * i;
            mult *= 1.25;
        }

        return r;
    }

    fillTexture(texture) {
        var waterMaxHeight = 25,
            pixels = texture.image.data,
            p = 0;

        for (var j=0; j<HEIGHT; j++) {
            for (var i=0; i<WIDTH; i++) {
                var x = i * 128 / WIDTH;
                var y = j * 128 / HEIGHT;

                pixels[p + 0] = this.waterNoise(waterMaxHeight, x, y, 123.4);
                pixels[p + 1] = 0;
                pixels[p + 2] = 0;
                pixels[p + 3] = 1;

                p += 4;
            }
        }
    }

    smoothWater() {
        var currentRenderTarget = gpuCompute.getCurrentRenderTarget(heightmapVariable);
        var alternateRenderTarget = gpuCompute.getAlternateRenderTarget(heightmapVariable);

        for (var i=0; i<10; i++) {
            smoothShader.uniforms.texture.value = currentRenderTarget.texture;
            gpuCompute.doRenderTarget(smoothShader, alternateRenderTarget);

            smoothShader.uniforms.texture.value = alternateRenderTarget.texture;
            gpuCompute.doRenderTarget(smoothShader, currentRenderTarget);
        }
    }

    renderWater() {
        // Set uniforms: mouse interaction
        var uniforms = heightmapVariable.material.uniforms;
        if (mouseMoved) {
            raycaster.setFromCamera(mouseCoords, this.camera);

            var intersects = raycaster.intersectObject(meshRay);

            if (intersects.length > 0) {
                var point = intersects[0].point;
                uniforms.mousePos.value.set(point.x, point.z);
            } else {
                uniforms.mousePos.value.set(10000, 10000);
            }

            mouseMoved = false;
        } else {
            uniforms.mousePos.value.set(10000, 10000);
        }

        // Do the gpu computation
        gpuCompute.compute();

        // Get compute output in custom uniform
        waterUniforms.heightmap.value = gpuCompute.getCurrentRenderTarget(heightmapVariable).texture;
    }

    animate() {
		var delta = this.clock.getDelta();

        this.renderer.clear();

		//this.searchOctree();

		// Update all the objects
        this.objects.forEach((object) => object.update(delta, this.actualCamera));

		// Update the water
        this.renderWater();

        this.stats.update();

		// Render the scene
        this.render(delta);

        requestAnimationFrame(() => this.animate());
    }

	searchOctree() {
		// record start time
		var timeStart = Date.now(),
			$this = this;


		this.objects.forEach(
			//(object) => object.isHelper().update(delta, this.camera)
			function(object) {
				if (object.isHelper()) {
					var helper = object.getHelper(),
						mesh = object.getMesh(),
						position = object.getPosition();
					helper.material.color.set(0xffffff);

					var dir = 5;

					// method A
					var direction = new THREE.Vector3();
					direction.set( position.x+2*dir, position.y, position.z).normalize();

					$this.rayCaster.set( position, direction );
					$this.meshesSearch = $this.octree.search( $this.rayCaster.ray.origin, 25, true, $this.rayCaster.ray.direction );

					var intersections = $this.rayCaster.intersectOctreeObjects( $this.meshesSearch );

					if (intersections.length>0) {
						console.log(intersections);
						helper.material.color.set( 0xff0000 );
					}
				}
			}
		);

		// record end time
		var timeEnd = Date.now();
	}

    render(delta) {
		this.renderer.render(this.scene, this.actualCamera);
    }

    add(mesh) {
        this.spline = null;

        if (Array.isArray(mesh)) {
            var count1 = 0;
            for (var index in mesh) {
                this.objects.push(mesh[index]);

                if (mesh[index] instanceof Objects.Spline) {
                    this.spline = mesh[index].getObj();
                } else if (mesh[index] instanceof PlayableObjects.Ratamahatta) {
					this.monster = mesh[index].obj;
				}

				if (mesh[index].getMesh().name.substr(0, 6) == 'player') {
					//mesh[index].setSpeed(0.002);
					mesh[index].setSpline(this.spline);
				}

                this.scene.add(mesh[index].getMesh());
            }
        } else {
            this.objects.push(mesh);
            this.scene.add(mesh.getMesh());
        }
    }

    handleResize() {
        this.camera.aspect = (window.innerWidth / window.innerHeight);
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}