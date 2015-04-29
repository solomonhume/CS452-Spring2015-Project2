
// --------------------------------------------- //
// ------- WebGL PONG built with Three.JS 
// ------- Created by Jiaju Huang  
// ------- jiajhua@clarkson.edu    
// ------- 0530537       


// scene object variables
var renderer, scene, camera, pointLight, spotLight;

var fieldWidth = 400, fieldHeight = 200;

// paddle variables
var paddleWidth, paddleHeight, paddleDepth, paddleQuality;
var paddle1DirY = 0, paddle2DirY = 0, paddleSpeed = 2.5;

// ball variables
var ball, paddle1, paddle2;
var ballDirX = 1, ballDirY = Math.random()*2, ballSpeed = 2+Math.random()*2;

// game-related variables
var score1 = 0, score2 = 0;
// you can change this to any natural number
var maxScore = 5;

function setup()
{
	document.getElementById("winnerBoard").innerHTML = "Get score " + maxScore + " to win!";
	
	score1 = 0;
	score2 = 0;	
	createScene();
	draw();
}

function createScene()
{
	var WIDTH = 1024,
	  HEIGHT = 768;

	// set some camera attributes
	var VIEW_ANGLE = 40+Math.random()*40,
	  ASPECT = WIDTH / HEIGHT,
	  NEAR = 0.1,
	  FAR = 1000;

	var c = document.getElementById("gameCanvas");

	// create a WebGL renderer, camera
	// and a scene
	renderer = new THREE.WebGLRenderer();
	camera = new THREE.PerspectiveCamera(
		VIEW_ANGLE,ASPECT, NEAR, FAR);

	scene = new THREE.Scene();

	scene.add(camera);
	
	camera.position.z = 300;
	renderer.setSize(WIDTH, HEIGHT);
	// attach the render-supplied DOM element
	c.appendChild(renderer.domElement);

	// set up the playing surface plane 
	var planeWidth = fieldWidth,
		planeHeight = fieldHeight,
		planeQuality = 10;
		
	// create the paddle1's material
	var paddle1Material =
	  new THREE.MeshLambertMaterial(
		{color: 0x1B00C0});
	// create the paddle2's material
	var paddle2Material =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xFF0000
		});
	// create the plane's material	
	var planeMaterial =
	  new THREE.MeshLambertMaterial(
		{color: 0x008100});
	// create the table's material
	var tableMaterial =
	  new THREE.MeshLambertMaterial({ color: 0x111111});
	// create the pillar's material
	var pillarMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x555500
		});
	// create the ground's material
	var groundMaterial =
	  new THREE.MeshLambertMaterial(
		{color: 0x888888});
	// create the playing surface plane
	var plane = new THREE.Mesh(

	  new THREE.PlaneGeometry(
		planeWidth * 0.95,
		planeHeight,
		planeQuality,
		planeQuality),
	  planeMaterial);
	  
	scene.add(plane);
	plane.receiveShadow = true;	
	
	var table = new THREE.Mesh(

	  new THREE.CubeGeometry(
		planeWidth * 1.05,	
		planeHeight * 1.05,
		100,				
		planeQuality,
		planeQuality,
		1),tableMaterial);
	table.position.z = -51;	
	scene.add(table);
	table.receiveShadow = true;	
		
	// // set up the sphere vars
	// lower 'segment' and 'ring' values will increase performance
	var radius = 5,
		segments = 6,
		rings = 6;
		
	// // create the sphere's material
	var sphereMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xFF00FF
		});
		
	// Create a ball with sphere geometry
	ball = new THREE.Mesh(

	  new THREE.SphereGeometry(
		radius,
		segments,
		rings),

	  sphereMaterial);

	// // add the sphere to the scene
	scene.add(ball);
	
	ball.position.x = 0;
	ball.position.y = 0;
	// set ball above the table surface
	ball.position.z = radius;
	ball.receiveShadow = true;
    ball.castShadow = true;
	
	// // set up the paddle vars
	paddleWidth = 10;
	paddleHeight = 30;
	paddleDepth = 10;
	paddleQuality = 1;
		
	paddle1 = new THREE.Mesh(

	  new THREE.CubeGeometry(
		paddleWidth,
		paddleHeight,
		paddleDepth,
		paddleQuality,
		paddleQuality,
		paddleQuality),

	  paddle1Material);

	// // add the sphere to the scene
	scene.add(paddle1);
	paddle1.receiveShadow = true;
    paddle1.castShadow = true;
	
	paddle2 = new THREE.Mesh(

	  new THREE.CubeGeometry(
		paddleWidth,
		paddleHeight,
		paddleDepth,
		paddleQuality,
		paddleQuality,
		paddleQuality),

	  paddle2Material);
	  
	// // add the sphere to the scene
	scene.add(paddle2);
	paddle2.receiveShadow = true;
    paddle2.castShadow = true;	
	
	// set paddles on each side of the table
	paddle1.position.x = -fieldWidth/2 + paddleWidth;
	paddle2.position.x = fieldWidth/2 - paddleWidth;
	
	// lift paddles over playing surface
	paddle1.position.z = paddleDepth;
	paddle2.position.z = paddleDepth;
		
	// we iterate 6 to create pillars to show off shadows
	for (var i = 0; i < 3; i++)
	{
		for (var j =0; j<2; j++)
		{var backdrop = new THREE.Mesh(
		
		  new THREE.CubeGeometry( 
		  30, 30, 300, 1, 1, 1 ),pillarMaterial);
		  
		backdrop.position.x = -50 + i * 200;
		backdrop.position.y = 200-400*j;
		backdrop.position.z = -30;		
		backdrop.castShadow = true;
		backdrop.receiveShadow = true;		  
		scene.add(backdrop);}	
	}

	
	// add a ground to show shadows
	var ground = new THREE.Mesh(

	  new THREE.CubeGeometry( 1000, 1000,  3, 1, 1,1 ),

	  groundMaterial);
	ground.position.z = -100;
	ground.receiveShadow = true;	
	scene.add(ground);		
		
	pointLight =new THREE.PointLight(0xF8D898);

	pointLight.position.x = -1000;
	pointLight.position.y = 0;
	pointLight.position.z = 1000;
	pointLight.intensity = 3;
	pointLight.distance = 10000;

	scene.add(pointLight);
		
    spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(0, 0, 460);
    spotLight.intensity = 1.5;
    spotLight.castShadow = true;
    scene.add(spotLight);
	
	renderer.shadowMapEnabled = true;		
}

