// client.js
import { drawObstacles, shrinkSafeZone, isPlayerOutsideSafeZone, drawSafeZone } from './map.js';
import { Player } from './player.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let mouseX = 0;
let mouseY = 0;

// Taille du canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Connexion au serveur
const socket = io();

// Stocker les autres joueurs
let otherPlayers = {};

let obstacles = [];
let myProjectiles = []; // Projectiles du joueur local
let otherProjectiles = {}; // Projectiles des autres joueurs
// Gérer les touches enfoncées
let keys = {};

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

const player = new Player(); //On créé un joueur à partir de la classe

// export const obstacles = [
//  { x: 300, y: 400, width: 100, height: 100 },
//  { x: 600, y: 700, width: 150, height: 50 },
//  { x: 1200, y: 900, width: 200, height: 200 }
//];
// Recevoir les obstacles générés par le serveur
// Mettre à jour `obstacles` lorsqu'on reçoit les données du serveur
socket.on('mapData', (serverObstacles) => {
  console.log("Obstacles reçus:", serverObstacles);
  obstacles = serverObstacles;  // Mettre à jour les obstacles avec les données du serveur
});

// Fonction pour accéder aux obstacles à jour
export function getObstacles() {
  return obstacles;
}

export function getProjectiles() {
  return otherProjectiles;
}



// Recevoir la liste des joueurs actuels à la connexion
socket.on('currentPlayers', (players) => {
  otherPlayers = players;
});

// Recevoir l'information d'un nouveau joueur
socket.on('newPlayer', (playerInfo) => {
  otherPlayers[playerInfo.id] = { x: playerInfo.x, y: playerInfo.y };
});

// Recevoir l'information de déconnexion d'un joueur
socket.on('playerDisconnected', (playerId) => {
  delete otherPlayers[playerId];
});

// Recevoir les mises à jour des positions des autres joueurs
socket.on('playerMoved', (playerInfo) => {
  if (otherPlayers[playerInfo.id]) {
    otherPlayers[playerInfo.id].x = playerInfo.x;
    otherPlayers[playerInfo.id].y = playerInfo.y;
  }
});

function drawOtherPlayers(ctx, cameraX, cameraY) {
  for (let id in otherPlayers) {
    const player = otherPlayers[id];
    const otherPlayerDrawX = player.x - cameraX;
    const otherPlayerDrawY = player.y - cameraY;
    ctx.fillStyle = 'blue';  // Couleur des autres joueurs
    ctx.fillRect(otherPlayerDrawX - 15, otherPlayerDrawY - 15, 30, 30);
  }
}

canvas.addEventListener('click', () => {
  const speed = 10; // Vitesse du projectile
  const dx = mouseX - canvas.width / 2;
  const dy = mouseY - canvas.height / 2;
  const magnitude = Math.sqrt(dx * dx + dy * dy);
  const directionX = dx / magnitude;
  const directionY = dy / magnitude;
  const damage = 10;
  const projectile = {
    x: player.x,
    y: player.y,
    directionX: directionX,
    directionY: directionY,
    speed: speed,
    damage: damage,
  };

  myProjectiles.push(projectile);
  console.log("Projectile tiré");
  // Informer le serveur
  socket.emit('shootProjectile', projectile);
});

socket.on('projectileFired', (data) => {
  if (!otherProjectiles[data.id]) {
    otherProjectiles[data.id] = [];
  }
  otherProjectiles[data.id].push(data);
});

function updateProjectiles(projectiles) {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const projectile = projectiles[i];
    projectile.x += projectile.directionX * projectile.speed;
    projectile.y += projectile.directionY * projectile.speed;

    // Retirer les projectiles hors de la carte (par exemple, limites arbitraires)
    if (projectile.x < 0 || projectile.x > 20000 || projectile.y < 0 || projectile.y > 20000) {
      projectiles.splice(i, 1);
    }
  }
}

function drawProjectiles(ctx, projectiles, cameraX, cameraY) {
  projectiles.forEach((projectile) => {
    const drawX = projectile.x - cameraX;
    const drawY = projectile.y - cameraY;
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(drawX, drawY, 5, 0, Math.PI * 2);
    ctx.fill();
  });
}

canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
});

function drawCrosshair(ctx) {
  const size = 15;  // Taille du réticule

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 4;

  // Dessine une croix simple
  ctx.beginPath();
  // Ligne verticale
  ctx.moveTo(mouseX, mouseY - size);
  ctx.lineTo(mouseX, mouseY + size);
  // Ligne horizontale
  ctx.moveTo(mouseX - size, mouseY);
  ctx.lineTo(mouseX + size, mouseY);
  ctx.stroke();
}

function drawGrid(cameraX, cameraY) {
    const gridSize = 50;  // Taille des cases de la grille
  
    ctx.strokeStyle = '#d3d3d3';  // Couleur des lignes de la grille
  
    // Dessiner les lignes verticales de la grille
    for (let x = -cameraX % gridSize; x <= canvas.width; x += gridSize) { // Utiliser la largeur totale du canvas
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height); // Utiliser la hauteur du canvas
      ctx.stroke();
    }
  
    // Dessiner les lignes horizontales de la grille
    for (let y = -cameraY % gridSize; y <= canvas.height; y += gridSize) { // Utiliser la hauteur totale du canvas
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y); // Utiliser la largeur totale du canvas
      ctx.stroke();
    }
  }

function gameLoop() {
  // Calculer la position de la caméra
  const cameraX = Math.min(Math.max(player.x - canvas.width / 2, 0), 20000 - canvas.width);
  const cameraY = Math.min(Math.max(player.y - canvas.height / 2, 0), 20000 - canvas.height);


  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateProjectiles(myProjectiles);
  Object.values(otherProjectiles).forEach(updateProjectiles);

  player.checkHit();
  //shrinkSafeZone();
  //drawSafeZone(ctx, cameraX, cameraY)
  drawGrid(cameraX, cameraY);
  drawObstacles(ctx, cameraX, cameraY);
  drawCrosshair(ctx);

  drawProjectiles(ctx, myProjectiles, cameraX, cameraY);
  Object.values(otherProjectiles).forEach((projectiles) => {
    drawProjectiles(ctx, projectiles, cameraX, cameraY);
  });
    // Mise à jour des autres entités et déplacements

  
  player.draw(ctx, cameraX, cameraY);
  player.update(keys);

  // Dessiner les autres joueurs
  drawOtherPlayers(ctx, cameraX, cameraY);
  // Envoyer la position du joueur au serveur
  socket.emit('playerMovement', { x: player.x, y: player.y });
  player.drawHealthBarTopLeft(ctx); // Dessine la barre de vie en haut à gauche
  requestAnimationFrame(gameLoop);
}

gameLoop();
