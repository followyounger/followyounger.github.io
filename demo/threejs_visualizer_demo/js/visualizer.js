/*
Audio Visualizer by Raathigeshan.
http://raathigesh.com/
*/

var visualizer;

$(document).ready(function () {
    visualizer = new AudioVisualizer();
    visualizer.initialize();
    visualizer.addStars();
    visualizer.createBars();
    visualizer.setupAudioProcessing();
    visualizer.getAudio();
    visualizer.handleDrop();
});

function down(){
    scrollToY(visualizer.height, 500, 'easeInOutQuint');
}

function up(){
    scrollToY(0, 500, 'easeInOutQuint');
}


function AudioVisualizer() {
    //constants
    this.numberOfBars = 60;
    this.lines = 20;

    //variables
    this.height;

    //Rendering
    this.scene;
    this.camera;
    this.renderer;
    this.controls;

    //bars
    this.bars = new Array();
    this.lights = new Array();
    this.lineCol = new Array();

    //audio
    this.javascriptNode;
    this.audioContext;
    this.sourceBuffer;
    this.analyser;
    this.played = false;
    this.isauthorized = false;
    this.totalTime;
    this.startTime;
}

//initialize the visualizer elements
AudioVisualizer.prototype.initialize = function () {
    //generate a ThreeJS Scene
    this.scene = new THREE.Scene();

    //get the width and height
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;
    this.height = HEIGHT;

    //get the renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
    this.renderer.setSize(WIDTH, HEIGHT);

    //append the rederer to the body
    document.getElementById('object').insertBefore(this.renderer.domElement,
        document.getElementById('object').firstChild);

    //create and add camera
    this.camera = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 0.1, 20000);
    this.camera.position.set(0, -65, 25);
    this.scene.add(this.camera);
    var planeGeo = new THREE.PlaneGeometry(60, 60);
    var planeMat = new THREE.MeshPhongMaterial({
        color: 0x000000,
        specular: 0x222222,
        flatShading: true,
        shininess: 100
    });

    // add plane
    var plane = new THREE.Mesh(planeGeo, planeMat);
    plane.receiveShadow = true;
    plane.position.y = -0.01;

    this.scene.add(plane);

    // add line progress
    var geometry = new THREE.BufferGeometry();
    var positions = new Float32Array( this.numberOfBars * 3 ); // 3 vertices per point
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.setDrawRange( 0, this.numberOfBars + 1 );
    var material = new THREE.LineBasicMaterial( {
        color: "#FFFFFF",
        linewidth: 1,
    } );
    var progressLine = new THREE.Line( geometry, material);
    positions = progressLine.geometry.attributes.position.array;
    for (var i = 0; i < this.numberOfBars; i++){
        var angle = Math.PI  / 30 * i;
        positions[i*3] = 15 * Math.cos(angle);
        positions[i*3+1] = 15 * Math.sin(angle);
        positions[i*3+2] = 0;
    }
    this.scene.add(progressLine);

    var geometry   = new THREE.SphereGeometry(0.5, 4, 4);
    var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    this.progressLight = new THREE.PointLight("#FFFFFF", 10, 10, 2);
    this.progressSphere = new THREE.Mesh(geometry, material);
    this.progressSphere.position.set(15, 0, 0);
    this.progressLight.position.set(15, 0, 1);
    this.scene.add(this.progressLight);
    this.scene.add(this.progressSphere);

    // add line wave
    var Linematerial = new THREE.LineBasicMaterial( {
        color: "#ea3323",
        linewidth: 1,
    } );
    for (var i = 0; i < this.lines; i++){
        var geometry = new THREE.BufferGeometry();
        var positions = new Float32Array( (this.numberOfBars + 1) * 3 ); // 3 vertices per point
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.setDrawRange( 0, this.numberOfBars + 1 );
        this.lineCol[i] = new THREE.Line( geometry,  Linematerial );
    }

    var that = this;

    //update renderer size, aspect ratio and projection matrix on resize
    window.addEventListener('resize', function () {

        var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight;
        this.height = HEIGHT;

        that.renderer.setSize(WIDTH, HEIGHT);

        that.camera.aspect = WIDTH / HEIGHT;
        that.camera.updateProjectionMatrix();

    });

    //background color of the scene
    this.renderer.setClearColor(0x000000, 1);

    //create a light and add it to the scene
    // var light = new THREE.PointLight(0xffffff);
    // light.position.set(0, 0, 100);
    // this.scene.add(light);

    //Add interation capability to the scene
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.1;

};

