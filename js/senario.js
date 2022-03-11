// VARIABLES
let jeu;
let affichage = 0;
let aide = 0;
let diff = 0.7;

// FUNCTIONS

// Vérifie si le jeu est terminé et agit en consequences
function verifier() {
    if (jeu.estFini()) {
        jeu.start();
        document.getElementById("message").innerText = "Vous avez gagné ! Vous avez utilisé " + aide + " aide(s)";
        jeu.afficherPlateau();
    } else {
        document.getElementById("message").innerText = "Vous n'avez pas une grille correcte";
    }
}

// Donne une aide si c'est possible
function aides() {
    if (jeu.resolve()) {
        aide++;
        document.getElementById("message").innerText = "Vous avez obtenue une aide";
        jeu.afficherPlateau();
    } else {
        document.getElementById("message").innerText = "Il n'y a pas d'aide disponible";
    }
}

// Affiche les valeurs possible de chaque cases
function possible() {
    if (document.getElementById("start").style.display == "inline") return;
    if (affichage == 0 ) {
        affichage = 1;
    } else if (affichage == 1) {
        affichage = 0;
    } 
    jeu.afficherPlateau(affichage);
}

// L'utilisateur a choisis de définir une grille personnelle
function choisir() {
    jeu = new Jeu(diff);
    document.getElementById("start").style.display = "inline";
    document.getElementById("verification").style.display = "none";
    document.getElementById("possible").style.display = "none";
    document.getElementById("resolve").style.display = "none";
    document.getElementById("choisir").style.display = "none";
    document.getElementById("restart").value = "Grille Automatique";
    document.getElementById("message").innerText = "Choisissez votre grille";
    jeu.afficherPlateau(affichage);
}

// Début du jeux et mise en place de l'interface
function start() {
    affichage = 0;
    document.getElementById("start").style.display = "none";
    document.getElementById("restart").style.display = "inline";
    document.getElementById("verification").style.display = "inline";
    document.getElementById("possible").style.display = "inline";
    document.getElementById("resolve").style.display = "inline";
    document.getElementById("choisir").style.display = "inline";
    document.getElementById("restart").value = "Restart";
    document.getElementById("message").innerText = "Début du jeux";
    jeu.start();
    jeu.afficherPlateau(affichage);
}

// Nouvelle partie simple
function nouvellePartie() {
    jeu = new Jeu(diff);
    jeu.afficherPlateau(affichage);
    start();
}

function difficulty() {
    diff = document.getElementById("difficulty").value;
    nouvellePartie();
}

// HOOKS

// Clavier
function keyPress(e) {
    if (e.key == "a" || e.key == "A") {
        nouvellePartie();
    } else if (e.key == "z" || e.key == "Z") {
        choisir();
    } else if (e.key == "e" || e.key == "E") {
        verifier();
    } else if (e.key == "r" || e.key == "R") {
        aides();
    } else if (e.key == "t" || e.key == "T") {
        possible();
    }
}
document.addEventListener('keypress', keyPress);

// Chargement
window.addEventListener("load", function () {
    nouvellePartie();
});

// Update
function miseAJour() {
    jeu.miseAJour();
    jeu.afficherPlateau();
}
document.getElementById("jeu").addEventListener('change', miseAJour);