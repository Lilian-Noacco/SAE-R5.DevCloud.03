// map.js
import { getObstacles } from './client.js';

  // Dessiner les obstacles sur la carte
  export function drawObstacles(ctx, cameraX, cameraY) {
    ctx.fillStyle = 'gray';  // Couleur des obstacles
    const obstacles = getObstacles(); // Obtenir les obstacles actuels
    obstacles.forEach((obstacle) => {
      const drawX = obstacle.x - cameraX;
      const drawY = obstacle.y - cameraY;
      ctx.fillRect(drawX, drawY, obstacle.width, obstacle.height);
    });
  }
  
  // Fonction pour vérifier la collision du joueur avec un obstacle
  export function checkCollision(x, y) {
    const obstacles = getObstacles();
    for (let obstacle of obstacles) {
      if (x - 15 < obstacle.x + obstacle.width &&
          x + 15 > obstacle.x &&
          y - 15 < obstacle.y + obstacle.height &&
          y + 15> obstacle.y) {
        return true;  // Collision détectée
      }
    }
    return false;  // Pas de collision
  }
  
