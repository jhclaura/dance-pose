import PulseHandler from "./pulseHandler.js"

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

		paper.install(window);
		this.container = document.createElement( 'div' );
		document.body.appendChild( this.container );
		this.canvas = document.createElement( 'canvas' );
		this.canvas.setAttribute('resize', true);
		this.container.appendChild( this.canvas );
		paper.setup(this.canvas);

		this.circle = new Path.Circle(new Point(20,20), 5);
		this.circle.fillColor = 'red';
		// this.symbol = new Symbol(this.circle);
		this.peakGroup = new Group();

		this.pulseHandler = new PulseHandler();
		this.pulseHandler.load();

		this.audioSample = new Howl({
			src: ["../assets/audios/canned_heat_audio.mp3"]
		});

		eventBus.on('beatAnalyse_done', ()=>{this.onPulseAnalyseDone();});
	}

	animate(t) {
		// this.cube.rotation.x += 0.01;
		// this.cube.rotation.y += 0.01;
		// this.renderer.render( this.scene, this.camera );

		if (this.audioSample.playing())
		{
			let currS = this.audioSample.seek();			
			// console.log("currMS: " + currMS);
			this.currentNote.position = this.getPositionFromMillisec(currS*1000);
		}
	}

	onWindowResize()
	{
		// this.camera.aspect = window.innerWidth / window.innerHeight;
		// this.camera.updateProjectionMatrix();
		// this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	onPulseAnalyseDone()
	{
		console.log(this.pulseHandler.pulse.significantPeaks);
		// let amountPerLine = Math.round(view.size.width/30);
		// console.log(amountPerLine);
		for(let i=0; i<this.pulseHandler.pulse.significantPeaks.length; i++)
		{
			// this.symbol.place( this.getPositionFromMillisec(this.pulseHandler.pulse.significantPeaks[i]) );
			let peakCircle = this.circle.clone();
			peakCircle.position = this.getPositionFromMillisec(this.pulseHandler.pulse.significantPeaks[i]);
			this.peakGroup.addChild( peakCircle );
			//console.log(i + ", " + xPos + ", " + yPos);
		}

		this.currentNote = new Path.Circle(new Point(20,20), 5);
		this.audioSample.play();
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