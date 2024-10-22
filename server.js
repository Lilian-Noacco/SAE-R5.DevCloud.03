const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const mapSize = 2000;  // Taille de la carte
let obstacles = [];

// Fonction pour générer des obstacles aléatoires
function generateMap() {
  obstacles = [];
  const numberOfObstacles = 10; // Par exemple, 10 obstacles
  for (let i = 0; i < numberOfObstacles; i++) {
    let obstacle = {
      x: Math.floor(Math.random() * (mapSize - 200)) + 100,  // Position aléatoire
      y: Math.floor(Math.random() * (mapSize - 200)) + 100,
      width: Math.floor(Math.random() * 150) + 50,  // Taille aléatoire
      height: Math.floor(Math.random() * 150) + 50,
    };
    obstacles.push(obstacle);
  }
}

generateMap();  // Génère la carte lors du démarrage du serveur
 
// Stocker les joueurs
let players = {};

io.on('connection', (socket) => {
  console.log('Un joueur s\'est connecté : ' + socket.id);
  

  // Ajouter un nouveau joueur
  players[socket.id] = {
    x: Math.random() * 500,  // Position de départ aléatoire
    y: Math.random() * 500,
  };
  
  socket.emit('mapData', obstacles);
  // Envoyer la liste des joueurs actuels au nouvel arrivant
  socket.emit('currentPlayers', players);
  
  // Informer les autres joueurs de la nouvelle connexion
  socket.broadcast.emit('newPlayer', { id: socket.id, x: players[socket.id].x, y: players[socket.id].y });
  
  socket.on('shootProjectile', (projectileData) => {
    socket.broadcast.emit('projectileFired', projectileData);
  });
  
  // Recevoir les mises à jour des positions des joueurs
  socket.on('playerMovement', (movementData) => {
    if (players[socket.id]) {
      players[socket.id].x = movementData.x;
      players[socket.id].y = movementData.y;
      
      // Diffuser le mouvement du joueur à tous les autres
      socket.broadcast.emit('playerMoved', { id: socket.id, x: movementData.x, y: movementData.y });
    }
  });
  
  // Gérer la déconnexion
  socket.on('disconnect', () => {
    console.log('Un joueur s\'est déconnecté : ' + socket.id);
    
    // Supprimer le joueur de la liste
    delete players[socket.id];
    
    // Informer les autres clients de la déconnexion
    io.emit('playerDisconnected', socket.id);
  });
});

app.use(express.static('public'));

server.listen(3000, () => {
  console.log('Serveur lancé sur le port 3000');
});
