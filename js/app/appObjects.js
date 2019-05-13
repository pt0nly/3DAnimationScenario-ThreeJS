// Basic Object
class ObjectBasic {
    constructor(scale, position, rotation) {
        // Scale
        this.scale = (!checkExist(scale) ? { x: 1, y: 1, z: 1 } : scale);
        if (!checkExist(this.scale.x)) this.scale.x = 1;
        if (!checkExist(this.scale.y)) this.scale.y = 1;
        if (!checkExist(this.scale.z)) this.scale.z = 1;

        // Position
        this.position = (!checkExist(position) ? { x: 0, y: 0, z: 0 } : position);
        if (!checkExist(this.position.x)) this.position.x = 0;
        if (!checkExist(this.position.y)) this.position.y = 0;
        if (!checkExist(this.position.z)) this.position.z = 0;

        // Rotation
        this.rotation = (!checkExist(rotation) ? { x: 0, y: 0, z: 0 } : rotation);
        if (!checkExist(this.rotation.x)) this.rotation.x = 0;
        if (!checkExist(this.rotation.y)) this.rotation.y = 0;
        if (!checkExist(this.rotation.z)) this.rotation.z = 0;

        this.material = null;
        this.mesh = null;
        this.meshCollider = null;
        this.hasMeshCollider = false;
		this.spline = null;
		this.splineTime = 0;
		this.up = null;
		this.axis = new THREE.Vector3();

        this.renderer = null;

		this.movement = {
			maxSpeed: 0,
			speed: 0,
			maxAccel: 0,
			accel: 0,
			maxLateralSpeed: 0,
			lateralSpeed: 0,
			maxLateralAccel: 0,
			lateralAccel: 0
		};
    }

    update() {
		if (checkExist(this.spline)) {
            var tangent = new THREE.Vector3(),
				radians,
            	marker;

			// Set the marker position
            try {
				// This is to keep a constant speed
    			marker = this.spline.getPointAt(this.splineTime);
            } catch(e) {
				// This is for when the last point of the spline changes to the first point
    			marker = this.spline.getPoint(this.splineTime);
            }
			this.getMesh().position.set(marker.x, marker.y, marker.z);

			// Get the tangent to the curve
            try {
				// This is to keep a constant speed
			    tangent = this.spline.getTangentAt(this.splineTime).normalize();
            } catch(e) {
				// This is for when it changes from the last point of the spline to the first point
			    tangent = this.spline.getTangent(this.splineTime).normalize();
            }

			// Calculate the axis to rotate around
			this.axis.crossVectors(this.up, tangent).normalize();

			// Calculate the angle between the up vector and the tangent
			radians = Math.acos(this.up.dot(tangent));

			// Set the quaternion
			this.getMesh().quaternion.setFromAxisAngle(this.axis, radians);

			this.splineTime = (this.splineTime >= 1) ? 0 : this.splineTime += this.movement.speed;
		}
	}

    setRenderer(renderer) {
        this.renderer = renderer;
    }

	setSpline(spline, up) {
        if (checkExist(up)) {
		    this.up = up;
        }
		this.splineTime = 0;
		this.spline = spline;
	}

	setSpeed(speed) {
		if (speed > this.movement.maxSpeed) {
			speed = this.movement.maxSpeed;
			this.setAcceleration(0);
		}
		this.movement.speed = speed;
	}

	setMaxSpeed(maxSpeed) {
		this.movement.maxSpeed = maxSpeed;
	}

	setMaxAccel(maxAccel) {
		this.movement.maxAccel = maxAccel;
	}

	setMaxLateralSpeed(maxSpeed) {
		this.movement.maxLateralSpeed = maxSpeed;
	}

	setMaxLateralAccel(maxAccel) {
		this.movement.maxLateralAccel = maxAccel;
	}

	setAcceleration(accel) {
		if (accel > this.movement.maxAccel) {
			accel = this.movement.maxAccel;
		}
		this.movement.accel = accel;
	}

	getPosition() {
		return this.position;
	}

	setLateralSpeed(speed) {
		if (speed > this.movement.maxLateralSpeed) {
			speed = this.movement.maxLateralSpeed;
			this.setLateralAcceleration(0);
		}
		this.movement.lateralSpeed = speed;
	}

	setLateralAcceleration(accel) {
		if (accel > this.movement.maxLateralAccel) {
			accel = this.movement.maxLateralAccel;
		}
		this.movement.lateralAccel = accel;
	}

    getMesh() {}

    getMeshCollider() {}

    getMaterial() {}

	isHelper() {
		return checkExist(this.helper);
	}

	getHelper() {
		return this.helper;
	}
}

