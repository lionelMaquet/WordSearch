let slider = document.getElementById("myRange")
let sliderValue = slider.value
let numberOfRows = sliderValue;
let numberOfCols = sliderValue;
let insertedWords = [];
let motsObjets = [];

let databaseMots = [ "angle", "armoire", "banc", "bureau", "cabinet", "carreau", "chaise", "classe", "clé",
                    "coin", "couloir", "dossier", "eau", "école", "écriture", "entrée", "escalier", "étagère",
                    "étude", "extérieur", "fenêtre", "intérieur", "lavabo", "lecture", "lit", "marche",
                    "matelas", "maternelle", "meuble", "mousse", "mur", "peluche", "placard", "plafond",
                    "porte", "poubelle", "radiateur", "rampe", "récréation", "rentrée",
                    "rideau", "robinet", "salle", "savon", "serrure", "serviette", "siège", "sieste", "silence",
                    "sol", "sommeil", "sonnette", "sortie", "table", "tableau", "tabouret", "tapis", "tiroir", "toilette", "vitre",
                    "argent","travail","bicyclette","saturne","rodeo","blagueur","étonnement","surprise","devinette","tableau","peinture",
                "artistique","débrouillard"]

let tousLesMots = []


// création de la grille 

function createGrid(rows,cols) { 
    let grid = []
    for (let i = 0; i< rows; i++) {
        grid.push([])
        for (let y = 0; y < cols ; y++) {
            grid[i].push(0)
        }

    }

    return grid

}

let grille = createGrid(numberOfRows,numberOfCols) 

// création de la classe 

class mot { 

    constructor(nouvMot) {
        this.letters = nouvMot.split("");
        this.length = this.letters.length;
        this.pos = []
        this.direction = "horizontal" //Horizontale de base
        
    }
}

/***/

function insertWord(mot) {
    if (horizontalCheck(mot) === false) { // effectue le check vertical si l'horizontal n'est pas OK 
    verticalCheck(mot);}
    if (verticalCheck(mot) === false) { // effectue une position random si le check horizontal n'est pas OK non plus
        randomPos(mot)
    }

    
    if (mot.direction === "horizontal"){ // Insère les lettres aux bonnes positions dans le cas d'un mot horizontal
        for (let i = 0;i < mot.length;i++) {
            grille[mot.pos[0]][mot.pos[1] + i] = mot.letters[i]
        }
    }

    else if (mot.direction === "vertical") { // insère les lettres aux bonnes positions dans le cas d'un mot vertical
        for (let i = 0;i < mot.length;i++) {
            grille[mot.pos[0]+i][mot.pos[1]] = mot.letters[i]
        }

    }

    motsObjets.push(mot)
    
}


function horizontalCheck(mot) { // Vérifier si une position horizontale ayant des lettres communes peut-être trouvée

    for (let i = 0; i< numberOfRows; i++) { //pour chaque rangée

        for (each of grille[i]) { //chaque élément de la range

            if (mot.letters.includes(each) && // Si la lettre est commune 
                mot.letters.indexOf(each) <= grille[i].indexOf(each) && // et que la colonne n'est pas trop rapprochée du bord gauche
                  mot.letters.length - mot.letters.indexOf(each) <= (numberOfCols -1 ) - grille[i].indexOf(each)   // ou du bord droit
                  
                ) {
                    if(noHorLet(mot,[i,grille[i].indexOf(each)])) {            // Si le mot à cette position ne remplace pas d'autres lettres
                    let startPosition = [i,grille[i].indexOf(each)-mot.letters.indexOf(each)]; 
                    mot.pos = startPosition // alors, la fonction définit la position de départ du mot 
                    return startPosition  // retourne les coordonnées de la position de départ [index de la rangée, index de la colonne]
                    }
                }
            
        }
        
    }

    return false

}