AudioVisualizer.prototype.addStars = function(){
    // The loop will move from z position of -1000 to z position 1000, adding a random particle at each position.
    var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    for ( var z= -250; z < 250; z+=5 ) {
        // Make a sphere (exactly the same as before).
        var geometry   = new THREE.SphereGeometry(0.5, 4, 4);
        var sphere = new THREE.Mesh(geometry, material);

        // This time we give the sphere random x and y positions between -500 and 500
        sphere.position.x = Math.random() * 1000 - 250;
        sphere.position.y = Math.random() * 1000 - 250;

        // Then set the z position to where it is in the loop (distance of camera)
        sphere.position.z = z;
        // scale it up a bit
        sphere.scale.x = sphere.scale.y = 2;
        //add the sphere to the scene
        this.scene.add( sphere );
    }
};

//create the bars required to show the visualization
AudioVisualizer.prototype.createBars = function () {
    let r = 20;
    //iterate and create bars
    for (var i = 0; i < this.numberOfBars; i++) {

        var color = this.getRandomColor();
        var color2 = this.getRandomColor();


        //create a bar
        var barGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 3);
        var light = new THREE.PointLight(color, 10, 10, 2);
        //create a material
        // var material = new THREE.MeshPhongMaterial({
        //     color: 0x0,
        //     emissive: color,
        //     shininess: 0
        // });
        var material = new THREE.ShaderMaterial({
            uniforms: {
                color1: {
                    value: new THREE.Color(color)
                },
                color2: {
                    value: new THREE.Color(color2)
                }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                }
                `,
            fragmentShader: `
                uniform vec3 color1;
                uniform vec3 color2;
                varying vec2 vUv;
                void main() {
                    gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
                }
            `,
        });
        var angle = Math.PI  / 30 * i;
        //create the geometry and set the initial position
        this.bars[i] = new THREE.Mesh(barGeometry, material);
        this.bars[i].rotation.x = Math.PI / 2;
        // this.bars[i].position.set(i - this.numberOfBars/2, 0, 0);
        this.bars[i].position.set(r * Math.cos(angle), r * Math.sin(angle), 0);
        this.lights[i] = light;
        // this.lights[i].position.set(i - this.numberOfBars/2, 0, 0.5);
        this.lights[i].position.set(r * Math.cos(angle), r * Math.sin(angle), 0.5);
        // line
        var count = r - 10;
        for (var j = 0; j < this.lines; j++){
            var positions = this.lineCol[j].geometry.attributes.position.array;
            positions[i*3] = count * Math.cos(angle);
            positions[i*3+1] = count * Math.sin(angle);
            positions[i*3+2] = 0;
            count -= 0.05;
        }
        //add the created bar to the scene
        this.scene.add(this.bars[i]);
        this.scene.add(this.lights[i]);
    }
    for (var j = 0; j < this.lines; j++){
        var positions = this.lineCol[j].geometry.attributes.position.array;
        positions[this.numberOfBars*3] = positions[0];
        positions[this.numberOfBars*3+1] = positions[1];
        positions[this.numberOfBars*3+2] = positions[2];
        this.scene.add(this.lineCol[j]);
    }
    var that = this;
    var animate = function () {
        if (!that.played) {
            requestAnimationFrame( animate );
            that.renderer.render(visualizer.scene, visualizer.camera);
            that.controls.update();
        }
    };
    animate();
};

AudioVisualizer.prototype.setupAudioProcessing = function () {
    // this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    //create the javascript node
    this.javascriptNode = this.audioContext.createScriptProcessor(2048, 1, 1);
    this.javascriptNode.connect(this.audioContext.destination);

    //create the source buffer
    // this.sourceBuffer = this.audioContext.createBufferSource();

    //create the analyser node
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.6;
    this.analyser.fftSize = 512;

    //connect source to analyser
    // this.sourceBuffer.connect(this.analyser);

    //analyser to speakers
    this.analyser.connect(this.javascriptNode);

    //connect source to analyser
    // this.sourceBuffer.connect(this.audioContext.destination);

    var that = this;

    //this is where we animates the bars

    this.javascriptNode.onaudioprocess = function () {
        for (var i = 0; i < that.lines; i++){
            that.lineCol[i].geometry.attributes.position.needsUpdate = true;
        }
        that.played = true;
        // get the average for the first channel
        var array = new Uint8Array(that.analyser.frequencyBinCount);
        that.analyser.getByteFrequencyData(array);

        //render the scene and update controls
        visualizer.renderer.render(visualizer.scene, visualizer.camera);
        visualizer.controls.update();

        var step = Math.round(array.length / visualizer.numberOfBars);
        //Iterate through the bars and scale the z axis
        for (var i = 0; i < visualizer.numberOfBars; i++) {
            var value = array[i * step] / 4 || 1;
            value = value < 1 ? 1 : value;
            visualizer.bars[i].position.z = value / 4 - 0.2;
            visualizer.bars[i].scale.y = value - 0.2;
            visualizer.lights[i].intensity = value * 5;
            for (var j = 0; j < that.lines; j++){
                var positions = that.lineCol[j].geometry.attributes.position.array;
                positions[i*3+2] =  Math.sin(Math.PI * (j + 1) / that.lines) * value / 20;
            }
        }
        for (var j = 0; j < that.lines; j++){
            var positions = that.lineCol[j].geometry.attributes.position.array;
            positions[visualizer.numberOfBars*3+2] = positions[2];
        }
        var ver =  (that.audioContext.currentTime - that.startTime) / that.totalTime;
        if (ver > 1){
            that.startTime = that.audioContext.currentTime;
        }
        that.progressSphere.position.set(15 * Math.cos(2 * Math.PI * ver),
            15 * Math.sin(2 * Math.PI * ver), 0);
        that.progressLight.position.set(15 * Math.cos(2 * Math.PI * ver),
            15 * Math.sin(2 * Math.PI * ver), 1);
    }

};

//get the default audio from the server
AudioVisualizer.prototype.getAudio = function () {
    var request = new XMLHttpRequest();
    request.open("GET", "https://server.soptq.me/blog/music/demo.mp3", true);
    request.responseType = "arraybuffer";
    request.send();
    var that = this;
    request.onload = function () {
        that.start(request.response);
    }
};

//start the audio processing
AudioVisualizer.prototype.start = function (buffer) {
    try {
        this.sourceBuffer.stop();
        this.sourceBuffer.disconnect(0);
    } catch (e) {

    }
    this.sourceBuffer = this.audioContext.createBufferSource();
    this.sourceBuffer.loop = true;
    this.sourceBuffer.connect(this.analyser);
    this.sourceBuffer.connect(this.audioContext.destination);
    this.audioContext.decodeAudioData(buffer, decodeAudioDataSuccess, decodeAudioDataFailed);
    var that = this;
    document.getElementById('loading-icon').classList.add('hidden');
    document.getElementById("play-icon").classList.remove('hidden');
    function decodeAudioDataSuccess(decodedBuffer) {
        that.sourceBuffer.buffer = decodedBuffer;
        that.totalTime = decodedBuffer.duration;
        if (that.isauthorized){
            that.sourceBuffer.start(0);
            that.startTime = that.audioContext.currentTime;
        } else {
            document.getElementById("play-icon").onclick = function(){
                that.sourceBuffer.start(0);
                that.startTime = that.audioContext.currentTime;
                that.isauthorized = true;
                $('#authorize')[0].remove();
            };
        }
    }

    function decodeAudioDataFailed() {
        debugger
    }
};

//util method to get random colors to make stuff interesting
AudioVisualizer.prototype.getRandomColor = function () {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

AudioVisualizer.prototype.handleDrop = function () {
    //drag Enter
    document.body.addEventListener("dragenter", function () {

    }, false);

    //drag over
    document.body.addEventListener("dragover", function (e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }, false);

    //drag leave
    document.body.addEventListener("dragleave", function () {

    }, false);

    //drop
    document.body.addEventListener("drop", function (e) {
        e.stopPropagation();

        e.preventDefault();
        //get the file
        var file = e.dataTransfer.files[0];
        var fileName = file.name;

        var fileReader = new FileReader();

        fileReader.onload = function (e) {
            var fileResult = e.target.result;
            visualizer.start(fileResult);
        };

        fileReader.onerror = function (e) {
            debugger
        };

        fileReader.readAsArrayBuffer(file);
    }, false);
}
