import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Load assets for the spaceship and collectible materials
        this.load.image('spaceship', 'path/to/spaceship.png'); // Replace with your spaceship image path
        this.load.image('iron', 'path/to/iron.png');           // Replace with your Iron image path
        this.load.image('aluminum', 'path/to/aluminum.png');   // Replace with your Aluminum image path
        this.load.image('lithium', 'path/to/lithium.png');     // Replace with your Lithium image path
        this.load.image('diamond', 'path/to/diamond.png');     // Replace with your Diamond image path
    }

    create() {
        // Initialize score
        this.score = 0;
        // Display score on the screen
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

        // Create player spaceship
        this.spaceship = this.physics.add.sprite(100, 100, 'spaceship');
        this.spaceship.setCollideWorldBounds(true); // Prevent the spaceship from leaving the world bounds

        // Create a group for collectible items
        this.materials = this.physics.add.group();

        // Generate materials (4 types)
        this.createMaterial('iron', 10);
        this.createMaterial('aluminum', 20);
        this.createMaterial('lithium', 30);
        this.createMaterial('diamond', 50);

        // Collision detection between spaceship and materials
        this.physics.add.overlap(this.spaceship, this.materials, this.collectMaterial, null, this);

        // Set up controls
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    createMaterial(type, points) {
        for (let i = 0; i < 5; i++) { // Generate 5 of each material
            const material = this.materials.create(
                Phaser.Math.Between(50, 750),
                Phaser.Math.Between(50, 550),
                type
            );
            material.setCollideWorldBounds(true);
            material.points = points; // Assign points for each material type
        }
    }

    collectMaterial(spaceship, material) {
        // Remove the material after collecting it
        material.disableBody(true, true);

        // Update the score based on the type of material collected
        this.score += material.points; // Use the points assigned to the material
        this.scoreText.setText('Score: ' + this.score);
    }

    update() {
        // Handle player movement
        if (this.cursors.left.isDown) {
            this.spaceship.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.spaceship.setVelocityX(160);
        } else {
            this.spaceship.setVelocityX(0);
        }

        if (this.cursors.up.isDown) {
            this.spaceship.setVelocityY(-160);
        } else if (this.cursors.down.isDown) {
            this.spaceship.setVelocityY(160);
        } else {
            this.spaceship.setVelocityY(0);
        }
    }
}

// Create the game configuration and initialize the game
const config = {
    type: Phaser.AUTO,
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