function verticalCheck(mot) { //fonctionnement semblable au check horizontal 

    for (let i = 0; i< numberOfRows; i++) { 

        for (each of grille[i]) { 

            if ((mot.letters.includes(each)) && 
                (mot.letters.indexOf(each) <= i) && 
                  ((mot.letters.length- 1) - (mot.letters.indexOf(each))) <= (numberOfRows -1  ) - i)  
                  
                 {
                   if(noVerLet(mot,[i,grille[i].indexOf(each)])) {
                    let startPosition = [i-mot.letters.indexOf(each),grille[i].indexOf(each)];
                    mot.direction = "vertical";
                    mot.pos = startPosition;
                    
                    return startPosition  
                   }
                }
            
        }
        
    }

    return false

}


function noHorLet(mot,posDepart) { //noHorLet = no Horizontal Letter; renvoie true si la voie est libre ou si les lettres sur le chemin sont communes 
    
    let horSpace = [] //contiendra tous les emplacements compris entre la position de départ et la longueur du mot 
    
    for (let i = 0; i < mot.length;i++) {
        horSpace.push(grille[posDepart[0]][(posDepart[1]- mot.letters.indexOf(each))+i])
    }


    let spaceIsFree = !horSpace.some(function(element){
    
        return (element != 0 && element != undefined
            && grille[posDepart[0]][posDepart[1] - mot.letters.indexOf(each)+ horSpace.indexOf(element)] != mot.letters[horSpace.indexOf(element)]) 
    });

    return spaceIsFree

}

function noHorLetRandom(mot,posDepart) { //renvoie true si aucune autre lettre ou une lettre correspondante ne gène  
    
    let horSpace = []
    
    for (let i = 0; i < mot.length;i++) {
        horSpace.push(grille[posDepart[0]][(posDepart[1])+i])
    }


    let spaceIsFree = !horSpace.some(function(element){
    
    

        return (element != 0 && element != undefined
            && grille[posDepart[0]][posDepart[1] + horSpace.indexOf(element)] != mot.letters[horSpace.indexOf(element)]) 
    });

    return spaceIsFree

}

function noVerLet(mot,posDepart) { //renvoie true si aucune autre lettre ou une lettre correspondante ne gène  
    
    let verSpace = []
    
    for (let i = 0; i < mot.length;i++) {
        verSpace.push(grille[(posDepart[0] - mot.letters.indexOf(each))+i][posDepart[1]])
    }

    let spaceIsFree = !verSpace.some(function(element){
    
        return (element != 0 && element != undefined
            && grille[posDepart[0]][posDepart[1] - mot.letters.indexOf(each) + verSpace.indexOf(element)] != mot.letters[verSpace.indexOf(element)]) 
            // spaceIsFree regarde si la zone est libre
    });

    return spaceIsFree

}

function noVerLetRandom(mot,posDepart) { //renvoie true si aucune autre lettre ou une lettre correspondante ne gène  
    
    let verSpace = []
    
    for (let i = 0; i < mot.length;i++) {
        verSpace.push(grille[posDepart[0] +i][posDepart[1]])
    }


    

    let spaceIsFree = !verSpace.some(function(element){
    
        return (element != 0 && element != undefined
            && grille[posDepart[0]][posDepart[1] + verSpace.indexOf(element)] != mot.letters[verSpace.indexOf(element)]) 
            // spaceIsFree regarde si la zone est libre
    });

    return spaceIsFree

}

function randomPos(mot) { //définit la position du mot - ne return rien 

    let randStart = []
    let found = false
    let counter = 0
    do {    

        let xHor = Math.floor(Math.random()* numberOfRows )
        let yHor = Math.floor(Math.random()*(numberOfCols - mot.letters.length))
        let xVer = Math.floor(Math.random()*(numberOfRows - mot.letters.length))
        let yVer = Math.floor(Math.random()*numberOfCols)

        if (noHorLetRandom(mot,[xHor,yHor])) {
           
            found = true; 
            mot.pos = [xHor,yHor]
        }
        else if (noVerLetRandom(mot,[xVer,yVer])) {
     
            found = true; 
            mot.pos = [xVer,yVer]
            mot.direction = "vertical"
        }

        counter++
       

        if (counter === 200) {
            alert("Il y a eu un petit problème, veuillez rafraîchir la page!")
            
            
            return false;
            
           
        }
        
    } while ( found === false)

}

