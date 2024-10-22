// map.js

export const obstacles = [
    { x: 300, y: 400, width: 100, height: 100 },
    { x: 600, y: 700, width: 150, height: 50 },
    { x: 1200, y: 900, width: 200, height: 200 }
  ];
  
  // Dessiner les obstacles sur la carte
  export function drawObstacles(ctx, cameraX, cameraY) {
    ctx.fillStyle = 'gray';  // Couleur des obstacles
  
    obstacles.forEach((obstacle) => {
      const drawX = obstacle.x - cameraX;
      const drawY = obstacle.y - cameraY;
      ctx.fillRect(drawX, drawY, obstacle.width, obstacle.height);
    });
  }
  
  // Fonction pour vérifier la collision du joueur avec un obstacle
  export function checkCollision(x, y) {
    for (let obstacle of obstacles) {
      if (x < obstacle.x + obstacle.width &&
          x + 30 > obstacle.x &&
          y < obstacle.y + obstacle.height &&
          y + 30 > obstacle.y) {
        return true;  // Collision détectée
      }
    }
    return false;  // Pas de collision
  }
  