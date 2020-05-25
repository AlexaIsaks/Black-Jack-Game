console.log("Black Jack");
(function() {
document.getElementById("deal").addEventListener("click", startGame);

let suit = ["&#9830;", "&#9829;", "&#9827;", "&#9824;"], //HTML code for Diamond, Heart, Club, Spade respectively
    value = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
    cd = { //card
             suit: "",
             value: ""
            },
    deck = [],
    shuffledDeck = [],
    computerCards = [],
    playerCards = [],
    computerTotal = 0,
    playerTotal = 0,
    win = 0,
    lose = 0,
    draw = 0,
    dealBtn =  document.getElementById("deal"),//Board buttons
    hitMeBtn =  document.getElementById("hitMe"),
    holdBtn =  document.getElementById("hold"),
    newGameBtn = document.getElementById("newGame"),
    resetBtn = document.getElementById("reset"),
    computerArea = document.getElementById("dealer"), //The area on the board to display cards
    playerArea = document.getElementById("player"),
    winId = document.getElementById("win"),
    loseId = document.getElementById("lose"),
    drawId = document.getElementById("draw"),
    resultsArea = document.getElementById("results");

//Start the game
 function startGame() {
      createDeck();
      shuffle();
      dealDeck(computerCards);
      dealDeck(playerCards);
      computerTotal = calculate(computerCards);
      playerTotal = calculate(playerCards);
      scoreBoard("", "", playerTotal);
      checkPlayersHand();//Checks if player already loses

     //Add eventlisteners to the hit, hold, new game, reset buttons
     hitMeBtn.addEventListener("click", hitMe);
     holdBtn.addEventListener("click", hold);
     newGameBtn.addEventListener("click", newGame);
     resetBtn.addEventListener("click", resetGame);
     //Remove eventlistener from the deal button
     dealBtn.removeEventListener("click", startGame);
 } 

//Create a new deck
function createDeck() {
 suit.forEach( suite => {
      value.forEach( val => {
      cd = { 
         suit: suite,
         value: val
      }
      deck.push(cd);
      });  
  });
}
 
//Shuffle the deck
function shuffle() {
let deckLength = deck.length,
    index;
while (deckLength > 0){
  index = Math.floor(Math.random() * deckLength);
  shuffledDeck.push(deck[index]);
  deck.splice(index,1);
  deckLength--; 
}
}

//Deal the deck
function dealDeck(hand) {
hand.push(shuffledDeck.shift(), shuffledDeck.shift());
hand.forEach( card => {
  createCard(card, hand); //create card for display
});
}

//Create card
function createCard(card, hand) {
let div, span;

//Create DIV: used to create card
  div = document.createElement("DIV");
  div.classList.add("cd", "card", "card-dealt");
  div.innerHTML = card.value;
  span = document.createElement("span");
  span.classList.add("card-suit", "card-suit-big");
  span.innerHTML = card.suit;
  div.appendChild(span);
  suitColor(span, card.suit);

//If the array/hand is the player
if (hand === playerCards) {
   playerArea.appendChild(div); 

//No space in player's area: shrink cards
   if(hand.length > 5){
     shrinkCards();
   }

} else {
  computerArea.appendChild(div);
  hideCard(); //Hide one the cards
}
}

//Change the color of the suit accordingly
function suitColor(span, suit){
  if (suit === "&#9830;" || suit === "&#9829;") { 
   span.style.color = "red";
  } else {
    span.style.color = "black";
  } 
}

//Hide the first dealer card
function hideCard() {
  let card = computerArea.querySelector(".card"); 
  card.children[0].style.color = "transparent";
  card.classList.remove("card-dealt");
  card.classList.add("card-hidden");
}

//Reveal the card
function revealCard() {
  let card = computerArea.querySelector(".card"); 
  card.children[0].style.color = "black";
  card.classList.remove("card-hidden");
  card.classList.add("card-dealt");
}

function shrinkCards() { 
  let cards = playerArea.querySelectorAll(".card");
  cards.forEach(card => {
     card.classList.remove("card", "card-dealt", "card-suit-big");
     card.classList.add("card-shrink", "card-suit-small");
    }
  )
}

//Calculate Cards Total
   function calculate(hand) { 
    let total = 0,
        card;
    for(let i=0; i < hand.length; i++){
     card = hand[i].value;

     switch (card) {
     case "A": 
     total = total + 11;
     break;
     case 2:
     total = total + 2;
     break;
     case 3:
     total = total + 3;
     break;
     case 4: 
     total = total + 4;
     break;
     case 5:
     total = total + 5;
     break;
     case 6:
     total = total + 6;
     break;
     case 7:
     total = total + 7;
     break;
     case 8:
     total = total + 8;
     break;
     case 9: 
     total = total + 9;
     break;
     case 10:
     total = total + 10;
     break;
     case "J":
     case "Q":
     case "K":
     total = total + 10;
     break; 
     default:
     "No Card Value";
  } 
 } 
  return total;
}

/*Check if the player's cards add to 21. If true,
check if there are A's. If A's are present, convert
the value of A to 1 and continue playing. */

function checkPlayersHand() {
let arrayOfA;

arrayOfA = playerCards.filter( card => {
  return card.value === "A";
});

  if (playerTotal > 21 && arrayOfA.length > 0) {
        
     playerTotal = playerTotal - (10 * arrayOfA.length);

    if (playerTotal > 21) { //Player's total still over 21 even after deduction   
     lose++;
     scoreBoard(lose, loseId, "LOSE");
     disableButtons();
     revealCard();
    } else {
      scoreBoard("", "", playerTotal);
      return playerTotal;
    }

  } else if (playerTotal > 21 && arrayOfA.length === 0) {
     lose++;
     scoreBoard(lose, loseId, "LOSE");
     revealCard();
     disableButtons();
  } else {
    return;
  }
}

//Hit Me Button, add one card
function hitMe() {
  let card;
  playerCards.push(shuffledDeck.shift());
  card  = playerCards[playerCards.length-1];
  createCard(card, playerCards); 
  playerTotal = calculate(playerCards);
  scoreBoard("", "", playerTotal);
  checkPlayersHand();
}

//Hold Button, end game
function hold() {

 if (computerTotal > playerTotal && computerTotal <= 21 || playerTotal > 21) {
  lose++;
  scoreBoard(lose, loseId, "LOSE");

  } else if (playerTotal > computerTotal && playerTotal <= 21 || computerTotal > 21){  
   win++;
   scoreBoard(win, winId, "WIN");

  } else {
   draw++;
   scoreBoard(draw, drawId, "DRAW");
  }
  revealCard();
  disableButtons();
}

//Update scoreboard
function scoreBoard(score, scoreId, scoreText) {
 
  resultsArea.innerHTML = scoreText;
  if (score !== "" || scoreId !== ""){
  scoreId.innerHTML = score;
}
}

//Disable playing buttons
function disableButtons(){
  dealBtn.removeEventListener("click", startGame);
  hitMeBtn.removeEventListener("click", hitMe);
  holdBtn.removeEventListener("click", hold);
}

//For a new game, set every thing back to default except the scores
function newGame() {
  let cards;
  deck = [];
  shuffledDeck = [];
  computerCards = []
  playerCards = [];
  computerTotal = 0;
  playerTotal = 0;

  cards = document.querySelectorAll(".cd");
  cards.forEach( card => {
    card.remove();
  });

  dealBtn.addEventListener("click", startGame);
  resultsArea.innerHTML = "";
}

//Reset game; set scores to default value
function resetGame() {
  win = 0;
  lose = 0;
  draw = 0;
  winId.innerHTML = win;
  loseId.innerHTML = lose;
  drawId.innerHTML = draw;
  newGame();  
}
})();