// Objects namespace
var Objects = {
    // Cube with particle system
    CubeParticleSystem: class extends ObjectBasic {
        constructor(name, cubeSize, texturePath, transparent, size, segments, position, rotation) {
            super(null, position, rotation);

            // Texture
            transparent = (!checkExist(transparent) ? false : transparent);

            // Segments
            segments = (!checkExist(segments) ? { width: 1, height: 1, depth: 1 } : segments);
            segments.width = (!checkExist(segments.width) ? 1 : segments.width);
            segments.height = (!checkExist(segments.height) ? 1 : segments.height);
            segments.depth = (!checkExist(segments.depth) ? 1 : segments.depth);

            this.geometry = new THREE.BoxGeometry(cubeSize.width, cubeSize.height, cubeSize.depth, segments.width, segments.height, segments.depth);
            this.material = new Material.ParticleBasicMaterial(texturePath, transparent, size);

            this.particleSystem = new THREE.ParticleSystem(geometry, material);
            this.particleSystem.sortParticles = true;
            this.particleSystem.name = name;

            // Position
            this.particleSystem.position.set(this.position.x, this.position.y, this.position.z);

            // Rotation
            this.particleSystem.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
        }

        update() {
            super.update();
        }

        getParticleSystem() {
            return this.particleSystem;
        }

        getMesh() {
            super.getMesh();

            return this.mesh;
        }

        getMeshCollider() {
            super.getMeshCollider();

            return this.meshCollider;
        }

        getMaterial() {
            super.getMaterial();

            return this.material;
        }
    },

    // Cube
    Cube: class extends ObjectBasic {
        constructor(size, position, rotation) {
            super(null, position, rotation);

            this.geometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
            this.material = new THREE.MeshBasicMaterial(); // { color: 0x00ff00 }

            this.mesh = new THREE.Mesh(this.geometry, this.material);

            // Position
            this.mesh.position.set(this.position.x, this.position.y, this.position.z);

            // Rotation
            this.mesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
        }

        update() {
            super.update();

            this.mesh.rotation.x += 0.1;
            this.mesh.rotation.y += 0.1;
        }

        setRenderer(renderer) {
            super.setRenderer(renderer);
        }

        getMesh() {
            super.getMesh();

            return this.mesh;
        }

        getMeshCollider() {
            super.getMeshCollider();

            return this.meshCollider;
        }

        getMaterial() {
            super.getMaterial();

            return this.material;
        }
    },

    // Sphere
    Sphere: class extends ObjectBasic {
        constructor(name, params, material, position, rotation) {
            super(null, position, rotation);

            // Sphere parameters
            this.params = {
                'radius': (!checkExist(params.radius) ? 50 : params.radius),
                'widthSegments': (!checkExist(params.widthSegments) ? 8 : params.widthSegments),
                'heightSegments': (!checkExist(params.heightSegments) ? 6 : params.heightSegments),
                'phiStart': (!checkExist(params.phiStart) ? 0 : params.phiStart),
                'phiLength': (!checkExist(params.phiLength) ? (Math.PI * 2) : params.phiLength),
                'thetaStart': (!checkExist(params.thetaStart) ? 0 : params.thetaStart),
                'thetaLength': (!checkExist(params.thetaLength) ? (Math.PI) : params.thetaLength),
            };
            if (this.params.widthSegments < 3) this.params.widthSegments = 3;
            if (this.params.heightSegments < 2) this.params.heightSegments = 2;

            // Create geometry
            this.geometry = new THREE.SphereGeometry(
                this.params.radius,
                this.params.widthSegments, this.params.heightSegments,
                this.params.phiStart, this.params.phiLength,
                this.params.thetaStart, this.params.thetaLength
            );

            if (!checkExist(material)) {
                // Create material
                this.material = new THREE.MeshPhongMaterial({ color: 0xe4e4e4 });
            } else {
                // Use defined material
                this.material = material;
            }

            // Create a Mesh
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            if (typeof(name) == String && name.length > 0) {
                this.mesh.name = name;
            }

            // Mesh position
            this.mesh.position.set(this.position.x, this.position.y, this.position.z);

            // Mesh rotation
            this.mesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
        }

        update() {
            super.update();
        }

        setRenderer(renderer) {
            super.setRenderer(renderer);
        }

        getMesh() {
            super.getMesh();

            return this.mesh;
        }

        getMeshCollider() {
            super.getMeshCollider();

            return this.meshCollider;
        }

        getMaterial() {
            super.getMaterial();

            return this.material;
        }
    },

    // Plane
    Plane: class extends ObjectBasic {
        constructor(size, segments, materialParams, receiveShadow, position, rotation) {
            super(null, position, rotation);

            segments = (!checkExist(segments) ? { width: 1, height: 1 } : segments);
            receiveShadow = (!checkExist(receiveShadow) ? false : receiveShadow);

            this.geometry = new THREE.PlaneGeometry(size.width, size.height, segments.width, segments.height);
            this.material = new THREE.MeshPhongMaterial(materialParams);

            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.receiveShadow = receiveShadow;

            // Mesh position
            this.mesh.position.set(this.position.x, this.position.y, this.position.z);

            // Mesh rotation
            this.mesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
        }

        update() {
            super.update();
        }

        setRenderer(renderer) {
            super.setRenderer(renderer);
        }

        getMesh() {
            super.getMesh();

            return this.mesh;
        }

        getMeshCollider() {
            super.getMeshCollider();

            return this.meshCollider;
        }

        getMaterial() {
            super.getMaterial();

            return this.material;
        }
    },

    // Spline
    Spline: class {
        constructor(points) {
            // SPLINE
            this.arcSegments = 200;

            if (Array.isArray(points)) {
                var geometry = new THREE.Geometry();
                for (var i=0; i<this.arcSegments; i++) {
                    geometry.vertices.push(new THREE.Vector3());
                }

                // Centripetal spline
                var curve = new THREE.CatmullRomCurve3(points);
                curve.type = 'centripetal';
                curve.mesh = new THREE.Line(geometry.clone(), new THREE.LineBasicMaterial({
                    color: 0x00ff00,
                    opacity: 1,
                    linewidth: 20
                }));
                curve.mesh.castShadow = false;
                curve.mesh.visible = false;
                this.spline = curve;

                this.updateSplineOutline();
            }
        }

        update() {}

        setRenderer(renderer) {
            super.setRenderer(renderer);
        }

        updateSplineOutline() {
            for (var i=0; i<this.arcSegments; i++) {
                var p = this.spline.mesh.geometry.vertices[i];

                p.copy( this.spline.getPoint(i / (this.arcSegments - 1)) );
            }

            this.spline.mesh.geometry.verticesNeedUpdate = true;
        }

        getMesh() {
            return this.spline.mesh;
        }

        getMeshCollider() {
            super.getMeshCollider();

            return this.meshCollider;
        }

        getObj() {
            return this.spline;
        }

		isHelper() {
			return checkExist(this.helper);
		}

		getHelper() {
			return this.helper;
		}
    },

    // Water
    Water: class extends ObjectBasic {
        constructor(size, segments, materialParams, receiveShadow, position, rotation) {
            super(null, position, rotation);

            segments = (!checkExist(segments) ? { width: 1, height: 1 } : segments);
            receiveShadow = (!checkExist(receiveShadow) ? false : receiveShadow);

            // Texture width for simulation
            this.width = size.width;
            this.height = size.height;
            this.WIDTH = /*hash ||*/ 128;
            this.NUM_TEXELS = this.WIDTH * this.WIDTH;

            // Water size in system units
            this.BOUNDS = 512;
            this.BOUNDS_HALF = this.BOUNDS * 0.5;

            this.container;
            this.camera;
			this.scene;
			this.renderer;
			this.controls;
            this.mouseMoved = false;
            this.mouseCoords = new THREE.Vector2();
            this.raycaster = new THREE.Raycaster();

            this.waterMesh;
            this.meshRay;
            this.gpuCompute;
            this.heightmapVariable;
            this.waterUniforms;
            this.smoothShader;

            this.simplex = new SimplexNoise();

            this.windowHalfX = window.innerWidth / 2;
            this.windowHalfY = window.innerHeight / 2;

            // Create shaders id's
            var timeStamp = '';
            this.heightMapShader = 'heightmapFragmentShader' + timeStamp;
            this.smoothShader = 'smoothFragmentShader' + timeStamp;
            this.vertexShader = 'waterVertexShader' + timeStamp;

			// Create Water
			var materialColor = 0x0040C0;

			this.geometry = new THREE.PlaneBufferGeometry(size.width, size.height, segments.width, segments.height);

			// material: make a ShaderMaterial clone of MeshPhongMaterial, with customized vertex shader
			this.material = new THREE.ShaderMaterial({
				uniforms: THREE.UniformsUtils.merge([
					THREE.ShaderLib['phong'].uniforms,
					{
						heightmap: {value: null}
					}
				]),
				vertexShader: document.getElementById(this.vertexShader).textContent,
				fragmentShader: THREE.ShaderChunk['meshphong_frag']
			});

			this.material.lights = true;

			// Material attributes from MeshPhongMaterial
			this.material.color = new THREE.Color(materialColor);
			this.material.specular = new THREE.Color(0x111111);
			this.material.shininess = 50;

			// Sets the uniforms with the material values
			this.material.uniforms.diffuse.value = this.material.color;
			this.material.uniforms.specular.value = this.material.specular;
			this.material.uniforms.shininess.value = Math.max(this.material.shininess, 1e-4);
			this.material.uniforms.opacity.value = this.material.opacity;

			// Defines
			this.material.defines.WIDTH = size.width.toFixed(1);
			this.material.defines.BOUNDS = this.BOUNDS.toFixed(1);

			this.waterUniforms = this.material.uniforms;

			this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.receiveShadow = receiveShadow;

            // Mesh position
            this.mesh.position.set(this.position.x, this.position.y, this.position.z);

            // Mesh rotation
            this.mesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);

			this.mesh.matrixAutoUpdate = false;
			this.mesh.updateMatrix();

			// Mesh just for mouse raycasting
			var geometryRay = new THREE.PlaneBufferGeometry(size.width, size.height, 1, 1);
			this.meshCollider = new THREE.Mesh(geometryRay, new THREE.MeshBasicMaterial({color: 0xFFFFFF, visible: false}));
            // Mesh position
            this.meshCollider.position.set(this.position.x, this.position.y, this.position.z);

            // Mesh rotation
            this.meshCollider.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);

			this.meshCollider.matrixAutoUpdate = false;
			this.meshCollider.updateMatrix();
        }

        update() {
            super.update();

            if (checkExist(this.heightmapVariable)) {
                var uniforms = this.heightmapVariable.material.uniforms;

                if (this.mouseMoved) {
                    this.raycaster.setFromCamera(this.mouseCoords, camera);

                    var intersects = this.raycaster.intersectObject(this.meshCollider);

                    if (intersects.length > 0) {
                        var point = intersects[0].point;
                        uniforms.mousePos.value.set(point.x, point.z);
                    } else {
                        uniforms.mousePos.value.set(10000, 10000);
                    }

                    this.mouseMoved = false;
                } else {
                    uniforms.mousePos.value.set(10000, 10000);
                }

                // Do the gpu computation
                this.gpuCompute.compute();

                // Get compute output in custom uniform
                this.waterUniforms.heightmap.value = this.gpuCompute.getCurrentRenderTarget(this.heightmapVariable).texture;
            }
        }

        getMesh() {
            super.getMesh();

            return this.mesh;
        }

        getMeshCollider() {
            super.getMeshCollider();

            this.gpuCompute = new GPUComputationRenderer(this.width, this.height, this.renderer);
            var heightmap0 = this.gpuCompute.createTexture();

            this.fillTexture(heightmap0);

            this.heightmapVariable = gpuCompute.addVariable("heightmap", document.getElementById(this.heightMapShader).textContent, heightmap0);

            gpuCompute.setVariableDependencies(this.heightmapVariable, [this.heightmapVariable]);

            this.heightmapVariable.material.uniforms.mousePos = { value: new THREE.Vector2(10000, 10000) };
            this.heightmapVariable.material.uniforms.mouseSize = { value: 20.0 };
            this.heightmapVariable.material.uniforms.viscosityConstant = { value: 0.03 };
            this.heightmapVariable.material.defines.BOUNDS = BOUNDS.toFixed(1);

            var error = gpuCompute.init();
            if (error !== null) {
                console.error(error);
            }

            // Create compute shader to smooth the water surface and velocity
            this.smoothShader = gpuCompute.createShaderMaterial(document.getElementById(this.smoothShader).textContent, {texture: {value: null}});

            this.valuesChanger();

            document.addEventListener('mousemove', this.onDocumentMouseMove, false);
            document.addEventListener('touchstart', this.onDocumentTouchStart, false);
            document.addEventListener('touchmove', this.onDocumentTouchMove, false);

            document.addEventListener('keydown', function(event) {
                // W Pressed: Toggle wireframe
                if (event.keyCode === 87) {
                    console.log('pressing W');
                    this.mesh.material.wireframe = !this.mesh.material.wireframe;
                    this.mesh.material.needsUpdate = true;
                }
            }, false);

            return this.meshCollider;
        }

        smoothWater() {
            var currentRenderTarget = this.gpuCompute.getCurrentRenderTarget(this.heightmapVariable);
            var alternateRenderTarget = this.gpuCompute.getAlternateRenderTarget(this.heightmapVariable);

            for(var i=0; i<10; i++) {
                this.smoothShader.uniforms.texture.value = currentRenderTarget.texture;
                this.gpuCompute.doRenderTarget(this.smoothShader, alternateRenderTarget);

                this.smoothShader.uniforms.texture.value = alternateRenderTarget.texture;
                this.gpuCompute.doRenderTarget(this.smoothShader, currentRenderTarget);
            }
        }

        setRenderer(renderer) {
            super.setRenderer(renderer);
            this.renderer = renderer;
        }

        getMaterial() {
            super.getMaterial();

            return this.material;
        }

        noise(x, y, z) {
            var multR = this.waterMaxHeight,
                mult = 0.025,
                r = 0;

            for(var i=0; i<15; i++) {
                r += multR * simplex.noise3d(x * mult, y * mult, z * mult);
                multR *= 0.53 + 0.025 * i;
                mult *= 1.25;
            }

            return r;
        }

        fillTexture(texture) {
            this.waterMaxHeight = 10;

            var pixels = texture.image.data,
                p = 0;

            for(var j=0; j<this.height; j++) {
                for(var i=0; i<this.width; i++) {
                    var x = i * 128 / this.width,
                        y = j * 128 / this.height;

                    pixels[p + 0] = this.noise(x, y, 123.4);
                    pixels[p + 1] = 0;
                    pixels[p + 2] = 0;
                    pixels[p + 3] = 1;

                    p += 4;
                }
            }
        }

		valuesChanger() {
			this.heightmapVariable.material.uniforms.mouseSize.value = this.effectController.mouseSize;
			this.heightmapVariable.material.uniforms.viscosityConstant.value = this.effectController.viscosity;
		}

        createHeightmapFragmentShader() {
            var shader = document.createElement("script");
            shader.id = this.heightMapShader;
            shader.type = "x-shader/x-fragment";
            shader.innerText =  "#include <common>\
                                \
                                uniform vec2 mousePos; \
                                uniform float mouseSize;\
                                uniform float viscosityConstant;\
                                \
                                #define deltaTime (1.0 / 60.0)\
                                #define GRAVITY_CONSTANT (resolution.x * deltaTime * 3.0)\
                                \
                                void main()	{\
                                    vec2 cellSize = 1.0 / resolution.xy;\
                                    vec2 uv = gl_FragCoord.xy * cellSize;\
                                    \
                                    // heightmapValue.x == height\
                                    \// heightmapValue.y == velocity\
                                    \// heightmapValue.z, heightmapValue.w not used\
                                    vec4 heightmapValue = texture2D(heightmap, uv);\
                                    \
                                    // Get neighbours\
                                    vec4 north = texture2D(heightmap, uv + vec2(0.0, cellSize.y));\
                                    vec4 south = texture2D(heightmap, uv + vec2(0.0, -cellSize.y));\
                                    vec4 east = texture2D(heightmap, uv + vec2(cellSize.x, 0.0));\
                                    vec4 west = texture2D(heightmap, uv + vec2(-cellSize.x, 0.0));\
                                    \
                                    float sump = north.x + south.x + east.x + west.x - 4.0 * heightmapValue.x;\
                                    float accel = sump * GRAVITY_CONSTANT;\
                                    \
                                    // Dynamics\
                                    heightmapValue.y += accel;\
                                    heightmapValue.x += heightmapValue.y * deltaTime;\
                                    \
                                    // Viscosity\
                                    heightmapValue.x += sump * viscosityConstant;\
                                    \
                                    // Mouse influence\
                                    float mousePhase = clamp(length((uv - vec2(0.5)) * BOUNDS - vec2(mousePos.x, -mousePos.y)) * PI / mouseSize, 0.0, PI);\
                                    heightmapValue.x += cos(mousePhase) + 1.0;\
                                    \
                                    gl_FragColor = heightmapValue;\
                                }";
            document.body.appendChild(shader);
        }

        createSmoothFragmentShader() {
            var shader = document.createElement("script");
            shader.id = this.smoothShader;
            shader.type = "x-shader/x-fragment";
            shader.innerText = "uniform sampler2D texture\
                                \
                                void main()	{\
                                    vec2 cellSize = 1.0 / resolution.xy;\
                                    vec2 uv = gl_FragCoord.xy * cellSize;\
                                    \
                                    // Computes the mean of texel and 4 neighbours\
                                    vec4 textureValue = texture2D(texture, uv);\
                                    textureValue += texture2D(texture, uv + vec2(0.0, cellSize.y));\
                                    textureValue += texture2D(texture, uv + vec2(0.0, -cellSize.y));\
                                    textureValue += texture2D(texture, uv + vec2(cellSize.x, 0.0));\
                                    textureValue += texture2D(texture, uv + vec2(-cellSize.x, 0.0));\
                                    \
                                    textureValue /= 5.0;\
                                    \
                                    gl_FragColor = textureValue;\
                                }";
            document.body.appendChild(shader);
        }

        createVertexShader() {
            var shader = document.createElement("script");
            shader.id = this.vertexShader;
            shader.type = "x-shader/x-vertex";
            shader.innerText = "uniform sampler2D heightmap;\
                                \
                                #define PHONG\
                                \
                                varying vec3 vViewPosition;\
                                \
                                #ifndef FLAT_SHADED\
                                    varying vec3 vNormal;\
                                #endif\
                                \
                                #include <common>\
                                #include <uv_pars_vertex>\
                                #include <uv2_pars_vertex>\
                                #include <displacementmap_pars_vertex>\
                                #include <envmap_pars_vertex>\
                                #include <color_pars_vertex>\
                                #include <morphtarget_pars_vertex>\
                                #include <skinning_pars_vertex>\
                                #include <shadowmap_pars_vertex>\
                                #include <logdepthbuf_pars_vertex>\
                                #include <clipping_planes_pars_vertex>\
                                \
                                void main() {\
                                    vec2 cellSize = vec2(1.0 / WIDTH, 1.0 / WIDTH);\
                                    \
                                    #include <uv_vertex>\
                                    #include <uv2_vertex>\
                                    #include <color_vertex>\
                                    \
                                    // # include <beginnormal_vertex>\
                                    // Compute normal from heightmap\
                                    vec3 objectNormal = vec3(\
                                            (texture2D(heightmap, uv + vec2(-cellSize.x, 0)).x - texture2D(heightmap, uv + vec2(cellSize.x, 0)).x) * WIDTH / BOUNDS,\
                                            (texture2D(heightmap, uv + vec2(0, -cellSize.y)).x - texture2D(heightmap, uv + vec2(0, cellSize.y)).x) * WIDTH / BOUNDS,\
                                            1.0\
                                        );\
                                    //<beginnormal_vertex>\
                                    \
                                    #include <morphnormal_vertex>\
                                    #include <skinbase_vertex>\
                                    #include <skinnormal_vertex>\
                                    #include <defaultnormal_vertex>\
                                    \
                                    #ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED\
                                        vNormal = normalize(transformedNormal);\
                                    #endif\
                                    \
                                    //# include <begin_vertex>\
                                    float heightValue = texture2D(heightmap, uv).x;\
                                    vec3 transformed = vec3(position.x, position.y, heightValue);\
                                    //<begin_vertex>\
                                    \
                                    #include <displacementmap_vertex>\
                                    #include <morphtarget_vertex>\
                                    #include <skinning_vertex>\
                                    #include <project_vertex>\
                                    #include <logdepthbuf_vertex>\
                                    #include <clipping_planes_vertex>\
                                    \
                                    vViewPosition = -mvPosition.xyz;\
                                    \
                                    #include <worldpos_vertex>\
                                    #include <envmap_vertex>\
                                    #include <shadowmap_vertex>\
                                }";
            document.body.appendChild(shader);
        }
    },

    // Water_old
    Water_old: class extends ObjectBasic {
        constructor(appOptions, size, materialParams, receiveShadow, position, rotation) {
            super(null, position, rotation);

            var segments = { width: 1, height: 1 };
            receiveShadow = (!checkExist(receiveShadow) ? false : receiveShadow);

            var gsize = 512,
                res = 1024,
                gres = res / 2,
                origx = -gsize / 2,
                origz = -gsize / 2;

            var plane = new Objects.Plane(size, {width: res, height: res}, {side: THREE.DoubleSide}, true, position, rotation);
            this.mesh = plane.getMesh();
            this.lastTime = (new Date()).getTime();
            this.done = 1;
        }

        update(delta, camera) {
            super.update();

            if (!this.done) {
                var currentTime = new Date().getTime();
                this.ocean.deltaTime = (currentTime - this.lastTime) / 1000 || 0.0;
                this.lastTime = currentTime;

                this.ocean.render(this.ocean.deltaTime);

                this.ocean.overrideMaterial = this.ocean.materialOcean;

                if (this.ocean.changed) {
                    this.ocean.materialOcean.uniforms.u_size.value = this.ocean.size;
                    this.ocean.materialOcean.uniforms.u_sunDirection.value.set(this.ocean.sunDirectionX, this.ocean.sunDirectionY, this.ocean.sunDirectionZ);
                    this.ocean.materialOcean.uniforms.u_exposure.value = this.ocean.exposure;
                    this.ocean.changed = false;
                }

                this.ocean.materialOcean.uniforms.u_normalMap.value = this.ocean.normalMapFramebuffer.texture;
                this.ocean.materialOcean.uniforms.u_displacementMap.value = this.ocean.displacementMapFramebuffer.texture;
                this.ocean.materialOcean.uniforms.u_projectionMatrix.value = camera.projectionMatrix;
                this.ocean.materialOcean.uniforms.u_viewMatrix.value = camera.matrixWorldInverse;
                this.ocean.materialOcean.uniforms.u_cameraPosition.value = camera.position;
                this.ocean.materialOcean.depthTest = true;

                this.done = 1;
            }
        }

        setRenderer(renderer) {
            super.setRenderer(renderer);
        }

        getMesh() {
            super.getMesh();
            this.lastTime = (new Date()).getTime();

            return this.mesh;
        }

        getMeshCollider() {
            super.getMeshCollider();

            return this.meshCollider;
        }

        getMaterial() {
            super.getMaterial();

            return this.ocean.materialOcean;
        }
    },

    Load: {
        // Load OBJ models
        OBJ: class extends ObjectBasic {
            constructor(model, scale, position, rotation, scene) {
                super(scale, position, rotation);

                // Model
                model = {
                    'path': (!checkExist(model.path) ? "" : model.path),
                    'file': (!checkExist(model.file) ? "" : model.file),
                    'name': (!checkExist(model.name) ? "" : model.name)
                };
                if (model.path.length > 0 && model.path.substr(model.path.length - 1, 1) != "/") {
                    model.path += "/";
                }
				if (model.name == 'pista') {
					//debugger;
				}
                var $this = this;
				// Container to return the loaded object
                var container = new THREE.Object3D();

				// Variables to be used within the subfunctions
                var _material = this.material,
                    _mesh = this.mesh,
                    _scale = this.scale,
                    _position = this.position,
                    _rotation = this.rotation;

                var mtlLoader = new THREE.MTLLoader();
                mtlLoader.setPath(model.path);
                mtlLoader.load(model.file + ".mtl", function(materials) {
                    materials.preload();

                    var objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials(materials);
                    objLoader.setPath(model.path);
                    objLoader.load(model.file + ".obj",
                        // onLoad
                        function(object) {
                            object.rotation.set(_rotation.x, _rotation.y, _rotation.z);
                            object.scale.set(_scale.x, _scale.y, _scale.z);
							object.receiveShadow = true;
							object.castShadow = true;

                            container.add(object);

                            container.position.set(_position.x, _position.y, _position.z);

							container.receiveShadow = true;
							container.castShadow = true;
                        },

                        // onProgress
                        function(xhr) {
                            if (xhr.lengthComputable) {
                                var percentComplete = xhr.loaded / xhr.total * 100;
                            }
                        },

                        // onError
                        function(xhr) {}
                    );
                });

				// Copies container to the object's mesh
                this.mesh = container;

				if (model.name != '') {
					this.mesh.name = model.name;
				}
            }

            setRenderer(renderer) {
                super.setRenderer(renderer);
            }

			getPosition() {
				return this.mesh.position;
			}

            getMesh() {
                super.getMesh();

                return this.mesh;
            }

            getMeshCollider() {
                super.getMeshCollider();

                return this.meshCollider;
            }

            getMaterial() {
                super.getMaterial();

                return this.material;
            }

            getPercentComplete() {
                return this.percentComplete;
            }
        },

        // Load JSON models
		JSON: class extends ObjectBasic {
			constructor(model, scale, position, rotation) {
				super(scale, position, rotation);

				// Model
				this.modelConfig = {
					'name': (!checkExist(model.name) ? "" : model.name),
					'path': (!checkExist(model.path) ? "" : model.path),
					'file': (!checkExist(model.file) ? "" : model.file),
                    'castShadow': (!checkExist(model.castShadow) ? false : model.castShadow),
                    'friction': (!checkExist(model.friction) ? 0 : model.friction),
                    'restitution': (!checkExist(model.restitution) ? 0 : model.restitution)
				};
				if (this.modelConfig.path.length > 0 && this.modelConfig.path.substr(this.modelConfig.path.length - 1, 1) != "/") {
					this.modelConfig.path += "/";
				}

                this.up = new THREE.Vector3(0, 1, 0);
                this.dir = -5;
                this.loaded = false;

                var $this = this;
				// Container to return the loaded object
                var container = new THREE.Object3D(),
                    _material = this.material,
                    _mesh = this.mesh;

                var loader = new THREE.JSONLoader();
                loader.load(this.modelConfig.path + this.modelConfig.file, function(geometry, materials) {

                    _material = Physijs.createMaterial(
                        new THREE.MultiMaterial(materials),
                        $this.modelConfig.friction,
                        $this.modelConfig.restitution
                    );

                    container = new Physijs.ConvexMesh(geometry, _material, 100);
                    if ($this.modelConfig.name != '') {
                        container.name = $this.modelConfig.name;
                    }

                    container.velocity = new THREE.Vector3();
                    container.position.set($this.position.x, $this.position.y, $this.position.z);
                    container.rotation.set($this.rotation.x, $this.rotation.y, $this.rotation.z);
                    container.scale.set($this.scale.x, $this.scale.y, $this.scale.z);

                    container.quaternion.setFromAxisAngle($this.up, -Math.PI/2);

                    container.addEventListener('collision', function(objet) {
                        console.log(_mesh.name + " collision!");
                        if (object.mass > 0) {
                            console.log(object);
                            $this.dir *= -1;

                            container.rotation.set(0, $this.dir > 0 ? Math.PI/2 : -Math.PI/2);
                            container.__dirtyRotation = true;
                        }
                    });

                    $this.loaded = true;
                });

                this.mesh = container;
			}

			getMesh() {
				super.getMesh();

				return this.mesh;
			}

			getPosition() {
				return this.mesh.position;
			}

			getMaterial() {
				super.getMaterial();

				return this.material;
			}

            isLoaded() {
                return this.loaded;
            }
		},

		// Load MD2 models
		MD2: class extends ObjectBasic {
			constructor(modelConfig, scale, position, rotation) {
				super(null, position, rotation);

				// Model scale
				this.scale = !checkExist(scale) ? 1 : scale;

				var name = (!checkExist(modelConfig.name) ? "" : modelConfig.name);

                // Model
                modelConfig = {
					'baseUrl': (!checkExist(modelConfig.baseUrl) ? "" : modelConfig.baseUrl),
                    'body': (!checkExist(modelConfig.body) ? "" : modelConfig.body),
                    'skins': (!checkExist(modelConfig.skins) ? [] : modelConfig.skins),
                    'weapons': (!checkExist(modelConfig.weapons) ? [] : modelConfig.weapons)
                };
                if (modelConfig.baseUrl.length > 0 && modelConfig.baseUrl.substr(modelConfig.baseUrl.length - 1, 1) != "/") {
                    modelConfig.baseUrl += "/";
                }

				this.character = new THREE.MD2Character();
				this.character.scale = this.scale;

				this.playbackConfig = {
					speed: 1.0,
					wireframe: false
				};

				this.animations = [];
				this.skins = [];
				this.weapons = [];

				var $this = this;

				this.character.onLoadComplete = function() {
					// Position
					$this.character.root.position.x = $this.position.x;
					$this.character.root.position.y += $this.position.y;
					$this.character.root.position.z = $this.position.z;

					// Rotation
					$this.character.root.rotation.x = $this.rotation.x;
					$this.character.root.rotation.y = $this.rotation.y;
					$this.character.root.rotation.z = $this.rotation.z;


					$this.animations = $this.setupAnimations($this.character);
					$this.skins = $this.setupSkins($this.character);
					$this.weapons = $this.setupWeapons($this.character);

					$this.character.setAnimation($this.character.meshBody.geometry.animations[0].name);
				};

				this.character.loadParts(modelConfig);
				if (name != '') {
					this.getMesh().name = name;
				}
			}

			setupWeapons(character) {
				var generateCallback = function(index) {
						return function() { character.setWeapon(index); };
					},
					weaponConfig = [];

				for (var i=0; i<character.weapons.length; i++) {
					var name = character.weapons[i].name;

					weaponConfig[name] = generateCallback(i);
				}

				return weaponConfig;
			}

			getWeapons() {
				for (var gun in this.weapons) {
					console.log('weapons: [' + gun + ']');
				}
			}

			hideWeapon() {
				this.character.meshWeapon.visible = false;
			}

			setupSkins(character) {
				var generateCallback = function(index) {
						return function() { character.setSkin(index); };
					},
					skinConfig = [];

				for (var i=0; i<character.skinsBody.length; i++) {
					var name = character.skinsBody[i].name;

					skinConfig[name] = generateCallback(i);
				}

				return skinConfig;
			}

			getSkins() {
				for (var skin in this.skins) {
					console.log('skin: [' + skin + ']');
				}
			}

			setupAnimations(character) {
				var animations = character.meshBody.geometry.animations,
					generateCallback = function(animationClip) {
						return function() { character.setAnimation(animationClip.name); };
					},
					animationConfig = [];

				for (var i=0; i<animations.length; i++) {
					var clip = animations[i];

					animationConfig[clip.name] = generateCallback(clip);
				}

				return animationConfig;
			}

			getAnimations() {
				for (var clip in this.animations) {
					console.log('clip: [' + clip + ']');
				};
			}

			update(delta) {
				super.update();

				this.character.update(delta);
			}

			getPosition() {
				return this.character.root.position;
			}

			getObj() {
				return this.character;
			}

			setRenderer(renderer) {
				super.setRenderer(renderer);
			}

			getMesh() {
				super.getMesh();

				return this.character.root;
			}

			getMeshCollider() {
				super.getMeshCollider();

				return this.meshCollider;
			}

			getMaterial() {
				super.getMaterial();

				return this.material;
			}
		},

		// Load Complex MD2 models
		MD2Complex: class extends ObjectBasic {
			constructor(modelConfig, scale, position, rotation, controls) {
				super(null, position, rotation);

				controls = (!checkExist(controls) ? {
					moveForward: false,
					moveBackward: false,
					moveLeft: false,
					moveRight: false
				} : controls);

				// Model scale
				this.scale = !checkExist(scale) ? 1 : scale;

                // Model
                modelConfig = {
					'baseUrl': (!checkExist(modelConfig.baseUrl) ? "" : modelConfig.baseUrl),
                    'body': (!checkExist(modelConfig.body) ? "" : modelConfig.body),
                    'skins': (!checkExist(modelConfig.skins) ? [] : modelConfig.skins),
                    'weapons': (!checkExist(modelConfig.weapons) ? [] : modelConfig.weapons),
					'animations': (!checkExist(modelConfig.animations) ? {
							'move': "run",
							'idle': "stand",
							'jump': "jump",
							'attack': "attack",
							'crouchMove': "cwalk",
							'crouchIdle': "cstand",
							'crouchAttach': "crattack"
						} : modelConfig.animations),
					'walkSpped': (!checkExist(modelConfig.walkSpped) ? 1 : modelConfig.walkSpped),
					'crouchSpeed': (!checkExist(modelConfig.crouchSpeed) ? 1 : modelConfig.crouchSpeed)
                };
                if (modelConfig.baseUrl.length > 0 && modelConfig.baseUrl.substr(modelConfig.baseUrl.length - 1, 1) != "/") {
                    modelConfig.baseUrl += "/";
                }

				this.character = new THREE.MD2CharacterComplex();
				this.character.scale = this.scale;
				this.character.controls = controls;

				// Position
				this.character.root.position.x = this.position.x;
				this.character.root.position.y = this.position.y;
				this.character.root.position.z = this.position.z;

				// Rotation
				this.character.root.rotation.x = this.rotation.x;
				this.character.root.rotation.y = this.rotation.y;
				this.character.root.rotation.z = this.rotation.z;

				var container = this.character;

				this.character.onLoadComplete = function() {
					// Cast and receive shadows
					container.enableShadows(true);
					container.setWeapon(0);
					container.setSkin(0);

					container.setAnimation(container.meshBody.geometry.animations[0].name);
				};
				this.character = container;

				this.character.loadParts(modelConfig);
			}

			update(delta) {
				super.update();

				this.character.update(delta);
			}

			getObj() {
				return this.character;
			}

			setRenderer(renderer) {
				super.setRenderer(renderer);
			}

			getMesh() {
				super.getMesh();

				return this.character.root;
			}

			getMeshCollider() {
				super.getMeshCollider();

				return this.meshCollider;
			}

			getMaterial() {
				super.getMaterial();

				return this.material;
			}
		}
    }
};

