class LightBasic {
	constructor(color, intensity, position) {
		// Position
		this.position = (!checkExist(position) ? { x: 0, y: 0, z: 0 } : position);
		if (!checkExist(this.position.x)) this.position.x = 0;
		if (!checkExist(this.position.y)) this.position.y = 0;
		if (!checkExist(this.position.z)) this.position.z = 0;

		// Color
		this.color = !checkExist(color) ? 0xffffff : color;

		// Intensity
		this.intensity = !checkExist(color) ? 1 : intensity;

		this.loaded = true;
		this.added = false;
	}

	isHelper() {
		return checkExist(this.helper);
	}

	getHelper() {
		return this.helper;
	}

	getMesh() {}

	getName() {
		var name = '';
		if (checkExist(this.getMesh()) && checkExist(this.getMesh().name)) {
			name = this.getMesh().name;
		}

		return name;
	}

	isLoaded() {
		return this.loaded;
	}

	setAdded() {
		this.added = true;
	}

	isAdded() {
		return this.added;
	}
}



var Lights = {
	// SpotLight
	SpotLight: class extends LightBasic {
		constructor(light, position, shadow, target) {
			super(null, null, position);

			if (typeof(light) == 'undefined' || light == null) {
				light = {
					color: 0xffffff,
					intensity: 1,
					distance: 0.0,
					angle: Math.PI/3,
					penumbra: 0,
					decay: 1
				};
			} else {
				if (typeof(light.color) == 'undefined' || light.color == null) {
					light.color = 0xffffff;
				}
				if (typeof(light.intensity) == 'undefined' || light.intensity == null) {
					light.intensity = 1;
				}
				if (typeof(light.distance) == 'undefined' || light.distance == null) {
					light.distance = 0.0;
				}
				if (typeof(light.angle) == 'undefined' || light.angle == null) {
					light.angle = Math.PI/3;;
				}
				if (typeof(light.penumbra) == 'undefined' || light.penumbra == null) {
					light.penumbra = 0;
				}
				if (typeof(light.decay) == 'undefined' || light.decay == null) {
					light.decay = 1;
				}
			}

			// Shadow
			shadow = (typeof(shadow) == 'undefined' || shadow == null ? {near: 20, far: 50, cast: false} : shadow);
			shadow.near = (typeof(shadow.near) == 'undefined' || shadow.near == null ? 20 : shadow.near);
			shadow.far = (typeof(shadow.far) == 'undefined' || shadow.far == null ? 50 : shadow.far);
			shadow.cast = (typeof(shadow.cast) == 'undefined' || shadow.cast == null ? false : shadow.cast);

			this._spotLight = new THREE.SpotLight(
				light.color,
				light.intensity,
				light.distance,
				light.angle,
				light.penumbra,
				light.decay
			);
			this._spotLight.position.set(this.position.x, this.position.y, this.position.z);
			this._spotLight.shadow.camera.near = shadow.near;
			this._spotLight.shadow.camera.far = shadow.far;
			this._spotLight.shadow.camera.fov = 30;
			this._spotLight.castShadow = shadow.cast;
			this._spotLight.shadowCameraVisible = true;

			if (checkExist(target)) {
				// Target
				this.target = target;
				if (!checkExist(this.target.x)) this.target.x = 0;
				if (!checkExist(this.target.y)) this.target.y = 0;
				if (!checkExist(this.target.z)) this.target.z = 0;

				this._spotLight.target.position.set(this.target.x, this.target.y, this.target.z);
				this._spotLight.target.updateMatrixWorld();
			}

			this.lightShadowHelper = new THREE.CameraHelper(this._spotLight.shadow.camera);
			this.lightHelper = new THREE.SpotLightHelper(this._spotLight, 50);
		}

		update() { }

		getMesh() {
			return this._spotLight;
		}

		getHelper() {
			super.getHelper();

			return this.lightHelper;
		}

		getShadowHelper() {
			return this.lightShadowHelper;
		}
	},

	// PointLight
	PointLight: class extends LightBasic {
		constructor(color, intensity, distance, position) {
			super(color, intensity, position);

			this._pointLight = new THREE.PointLight(this.color, this.intensity, distance);
			this._pointLight.position.set(this.position.x, this.position.y, this.position.z);

			this.lightShadowHelper = new THREE.CameraHelper(this._pointLight.shadow.camera);
			this.lightHelper = new THREE.PointLightHelper(this._pointLight, 50);
		}

		update() { }

		getMesh() {
			return this._pointLight;
		}

		getHelper() {
			super.getHelper();

			return this.lightHelper;
		}

		getShadowHelper() {
			return this.lightShadowHelper;
		}
	},

	// DirectionalLight
	DirectionalLight: class extends LightBasic {
		constructor(color, intensity, shadow, position, target) {
			super(color, intensity, position);

			// Shadow
			shadow = (checkExist(shadow) ? shadow : {near: 20, far: 50, cast: false});
			shadow.near = (checkExist(shadow.near) ? shadow.near : 0.5);
			shadow.far = (checkExist(shadow.far) ? shadow.far : 500);
			shadow.cast = (checkExist(shadow.cast) ? shadow.cast : false);
			shadow.mapSizeWidth = (checkExist(shadow.mapSizeWidth) ? shadow.mapSizeWidth : 512);
			shadow.mapSizeHeight = (checkExist(shadow.mapSizeHeight) ? shadow.mapSizeHeight : 512);

			this._directionalLight = new THREE.DirectionalLight(this.color, this.intensity);
			this._directionalLight.position.set(this.position.x, this.position.y, this.position.z);

			this._directionalLight.castShadow = shadow.cast;
			this._directionalLight.shadow.mapSize.width = shadow.mapSizeWidth;
			this._directionalLight.shadow.mapSize.height = shadow.mapSizeHeight;
			this._directionalLight.shadow.camera.near = shadow.near;
			this._directionalLight.shadow.camera.far = shadow.far;

			if (checkExist(target)) {
				// Target
				this.target = target;
				if (!checkExist(this.target.x)) this.target.x = 0;
				if (!checkExist(this.target.y)) this.target.y = 0;
				if (!checkExist(this.target.z)) this.target.z = 0;

				this._directionalLight.target.position.set(this.target.x, this.target.y, this.target.z);
				this._directionalLight.target.updateMatrixWorld();
			}

			this.lightShadowHelper = new THREE.CameraHelper(this._directionalLight.shadow.camera);
			this.lightHelper = new THREE.DirectionalLightHelper(this._directionalLight, 50);
		}

		update() { }

		getMesh() {
			return this._directionalLight;
		}

		getHelper() {
			super.getHelper();

			return this.lightHelper;
		}

		getShadowHelper() {
			return this.lightShadowHelper;
		}
	},

	// AmbientLight
	AmbientLight: class extends LightBasic {
		constructor(color, intensity) {
			super(color, intensity);

			this._ambientLight = new THREE.AmbientLight(this.color, this.intensity);
		}

		update() { }

		getMesh() {
			return this._ambientLight;
		}

		getHelper() {
			super.getHelper();

			return null;
		}
	}
};
