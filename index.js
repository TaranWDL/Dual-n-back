var letters = ["c", "d", "g", "h", "k", "l", "q", "r", "s", "t"];
var cells = ["tl", "tc", "tr", "ml", "mr", "bl", "bc", "br"];
var level = 1;
var gameCells = [];
var gameLetters = [];
var cellAmount = 0;
var letterAmount = 0;
var audioMatches = 0;
var positionMatches = 0;
var correctAudio = [];
var correctPosition = [];
var gameTick = 0;
var playerAudio = [];
var playerPosition = [];
var audioPaired = [];
var positionPaired = [];

function initialise() {
    gameCells = [];
    gameLetters = [];
    cellAmount = 0;
    letterAmount = 0;
    audioMatches = 0;
    positionMatches = 0;
    correctAudio = [];
    correctPosition = [];
    gameTick = 0;
    playerAudio = [];
    playerPosition = [];
    audioPaired = [];
    positionPaired = [];
}

function flash(cell) {
    cell = $("#" + cell);
    cell.addClass("flash");
        setTimeout(() => {
        cell.removeClass("flash");
        }, 1500);
};

function playSound(letter) {
    var audio = new Audio("sounds/" + letter + ".mp3");
    audio.play();
};

function randomLetter() {
    var rng = Math.floor(Math.random() * 10);
    return letters[rng];
};

function randomCell() {
    var rng = Math.floor(Math.random() * 8);
    return (cells[rng]);
};

function roundStart() {
    initialise()
    

    letterAmount = 20;
    while (letterAmount != 0) {
        gameLetters.push(randomLetter());
        letterAmount--;
    }
    cellAmount = 20;
    while (cellAmount != 0) {
        gameCells.push(randomCell());
        cellAmount--;
    }

    var patternIterate = level;
    while (patternIterate != gameLetters.length - level) {
        
        var positionPair = gameCells[patternIterate - level];
        var positionCurrent = gameCells[patternIterate];
        while (positionPair == positionCurrent) {
            var rng = randomCell();
            positionPair = rng;
            gameCells[patternIterate - level] = positionPair;
        }
        var audioPair = gameLetters[patternIterate - level];
        var audioCurrent = gameLetters[patternIterate];
        while (audioPair == audioCurrent) {
            var rng = randomLetter();
            audioPair = rng;
            gameLetters[patternIterate - level] = audioPair;
        }

        patternIterate++;
    }

    audioMatches = 5;
    while (audioMatches != 0) {
        var rng = Math.floor(Math.random() * 20);
        if (!(correctAudio.includes(rng)) && !(audioPaired.includes(rng)) && !((gameLetters[rng-level]) == (gameLetters[rng+level])) && (rng > level - 1)) {
            var pair = gameLetters[rng-level];
            gameLetters[rng] = pair;
            correctAudio.push(rng);
            audioPaired.push(rng - level);
            audioMatches--;
        }
        
    }
    positionMatches = 5;
    while (positionMatches != 0) {
        var rng = Math.floor(Math.random() * 20);
        if (!(correctPosition.includes(rng)) && !(positionPaired.includes(rng)) && !((gameCells[rng-level]) == (gameCells[rng+level])) && (rng > level - 1)) {
            var pair = gameCells[rng-level];
            gameCells[rng] = pair;
            correctPosition.push(rng);
            positionPaired.push(rng - level);
            positionMatches--;
        }
    }
    console.log(gameCells);
    console.log(correctPosition);
    playPattern();
}

function playPattern() {
    gameTick = 0;
        
        var patternLoop = setInterval(function() {
            $("button").off("click", handleClick);
            $("#audio").removeClass("disabled");
            $("#position").removeClass("disabled");
            playSound(gameLetters[gameTick]);
            flash(gameCells[gameTick]);
            $("button").on("click", handleClick);
            gameTick++;
            if (gameTick == 20) {
                clearInterval(patternLoop);
                setTimeout(function () {
                    endGame();
                }, 3000);
            }
        }, 3000);

        
    }