function draw()
{	
	// draw THREE.JS scene
	renderer.render(scene, camera);
	requestAnimationFrame(draw);
	
	ballPhysics();
	paddlePhysics();
	cameraPhysics();
	playerPaddleMovement();
	opponentPaddleMovement();
}

function ballPhysics()
{
	// if ball goes off the Player's side
	if (ball.position.x <= -fieldWidth/2)
	{	
		// CPU scores
		score2++;
		// update scoreboard HTML
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		// reset ball to center
		resetBall(2);
		matchScoreCheck();	
	}
	
	// if ball goes off the CPU's side
	if (ball.position.x >= fieldWidth/2)
	{	
		score1++;
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		resetBall(1);
		matchScoreCheck();	
	}
	
	// bounce if the ball touch the side walls
	if (ball.position.y <= -fieldHeight/2 ||ball.position.y >= fieldHeight/2)
	{	ballDirY = -ballDirY;}	
	
	// update ball position over time
	ball.position.x += ballDirX * ballSpeed;
	ball.position.y += ballDirY * ballSpeed;
	}

// Handles CPU paddle movement and logic
function opponentPaddleMovement()
{
	paddle2DirY = (ball.position.y - paddle2.position.y) * 0.9;
	
	if (Math.abs(paddle2DirY) <= paddleSpeed)
	{	paddle2.position.y += paddle2DirY;}
	else
	{
		if (paddle2DirY > paddleSpeed)
		{paddle2.position.y += paddleSpeed;}
		else if (paddle2DirY < -paddleSpeed)
		{paddle2.position.y -= paddleSpeed;}
	}
}


