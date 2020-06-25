class SceneMain extends Phaser.Scene {
    constructor() {
        super('SceneMain');
    }
    preload() {

        //load our images and other resources
        this.load.image('tbg', 'images/title.png');
        this.load.image('bg', 'images/bg.png');
        this.load.image('fg', 'images/fg.png');
        this.load.image('bird', 'images/aBird.png');
        this.load.image('pipeUp', 'images/pipeNorth.png');
        this.load.image('pipeDown', 'images/pipeSouth.png');
        this.load.image('over', 'images/over.png');
        this.load.image('pBut', 'images/pBut.png');
        this.load.image('paus', 'images/paus.png');
        this.load.image('playBut', 'images/playBut.png');
        this.load.image('resBut', 'images/res.png');
        this.load.image('stBut', 'images/st_but.png');
        this.load.bitmapFont('retro', 'fonts/retro.png', 'fonts/retro.fnt');
        this.load.audio('a_fly', 'sounds/sfx_wing.wav');
        this.load.audio('a_hit', 'sounds/sfx_hit.wav');
        this.load.audio('a_select', 'sounds/sfx_point.wav');
        this.load.audio('bgMusic', 'sounds/boy.mp3');
        this.load.audio('click', 'sounds/click.wav');

        // grid utility for alignment
        let aGrid = new AlignGrid({
            scene: this,
            rows: 11,
            cols: 11
        });
        //aGrid.showNumbers();


        //preload handling
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        let pbX = (game.config.width / 2) - 110;
        let pbY = (game.config.height / 2) - 15;
        progressBox.fillRect(pbX, pbY, 220, 30);

        // create loading text
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var loadingText = this.make.text({
            x: game.config.width / 2,
            y: pbY - 15,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        //aGrid.placeAtIndex(50, loadingText);
        //Align.centerH(loadingText);

        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(pbX + 10, pbY + 10, 200 * value, 10);
        });

        this.load.on('fileprogress', function (file) {
            console.log(file.src);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });
    }
    create() {
        //define our objects
        console.log("Ready!");
        this.scene.start('StartScreen');
    }
    update() {
        //constant running loop
    }

}
