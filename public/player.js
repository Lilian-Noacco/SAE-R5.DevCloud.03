// player.js

export let playerX = 1000;
export let playerY = 1000;
const playerSpeed = 5;

// Mettre à jour la position du joueur
export function updatePlayer(keys, checkCollision) {
  let newX = playerX;
  let newY = playerY;

  // Gérer les déplacements en fonction des touches
  if (keys['ArrowUp']) newY -= playerSpeed;
  if (keys['ArrowDown']) newY += playerSpeed;
  if (keys['ArrowLeft']) newX -= playerSpeed;
  if (keys['ArrowRight']) newX += playerSpeed;

  // Vérifier les collisions avant d'appliquer le déplacement
  if (!checkCollision(newX, playerY)) playerX = Math.max(0, Math.min(20000, newX));
  if (!checkCollision(playerX, newY)) playerY = Math.max(0, Math.min(20000, newY));
}

// Dessiner le joueur
export function drawPlayer(ctx, cameraX, cameraY) {
  const playerDrawX = playerX - cameraX;
  const playerDrawY = playerY - cameraY;
  ctx.fillStyle = 'red';
  ctx.fillRect(playerDrawX - 15, playerDrawY - 15, 30, 30);
}