// ComplexObjects namespace
var ComplexObjects = {
    Placard: class extends ObjectBasic {
        constructor(params, position, rotation) {
            super(null, position, rotation);

            if (!checkExist(params)) {
                params = {
                    color: 0xffffff,
                    intensity: 1.0,
                    distance: 0.0,
                    spotIntensity: 1.0,
                    spotDistance: 0.0,
                    angle: 0.314,
                    penumbra: 0.0,
                    decay: 1.0,
                    shadow: false
                };
            } else {
                params.color = checkExist(params.color) ? params.color : 0xffffff;
                params.intensity = checkExist(params.intensity) ? params.intensity : 1.0;
                params.distance = checkExist(params.distance) ? params.distance : 1.0;
            }

            // SpotLight parameters
            let spotParams = {
                    intensity: checkExist(params.spotIntensity) ? params.spotIntensity : 1.0,
                    distance: checkExist(params.spotDistance) ? params.spotDistance : 0.0,
                    angle: checkExist(params.angle) ? params.angle : Math.PI/3,
                    penumbra: checkExist(params.penumbra) ? params.penumbra : 0,
                    decay: checkExist(params.decay) ? params.decay : 1,
                    shadow: checkExist(params.shadow) ? params.shadow : false
               };

            // Build Lines
            let Line1 = this.buildLine(params.color, params.intensity, params.distance, spotParams, 0.0);
            let Line2 = this.buildLine(params.color, params.intensity, params.distance, spotParams, -82.00);
            let Line3 = this.buildLine(params.color, params.intensity, params.distance, spotParams, -173.00);
            let Line4 = this.buildLine(params.color, params.intensity, params.distance, spotParams, -267.00);

            // Build Placard
            this.placard = new THREE.Group();

            // Add Placard Lines
            this.placard.add(Line1);
            this.placard.add(Line2);
            this.placard.add(Line3);
            this.placard.add(Line4);

            // Position and rotate the placard
            this.placard.position.set(4258.85, 2076.09, 7713.03);
            this.placard.rotation.set(0, 0, 0);
            this.placard.position.set(position.x, position.y, position.z);
            this.placard.rotation.set(rotation.x, rotation.y, rotation.z);
        }

        update() {
            super.update();
        }

        getMesh() {
            super.getMesh();

            return this.placard;
        }

        buildLine(color, intensity, distance, spotParams, posY) {
            let placardLine = new THREE.Group();
            placardLine.position.set(0, posY, 0);
            placardLine.rotation.set(0, 0, 0);

            // Point of Light Col1
            let PL_1 = new Lights.PointLight(color, intensity, distance, {x: 0.0, y: 0.0, z: 0.0});
            placardLine.add(PL_1.getMesh());

            // Point of Light Col2
            let PL_2 = new Lights.PointLight(color, intensity, distance, {x: -89.00, y: 0.0, z: 0.0});
            placardLine.add(PL_2.getMesh());


            // Point of Light Col3
            let PL_3 = new Lights.PointLight(color, intensity, distance, {x: -168.00, y: 0.0, z: 0.0});
            placardLine.add(PL_3.getMesh());

            // Point of Light Col4
            let PL_4 = new Lights.PointLight(color, intensity, distance, {x: -246.00, y: 0.0, z: 0.0});
            placardLine.add(PL_4.getMesh());

            // Point of Light Col5
            let PL_5 = new Lights.PointLight(color, intensity, distance, {x: -328.00, y: 0.0, z: 0.0});
            placardLine.add(PL_5.getMesh());

            // Point of Light Col6
            let PL_6 = new Lights.PointLight(color, intensity, distance, {x: -409.00, y: 0.0, z: 0.0});
            placardLine.add(PL_6.getMesh());

            // Point of Light Col7
            let PL_7 = new Lights.PointLight(color, intensity, distance, {x: -493.00, y: 0.0, z: 0.0});
            placardLine.add(PL_7.getMesh());

            // Point of Light Col8
            let PL_8 = new Lights.PointLight(color, intensity, distance, {x: -574.00, y: 0.0, z: 0.0});
            placardLine.add(PL_8.getMesh());

            // Point of Light Col9
            let PL_9 = new Lights.PointLight(color, intensity, distance, {x: -656.00, y: 0.0, z: 0.0});
            placardLine.add(PL_9.getMesh());

            // Point of Light Col10
            let PL_10 = new Lights.PointLight(color, intensity, distance, {x: -736.00, y: 0.0, z: 0.0});
            placardLine.add(PL_10.getMesh());

            // Point of Light Col11
            let PL_11 = new Lights.PointLight(color, intensity, distance, {x: -819.00, y: 0.0, z: 0.0});
            placardLine.add(PL_11.getMesh());

            // Point of Light Col12
            let PL_12 = new Lights.PointLight(color, intensity, distance, {x: -905.00, y: 0.0, z: 0.0});
            placardLine.add(PL_12.getMesh());

            return placardLine;
        }
    }
}

