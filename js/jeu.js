class Jeu {

    // Constructeur premier paramètres la difficulté et le 2eme est null sauf si on veux choisir la grille de départ
    constructor(diff = 0.6) {
        // Set of var
        this.historique = new Array();
        this.compt = 0;
        this.init = false;
        this.difficulty = diff;
        this.plateau = new Array(9);
        // Set of the tab 9x9
        for(let i = 0; i<9;i++) {
            this.plateau[i] = new Array(9);
            for(let j = 0; j<9;j++) {
                this.plateau[i][j] = new Case();
            }
        } 
    }

    getFreeCaseOnLine(l = 0) {
        let x = UT.getRowNumbers();
        while (x.length > 1) {
            let i = x.shift()-1;
            if(!this.plateau[l][i].haveValue()) {
                return i;
            }
        }
        return null;
    }

    getAllFreeCaseOnLine(l = 0) {
        let tab = new Array();
        let x = UT.getRowNumbers();
        while (x.length > 1) {
            let i = x.shift()-1;
            if(!this.plateau[l][i].haveValue()) {
                tab.push(i);
            }
        }
        return tab;
    }

    // Update l'affichage
    afficherPlateau(option = 0) {
        let cpt = 0;
        for(let i = 0; i<9;i++) {
            for(let j = 0; j<9;j++) {
                let c = document.getElementById("case"+cpt);
                if (option == 1) {
                    c.innerHTML = this.plateau[i][j].print(this.estDisponible(cpt));
                } else {
                    c.innerHTML = this.plateau[i][j].print(this.init);
                }
                
                cpt++
            }
        }
    }

    // démarre la partie
    start() {
        let combien = 0;
        for(let cpt = 0; cpt<81;cpt++) {
            let c = document.getElementById("case"+cpt).children[0].value;
            if (c) {
                this.plateau[this.getCos(cpt)[0]][this.getCos(cpt)[1]].value = c;
                combien++;
            }
        }
        if (combien == 0) {
            this.solution = UT.getFull();
            for(let cpt = 0; cpt<81;cpt++) {
                if (Math.random() > this.difficulty) {
                    this.plateau[this.getCos(cpt)[0]][this.getCos(cpt)[1]] = new Case(this.solution[this.getCos(cpt)[0]][this.getCos(cpt)[1]]);
                }
            }
        }
    }

    // Sort un tableau de toutes les valeurs possibles de la case passé en paramètres
    estDisponible(cpt) {
        let d = new Array();
        for(let i=0;i<10;i++) {
            d.push(i);
        }
        for(let i=0;i<9;i++) {
            d = UT.removeFromTab(d, this.plateau[i][this.getCos(cpt)[1]].getValeur() );
            d = UT.removeFromTab(d, this.plateau[this.getCos(cpt)[0]][i].getValeur() );
        }
        
        let tab = document.getElementsByClassName(document.getElementById("case"+cpt).classList[1]);
        for(let i in tab) {
            if(tab[i] && tab[i].id && tab[i].id != "case"+cpt) {
                let c = this.getCos(tab[i].id.replace("case", ""));
                d = UT.removeFromTab(d, this.plateau[c[0]][c[1]].getValeur());
            }
        }
        d = UT.removeFromTab(d, 0);
        return d;
    }

    // Fonction utilitaire pour avoir l'ID a partir des cordonnes X et Y
    getCpt(x, y) {
        return x*9+y;
    }

    // Fonction utilitaire pour avoir les cordonnes X et Y a partir d'un ID de case
    getCos(cpt) {
        let tab = new Array(2);
        tab[0] = parseInt(cpt/9);
        tab[1] = cpt%9;
        return tab;
    }

    // A chaque update de valeur est chargé de verifier si la valeur est correcte et l'update dans la matrice
    miseAJour() {
        let cpt = 0;
        for(let i = 0; i<9;i++) { // Each line
            for(let j = 0; j<9;j++) { // Each column
                let c = document.getElementById("case"+cpt).children[0];
                if(c.value != null && c.value != "" && c.value != 1 && c.value != 2 && c.value != 3 && c.value != 4 && c.value != 5 && c.value != 6 && c.value != 7 && c.value != 8 && c.value != 9) {
                    c.value = "";
                } else {
                    this.plateau[i][j].actual = c.value;
                }
                cpt++
            }
        }
    }

    // Verification de grille complete et correcte 
    // TODO Simplifier
    estFini() {

        // Verification des lignes
        for (let i in this.plateau) {
            if ((this.plateau[i].indexOf(0) !== -1) || (UT.isRepeat(this.plateau[i]))) {
                return false;
            }
        }

        // Verification des colones
        for (let count = 8; count>=0;count--) {
            let s = [];
            for (let i = 0; i < 9; i++) {
                if ((!/^[1-9]$/.test(this.plateau[i][count].getValeur())) || (s.indexOf(this.plateau[i][count].getValeur()) !== -1)) {
                    return false;
                }
                s.push(this.plateau[i][count].getValeur());
            }
        }

        // Verification des blocks
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                let block = [
                    this.plateau[(x*3)][(y*3)].getValeur(), this.plateau[(x*3)][(y*3)+1].getValeur(), this.plateau[(x*3)][(y*3)+2].getValeur(),
                    this.plateau[(x*3)+1][(y*3)].getValeur(), this.plateau[(x*3)+1][(y*3)+1].getValeur(), this.plateau[(x*3)+1][(y*3)+2].getValeur(),
                    this.plateau[(x*3)+2][(y*3)].getValeur(), this.plateau[(x*3)+2][(y*3)+1].getValeur(), this.plateau[(x*3)+2][(y*3)+2].getValeur()
                ];

                if ((block.indexOf(0) !== -1) || (UT.isRepeat(block))) {
                    return false;
                }
            }
        }
        return true;
    }


    // Fonction d'aide
    resolve() {
        let x = UT.getRowNumbers();
        while (x.length) {
            let i = x.shift()-1;
            let tab = this.getAllFreeCaseOnLine(i);
            if(tab.length >=1 && this.solution) {
                this.plateau[i][tab[0]].actual = this.solution[i][tab[0]];
                return true;
            } else if (tab.length >=1) {
                for (let j in tab) {
                    let t = this.estDisponible(this.getCpt(i,tab[j]));
                    if (t.length == 1) {
                        this.plateau[i][tab[j]].actual = t[0];
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
