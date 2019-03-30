//var THREE = require('three');	// if using browserify
//import * as THREE from "/js/lib/three.module.js";	// nah..

import Game from "./game.js"
// import AudioHandler from "./audioHandler.js"

var game = new Game();
var stats = new Stats();
var audioHandler, pulseHandler;

// window.onload = function() {
// 	console.log('load!');
// }
window.onload = () => { 
	console.log('load!');
	start();
};

function start()
{
	// AUDIO
	// try {
	// 	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	// 	audioHandler = new AudioHandler( new window.AudioContext() );
	// } catch(e) {
	// 	console.log(e);
	// 	console.log("can't use Web Audio API :(");
	// 	return;
	// }
	// audioHandler.init();
	// audioHandler.loadSound(true);
	// audioHandler.renderSound();

	// GAME
	game.init();
	game.container.appendChild(stats.dom);
	window.addEventListener('resize', onWindowResize, false);
	// window.addEventListener('click', onClick, false);
	animate();
}

function animate(t) {
    requestAnimationFrame(animate);
    // audioHandler.update();
    game.animate(t);
    stats.update();
}

function onWindowResize()
{
	game.onWindowResize();
}

function onClick()
{
	console.log("onClick");
}