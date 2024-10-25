// client.js
import { drawObstacles, checkCollision } from './map.js';
import { playerX, playerY, updatePlayer, drawPlayer } from './player.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Taille du canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Connexion au serveur
const socket = io();

// Stocker les autres joueurs
let otherPlayers = {};

let obstacles = [];
// Gérer les touches enfoncées
let keys = {};

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

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
  const cameraX = Math.min(Math.max(playerX - canvas.width / 2, 0), 20000 - canvas.width);
  const cameraY = Math.min(Math.max(playerY - canvas.height / 2, 0), 20000 - canvas.height);
  // Effacer le canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid(cameraX, cameraY);



  // Dessiner le joueur local
  drawPlayer(ctx, cameraX, cameraY);
  
  // Dessiner les obstacles
  drawObstacles(ctx, cameraX, cameraY);
  // Mettre à jour la position du joueur local
  updatePlayer(keys, checkCollision);


  // Dessiner les autres joueurs
  drawOtherPlayers(ctx, cameraX, cameraY);

  // Envoyer la position du joueur au serveur
  socket.emit('playerMovement', { x: playerX, y: playerY });

  requestAnimationFrame(gameLoop);
}

gameLoop();
