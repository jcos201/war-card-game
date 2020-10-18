// Constants and Variables
const BASE_URL = 'https://deckofcardsapi.com/api/deck/new/draw/?count=52';
const valueArray = ["2","3","4","5","6","7","8","9","10","JACK","QUEEN","KING","ACE"];

let deckData, deckID, userName, cpuTurn, p1Turn;
cardArray = [];
p1Pile = [];
cpuPile = [];
p1Cards = [];
cpuCards = [];


// Cached Element References
const $input = $('input[type="text"]');
const $form = $('form');
const $dynBG = $('.dynamicBG');
const $headr = $('#hd');
const $mstr = $('#mstr');
const $cpuHand = $('#cpuHand');
const $cpuPile = $('#cpuPile');
const $main = $('#main');
const $p1Pile = $('#p1Pile');
const $p1Hand = $('#p1Hand');
const $actvClass = $('.active');
const $piles = $('.piles');
const $buttons = $('button');
const $btns = $('#btns');
const $trn = $('#trn');
const $restart = $('#restart');
const $exit = $('#quit');

// Event Listeners
$form.on('submit', handleStartGame);
$trn.on('click', takeTurn);
$restart.on('click', restart);
$exit.on('click', exit);


// Functions
init();

function init() {
    $mstr.css({"grid-column": "span 3","grid-row": "span 3"});
    $mstr.prepend('<img src="./img/jigsaw-first-look.jpg" alt="jigsaw">');
    $headr.fadeOut(0).fadeIn(5000);  
    $form.fadeOut(0).fadeIn(5000);
    $btns.fadeOut(0)
};

function handleStartGame(event){
    if(event) { event.preventDefault() }
    userName = $input.val();
    $btns.fadeIn(0);
    $mstr.css({"grid-column": "span 1","grid-row": "span 1"});
    $mstr.text('');
    $actvClass.css("border", "solid");
    $main.css({"border-radius": "25px"});
    $piles.css({"border-radius": "50%"});
    
    $p1Hand.html(`
    <article id="innerArticle">test</article>
    <article id="innerArticle">test</article>
    <article id="innerArticle">test</article>`);
    $p1Pile.addClass('p1Pile');
    if(!userName) { return;}
    
    $dynBG.css('background-color','green');
    $form.css('display','none');


    $.ajax(BASE_URL).then(function(data){
        deckData = data;
        deckID = deckData.deck_id;
        cardArray = deckData.cards;
        var i = 0;
        do {
            if(i % 2 === 0){ p1Cards.push(cardArray[i]); }
           else { cpuCards.push(cardArray[i]); }
            //console.log(typeof userCards);
          i += 1;
        } while (i < cardArray.length)

    }, function(error) {
        console.log('Error: ', error);
    });

    updateCards();

}

function updateCards(){
    $cpuHand.html(`${cpuCards.length}`);
    $p1Hand.html(`${p1Cards.length}`);
    $cpuPile.html(`${cpuPile.length}  <br/> Cards Won`);
    $p1Pile.html(`${p1Pile.length} <br/> Cards Won`);

}

function takeTurn(){
    console.log('Take turn button was selected');
   // cpuTurn = 
   updateCards();
    p1Turn = p1Cards.pop();
    cpuTurn = cpuCards.pop();

    $main.html(`
    <article id="p1Card"><img class="cardIMG" src=${p1Turn.images.png} alt="Player 1 Card"></article>
    <article id="cpuCard"><img class="cardIMG" src=${cpuTurn.images.png} alt="CPU Card"></article>`);
    $main.css({'justify-content': 'space-around'});

    compareCards();
}

function compareCards(){
    let p1 = parseInt(valueArray.indexOf(p1Turn.value));
    let cpu = parseInt(valueArray.indexOf(cpuTurn.value)); 
    console.log(`player one ${valueArray.indexOf(p1Turn.value)}`);
    if( p1 === cpu ){
        console.log("it's a tie");
    } else if(p1  < cpu) {
        cpuPile.push(cpuTurn, p1Turn);
        console.log("cpu wins");
    } else {
        console.log("player 1 wins");
        p1Pile.push(cpuTurn, p1Turn);
    }
}

function restart(){
    cpuPile = [];
    cpuCards = [];
    p1Pile = [];
    p1Cards = [];
    $main.html('');
    p1Turn = '';
    cpuTurn = '';

    handleStartGame();
}

function exit(){
    location.reload();
}