// Handles player's keyboard input
function playerPaddleMovement()
{
	if (Key.isDown(Key.A))		
	{
		// move if paddle is not touching the side of table
		if (paddle1.position.y < fieldHeight * 0.45)
		{paddle1DirY = paddleSpeed * 0.5;}
		else {paddle1DirY = 0;}
	}	
	else if (Key.isDown(Key.D))
	{
		if (paddle1.position.y > -fieldHeight * 0.45)
		{	paddle1DirY = -paddleSpeed * 0.5;	}
		else	{paddle1DirY = 0;	}
	}
	// else don't move paddle
	else
	{paddle1DirY = 0;}
	
	paddle1.position.y += paddle1DirY;
}

// Handles camera and lighting logic
function cameraPhysics()
{
	spotLight.position.x = ball.position.x * 2;
	spotLight.position.y = ball.position.y * 2;
	
	// move to behind the player's paddle
	camera.position.x = paddle1.position.x - 100;
	camera.position.y += (paddle1.position.y - camera.position.y) * 0.05;
	camera.position.z = paddle1.position.z + 100 + 0.04 * (-ball.position.x + paddle1.position.x);
	
	// rotate to face towards the opponent
	camera.rotation.x = -0.01 * (ball.position.y) * Math.PI/180;
	camera.rotation.y = -60 * Math.PI/180;
	camera.rotation.z = -90 * Math.PI/180;
}

// Handles paddle collision logic
function paddlePhysics()
{
	// PLAYER PADDLE LOGIC
	// If the x coordinate of the ball and pad1 can touch
	if (ball.position.x <= paddle1.position.x + paddleWidth
	&&  ball.position.x >= paddle1.position.x)
	{
		// and if the y coordinate of the ball can pad1 can touch
		if (ball.position.y <= paddle1.position.y + paddleHeight/2
		&&  ball.position.y >= paddle1.position.y - paddleHeight/2)
		{
			// and if ball is travelling towards player (-ve direction)
			if (ballDirX < 0)
			{
				// switch direction of ball travel to create bounce
				ballDirX = -ballDirX;
				// we impact ball angle when hitting it
				// this is not realistic physics, just spices up the gameplay
				// allows you to 'slice' the ball to beat the opponent
				ballDirY -= paddle1DirY * 0.8;
			}
		}
	}
	
	// OPPONENT PADDLE LOGIC	
	
	if (ball.position.x <= paddle2.position.x + paddleWidth
	&&  ball.position.x >= paddle2.position.x)
	{
		// and if ball is aligned with paddle2 on y plane
		if (ball.position.y <= paddle2.position.y + paddleHeight/2
		&&  ball.position.y >= paddle2.position.y - paddleHeight/2)
		{
			// and if ball is travelling towards opponent 
			if (ballDirX > 0)
			{
				// switch direction of ball travel to create bounce
				ballDirX = -ballDirX;
				//  impact ball angle when hitting it
				ballDirY -= paddle2DirY * 0.3;
			}
		}
	}
}

function resetBall(loser)
{
	// position the ball in the center of the table
	ball.position.x = 0;
	ball.position.y = 0;
	
	// ball move towards the one who just scored
	if (loser == 1){ballDirX = -1;}
	else {ballDirX = 1;}
	
	// set the ball to move +ve in y plane (towards left from the camera)
	ballDirY = 1;
}

var bounceTime = 0;

function matchScoreCheck()
{
	// if player has winning points
	if (score1 >= maxScore)
	{
		ballSpeed = 0;
		document.getElementById("scores").innerHTML = "Player wins "+score1 +":"+ score2;		
		document.getElementById("winnerBoard").innerHTML = "You win! Click to play again";
	}
	// else if opponent has winning points
	else if (score2 >= maxScore)
	{
		ballSpeed = 0;
		document.getElementById("scores").innerHTML = "Player loses "+score1 +":"+ score2;
		document.getElementById("winnerBoard").innerHTML = 'You lose! Click to restart...'
	}
}
