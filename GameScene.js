class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.totalItems = 20;
        this.itemsCollected = 0;
        this.timeLimit = 10; // Set the timer to 10 seconds
    }

    preload() {
        // Load assets for the spaceship and collectible materials
        this.load.image('spaceship', 'Assets/Items_Space/spaceship.png');
        this.load.image('iron', 'Assets/Items_Space/iron.png');
        this.load.image('aluminum', 'Assets/Items_Space/aluminum.png');
        this.load.image('lithium', 'Assets/Items_Space/lithium.png');
        this.load.image('diamond', 'Assets/Items_Space/diamond.png');
    }

    create() {
        // Initialize score and timer
        this.score = 0;
        this.remainingTime = this.timeLimit;

        // Display score on the screen
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

        // Display timer on the screen
        this.timerText = this.add.text(650, 16, `Time: ${this.remainingTime}`, { fontSize: '32px', fill: '#fff' });

        // Create player spaceship
        this.spaceship = this.physics.add.sprite(100, 100, 'spaceship');
        this.spaceship.setCollideWorldBounds(true);

        // Create a group for collectible items
        this.materials = this.physics.add.group();

        // Generate materials
        this.createMaterial('iron', 10);
        this.createMaterial('aluminum', 20);
        this.createMaterial('lithium', 30);
        this.createMaterial('diamond', 50);

        // Collision detection between spaceship and materials
        this.physics.add.overlap(this.spaceship, this.materials, this.collectMaterial, null, this);

        // Set up controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // Set a timer event to count down every second
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    createMaterial(type, points) {
        for (let i = 0; i < 5; i++) { // Generate 5 of each material
            const material = this.materials.create(
                Phaser.Math.Between(50, 750),
                Phaser.Math.Between(50, 550),
                type
            );
            material.setCollideWorldBounds(true);
            material.points = points;
        }
    }

    collectMaterial(spaceship, material) {
        material.disableBody(true, true);
        this.score += material.points;
        this.scoreText.setText('Score: ' + this.score);

        this.itemsCollected++;
        if (this.itemsCollected === this.totalItems) {
            this.endGame();
        }
    }

    updateTimer() {
        // Decrease remaining time by 1 second
        this.remainingTime--;
        this.timerText.setText(`Time: ${this.remainingTime}`);

        // Check if time has run out
        if (this.remainingTime <= 0) {
            this.endGame();
        }
    }

    endGame() {
        this.timerEvent.remove(); // Stop the timer
        this.showGameOver();
    }

    showGameOver() {
        // Game over overlay and text
        const overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.7);
        overlay.setOrigin(0, 0);

        const gameOverText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 100,
            'Game Over',
            { fontSize: '32px', fill: '#fff', align: 'center' }
        );
        gameOverText.setOrigin(0.5);

        const finalScoreText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            `Final Score: ${this.score}`,
            { fontSize: '24px', fill: '#fff' }
        );
        finalScoreText.setOrigin(0.5);

        // Play again button
        const playAgainButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 100,
            'Play Again',
            { fontSize: '24px', fill: '#fff', backgroundColor: '#2196F3', padding: { x: 20, y: 10 } }
        );
        playAgainButton.setOrigin(0.5);
        playAgainButton.setInteractive({ useHandCursor: true });

        playAgainButton.on('pointerdown', () => {
            this.scene.restart();
        });
    }

    update() {
        // Player movement controls
        if (this.cursors.left.isDown) this.spaceship.setVelocityX(-160);
        else if (this.cursors.right.isDown) this.spaceship.setVelocityX(160);
        else this.spaceship.setVelocityX(0);

        if (this.cursors.up.isDown) this.spaceship.setVelocityY(-160);
        else if (this.cursors.down.isDown) this.spaceship.setVelocityY(160);
        else this.spaceship.setVelocityY(0);
    }
}

// Create the game configuration and initialize the game
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { gravity: 0, debug: false }
    },
    scene: GameScene
};

const game = new Phaser.Game(config);
