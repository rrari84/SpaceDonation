import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Load assets (spaceship and material images)
        this.load.image('spaceship', 'path/to/spaceship.png'); // Replace with your spaceship image path
        this.load.image('material', 'path/to/material.png');   // Replace with your material image path
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

        // Generate materials (example: 10 materials at random positions)
        for (let i = 0; i < 10; i++) {
            const material = this.materials.create(
                Phaser.Math.Between(50, 750),
                Phaser.Math.Between(50, 550),
                'material'
            );
            material.setCollideWorldBounds(true);
        }

        // Collision detection between spaceship and materials
        this.physics.add.overlap(this.spaceship, this.materials, this.collectMaterial, null, this);

        // Set up controls
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    collectMaterial(spaceship, material) {
        // Remove the material after collecting it
        material.disableBody(true, true);

        // Update the score
        this.score += 10; // Adjust score increment as desired
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

export default GameScene;

// Create the gameScene configuration and initialize the gameScene
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

const gameScene = new Phaser.Game(config);
