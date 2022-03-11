class Case {

    // Constructeur avec paramètres pour définir la valeur
    constructor(n = null) {
        // Set of var
        this.value = null;
        this.actual = null;

        if (n) {
            this.value = n;
        }
    }

    // Permet de voir si une valeur est définie
    haveValue() {
        return (this.value != "" && this.value != null) || (this.actual != "" && this.actual != null);
    }

    // Get la valeur ou false a défaut
    getValeur() {
        if (this.value) {
            return this.value;
        }
        if (this.actual) {
            return this.actual;
        }
        return false;
    }

    // Gere l'affichage de la case au format html
    print(init = false) {
        // Si grille initiale
        if (this.value) {
            return "<h1>"+this.value+"</h1>";
        }
        // Si demande affichage de valeurs possibles
        if (init) {
            // Valeur set par user
            if (this.actual) {
                return `<p style="font-size: x-large;">`+this.actual+`</p>`;
            }
            // Liste des possibles
            let s = "<p>";
            for (let i of init) {
                s+=i+" ";
            }
            s+="</p>";
            return s;
        }
        // Valeur actuelle
        if(this.actual) {
            return `<input type="text" value="`+this.actual+`">`;
        }
        // Pas de valeurs
        return `<input type="text">`;
    }

}
