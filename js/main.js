var game;
window.onload=function()
{
    var isMobile = navigator.userAgent.indexOf("Mobile");
    if (isMobile == -1) {
        isMobile = navigator.userAgent.indexOf("Tablet");
    }
    if (isMobile == -1) {
        var config = {
            type: Phaser.AUTO,
            width: 288,
            height: 512,
            parent: 'phaser-game',
            scene: [SceneMain, StartScreen, GameScene],

            physics: {
                default: 'arcade',
                arcade: { debug: false }
            }
        };
    } else {
        var config = {
            type: Phaser.AUTO,
            width: 288,
            height: 512,
            parent: 'phaser-game',
            scene: [SceneMain, StartScreen, GameScene],

            physics: {
                default: 'arcade',
                arcade: { debug: false }
            }
        };
    }
    game = new Phaser.Game(config);
}


