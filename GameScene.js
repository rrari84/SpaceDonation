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

        // Scale the spaceship if needed
        this.spaceship.setScale(0.3); // Adjust this value as needed

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
            material.setScale(0.2); // Adjust this value as needed
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
        this.remainingTime--;
        this.timerText.setText(`Time: ${this.remainingTime}`);

        if (this.remainingTime <= 0) {
            this.endGame();
        }
    }

    endGame() {
        this.timerEvent.remove(); // Stop the timer
        this.physics.pause(); // Stop all physics movement
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

        // Calculate suggested donation amount
        const suggestedDonation = Math.max(1, Math.ceil(this.score * 0.1)); // Minimum $1 donation

        // Play again button
        const playAgainButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 60,
            'Play Again',
            {
                fontSize: '24px',
                fill: '#fff',
                backgroundColor: '#2196F3',
                padding: { x: 20, y: 10 }
            }
        );
        playAgainButton.setOrigin(0.5);
        playAgainButton.setInteractive({ useHandCursor: true });

        playAgainButton.on('pointerdown', () => {
            this.scene.restart();
        });

        // Donation button
        const donateButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 140,
            `Donate $${suggestedDonation} to UNICEF`,
            {
                fontSize: '24px',
                fill: '#fff',
                backgroundColor: '#4CAF50',
                padding: { x: 20, y: 10 }
            }
        );
        donateButton.setOrigin(0.5);
        donateButton.setInteractive({ useHandCursor: true });

        donateButton.on('pointerdown', () => {
            window.open('https://www.paypal.com/US/fundraiser/charity/2400352', '_blank');
        });
    }

    update() {
        if (!this.cursors) return;

        // Reset velocity
        this.spaceship.setVelocity(0);

        // Movement speed
        const speed = 300;

        // Handle keyboard input
        if (this.cursors.left.isDown) {
            this.spaceship.setVelocityX(-speed);
        }
        else if (this.cursors.right.isDown) {
            this.spaceship.setVelocityX(speed);
        }

        if (this.cursors.up.isDown) {
            this.spaceship.setVelocityY(-speed);
        }
        else if (this.cursors.down.isDown) {
            this.spaceship.setVelocityY(speed);
        }
    }
}

// Initialize the game with configuration
window.onload = function() {
    const config = {
        type: Phaser.AUTO,
        parent: 'game-container',
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: 0,
                debug: false
            }
        },
        scene: GameScene
    };

    const game = new Phaser.Game(config);
}