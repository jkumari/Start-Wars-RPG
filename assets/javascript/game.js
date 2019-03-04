// initialization of global variable, which is available to all method
var baseAttack = 0; // original attack strength
var player; // holds the player Object
var defender; // holds the current defender Object
var charArray = []; // array to store the game characters (Objects)
var playerSelected = false; // flag to mark if we picked a player yet
var defenderSelected = false; // flag to mark if we picked a defender


// Function to initialize all players
function initCharacters() {
    // Character function is called to initialize and assign the values to each players
    var obi = new Character("Obi-Wan Kenobi", 150, 15, 2, "./assets/images/obi.jpg");
    var chew = new Character("Chewbacca", 180, 30, 12, "./assets/images/chew.jpg");
    var luke = new Character("Luke Skywalker", 100, 10, 5, "./assets/images/luke.jpg");
    var vader = new Character("Darth Vader", 200, 50, 30, "./assets/images/vader.jpg");
    // After initialization, push these character to charArray
    charArray.push(luke, vader, obi, chew);
}
// Function to initialize the player with passed values
function Character(name, hp, ap, counter, pic) {
    this.name = name;
    this.healthPoints = hp;
    this.attackPower = ap;
    this.counterAttackPower = counter;
    this.pic = pic;
}

// Increase the attack strength (this attack strength + original attack strength)
Character.prototype.increaseAttack = function () {
    this.attackPower += baseAttack;
};

// Performs an attack
Character.prototype.attack = function (Obj) {
    Obj.healthPoints -= this.attackPower;
    $("#msg").html("You attacked " +
        Obj.name + "for " + this.attackPower + " damage points.");
    this.increaseAttack();
};

// Performs a counter attack
Character.prototype.counterAttack = function (Obj) {
    Obj.healthPoints -= this.counterAttackPower;
    $("#msg").append("<br>" + this.name + " counter attacked you for " + this.counterAttackPower + " damage points.");
};

// Create the avaliable character cards on onscreen. Here divID is "game" from window.
function characterCards(divID) {
    $(divID).children().remove();
    // Remove any preassigned child div
    for (var i = 0; i < charArray.length; i++) {
        $(divID).append("<div />");
        // append a div tag under game div
        $(divID + " div:last-child").addClass("card");
        console.log(divID + " div:last-child");
        // assign class "card" to each player div
        $(divID + " div:last-child").append("<img />");
        $(divID + " img:last-child").attr("id", charArray[i].name);
        $(divID + " img:last-child").attr("class", "card-img-top");
        $(divID + " img:last-child").attr("src", charArray[i].pic);
        $(divID + " img:last-child").attr("width", 150);
        $(divID + " img:last-child").addClass("img-thumbnail");
        $(divID + " div:last-child").append(charArray[i].name + "<br>");
        $(divID + " div:last-child").append("HP: " + charArray[i].healthPoints);
        $(divID + " idv:last-child").append();
        
    }
}


$(document).on("click", "img", function () {
    // Stores the defender the user has clicked on in the defender variable and removes it from the charArray
    if (playerSelected && !defenderSelected && (this.id != player.name)) {
        for (var j = 0; j < charArray.length; j++) {
            if (charArray[j].name == (this).id) {
                defender = charArray[j]; // sets defender
                charArray.splice(j, 1);
                defenderSelected = true;
                $("#msg").html("Click the button to attack!");
            }
        }
        $("#defenderDiv").append(this); // appends the selected defender to the div 
        $("#defenderDiv").addClass("animated zoomInRight");
        $("#defenderDiv").append("<br>" + defender.name);
        $("#defenderHealthDiv").append("HP: " + defender.healthPoints);
        $("#defenderHealthDiv").addClass("animated zoomInRight");
    }
    // When player is selected for the first time , the value of playerSelected is false
    // Stores the player the user has clicked on in the player variable and removes it from charArray
    if (!playerSelected && (this.id !=='logo')) {
        // Check if by mistake star war logo is pressed the stay on the page and do nothing -(this.id !=='logo')
        for (var i = 0; i < charArray.length; i++) {
            if (charArray[i].name == (this).id) {
                player = charArray[i]; // sets current player
                playAudio(); // starts theme song
                $("body").css({
                    "background-image": "url('./assets/images/" + this.id[0] + ".gif')"
                }); // changes the background picture according to the user selection
                setBaseAttack(player);
                charArray.splice(i, 1);
                playerSelected = true;
                changeView();
                $("#msg").html("Pick an enemy to fight!");
            }
        }
        updatePics("#game", "#defendersLeftDiv");
        $("#playerDiv").append(this); // appends the selected player to the div
        $("#playerDiv").addClass("animated zoomIn");
        $("#playerDiv").append(player.name);
        $("#playerHealthDiv").append("HP: " + player.healthPoints);
        $("#playerHealthDiv").addClass("animated zoomIn");
    }
    
});


