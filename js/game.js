const board_size = 50;
const timeOut = 200;
const neighbourRadius = 1;


let interval;

$(() => {
    for (let row = 0; row < board_size; row++) {
        const row = $("<div>").addClass('row');
        $("#board").append(row);
        
        for (let col = 0; col < board_size; col++) {
            const square = $("<div>").addClass('square');
            row.append(square);
            if (Math.random() < 0.3) {
                $(square).toggleClass('alive');
                $(square).toggleClass('corps');
            }
            square.on('click', function() {
                $(this).toggleClass('alive');
                $(this).toggleClass('corps');
            })
        }
    }


    $("#start").on('click', () => {
        if (interval) {
            clearInterval(interval);
            interval = undefined;
            $("#start").text('start');
        } else {
            interval = setInterval(() => displayState(computeNextState(fetchOldState())), timeOut);
            $("#start").text('stop');
        }
    })
});

function fetchOldState() {
    const board = [];
    $("#board").children().each( (i, row) => {
        board.push([]);
        
        $(row).children().each( (_, square) => {
            board[i].push($(square).hasClass('alive'));
        })
    })
    
    return board;
}

function computeNextState(currentState) {
    function computeSquare(x, y) {
        const nr = neighbourRadius;
        let cpt = 0;
        for (let dx = x - nr; dx <= x + nr; dx++) {
            for (let dy = y - nr; dy <= y + nr; dy++) {
                if ( contains(dy, dx) && !(dy == y && dx == x) && currentState[dy][dx]) {
                    cpt++;
                }
            }
        }

        return !currentState[y][x] ? 
            cpt == 3 :
            cpt == 2 || cpt == 3;
    }

    const newState = [];
    currentState.forEach((row, i) => {
        newState.push([]);
        row.forEach((square, j) => {
            newState[i].push(computeSquare(j, i));
        })
    });
    
    return newState
}

function displayState(state) {
    state.forEach((row, y) => {
        row.forEach((squareStatus, x) => {
            if (squareStatus) {
                getSquare(x, y)
                    .addClass('alive')
                    .addClass('corps');
            } else {
                getSquare(x, y).removeClass('alive');
            }
        })
    });
}

function getSquare(x, y) {
    return $("#board")
            .children().eq(y)
            .children().eq(x);
}

function contains(row, col) {
    return 0 <= row && row < board_size
        && 0 <= col && col < board_size;
}
