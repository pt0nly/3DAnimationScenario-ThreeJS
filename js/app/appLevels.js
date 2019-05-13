var Levels = {
    totalLevels: 1,
    curLevel: 1,
    level: [
        [
            new Skybox.Dome(
                'sky', 43750, 60, 60,
                {x: 150, y: 0, z: 0},               // Position
                {x: 0, y: 2 * Math.PI / 3, z: 0},   // Rotation
                'assets/textures/skydome/hdrmaps_com_free_004_tonemapped.jpg'
            ),
            new Lights.AmbientLight( 0xffffff, 0.4 ),

            // Sun (in the sky)
            new Lights.PointLight(
                0x0033ff,
                3,
                150,
                {x: -13589.79, y: -13589.79, z: -13589.79}  // Position
            ),
            // Sun (from below the ground)
			new Lights.DirectionalLight(
                0xffffff,
                0.5,
                {cast: false, near: 20, far: 6000},
                {x: 21374.85, y: -16116.73, z: 34891.54},   // Position
                {x: 4443.21, y: 1083.76, z: 992.83}         // Target
			),

            new Objects.Load.OBJ(
				{ // Model
                    'path': "assets/models/Luigi_Circuit/",
                    'file': "Luigi_Circuit4",
					'name': 'pista'
                },
				{ x: 25, y: 25, z: 25 }, // Scale
                { x: 0, y: 0, z: 0 }, // Position
                { x: grausToRadianos(0), y: grausToRadianos(0), z: grausToRadianos(0) } // Rotation
            ),
            new Objects.Spline([
                new THREE.Vector3(6942.74, 277.24, 4949.47),
                new THREE.Vector3(1203.97, 421.20, 4838.28),
                new THREE.Vector3(545.19, 456.27, 4087.89),
                new THREE.Vector3(-120.10, 681.18, 940.81),
                new THREE.Vector3(-1546.23, 916.98, -1260.39),
                //6
                new THREE.Vector3(-1526.25, 968.92, -2129.83),
                new THREE.Vector3(-716.93, 983.23, -3143.21),
                new THREE.Vector3(270.05, 978.54, -3833.56),
                new THREE.Vector3(1076.48, 900.96, -3797.00),
                new THREE.Vector3(1932.81, 813.98, -3122.27),
                //10
                new THREE.Vector3(5273.93, 418.05, -99.80),
                new THREE.Vector3(6882.45, 418.05, 1283.26),
                new THREE.Vector3(8149.85, 276.99, 1435.93),
                new THREE.Vector3(11025.80, 296.10, 1469.27),
                new THREE.Vector3(12083.66, 308.35, 2100.57),
                //16
                new THREE.Vector3(12385.47, 297.43, 3266.65),
                new THREE.Vector3(11716.11, 300.20, 4500.51),
                new THREE.Vector3(10307.78, 288.26, 4930.90),
                new THREE.Vector3(6942.74, 277.24, 4949.47)
            ]),
			// PointLight
			new Lights.PointLight(
				0x0033ff,
				3,
				1300,
				{x: 1972.15, y: 530.64, z: 164.99}  // Position
			),
			// Podium
			new Objects.Load.OBJ(
				{ 						// Model
					'path': "assets/models/space-podium/",
					'file': "space-podium",
				},
				{x: 100, y: 100, z: 100}, 					// Scale
				{x: 1972.15, y: 1134.29, z: 164.99}, 		// Position
				{x: grausToRadianos(0), y: grausToRadianos(0), z: grausToRadianos(0)} 	// Rotation
			),

			// Playable Characters

			// Monster - Ratamahatta
            new PlayableObjects.Ratamahatta(
                'monster1',                                                             // Name
                20,                                                                     // Scale
                {x: 1902.15, y: 1223.29, z: 94.99},                                     // Position
                {x: grausToRadianos(0), y: grausToRadianos(0), z: grausToRadianos(0)}   // Rotation
            ),
			// Player Ship - Luminaris
            new PlayableObjects.Luminaris(
                'player1',                      // Name
				'p1Cam', 						// Cam Name
                6.75,                              // Scale
                {x: -16.28, y: 1223.29, z: 0},  // Position
                {x: grausToRadianos(0), y: grausToRadianos(0), z: grausToRadianos(0)}   // Rotation
            ),
			// Player Ship - SimpleShip
            new PlayableObjects.SimpleShip(
                'player2',      				// Name
				'p2Cam', 						// Cam Name
                {x: 3, y: 3, z: 3},             // Scale
                {x: -16.28, y: 1223.29, z: 0},  // Position
                {x: grausToRadianos(0), y: grausToRadianos(0), z: grausToRadianos(0)}   // Rotation
            )
       ]
    ]
}