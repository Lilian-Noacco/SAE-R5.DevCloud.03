// map.js

import { getObstacles } from './client.js';
// Position et rayon de la zone de sécurité

//A définir par le serveur via un msg
let safeZoneX = 100;
let safeZoneY = 100;
let safeZoneRadius = 5000;
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
  

export function shrinkSafeZone() {
  if (safeZoneRadius > 250) {
    safeZoneRadius -= 1;
    console.log("Shrinking");
  }
}

export function isPlayerOutsideSafeZone(playerX, playerY) {
  const distanceToCenter = Math.sqrt(
    Math.pow(playerX - safeZoneX, 2) + Math.pow(playerY - safeZoneY, 2)
  );
  return distanceToCenter > safeZoneRadius;
}

export function drawSafeZone(ctx, cameraX, cameraY) {
  ctx.beginPath();
  ctx.arc(safeZoneX - cameraX, safeZoneY - cameraY, safeZoneRadius, 0, Math.PI * 2);
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 3;
  ctx.stroke();
}
  
