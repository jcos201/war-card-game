// Constants and Variables
BASE_URL = 'https://deckofcardsapi.com/api/deck/new/draw/?count=52';

let deckData, deckID, cardArray, userPile, cpuPile, userCards, cpuCards;

// Cached Element References


// Event Listeners


// Functions
init();

function init(){

    $.ajax(BASE_URL).then(function(data){
        deckData = data;
        deckID = deckData.deck_id;
        cardArray = deckData.cards;
        var i = 0;
        userCards = [];
        cpuCards = [];
        do {
            if(i % 2 === 0){ userCards.push(cardArray[i]); }
           else { cpuCards.push(cardArray[i]); }
            //console.log(typeof userCards);
          i += 1;
        } while (i < cardArray.length)

    }, function(error) {
        console.log('Error: ', error);
    });
}