function randomLetter(){

    let alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
    let randomNumber = Math.floor(Math.random()*26);
    return alphabet[randomNumber];

}


function fillWithRandomLetters() { //remplit les cases non-utilisées par des lettres random 
    for (let i = 0;i<grille.length;i++) {
        for (each of grille[i]) {

            if (each === 0) {
               
                grille[i][grille[i].indexOf(each)] = randomLetter()
            }

        }
    }
}

function reverseString(word) { // pour un mot sur deux, inverse l'ordre des lettres afin de les insérer en sens inverse dans le tableau 
                                // cette solution n'est peut-être pas optimale 

    let myArray = word.split("")
    let reverseArray = myArray.reverse();
    let reversedWord = reverseArray.join("")
    return reversedWord
}

function randomWord() {

    let x = Math.floor(Math.random()* tousLesMots.length)
    return tousLesMots.splice(x,1)
    
}

startNewGrid()

slider.addEventListener("click", function () {
  startNewGrid()})

/* INTEGRATION DU GENERATEUR AU HTML */

function gridToHtml() {


    let table = ''
    let numRows = numberOfRows
    let numCols = numberOfCols
    
    table += "<table id='myTable'>"
    
            for (let i = 0; i< numRows;i++) {
                table += "<tr>"
    
                for (let y = 0; y < numCols; y++) {
    
                    table += `<td id='row${i}col${y}'>`
                    table += grille[i][y]
                    table += "</td>"
                }
    
    
    
                table += "</tr>"
    
            }
    
    table += "</table"
    document.getElementById("tableSpace").innerHTML = table

}


// Affichage des mots à trouver 

function displayWords() {

    let motsAAfficher = ""
    let motsAAfficher2 = "";
    let motsAAfficher3 = "";
    let motsAAfficher4 = ""

    for (let i = 0; i < insertedWords.length ; i++) {
        
        if (i < 20) {
        motsAAfficher +=  `<p id= "motNumero${i}" class="motsABarrer"> ${insertedWords[i]} </p>`; }

        else if (i < 40) {
            motsAAfficher2 +=  `<p id= "motNumero${i}" class="motsABarrer"> ${insertedWords[i]} </p>`;
        }

        else if(i <60) {
            motsAAfficher3 +=  `<p id= "motNumero${i}" class="motsABarrer"> ${insertedWords[i]} </p>`;
        }

        else {motsAAfficher4 +=  `<p id= "motNumero${i}" class="motsABarrer"> ${insertedWords[i]} </p>`;}
        
    }

    document.getElementById("wordsToFind").innerHTML = motsAAfficher;
    document.getElementById("wordsToFind2").innerHTML = motsAAfficher2;
    document.getElementById("wordsToFind3").innerHTML = motsAAfficher3;
    document.getElementById("wordsToFind4").innerHTML = motsAAfficher4;

    if (insertedWords.length > 1 ) {
    document.getElementById("numberOfWordsToFind").innerHTML = `<h1> ${insertedWords.length} mots à trouver   </h1>` }
    else {document.getElementById("numberOfWordsToFind").innerHTML = `<h1> ${insertedWords.length} mot à trouver   </h1>`}

}


// taille des data 

