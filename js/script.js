// Constants and Variables
BASE_URL = 'https://deckofcardsapi.com/api/deck/new/draw/?count=52';

let deckData, deckID, cardArray, userPile, cpuPile, userCards, cpuCards, userName;

// Cached Element References
const $input = $('input[type="text"]');
const $form = $('form');
const $dynBG = $('.dynamicBG');
const $headr = $('#hd');

// Event Listeners
$form.on('submit', handleStartGame);

// Functions
init();

function handleStartGame(event){
    event.preventDefault();
    userName = $input.val();
    

    if(!userName) { return;}
    
    $dynBG.css('background-color','green');
    $form.css('display','none');

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

function init() {
    $headr.fadeOut(0);
    $headr.css('font-family', 'Frijole').fadeIn(5000);  
};