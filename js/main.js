//var THREE = require('three');	// if using browserify
//import * as THREE from "/js/lib/three.module.js";	// nah..

import Game from "./game.js"
// import AudioHandler from "./audioHandler.js"

var game = new Game();
// var stats = new Stats();
// var audioHandler;

window.onload = () => { 
	console.log('load!');
	start();
};

function start()
{
	// AUDIO
	// audioHandler = new AudioHandler();
	// audioHandler.init();
	// audioHandler.loadSound(true);
	// audioHandler.renderSound();

	// GAME
	game.init();
	// game.container.appendChild(stats.dom);
	window.addEventListener('resize', onWindowResize, false);
	window.addEventListener('keydown', onKeyDown, false);
	window.addEventListener('keyup', onKeyUp, false);
	animate();
}

function animate(t) {
    requestAnimationFrame(animate);
    // audioHandler.update();
    game.animate(t);
    // stats.update();
}

function onWindowResize()
{
	game.onWindowResize();
}

function onKeyDown(e)
{
	game.onKeyDown(e.keyCode);
}

function onKeyUp(e)
{
	game.onKeyUp(e.keyCode);
}