function dataSize() {

    let tdHeightAndWidth = ""

    tdHeightAndWidth += "td {" ;
    tdHeightAndWidth += `width : ${window.innerHeight /*700*/ / (numberOfCols *1.35)}px;` ;
    tdHeightAndWidth += `height : ${window.innerHeight /*700*/ / (numberOfRows*1.35) }px;` ;
    tdHeightAndWidth += "}" ;

    let tdFontSize = `table {font-size : ${30/numberOfCols}em;` ;

    let styleToAdd = ""

    styleToAdd += tdHeightAndWidth ;
    styleToAdd += tdFontSize;


    document.getElementById("styleJS").innerHTML = styleToAdd

}

// Cliquer pour barrer les mots 


function lineThroughOnAllWords() {
    for (let i = 0; i < insertedWords.length ; i++) {
        
        document.getElementById(`motNumero${i}`).addEventListener("click",function(){

            if (document.getElementById(`motNumero${i}`).classList.contains("motBarre") === false)

            {

            document.getElementById(`motNumero${i}`).classList.add('motBarre')}

            else {document.getElementById(`motNumero${i}`).classList.remove('motBarre')}
            
            
        }
        )}
}

// Cliquer sur les cases pour les mettre en couleur 

function colorCases() {

    for (let i = 0 ; i < numberOfRows ; i ++) {
        for (let y = 0 ; y < numberOfCols ; y++) {

            document.getElementById(`row${i}col${y}`).addEventListener("click",function() {

                if(document.getElementById(`row${i}col${y}`).classList.contains("clickedTd") === false){

                document.getElementById(`row${i}col${y}`).classList.add("clickedTd")}

                else {document.getElementById(`row${i}col${y}`).classList.remove("clickedTd")}

                lineOnFoundWords()

            })
        }
    }


}

/********************/


function startNewGrid() {
    
    sliderValue = slider.value;
    numberOfRows = sliderValue;
    numberOfCols = sliderValue;

    tousLesMots = databaseMots.filter(function(element) {
        if (element.length <= numberOfRows) {
            return true
        }
        else {
            return false
        }
    })

    
    grille = createGrid(numberOfRows, numberOfCols);
    insertedWords = [];

for (let i = 0;i < (((Math.floor(numberOfRows * numberOfCols)/10)))-2 ; i++){

    let motAInserer = randomWord().join("")
    insertedWords.push(motAInserer)
    //console.log(motAInserer) 
    
    if (i % 2 === 0) {
        
        insertWord(new mot(reverseString(motAInserer)))
        
    }
    else {
    insertWord(new mot(motAInserer))}
    
}

fillWithRandomLetters();
gridToHtml();
displayWords();
dataSize();
lineThroughOnAllWords();
colorCases()
console.log(motsObjets[0])

}

/*

Ce qu'il reste à faire : 

1) A de rares occasions, une lettre en efface toujours une autre 
2) L'alerte de temps en temps quand le programme ne trouve pas d'emplacement


*/

const lineOnFoundWords = () => {

    /*let casesColor = []
    for (let i = 0; i < numberOfRows; i++ ) {
        for (let y = 0; y < numberOfCols; y++) {
            if (document.getElementById(`row${i}col${y}`).classList.contains("clickedTd")) {
                casesColor.push(grille[i][y])
            }
        }
    }
    console.log(casesColor)
    */

    for (let i = 0; i < motsObjets.length ; i++ ) {

        let lettresDuMotEnCouleur = [];
        motsObjets[i].found = true;
        
        if (motsObjets[i].direction === "horizontal") {

        for (let y = 0; y < motsObjets[i].letters.length ; y++) {

            let varPosition = motsObjets[i].pos[0]
            varPosition += y;
            console.log(`le mot actuel est ${motsObjets[i].letters.join('')}`)
            console.log(`var Position is ${varPosition}`)
        
            

                if (!document.getElementById(`row${motsObjets[i].pos[0]}col${varPosition}`).classList.contains("clickedTd"))
                    {
                    motsObjets[i].found = false
                }

            }

          
        }

        console.log(motsObjets[0].found)

        

    }
    


}