function endGame() {
    $("body").css("background-color", "black");

    var correctAudioMatches = 0;
    var correctPositionMatches = 0;

    for (var i = 0; i < playerAudio.length; i++) {
        if (correctAudio.includes(playerAudio[i])) {
            correctAudioMatches++;
            console.log(i);
        }
    }
    for (var i = 0; i < playerPosition.length; i++) {
        if (correctPosition.includes(playerPosition[i])) {
            correctPositionMatches++;
            console.log(i);
        }
    }
    console.log(correctPosition);
    console.log(playerPosition);
    console.log(" ")
    console.log(correctAudio);
    console.log(playerAudio);
    console.log(" ");
    console.log("You got " + correctPositionMatches + "/5 position cues correct!");
    console.log("You got " + correctAudioMatches + "/5 audio cues correct!");

    var totalPosition = 15;
    totalPosition += correctPositionMatches;
    if (playerPosition.length > 5) {
        totalPosition -= playerPosition.length - 5
    }
    totalPosition = (totalPosition / 20) * 100;

    var totalAudio = 15;
    totalAudio += correctAudioMatches;
    if (playerAudio.length > 5) {
        totalAudio -= playerAudio.length - 5
    }
    totalAudio = (totalAudio / 20) * 100;

    $("#results h1").html("DUAL N-BACK RESULTS")
    $("#position-results").html("<b>Position: <b>" + totalPosition + "%");
    $("#audio-results").html("<b>Audio: <b>" + totalAudio + "%");

    $("#results-section").css("display", "flex");
    $("#movebox").css("grid-template-rows", "93vh 93vh 93vh");

    scrollToHash("results-section");

    $("#level-rack").css("display", "flex");
    $("#start").css("display", "block");
    $("#center-focus").css("display", "none");
    $("#position").css("display", "none");
    $("#audio").css("display", "none");
    $("#position").removeClass("disabled");
    $("#audio").removeClass("disabled");
    
}

$("#start").on("click", function(event) {
    roundStart();
    $("#start").css("display", "none");
    $("#center-focus").css("display", "block");
    $("#position").css("display", "block");
    $("#audio").css("display", "block");
    $("#level-rack").css("display", "none");
});

$("#start-challenge").on("click", function(event) {
    scrollToHash("game-section");
});

$("#decrease-level").on("click", function(event) {
    if (!(level == 1)) {
        level--;
    }
    $("#level").html("LEVEL " + level);
    console.log(level);
});

$("#increase-level").on("click", function(event) {
    if (!(level == 8)) {
        level++;
    }
    $("#level").html("LEVEL " + level);
    console.log(level);
});

$("#position").on("mouseover", function(event) {
    if (!(this.classList.contains("disabled"))) {
        $(this).addClass("hover")
    }
});
$("#position").on("mouseleave", function(event) {
    if (!(this.classList.contains("disabled"))) {
        $(this).removeClass("hover")
    }
});
$("#audio").on("mouseover", function(event) {
    if (!(this.classList.contains("disabled"))) {
        $(this).addClass("hover")
    }
});
$("#audio").on("mouseleave", function(event) {
    if (!(this.classList.contains("disabled"))) {
        $(this).removeClass("hover")
    }
});

function handleClick() {
    if (this.id == "audio" && !(this.classList.contains("disabled"))) {
        playerAudio.push(gameTick-1);
        $(this).removeClass("hover")
        $(this).addClass("disabled");
        
    }
    else if (this.id == "position" && !(this.classList.contains("disabled"))) {
        playerPosition.push(gameTick-1);
        $(this).removeClass("hover")
        $(this).addClass("disabled");
    }
}

function scrollToHash(hash) {
    location.hash = "#" + hash;
}

$("#results-section").css("display", "none");
$("#movebox").css("grid-template-rows", "93vh 93vh");