// Checks if character is alive
function isAlive(Obj) {
    if (Obj.healthPoints > 0) {
        return true;
    }
    return false;
}
// plays audio file (.mp3)
function playAudio() {
    var audio = new Audio("./assets/media/themeSongSmall.mp3");
    audio.play();
}

// "Save" the original attack value
function setBaseAttack(Obj) {
    baseAttack = Obj.attackPower;
}

// Change the view from the first screen to the second screen
function changeView() {
    $("#firstScreen").empty();
    $("#secondScreen").show();
}


// Update the characters pictures location on the screen (move them between divs)
function updatePics(fromDivID, toDivID) {
    $(fromDivID).children().remove();
    for (var i = 0; i < charArray.length; i++) {
        $(toDivID).append("<img />");
        $(toDivID + " img:last-child").attr("id", charArray[i].name);
        $(toDivID + " img:last-child").attr("src", charArray[i].pic);
        $(toDivID + " img:last-child").attr("width", 150);
        $(toDivID + " img:last-child").addClass("img-thumbnail");
    }
}

// The attack button functionality
$(document).on("click", "#attackBtn", function () {
    if (playerSelected && defenderSelected) {
        if (isAlive(player) && isAlive(defender)) {
            player.attack(defender);
            defender.counterAttack(player);
            $("#playerHealthDiv").html("HP: " + player.healthPoints);
            $("#defenderHealthDiv").html("HP: " + defender.healthPoints);
            if (!isAlive(defender)) {
                $("#defenderHealthDiv").html("DEFETED!");
                $("#playerHealthDiv").html("Enemy defeated!");
                $("#msg").html("Pick another enemy to battle...");
            }
            if (!isAlive(player)) {
                $("#playerHealthDiv").html("YOU LOST!");
                $("#msg").html("Try again...");
                $("#attackBtn").html("Restart Game");
                $(document).on("click", "#attackBtn", function () { // restarts game
                    location.reload();
                });
            }
        }
        if (!isAlive(defender)) {
            $("#defenderDiv").removeClass("animated zoomInRight");
            $("#defenderHealthDiv").removeClass("animated zoomInRight");
            $("#defenderDiv").children().remove();
            $("#defenderDiv").html("");
            $("#defenderHealthDiv").html("");
            defenderSelected = false;
            if (isWinner()) {
                $("#secondScreen").hide();
                $("#globalMsg").show();
                $(document).on("click", "#restartBtn", function () { // restarts game
                    location.reload();
                });
            }
        }
    }
});


// Checks if the player has won
function isWinner() {
    if (charArray.length == 0 && player.healthPoints > 0)
        return true;
    else return false;
}


// This piece of code will be executed first each time the game is loaded
$(function () {
// The ready event occurs when the DOM (document object model) has been loaded
// The function after the DOM is ready can be call by two methods 
// $(document).ready(function) - typical call
// $(function) - As ready() method can only be used on the current document, so no selector is required
    $("#secondScreen").hide();
// Hide the battlefield (second) screen when game is load
    $("#globalMsg").hide();
// Hide the winning message when game is loaded.
    initCharacters();
// This is the first method to be called after the DOM is loaded, 
// intiate all character and assign health point, attach power, counter attach power and character image etc.
    characterCards("#game");
// Create the character card to display all available players on the first screen and append it to game div
});