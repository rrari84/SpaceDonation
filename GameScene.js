class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.totalItems = 20;
        this.itemsCollected = 0;
    }

    preload() {
        // Load assets for the spaceship and collectible materials
        this.load.image('spaceship', 'Assets/Items_Space/spaceship.png'); // Replace with your spaceship image path
        this.load.image('iron', 'Assets/Items_Space/iron.png');           // Replace with your Iron image path
        this.load.image('aluminum', 'Assets/Items_Space/aluminum.png');   // Replace with your Aluminum image path
        this.load.image('lithium', 'Assets/Items_Space/lithium.png');     // Replace with your Lithium image path
        this.load.image('diamond', 'Assets/Items_Space/diamond.png');     // Replace with your Diamond image path
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

        this.itemsCollected++;
        if (this.itemsCollected === this.totalItems) {
            this.showGameOver();
        }
    }

    showGameOver() {
        const overlay = this.add.rectangle(0, 0,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000, 0.7);
        overlay.setOrigin(0, 0);

        const gameOverText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 100,
            'Congratulations,\nyou collected all items!', {
                fontSize: '32px',
                fill: '#fff',
                align: 'center'
            }
        );
        gameOverText.setOrigin(0.5);


        const finalScoreText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            `Final Score: ${this.score}`,
            {
                fontSize: '24px',
                fill: '#fff'
            }
        );
        finalScoreText.setOrigin(0.5);

        const donateButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 100,
            'Donate to Space Collection',
            {
                fontSize: '24px',
                fill: '#fff',
                backgroundColor: '4CAF50',
                padding: {x: 20, y: 10}
            }
        );
        donateButton.setOrigin(0.5);
        donateButton.setInteractive({ useHandCursor: true});

        // Add hover effect
        donateButton.on('pointerover', () => {
            donateButton.setStyle({ fill: '#4CAF50', backgroundColor: '#fff' });
        });
        donateButton.on('pointerout', () => {
            donateButton.setStyle({ fill: '#fff', backgroundColor: '#4CAF50' });
        });

        // Handle donation click
        donateButton.on('pointerdown', () => {
            const donationAmount = (this.score * 0.1).toFixed(2); // $0.10 per point
            this.handleDonation(donationAmount);
        });

        const playAgainButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 160,
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

        // Add hover effect
        playAgainButton.on('pointerover', () => {
            playAgainButton.setStyle({ fill: '#2196F3', backgroundColor: '#fff' });
        });
        playAgainButton.on('pointerout', () => {
            playAgainButton.setStyle({ fill: '#fff', backgroundColor: '#2196F3' });
        });

        // Handle play again click
        playAgainButton.on('pointerdown', () => {
            this.scene.restart();
        });
    }

    handleDonation(amount) {
        // Update the HTML modal with the donation suggestion
        document.getElementById('donation-suggestion').textContent =
            `Based on your score, we suggest a donation of $${amount}`;
        document.getElementById('donation-modal').style.display = 'block';

        // Show overlay in game
        const modalOverlay = this.add.rectangle(0, 0,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000, 0.8);
        modalOverlay.setOrigin(0, 0);

        // Add close button for the modal
        const closeButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 100,
            'Close',
            {
                fontSize: '24px',
                fill: '#fff',
                backgroundColor: '#ff4444',
                padding: { x: 20, y: 10 }
            }
        );
        closeButton.setOrigin(0.5);
        closeButton.setInteractive({ useHandCursor: true });

        // Add hover effect for close button
        closeButton.on('pointerover', () => {
            closeButton.setStyle({ fill: '#ff4444', backgroundColor: '#fff' });
        });
        closeButton.on('pointerout', () => {
            closeButton.setStyle({ fill: '#fff', backgroundColor: '#ff4444' });
        });

        // Handle click for close button
        closeButton.on('pointerdown', () => {
            // Remove game overlay
            modalOverlay.destroy();
            closeButton.destroy();

            // Hide HTML modal
            document.getElementById('donation-modal').style.display = 'none';

            // Show thank you message
            const thankYouText = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY + 220,
                'Thank you for supporting UNICEF USA!',
                {
                    fontSize: '20px',
                    fill: '#fff',
                    backgroundColor: '#000',
                    padding: { x: 10, y: 5 }
                }
            );
            thankYouText.setOrigin(0.5);
        });

        // Add click event listener to HTML modal close button if needed
        document.querySelector('.donate-button').onclick = () => {
            // Remove game overlay
            modalOverlay.destroy();
            closeButton.destroy();

            // Hide HTML modal
            document.getElementById('donation-modal').style.display = 'none';

            // Show thank you message in game
            const thankYouText = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY + 220,
                'Thank you for supporting UNICEF USA!',
                {
                    fontSize: '20px',
                    fill: '#fff',
                    backgroundColor: '#000',
                    padding: { x: 10, y: 5 }
                }
            );
            thankYouText.setOrigin(0.5);
        };
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
