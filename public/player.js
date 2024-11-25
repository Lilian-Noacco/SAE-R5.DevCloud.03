// player.js
import { getObstacles, getProjectiles } from './client.js';

export class Player {
  constructor(startX = 1000, startY = 1000, health = 100) {
    this.x = startX;  // Position en x
    this.y = startY;  // Position en y
    this.speed = 5;   // Vitesse du joueur
    this.health = health;  // Vie du joueur
  }

  // Mettre à jour la position du joueur en fonction des touches
  update(keys) {
    let newX = this.x;
    let newY = this.y;

    // Gérer les déplacements en fonction des touches
    if (keys['z']) newY -= this.speed;
    if (keys['s']) newY += this.speed;
    if (keys['q']) newX -= this.speed;
    if (keys['d']) newX += this.speed;

    // Vérifier les collisions avant d'appliquer le déplacement
    if (!this.checkCollision(newX, this.y)) {
      this.x = Math.max(0, Math.min(20000, newX));
    }
    if (!this.checkCollision(this.x, newY)) {
      this.y = Math.max(0, Math.min(20000, newY));
    }
  }

  // Dessiner le joueur
  draw(ctx, cameraX, cameraY) {
    const playerDrawX = this.x - cameraX;
    const playerDrawY = this.y - cameraY;
    ctx.fillStyle = 'red';
    ctx.fillRect(playerDrawX - 15, playerDrawY - 15, 30, 30);
  }

  // Vérifier la collision avec les obstacles
  checkCollision(x, y) {
    const obstacles = getObstacles();
    for (let obstacle of obstacles) {
      if (x - 15 < obstacle.x + obstacle.width &&
          x + 15 > obstacle.x &&
          y - 15 < obstacle.y + obstacle.height &&
          y + 15 > obstacle.y) {
        return true;  // Collision détectée
      }
    }
    return false;  // Pas de collision
  }

  checkHit() {
    const projectiles = getProjectiles();
  
    // Vérifier si l'objet `projectiles` contient des données
    if (Object.keys(projectiles).length > 0) {
  
      // Itérer sur les projectiles des autres joueurs
      for (let projectileArray of Object.values(projectiles)) {
        for (let projectile of projectileArray) {  // Itérer sur chaque projectile
          if (
            this.x - 15 < projectile.x &&
            this.x + 15 > projectile.x &&
            this.y - 15 < projectile.y &&
            this.y + 15 > projectile.y
          ) {
            this.takeDamage(projectile.damage); // Collision détectée
          }
        }
      }
    }
  }

  drawHealthBarTopLeft(ctx) {
    const barWidth = 500;   // Largeur fixe pour la barre en haut de l'écran
    const barHeight = 50;   // Hauteur de la barre de vie
    const healthRatio = this.health / 100;
    //console.log(this.health);
    const healthBarWidth = barWidth * healthRatio;

    // Position en haut à gauche
    const xPos = 20;
    const yPos = 20;

    // Dessiner le fond de la barre de vie (gris)
    ctx.fillStyle = 'gray';
    ctx.fillRect(xPos, yPos, barWidth, barHeight);

    // Dessiner la barre de vie (vert)
    ctx.fillStyle = 'green';
    ctx.fillRect(xPos, yPos, healthBarWidth, barHeight);
  }

  // Réduire la vie en cas de dommages (par exemple si à l'extérieur d'une zone de sécurité)
  takeDamage(amount) {
    this.health = Math.max(0, this.health - amount);
    if (this.health <= 0) {
      console.log("Le joueur est mort !");
      // Gérer la mort du joueur si nécessaire
    }
  }


}
