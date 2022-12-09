    console.clear();

    // https://cdnjs.cloudflare.com/ajax/libs/three.js/r83/three.min.js
    // https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js
    // https://codepen.io/steveg3003/pen/zBVakw.js


    // minify = 압축 
    import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r83/three.module.js';
    console.log(THREE)
    var colorBox = 0x333344;
    // function colorChange(){
    //     colorBox = document.getElementById("color").value;
    //     console.log(colorBox)
    //     document.querySelector('#area1').style.backgroundColor = colorBox
    // };
    var stack = 0;
    var colorChange =  () => {document.querySelector(".color-button").addEventListener("click", function(e) {
        colorBox = document.getElementById("color").value;
        document.querySelector('#area1').style.backgroundColor = colorBox
        colorBox = "#"+colorBox.substring(1);
    })};

    // const colorChange = () => {
    //     document.querySelector('#area1').style.backgroundColor = colorBox
    // }

    const arr_sound = [];
    let temp = 150;
    for(let i = 0; i < 10; i++){
        const sound = new Audio();
        sound.src = "Coin.mp3";
        arr_sound.push(sound);
    }

    // const open = () => {
    //     document.querySelector(".modal").classList.remove("hidden");
    // }

    // const close = () => {
    //     document.querySelector(".modal").classList.add("hidden");
    // }

    const hide = () => {
        document.querySelector("#setting").classList.add("hidden");
    }

    const on = () => {
        document.querySelector("#setting").classList.remove("hidden");
    }

    document.querySelector("#setting").addEventListener("click", function(e) {
        document.querySelector(".modal").classList.remove("hidden");
        e.stopPropagation()
    });
    document.querySelector(".close-button").addEventListener("click", function(e) {
        document.querySelector(".modal").classList.add("hidden");
        e.stopPropagation()
    });
    document.querySelector("#pop-backgrounnd").addEventListener("click", function(e) {
        document.querySelector(".modal").classList.add("hidden");
        e.stopPropagation()
    });

    document.querySelector(".modal").addEventListener("click", function(e) {
        e.stopPropagation()
    })

    var Stage = /** @class */ (function () {
        function Stage() {
            
            // container
            var _this = this;
            this.render = function () {
                this.renderer.render(this.scene, this.camera);
            };
            this.add = function (elem) {
                this.scene.add(elem);
            };
            this.remove = function (elem) {
                this.scene.remove(elem);
            };
            this.container = document.getElementById('game');
            // renderer
            this.renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: false
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setClearColor('#D0CBC7', 1);
            this.container.appendChild(this.renderer.domElement);
            // scene
            this.scene = new THREE.Scene();
            // camera
            var aspect = window.innerWidth / window.innerHeight;
            var d = 20;
            this.camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, -100, 1000);
            this.camera.position.x = 2;
            this.camera.position.y = 2;
            this.camera.position.z = 2;
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));
            //light
            this.light = new THREE.DirectionalLight(0xffffff, 0.5);
            this.light.position.set(0, 499, 0);
            this.scene.add(this.light);
            this.softLight = new THREE.AmbientLight(0xffffff, 0.4);
            this.scene.add(this.softLight);
            window.addEventListener('resize', function () { return _this.onResize(); });
            this.onResize();
        }
        Stage.prototype.setCamera = function (y, speed) {
            if (speed === void 0) { speed = 0.3; }
            TweenLite.to(this.camera.position, speed, { y: y + 4, ease: Power1.easeInOut });
            TweenLite.to(this.camera.lookAt, speed, { y: y, ease: Power1.easeInOut });
        };
        Stage.prototype.onResize = function () {
            var viewSize = 30;
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.left = window.innerWidth / -viewSize;
            this.camera.right = window.innerWidth / viewSize;
            this.camera.top = window.innerHeight / viewSize;
            this.camera.bottom = window.innerHeight / -viewSize;
            this.camera.updateProjectionMatrix();
        };
        return Stage;
    }());
    var Block = /** @class */ (function () {
        function Block(block) {
            // set size and position
            this.STATES = { ACTIVE: 'active', STOPPED: 'stopped', MISSED: 'missed' };
            this.MOVE_AMOUNT = 12;
            this.dimension = { width: 0, height: 0, depth: 0 };
            this.position = { x: 0, y: 0, z: 0 };
            this.targetBlock = block;
            this.index = (this.targetBlock ? this.targetBlock.index : 0) + 1;
            this.workingPlane = this.index % 2 ? 'x' : 'z';
            this.workingDimension = this.index % 2 ? 'width' : 'depth';
            // set the dimensions from the target block, or defaults.
            this.dimension.width = this.targetBlock ? this.targetBlock.dimension.width : 10;
            this.dimension.height = this.targetBlock ? this.targetBlock.dimension.height : 2;
            this.dimension.depth = this.targetBlock ? this.targetBlock.dimension.depth : 10;
            this.position.x = this.targetBlock ? this.targetBlock.position.x : 0;
            this.position.y = this.dimension.height * this.index;
            this.position.z = this.targetBlock ? this.targetBlock.position.z : 0;
            // this.colorOffset = this.targetBlock ? this.targetBlock.colorOffset : Math.round(Math.random() * 100);
            // set color
            if (!this.targetBlock) {
                this.color = 0x333344;
            }
            else {
                this.color = colorBox;
            }
            // state
            this.state = this.index > 1 ? this.STATES.ACTIVE : this.STATES.STOPPED;
            
            let thumb = slider.querySelector('.thumb');

            thumb.onmousedown = function(event) {
            event.preventDefault(); // prevent selection start (browser action)
        
            let shiftX = event.clientX - thumb.getBoundingClientRect().left;
            // shiftY not needed, the thumb moves only horizontally
        
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);

            function onMouseMove(event) {
                let newLeft = event.clientX - shiftX - slider.getBoundingClientRect().left;
                // the pointer is out of slider => lock the thumb within the bounaries
                if (newLeft < 0) {
                newLeft = 0;
                }
                let rightEdge = slider.offsetWidth - thumb.offsetWidth;
                if (newLeft > rightEdge) {
                newLeft = rightEdge;
                }
        
                thumb.style.left = newLeft + 'px';
                temp = newLeft;
            }
        
            function onMouseUp() {
                document.removeEventListener('mouseup', onMouseUp);
                document.removeEventListener('mousemove', onMouseMove);
            }
        
            };

            this.speed = -temp/1000 - (this.index * 0.005);
                if (this.speed < -4)
                    this.speed = -4;
                this.direction = this.speed;
        
            thumb.ondragstart = function() {
            return false;
            };
            // create block
            var geometry = new THREE.BoxGeometry(this.dimension.width, this.dimension.height, this.dimension.depth);
            geometry.applyMatrix(new THREE.Matrix4().makeTranslation(this.dimension.width / 2, this.dimension.height / 2, this.dimension.depth / 2));
            this.material = new THREE.MeshToonMaterial({ color: this.color, shading: THREE.FlatShading });
            this.mesh = new THREE.Mesh(geometry, this.material);
            this.mesh.position.set(this.position.x, this.position.y + (this.state == this.STATES.ACTIVE ? 0 : 0), this.position.z);
            if (this.state == this.STATES.ACTIVE) {
                this.position[this.workingPlane] = Math.random() > 0.5 ? -this.MOVE_AMOUNT : this.MOVE_AMOUNT;
                if(this.position[this.workingPlane] == 12){
                    stack = stack + 1
                }
                for(let i = 0; i < arr_sound.length; i++){
                    if(arr_sound[i].paused){ 
                        arr_sound[i].play(); 
                        break;
                    }
                }
            }
        }
        Block.prototype.reverseDirection = function () {
            this.direction = this.direction > 0 ? this.speed : Math.abs(this.speed);
            stack = stack + 1;
            if(stack > 1){
                document.getElementById('container').click();
                stack = 0;
            }
        };
        Block.prototype.place = function () {
            this.state = this.STATES.STOPPED;
            var overlap = this.targetBlock.dimension[this.workingDimension] - Math.abs(this.position[this.workingPlane] - this.targetBlock.position[this.workingPlane]);
            var blocksToReturn = {
                plane: this.workingPlane,
                direction: this.direction
            };
            if (this.dimension[this.workingDimension] - overlap < 0.3) {
                overlap = this.dimension[this.workingDimension];
                blocksToReturn.bonus = true;
                this.position.x = this.targetBlock.position.x;
                this.position.z = this.targetBlock.position.z;
                this.dimension.width = this.targetBlock.dimension.width;
                this.dimension.depth = this.targetBlock.dimension.depth;
            }
            if (overlap > 0) {
                var choppedDimensions = { width: this.dimension.width, height: this.dimension.height, depth: this.dimension.depth };
                choppedDimensions[this.workingDimension] -= overlap;
                this.dimension[this.workingDimension] = overlap;
                var placedGeometry = new THREE.BoxGeometry(this.dimension.width, this.dimension.height, this.dimension.depth);
                placedGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(this.dimension.width / 2, this.dimension.height / 2, this.dimension.depth / 2));
                var placedMesh = new THREE.Mesh(placedGeometry, this.material);
                var choppedGeometry = new THREE.BoxGeometry(choppedDimensions.width, choppedDimensions.height, choppedDimensions.depth);
                choppedGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(choppedDimensions.width / 2, choppedDimensions.height / 2, choppedDimensions.depth / 2));
                var choppedMesh = new THREE.Mesh(choppedGeometry, this.material);
                var choppedPosition = {
                    x: this.position.x,
                    y: this.position.y,
                    z: this.position.z
                };
                if (this.position[this.workingPlane] < this.targetBlock.position[this.workingPlane]) {
                    this.position[this.workingPlane] = this.targetBlock.position[this.workingPlane];
                }
                else {
                    choppedPosition[this.workingPlane] += overlap;
                }
                placedMesh.position.set(this.position.x, this.position.y, this.position.z);
                choppedMesh.position.set(choppedPosition.x, choppedPosition.y, choppedPosition.z);
                blocksToReturn.placed = placedMesh;
                if (!blocksToReturn.bonus)
                    blocksToReturn.chopped = choppedMesh;
            }
            else {
                this.state = this.STATES.MISSED;
            }
            this.dimension[this.workingDimension] = overlap;
            return blocksToReturn;
        };
        Block.prototype.tick = function () {
            if (this.state == this.STATES.ACTIVE) {
                var value = this.position[this.workingPlane];
                if (value > this.MOVE_AMOUNT || value < -this.MOVE_AMOUNT){
                    this.reverseDirection();
                    //else if(stack == 1){
                    //     stack = stack - 2;
                    // }
                    // else if(stack == -1){
                    //     document.getElementById('container').click();
                    //     stack = 0;
                    // }
                    console.log(stack)
                    // if(stack == 0){
                    //     stack = stack + 1;
                    //     if(stack >= 2){
                    //         document.getElementById('container').click();
                    //         stack = 0;
                    //     }
                    // }
                    // console.log(this.workingPlane)
                    // this.state = this.STATES.MISSED;
                }
                
                this.position[this.workingPlane] += this.direction;
                this.mesh.position[this.workingPlane] = this.position[this.workingPlane];
            }
        };
        return Block;
    }());
    var Game = /** @class */ (function () {
        function Game() {
            var _this = this;
            this.STATES = {
                'LOADING': 'loading',
                'PLAYING': 'playing',
                'READY': 'ready',
                'ENDED': 'ended',
                'RESETTING': 'resetting'
            };
            this.blocks = [];
            this.state = this.STATES.LOADING;
            this.stage = new Stage();
            this.mainContainer = document.getElementById('container');
            this.scoreContainer = document.getElementById('score');
            this.startButton = document.getElementById('start-button');
            this.instructions = document.getElementById('instructions');
            this.scoreContainer.innerHTML = '0';
            this.newBlocks = new THREE.Group();
            this.placedBlocks = new THREE.Group();
            this.choppedBlocks = new THREE.Group();
            this.stage.add(this.newBlocks);
            this.stage.add(this.placedBlocks);
            this.stage.add(this.choppedBlocks);
            this.addBlock();
            this.tick();
            this.updateState(this.STATES.READY);
            document.addEventListener('keydown', function (e) {
                if (e.keyCode == 32)
                    _this.onAction();
                    document.querySelector(".modal").classList.add("hidden");
            });
            document.addEventListener('click', function (e) {
                _this.onAction();
            });
            document.addEventListener('touchstart', function (e) {
                e.preventDefault();
                // this.onAction();
                // ☝️ this triggers after click on android so you
                // insta-lose, will figure it out later.
            });
        }
        Game.prototype.updateState = function (newState) {
            for (var key in this.STATES)
                this.mainContainer.classList.remove(this.STATES[key]);
            this.mainContainer.classList.add(newState);
            this.state = newState;
        };
        Game.prototype.onAction = function () {
            switch (this.state) {
                case this.STATES.READY:
                    this.startGame();
                    break;
                case this.STATES.PLAYING:
                    this.placeBlock();
                    break;
                case this.STATES.ENDED:
                    this.restartGame();
                    break;
            }
        };
        Game.prototype.startGame = function () {
            if (this.state != this.STATES.PLAYING) {
                this.scoreContainer.innerHTML = '0';
                this.updateState(this.STATES.PLAYING);
                this.addBlock();
                hide();
            }
        };
        Game.prototype.restartGame = function () {
            var _this = this;
            this.updateState(this.STATES.RESETTING);
            var oldBlocks = this.placedBlocks.children;
            var removeSpeed = 0.2;
            var delayAmount = 0.02;
            var _loop_1 = function (i) {
                TweenLite.to(oldBlocks[i].scale, removeSpeed, { x: 0, y: 0, z: 0, delay: (oldBlocks.length - i) * delayAmount, ease: Power1.easeIn, onComplete: function () { return _this.placedBlocks.remove(oldBlocks[i]); } });
                TweenLite.to(oldBlocks[i].rotation, removeSpeed, { y: 0.5, delay: (oldBlocks.length - i) * delayAmount, ease: Power1.easeIn });
            };
            for (var i = 0; i < oldBlocks.length; i++) {
                _loop_1(i);
            }
            var cameraMoveSpeed = removeSpeed * 2 + (oldBlocks.length * delayAmount);
            this.stage.setCamera(2, cameraMoveSpeed);
            var countdown = { value: this.blocks.length - 1 };
            TweenLite.to(countdown, cameraMoveSpeed, { value: 0, onUpdate: function () { _this.scoreContainer.innerHTML = String(Math.round(countdown.value)); } });
            this.blocks = this.blocks.slice(0, 1);
            setTimeout(function () {
                _this.startGame();
            }, cameraMoveSpeed * 1000);
        };
        Game.prototype.placeBlock = function () {
            stack = 0;
            var _this = this;
            var currentBlock = this.blocks[this.blocks.length - 1];
            var newBlocks = currentBlock.place();
            this.newBlocks.remove(currentBlock.mesh);
            if (newBlocks.placed)
                this.placedBlocks.add(newBlocks.placed);
            if (newBlocks.chopped) {
                this.choppedBlocks.add(newBlocks.chopped);
                var positionParams = { y: '-=30', ease: Power1.easeIn, onComplete: function () { return _this.choppedBlocks.remove(newBlocks.chopped); } };
                var rotateRandomness = 10;
                var rotationParams = {
                    delay: 0.05,
                    x: newBlocks.plane == 'z' ? ((Math.random() * rotateRandomness) - (rotateRandomness / 2)) : 0.1,
                    z: newBlocks.plane == 'x' ? ((Math.random() * rotateRandomness) - (rotateRandomness / 2)) : 0.1,
                    y: Math.random() * 0.1,
                };
                if (newBlocks.chopped.position[newBlocks.plane] > newBlocks.placed.position[newBlocks.plane]) {
                    positionParams[newBlocks.plane] = '+=' + (40 * Math.abs(newBlocks.direction));
                }
                else {
                    positionParams[newBlocks.plane] = '-=' + (40 * Math.abs(newBlocks.direction));
                }
                TweenLite.to(newBlocks.chopped.position, 1, positionParams);
                TweenLite.to(newBlocks.chopped.rotation, 1, rotationParams);
            }
            this.addBlock();
        };
        Game.prototype.addBlock = function () {
            var lastBlock = this.blocks[this.blocks.length - 1];
            if (lastBlock && lastBlock.state == lastBlock.STATES.MISSED) {
                return this.endGame();
            }
            this.scoreContainer.innerHTML = String(this.blocks.length - 1);
            var newKidOnTheBlock = new Block(lastBlock);
            this.newBlocks.add(newKidOnTheBlock.mesh);
            this.blocks.push(newKidOnTheBlock);
            this.stage.setCamera(this.blocks.length * 2);
            if (this.blocks.length >= 5)
                this.instructions.classList.add('hide');
        };
        Game.prototype.endGame = function () {
            this.updateState(this.STATES.ENDED);
            on();
        };
        Game.prototype.tick = function () {
            var _this = this;
            this.blocks[this.blocks.length - 1].tick();
            this.stage.render();
            requestAnimationFrame(function () { _this.tick(); });
        };
        return Game;
    }());
    var game = new Game();
    colorChange();
