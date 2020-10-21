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
const $main = $('#main');
const $actvClass = $('.active');
const $buttons = $('button');
const $btns = $('#btns');
const $avatarImg = $('.avatar');
const $p1 = $('#p1');
const $p1Hand = $('#p1Hand');
const $p1War = $('#p1War');
const $p1Win = $('#p1Win');

const $cpu = $('#cpu');
const $cpuHand = $('#cpuHand');
const $cpuWar = $('#cpuWar');
const $cpuWin = $('#cpuWin');

// Playing Card elements
const $cardSmall = $('.cardSmall');


// Button variables
const $trn = $('#trn');
const $restart = $('#restart');
const $quit = $('#quit');
const $confirmShuffle = $('#confirmShuffle');
const $confirmExit = $('#confirmQuit');
const $noAction = $('.exit');

// Modal variables
const $warModal = $('#warModal');
const $shuffleModal = $('#reshuffleModal');
const $quitModal = $('#quitModal');
const $a = $('a');
const $modals = $('.modal');

// Event Listeners
$form.on('submit', handleStartGame);
$trn.on('click', takeTurn);
$restart.on('click', shuffleModal);
$quit.on('click', quitModal);
$confirmShuffle.on('click', restart);
$confirmExit.on('click', exit);
$noAction.on('click', closeModal);
$a.on('click', declareWar);

// Disable default modal close



// Functions
init();

function init() {
    $mstr.css({
        "grid-column": "span 5",
        "grid-row": "span 3"
    });
    $mstr.append(`
    <video id="introVid" width="900" height="700" loop>
    <source src="./img/intro.mp4" type="video/mp4">
    Your browser does not support the video tag.
    </video>`);
    $('#introVid').trigger('play');
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
    $dynBG.css('background-color', '#2D5F5D');
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
        //added comment
        updateCards();
    }, function (error) {
        console.log('Error: ', error);
    });



}

function updateCards() {

    $cpuHand.html(`${cardsDealt(cpuCards)}`);
    $p1Hand.html(`${cardsDealt(p1Cards)}`);

}

function cardsDealt(cardArray) {
    let cards = cardArray
    let allCardsDealt = '';
    let positionLeft = 0;
    for (let x = 0; x < cards.length; x++) {
        if (x === 0) {
            allCardsDealt += '<div class="cardSmall1st"><div class="front" style="visibility:hidden;"></div></div>';
        } else {
            allCardsDealt += '<div class="cardSmall"><div class="front" style="visibility:hidden;"></div></div>';
        }
        $cardSmall.css({
            "left": ` ${positionLeft}px`,
            "z-index": `${cards.length - x}`
        });
        positionLeft += 5;
    };

    return allCardsDealt;
}

function takeTurn() {

    $p1War.html('');
    $cpuWar.html('');

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


        $warModal.modal({
            fadeDuration: 1000,
            fadeDelay: 0.50,
            escapeClose: false,
            clickClose: false,
            showClose: false
        });
    } else if (p1 < cpu) {
        cpuCards.unshift(cpuTurn, p1Turn);
        if (warChest.length > 0) {
            while (warChest.length > 0) {
                cpuCards.unshift(warChest.pop())
            }
        };
    } else {
        p1Cards.unshift(cpuTurn, p1Turn);
        if (warChest.length > 0) {
            while (warChest.length > 0) {
                p1Cards.unshift(warChest.pop())
            }
        };
    }
}

function declareWar() {
    warChest.push(cpuTurn, p1Turn, p1Cards.pop(), cpuCards.pop());
    getCards();
    $cpuWar.html(`
    <div class="card"><div class="front" style="visibility:hidden;"></div></div>
    <div id="cpuWarCard"><img class="cardIMG" src=${cpuTurn.images.png} alt="CPU War Card"></div>`);

    $p1War.html(`
    <div class="card"><div class="front" style="visibility:hidden;"></div></div>
    <div id="p1WarCard"><img class="cardIMG" src=${p1Turn.images.png} alt="P1 War Card"></div></div>`);

    compareCards();

}

function checkWinner() {
    if (cpuCards.length === 0) {
        $cpuWin.modal();
        return true;
    } else if (p1Cards.length === 0) {
        $p1Win.modal();
        return true;
    }
}

function shuffleModal() {
    $shuffleModal.modal();
}

function quitModal() {
    $quitModal.modal();
}

function restart() {
    cpuPile = [];
    cpuCards = [];
    p1Pile = [];
    p1Cards = [];
    $main.html('');
    p1Turn = '';
    cpuTurn = '';
    $cpuWar.html('');
    $p1War.html('');
    closeModal();
    handleStartGame();
}

function exit() {
    closeModal();
    location.reload();
}

function closeModal() {
    $.modal.close();
}