// PlayableObjects namespace
var PlayableObjects = {
    // Luminaris
    Luminaris: class extends ObjectBasic {
        constructor(name, camName, scale, position, rotation) {
            super(null, position, rotation);

            // Model scale
            this.scale = !checkExist(scale) ? 1 : scale;

            this.name = (!checkExist(name) ? "" : name);
            this.camName = (!checkExist(camName) ? "" : camName);
			this.fov = 60;

			this.playerMesh = new THREE.Object3D();
			this.playerMesh.position.set(this.position.x, this.position.y, this.position.z);
			this.playerMesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
			this.playerMesh.name = this.name;

            this.obj = new Objects.Load.MD2(
				// Model config
				{
					//name: this.name,
					baseUrl: "assets/models/md2/luminaris/",
					body: "luminaris.md2",
					skins: [
						"luminaris_diffuse.png",
					],
					weapons: [
					]
				},
				this.scale,			// Scale
				{x: 0, y: 27.34, z: -42.04},		// Position
				{x: 0, y: 0, z: 0}		// Rotation
			);

			this.controls = {
				moveForward: false,
				moveBackward: false,
				moveLeft: false,
				moveRight: false
			};

			// Set Max's first
			this.setMaxSpeed(0.002);
			this.setMaxAccel(0.0005);
			this.setMaxLateralSpeed(0.0001);
			this.setMaxLateralAccel(0.00005);

			// Set actual
			this.setSpeed(0.002);
			this.setAcceleration(0);
			this.setLateralSpeed(0);
			this.setLateralAcceleration(0);
        }

        update(delta) {
            super.update();

            this.obj.update(delta);
			var pos = this.getPosition();
			this.helper.position.set(pos.x, pos.y, pos.z);
        }

        setSpline(spline) {
            super.setSpline(spline, new THREE.Vector3(0, 0, 1));
        }

		getPosition() {
			return this.obj.getMesh().position;
		}

        getMesh() {
            super.getMesh();
			var mesh = this.obj.getMesh();
			//mesh.visible = false;

			if (mesh != null) {
				this.playerMesh.add(mesh);

				// Camera Object
				var fov = this.fov,
					aspect = window.innerWidth / window.innerHeight,
					near = 0.1,
					far = 100000.00;
				var playerCam = new THREE.PerspectiveCamera(fov, aspect, near, far);
				playerCam.name = this.camName;
				playerCam.up = new THREE.Vector3(0, 1, 0);
				// Rotation
				playerCam.rotation.set(grausToRadianos(-168.67), grausToRadianos(0.00), grausToRadianos(-180.00));
				// Position
				playerCam.position.set(51.85, 597.53, -1095.59);

				this.playerMesh.add(playerCam);
			}

			if (!checkExist(this.helper)) {
				this.helper = new THREE.WireframeHelper(mesh);
				this.helper.material.color.set(0xff00ff);
				this.helper.scale.set(100, 100, 100);
				this.helper.position.set(this.position.x, this.position.y, this.position.z);
				this.helper.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), grausToRadianos(-90));
			}

            return this.playerMesh;
        }

        getMeshCollider() {
            super.getMeshCollider();

            return this.obj.getMeshCollider();
        }

        getMaterial() {
            super.getMaterial();

            return this.obj.getMaterial();
        }
    },

    // SimpleShip
    SimpleShip: class extends ObjectBasic {
        constructor(name, camName, scale, position, rotation) {
            super(scale, position, rotation);

            this.name = (!checkExist(name) ? "" : name);
            this.camName = (!checkExist(camName) ? "" : camName);
			this.fov = 60;

			this.playerMesh = new THREE.Object3D();
			this.playerMesh.position.set(this.position.x, this.position.y, this.position.z);
			this.playerMesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
			this.playerMesh.name = this.name;

			this.obj = new Objects.Load.OBJ(
				{ 						// Model
					'path': "assets/models/player_ship/",
					'file': "player_ship",
                    //'name': this.name
				},
				this.scale, 	// Scale
				{x: 0, y: 0, z: 0},	// Position
				{x: 0, y: 0, z: 0} 	// Rotation
			);

			// Set Max's first
			this.setMaxSpeed(0.001);
			this.setMaxAccel(0.0003);
			this.setMaxLateralSpeed(0.0001);
			this.setMaxLateralAccel(0.00005);

			// Set actual
			this.setSpeed(0.001);
			this.setAcceleration(0);
			this.setLateralSpeed(0);
			this.setLateralAcceleration(0);
        }

        update(delta) {
            super.update();

            this.obj.update(delta);
			var pos = this.getPosition();

			this.helper.position.set(pos.x, pos.y, pos.z);
        }

		getPosition() {
			return this.obj.getMesh().position;
		}

        setSpline(spline) {
            super.setSpline(spline, new THREE.Vector3(0, 0, 1));
        }

        getMesh() {
            super.getMesh();
			var mesh = this.obj.getMesh();

			if (mesh != null) {
				this.playerMesh.add(mesh);

				// Camera Object
				var fov = this.fov,
					aspect = window.innerWidth / window.innerHeight,
					near = 0.1,
					far = 100000.00;
				var playerCam = new THREE.PerspectiveCamera(fov, aspect, near, far);
				playerCam.name = this.camName;
				playerCam.up = new THREE.Vector3(0, 1, 0);
				// Rotation
				playerCam.rotation.set(grausToRadianos(-168.67), grausToRadianos(0.00), grausToRadianos(-180.00));
				// Position
				playerCam.position.set(51.85, 597.53, -1095.59);

				this.playerMesh.add(playerCam);
			}

			if (!checkExist(this.helper)) {
				this.helper = new THREE.WireframeHelper(mesh);
				this.helper.material.color.set(0xff00ff);
			}

            return this.playerMesh;
        }

        getMeshCollider() {
            super.getMeshCollider();

            return this.obj.getMeshCollider();
        }

        getMaterial() {
            super.getMaterial();

            return this.obj.getMaterial();
        }
    },

    // Ratamahatta
    Ratamahatta: class extends ObjectBasic {
        constructor(name, scale, position, rotation) {
            super(null, position, rotation);

            this.name = (!checkExist(name) ? "" : name);

            // Model scale
            this.scale = !checkExist(scale) ? 1 : scale;

			this.obj = new Objects.Load.MD2(
				// Model config
				{
                    name: this.name,
					baseUrl: "assets/models/md2/ratamahatta/",
					body: "ratamahatta.md2",
					skins: [
						"ctf_r.png",
						"ratamahatta.png",
						"ctf_b.png",
						"dead.png",
						"gearwhore.png"
					],
					weapons: [
						["weapon.md2", "weapon.png"],
						["w_bfg.md2", "w_bfg.png"],
						["w_blaster.md2", "w_blaster.png"],
						["w_chaingun.md2", "w_chaingun.png"],
						["w_glauncher.md2", "w_glauncher.png"],
						["w_hyperblaster.md2", "w_hyperblaster.png"],
						["w_machinegun.md2", "w_machinegun.png"],
						["w_railgun.md2", "w_railgun.png"],
						["w_rlauncher.md2", "w_rlauncher.png"],
						["w_shotgun.md2", "w_shotgun.png"],
						["w_sshotgun.md2", "w_sshotgun.png"],
					]
				},
				this.scale,		// Scale
				this.position,	// Position
				this.rotation	// Rotation
			);
        }

        update(delta) {
            super.update();

            this.obj.update(delta);
        }

		getPosition() {
			return this.obj.getMesh().position;
		}

        getMesh() {
            super.getMesh();

            return this.obj.getMesh();
        }

        getMeshCollider() {
            super.getMeshCollider();

            return this.obj.getMeshCollider();
        }

        getMaterial() {
            super.getMaterial();

            return this.obj.getMaterial();
        }
    }
};