// Constants and Variables
const BASE_URL = 'https://deckofcardsapi.com/api/deck/new/draw/?count=52';
const valueArray = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"];

let deckData, deckID, userName, cpuTurn, p1Turn;
cardArray = [];
p1Pile = [];
cpuPile = [];
p1Cards = [];
cpuCards = [];
warChest = [];

// Cached Element References
const $input = $('input[type="text"]');
const $form = $('form');
const $dynBG = $('.dynamicBG');
const $headr = $('#hd');
const $mstr = $('#mstr');
const $cpuHand = $('#cpuHand');
const $cpu = $('#cpu');
const $main = $('#main');
const $p1 = $('#p1');
const $p1Hand = $('#p1Hand');
const $actvClass = $('.active');
const $buttons = $('button');
const $btns = $('#btns');
const $trn = $('#trn');
const $restart = $('#restart');
const $exit = $('#quit');
const $avatarImg = $('.avatar');
const $p1War = $('.p1War');
const $cpuWar = $('.cpuWar');
const $warModal = $('#warModal');
const $p1Win = $('#p1Win');
const $cpuWin = $('#cpuWin');

// Event Listeners
$form.on('submit', handleStartGame);
$trn.on('click', takeTurn);
$restart.on('click', restart);
$exit.on('click', exit);


// Functions
init();

function init() {
    $mstr.css({
        "grid-column": "span 5",
        "grid-row": "span 3"
    });
    //$mstr.prepend('<img src="./img/jigsaw-first-look.jpg" alt="jigsaw">');
    $mstr.append(`
    <video width="700" height="300" autoplay>
    <source src="./img/intro.mp4" type="video/mp4">
    Your browser does not support the video tag.
    </video>`)
    $headr.fadeOut(0).delay(7700).fadeIn(7000);
    $form.fadeOut(0).delay(7700).fadeIn(7000);
    $btns.fadeOut(0);
};

function handleStartGame(event) {
    if (event) {
        event.preventDefault()
    }
    userName = $input.val();
    if (!userName) {
        return;
    }
    $p1.html(`<img src="./img/p1_avatar.png" alt="player1 avatar" height="65px" class="avatar">  ${userName}`);
    $cpu.html(`<img src="./img/JIGSAW.png" alt="Jigsaw Avatar" height="65px" class="avatar"> JIGSAW`);

    $btns.fadeIn(0);
    $mstr.css({
        "grid-column": "span 1",
        "grid-row": "span 1"
    });
    $mstr.text('');
    $actvClass.css("border", "solid");
    $main.css({
        "border-radius": "25px",
        "margin": "10px 80px"
    });

    $p1.addClass('p1');
    $cpu.addClass('cpu');
    $dynBG.css('background-color', 'green');
    $form.css('display', 'none');


    $.ajax(BASE_URL).then(function (data) {
        deckData = data;
        deckID = deckData.deck_id;
        cardArray = deckData.cards;
        var i = 0;
        do {
            if (i % 2 === 0) {
                p1Cards.push(cardArray[i]);
            } else {
                cpuCards.push(cardArray[i]);
            }

            i += 1;
        } while (i < cardArray.length)

    }, function (error) {
        console.log('Error: ', error);
    });

    updateCards();

}

function updateCards() {
    $cpuHand.html(`${cpuCards.length}`);
    $p1Hand.html(`${p1Cards.length}`);


}

function takeTurn() {

    if (!checkWinner()) {

        updateCards();
        getCards();

        $main.html(`
    <article id="p1Card"><img class="cardIMG" src=${p1Turn.images.png} alt="Player 1 Card"></article>
    <article id="cpuCard"><img class="cardIMG" src=${cpuTurn.images.png} alt="CPU Card"></article>`);
        $main.css({
            'justify-content': 'space-around'
        });

        compareCards();
        checkWinner();
    } else {
        return;
    }
}

function getCards() {
    p1Turn = p1Cards.pop();
    cpuTurn = cpuCards.pop();
};

function compareCards() {
    let p1 = parseInt(valueArray.indexOf(p1Turn.value));
    let cpu = parseInt(valueArray.indexOf(cpuTurn.value));
    if (p1 === cpu) {
        declareWar();
    } else if (p1 < cpu) {
        console.log(`CPU Wins Cards: ${cpuTurn.code} and ${p1Turn.code}`);
        cpuCards.unshift(cpuTurn, p1Turn);
    } else {
        console.log(`Player 1 Wins Cards: ${cpuTurn.code} and ${p1Turn.code}`);
        p1Cards.unshift(cpuTurn, p1Turn);
    }
}

function declareWar() {
    $warModal.modal();
    warChest.push(cpuTurn, p1Turn, p1Cards.pop(), cpuCards.pop());
    getCards();
    $cpuWar.html(`
    <div id="cpuWarCard"><img class="cardIMG" src=${cpuTurn.images.png} alt="CPU War Card"></div>
    <div class="card"><div class="front" style="visibility:hidden;"></div></div>`);
    
    $p1War.htnl(`
    <div id="p1WarCard"><img class="cardIMG" src=${p1Turn.images.png} alt="P1 War Card"></div></div>
    <div class="card"><div class="front" style="visibility:hidden;"></div></div>`);

}

function checkWinner() {
    if (cpuCards.length === 0) {
        console.log(`${userName} wins`);
        return true;
    } else if (p1Cards.length === 0) {
        console.log('JIGSAW Wins');
        return true;
    }
    //TODO write function checking winner and alerting user if they won/lost
}

function restart() {
    cpuPile = [];
    cpuCards = [];
    p1Pile = [];
    p1Cards = [];
    $main.html('');
    p1Turn = '';
    cpuTurn = '';

    handleStartGame();
}

function exit() {
    location.reload();
}