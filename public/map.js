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
  

  
