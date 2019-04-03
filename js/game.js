import PulseHandler from "./pulseHandler.js"
import Player from "./player.js";

export default class Game {
	constructor() {
		this.name = "game";
	}

	init() {
		class DanceEmitter extends Events {}
		this.emitter = new DanceEmitter();
		window.eventBus = this.emitter;

		// this.scene = new THREE.Scene();
		// this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 0.1, 1000 );
		// this.renderer = new THREE.WebGLRenderer( {antialias: true} );
		// this.renderer.setPixelRatio( window.devicePixelRatio );
		// this.renderer.setSize( window.innerWidth, window.innerHeight );
		// this.container = document.createElement( 'div' );
		// document.body.appendChild( this.container );
		// this.container.appendChild( this.renderer.domElement );
		// this.geometry = new THREE.BoxGeometry( 1, 1, 1 );
		// this.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		// this.cube = new THREE.Mesh( this.geometry, this.material );
		// this.scene.add( this.cube );
		// this.camera.position.z = 5;

		// ========= PAPER Setup
		paper.install(window);
		this.container = document.createElement( 'div' );
		document.body.appendChild( this.container );
		this.canvas = document.createElement( 'canvas' );
		this.canvas.setAttribute('resize', true);
		this.container.appendChild( this.canvas );
		paper.setup(this.canvas);

		// ========= Player seupt
		this.leftPlayer = new Player('left', '#00A8B5', new Point(20, 40));
		this.rightPlayer = new Player('right', '#774898', new Point(view.size.width-40, 40));
		this.rightPlayer.updateBGPosition(view.size.width/2, 0);
		this.leftPlayer.otherPlayer = this.rightPlayer;
		this.rightPlayer.otherPlayer = this.leftPlayer;
		this.players = {
			'left': this.leftPlayer,
			'right': this.rightPlayer
		};

		this.peakGroup = new Group();

		// this.totalScoreGroup = new Group();
		// this.tsBG = new Shape.Circle(new Point(0, 0), 60);
		// this.tsBG.fillColor = 'orange';
		// this.totalScoreGroup.addChild(this.tsBG);
		// this.totalScore = 0;
		// this.totalScoreText = new PointText({
		// 	point: [0, 30],
		// 	content: this.totalScore,
		// 	fillColor: 'white',
		// 	fontFamily: 'Courier New',
		// 	fontWeight: 'bold',
		// 	fontSize: 30,
		// 	justification: 'center'
		// });
		// this.totalScoreGroup.addChild(this.totalScoreText);
		// this.totalScoreGroup.position = new Point(view.size.width/2, 0);

		// ========= AUDIO
		this.pulseHandler = new PulseHandler();
		this.pulseHandler.load();
		this.audioSample = new Howl({
			src: ["./assets/audios/canned_heat_audio.mp3"]
		});

		// ========= EVENTS
		eventBus.on('beatAnalyse_done', ()=>{this.onPulseAnalyseDone();});
	}

	animate(t) {
		// this.renderer.render( this.scene, this.camera );

		if (this.audioSample.playing())
		{
			let currS = this.audioSample.seek();			
			// console.log("currMS: " + currMS);
			//this.currentNote.position = this.getPositionFromMillisec(currS*1000);
			this.peakGroup.position = new Point(view.size.width/2, view.size.height/3*2 + (currS*10 * 20));
		}
	}

	onWindowResize()
	{
		// this.camera.aspect = window.innerWidth / window.innerHeight;
		// this.camera.updateProjectionMatrix();
		// this.renderer.setSize(window.innerWidth, window.innerHeight);
		//console.log(view.size.height);
	}

	onPlayerKeyDown(player, keyCode)
	{
		let validPress = this.players[player].pressKey(keyCode);
		if (!validPress) return;

		//console.log(player + ': ' + keyCode);

		let hitResult = this.peakGroup.hitTest(this.currentNote.position);
		if (hitResult==null)
		{
			// miss!
			this.updateScore(player, -2);
			return;
		}
		else
		{
			// console.log(hitResult);
			hitResult.item.fillColor = 'yellow';

			// Player wins no matter what, when it's its turn
			this.updateScore(player, 1);
			// Double points if has same pose as the other
			if (this.players[player].checkPoseMatch())
			{
				console.log(player + ': same poses!');
				this.updateScore('left', 1);
				this.updateScore('right', 1);
			}
		}
	}

	onKeyDown(keyCode)
	{
		//console.log(keyCode);
		switch (keyCode)
		{
			// a, s, d
			case 65:
			case 83:
			case 68:
			this.onPlayerKeyDown('left', keyCode);
			break;

			// ←, ↓, →
			case 37:
			case 40:
			case 39:
			this.onPlayerKeyDown('right', keyCode);
			break;

			case 32:
			var hitResult = this.peakGroup.hitTest(this.currentNote.position);
			if (hitResult==null){
				console.log('...');
				return;
			}
			else
			{
				// console.log(hitResult);
				hitResult.item.fillColor = 'yellow';
			}
			break;
		}
	}

	onKeyUp(keyCode)
	{
		switch (keyCode)
		{
			// a, s, d
			case 65:
			case 83:
			case 68:
			this.players['left'].releaseKey();
			break;

			// ←, ↓, →
			case 37:
			case 40:
			case 39:
			this.players['right'].releaseKey();
			break;
		}
	}

	onPulseAnalyseDone()
	{
		console.log(this.pulseHandler.pulse.significantPeaks);
		// let amountPerLine = Math.round(view.size.width/30);
		// console.log(amountPerLine);
		let firstCircle = new Path.Circle(new Point(0,0), 20);
		firstCircle.fillColor = '#DE4383';
		this.peakGroup.addChild( firstCircle );

		for(let i=0; i<this.pulseHandler.pulse.significantPeaks.length; i++)
		{
			// this.symbol.place( this.getPositionFromMillisec(this.pulseHandler.pulse.significantPeaks[i]) );
			let peakCircle = firstCircle.clone();
			peakCircle.position = new Point(0, this.pulseHandler.pulse.significantPeaks[i]/100 * -20);//this.getPositionFromMillisec(this.pulseHandler.pulse.significantPeaks[i]);
			peakCircle.name = "peak_" + i;
			// let text = new PointText(peakCircle.position);
			// text.fillColor = 'black';
			// text.content = i;
			// this.peakGroup.addChild( text );
			this.peakGroup.addChild( peakCircle );
			//console.log(i + ", " + xPos + ", " + yPos);
		}
		this.peakGroup.pivot = this.peakGroup.bounds.bottomCenter;
		this.peakGroup.position = new Point(view.size.width/2, view.size.height/3*2);

		this.currentNote = new Path.Circle(new Point(view.size.width/2, view.size.height/3*2 -20), 10);
		this.currentNote.fillColor = 'grey';

		this.audioSample.play();

		// SCORE
		this.updateScore('right', 0);
	}

	updateScore(player, scoreDiff)
	{
		this.players[player].updateScore(scoreDiff);
		// if(scoreDiff<0) return;
		// this.totalScore = this.leftPlayer.score + this.rightPlayer.score;
		// this.totalScoreText.content = this.totalScore;
	}

	getPositionFromMillisec(milli)
	{
		let x = 15 + Math.floor(milli/100) * 20;
		let y = Math.floor(x/view.size.width);
		let yPos = 15 + y * 20;
		let xPos = x - y * view.size.width;
		return new Point(xPos, yPos);
	}


}