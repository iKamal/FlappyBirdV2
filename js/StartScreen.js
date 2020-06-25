class StartScreen extends Phaser.Scene {
    constructor() {
        super('StartScreen');
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
        console.log("StartScene");
        let bg = this.add.image(0, 0, 'tbg');
        let stBut = this.add.image(0,0,'stBut').setInteractive();
        Align.center(bg);
        Align.center(stBut);
        stBut.on("pointerdown", function (pointer) {
            this.scene.start('GameScene');
        }, this);

    }

    update() {
        //constant running loop
    }

}
