// var randomLoc = Math.floor(Math.random() * 5);
// var location1 = randomLoc;
// var location2 = location1 + 1;
// var location3 = location2 + 1;
// var guess;
// var hits = 0;
// var guesses = 0;
// var isSunk = false;

// while ( isSunk ==false) {
//     guess = prompt ("Ready, aim, fire! (OYA MUMU WRITE number from 0-6):");
//     if(guess < 0 || guess > 6){
//         alert("enter a valid number!");
//     }else{
//         guesses = guesses + 1;
//         if(guess==location1 || guess==location2 || guess==location3){
//             alert("HIT!");
//             hits = hits + 1;
//             if (hits == 3){
//                 isSunk = true;
//                 alert("You sank my ship!");
//             }
//         }else{
//             alert("MISS!");
//         }
//     }
// }
// var stats = "you took " + guesses + " guesses to sink the battleship, " + "which means your shooting accuracy was " + (3/guesses);
// alert(stats);
// function init(){
// var planet = document.getElementById("greenplanet");
// planet.innerHTML= "FUCK THIS PAGES!!"
// };
// window.onload = init;

// bird = {
//     good: "bad",
//     food: false,
//     check: function nel(){
//         console.log(bird.food);
//         return 4;
//     },
// };
// bird.goody = bird.check();
// console.log(bird);
// var unit = 50;
// function time (){
//     console.log("suck");
//     return 78;
// }


// for( n = 1; n < 26; n++){
    
//     time();


// }
// var times = time();
// console.log(times);


// MODEL OBJECT
var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships: [
        {locations: [0, 0, 0], hits: ["", "", ""]},
        {locations: [0, 0, 0], hits: ["", "", ""]},
        {locations: [0, 0, 0], hits: ["", "", ""]}
    ],
    fire: function(guess) {
        for(var i = 0; i < this.numShips; i++){
            var ship = this.ships[i];
            var locations = ship.locations;
            var index = locations.indexOf(guess);
			if (ship.hits[index] === "hit") {
				view.displayMessage("Oops, you already hit that location!");
				return true;
			} 
        else if(index >= 0){
            ship.hits[index] = "hit";
            view.displayHit(guess);
            view.displayMessage("HIT!");
            if(this.isSunk(ship)){
                view.displayMessage("You sank my battleship!");
                this.shipsSunk++;
            }
        return true;
        }
        }
        view.displayMiss(guess);
        view.displayMessage("You Missed!!");
        return false;
    },
    isSunk: function(ship){
        for (var i = 0; i < this.shipLength; i++){
            if(ship.hits[i] !== "hit"){
                return false;
            }
        }
        return true;
    },

    
    generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
		console.log("Ships array: ");
		console.log(this.ships);
	},

	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
	
}; 

var view  = { 
    // this method takes a string message and displays it in the message
    // display area
    displayMessage: function (msg){
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;

    },
    displayHit: function (location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
        
    },
    displayMiss: function(location){
        var cell = document.getElementById(location)
        cell.setAttribute("class", "miss");

    }

};

var controller = {
	guesses: 0,

	processGuess: function(guess) {
		var location = parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
					view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
			}
		}
	}
}

function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	if (guess === null || guess.length !== 2) {
		alert("Oops, please enter a letter and a number on the board.");
	} else {
		var firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);
		
		if (isNaN(row) || isNaN(column)) {
			alert("Oops, that isn't on the board.");
		} else if (row < 0 || row >= model.boardSize ||
		           column < 0 || column >= model.boardSize) {
			alert("Oops, that's off the board!");
		} else {
			return row + column;
		}
	}
	return null;
}


    
function handleFireButton() {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value.toUpperCase();

	controller.processGuess(guess);

	guessInput.value = "";
}

function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");

	// in IE9 and earlier, the event object doesn't get passed
	// to the event handler correctly, so we use window.event instead.
	e = e || window.event;

	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}

window.onload = init;

function init() {
	// Fire! button onclick handler
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;

	// handle "return" key press
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	// place the ships on the game board
	model.generateShipLocations();
}























