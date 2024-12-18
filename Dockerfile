# Utiliser l'image officielle de Node.js comme base
FROM node:18

# Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /usr/src/app

# Installer git pour cloner le dépôt
RUN apt-get update && apt-get install -y git && apt-get clean

# Cloner le dépôt GitHub
RUN git clone https://github.com/Lilian-Noacco/SAE-R5.DevCloud.03/ -b agario .

# Installer les dépendances du projet
RUN npm install

# Exposer le port utilisé par l'application
EXPOSE 3000

# Commande par défaut pour démarrer l'application
CMD ["npm", "start"]
