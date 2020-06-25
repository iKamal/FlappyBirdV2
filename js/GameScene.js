class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }
    preload() {
        // grid utility for alignment
        let aGrid = new AlignGrid({
            scene: this,
            rows: 11,
            cols: 11
        });
        //aGrid.showNumbers();
    }

    create() {
        this.bg = this.add.image(game.config.width, game.config.height, 'bg');
        this.bg.setOrigin(1,1);
        this.world = game.config;
        Align.scaleToGameW(this.bg, 1);
        console.log("Game Scene!");
        this.bgMusic = this.sound.add('bgMusic');
        this.bgMusic.play('', 0, 0.3, true);
        this.isPaused = false;
        this.isStopped = false;
        this.bird = this.physics.add.image(50, 100, 'bird');
        this.pipeUp = this.physics.add.image(this.world.width, 0, 'pipeUp');
        this.pipeUp.setOrigin(0,0);
        this.pipeDown = this.physics.add.image(this.world.width, this.pipeUp.y + this.pipeUp.height + 80, 'pipeDown');
        this.pipeDown.setOrigin(0,0);
        this.pipeUp.enableBody = true;
        this.pipeUp.body.immovable = true;
        this.pipeDown.enableBody = true;
        this.pipeDown.body.immovable = true;
        this.fg = this.add.image(this.world.width, this.world.height, 'fg');
        this.fg.setOrigin(1,1);
        Align.scaleToGameW(this.fg, 1);
        this.pBut = this.add.image(this.world.width/2, this.world.height - 50, 'pBut').setInteractive();
        this.pBut.on('pointerdown', this.clickedPause.bind(this));
        this.bg.on('pointerdown', this.fly);
        this.pBut.setOrigin(0.5,0.5);
        this.input.addPointer();
        this.scoreCount = 0;
        this.score = this.add.bitmapText(10, 10, 'retro', 'SCORE: ' + this.scoreCount, 14);
        this.speed = -60;
        this.speedIncrement = 9;
        this.speedIncrementScore = 3;
        this.birdVelocity = 60;
        this.birdVelocityMax = 200;
        this.speedMax = -200;
        this.birdSpeedIncrement = 7;
        this.flySound = this.sound.add('a_fly', 0.1, false);
        this.hitSound = this.sound.add('a_hit');
        this.selectSound = this.sound.add('a_select');
        this.clickSound = this.sound.add('click');
    }


    fly(){
        if(!this.isPaused && !this.isStopped){
            this.bird.setVelocityY(-this.birdVelocity);
        }
    }

    clickedPause(){
        this.clickSound.play();
        this.isPaused = !this.isPaused;
        if(this.pBut){
            this.pBut.destroy();
        }
        if(this.playBut){
            this.playBut.destroy();
        }
        this.updatePauseButtonState();
    }

    updatePauseButtonState(){
        if(this.isPaused){
            this.bgMusic.pause();
            this.playBut = this.physics.add.image(this.world.width/2, this.world.height - 50, 'playBut').setInteractive();
            this.playBut.setOrigin(0.5,0.5);
            this.playBut.on('pointerdown', this.clickedPause.bind(this));
        }
        else{
            this.bgMusic.resume();
            this.pBut = this.physics.add.image(this.world.width/2, this.world.height - 50, 'pBut').setInteractive();
            this.pBut.setOrigin(0.5,0.5);
            this.pBut.on('pointerdown', this.clickedPause.bind(this));
        }
    }

    update(){
        this.updatePipes();
        if(this.input.activePointer.isDown){
            this.fly();
        }
        else{
            this.updateBird();
        }

        this.physics.collide(this.bird, this.pipeUp, this.gameOver, null, this);
        this.physics.collide(this.bird, this.pipeDown, this.gameOver, null, this);

    }

    restartGame(){
        this.clickSound.play();
        this.scene.start('StartScreen');
    }

    gameOver(){
        this.hitSound.play();
        this.bird.setVelocityX(0);
        this.bird.setVelocityY(0);
        this.bgMusic.stop();
        this.isStopped = true;
        this.over = this.add.image((this.world.width/2), this.world.height/2 - 60, 'over');
        if(this.pBut){
            this.pBut.destroy();
        }
        if(this.playBut){
            this.playBut.destroy();
        }

        // add restart button
        this.resBut = this.add.image(this.world.width/2, this.world.height - 50, 'resBut').setInteractive();
        this.resBut.setOrigin(0.5,0.5);
        this.resBut.on('pointerdown', this.restartGame, this);
    }


    pauseGame(){
        if(this.isPaused){
            this.bird.setVelocityY(0);
            this.pipeUp.setVelocityX(0);
            this.pipeDown.setVelocityX(0);
            this.paus = this.add.sprite((this.world.centerX), this.world.centerY, 'paus');
            this.paus.anchor.set(0.5);
        }
        this.isPaused = !this.isPaused;


    }

    updateBird(){
        if(!this.isPaused && !this.isStopped){
            if(this.bird.y + this.bird.height < this.world.height - this.fg.height){
                this.bird.setVelocityY(this.birdVelocity);
            }
            else{
                this.bird.setVelocityY(0);
            }
        }
        else{
            this.bird.setVelocityY(0);
        }

    }


    updatePipes(){
        if(this.isPaused || this.isStopped){
            this.pipeUp.setVelocityX(0);
            this.pipeDown.setVelocityX(0);
            return;
        }
        // keep moving pipes if not reached the start
        if(this.pipeUp.x + this.pipeUp.width >=0){
            this.pipeUp.setVelocityX(this.speed);
            this.pipeDown.setVelocityX(this.speed);
            if(this.pipeUp.x + this.pipeUp.width < this.bird.x && (this.pipeUp.x + this.pipeUp.width) > (this.bird.x-1)){
                this.selectSound.play();
            }
        }
        else{
            // reset pipe position x to max
            this.pipeUp.x = this.bg.width;
            this.pipeDown.x = this.bg.width;

            // update position y to random
            var newPos =  Math.floor(Math.random() * (242 - 30) ) + 30;
            newPos = newPos - 242;

            // move up for the new position
            if( this.pipeUp.y > newPos){
                this.pipeUp.y = ( this.pipeUp.y+242) - (( this.pipeUp.y+242) - newPos);

            }

            // move down for the new position
            else if( this.pipeUp.y < newPos){
                this.pipeUp.y = ( this.pipeUp.y+242) + (newPos - ( this.pipeUp.y+242));
            }

            this.pipeDown.y = this.pipeUp.y + this.pipeUp.height + 80;
            this.scoreCount++;
            this.score.text = "SCORE: " + this.scoreCount;
            if(this.scoreCount%this.speedIncrementScore === 0){
                if(this.speed - this.speedIncrement >= this.speedMax){
                    this.speed -= this.speedIncrement;
                    console.log("speed increased to :" + this.speed);
                }
                else{
                    this.speed = this.speedMax;
                    console.log("MAX SPEED!");
                }
                if(this.birdVelocity + this.birdSpeedIncrement  <= this.birdVelocityMax){
                    this.birdVelocity += this.birdSpeedIncrement;
                    console.log("bird speed increased to :" + this.birdVelocity);
                }
                else{
                    this.birdVelocity = this.birdVelocityMax;
                    console.log("MAX BIRD POWER!");
                }
            }

        }
    }

}
