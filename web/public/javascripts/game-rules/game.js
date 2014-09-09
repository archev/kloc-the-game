define(['field', 'move', 'chessboard', 'color', 'gameState', 'rook', 'bishop', 'knight', 'queen', 'pawn', 'king'], function(Field, Move, ChessboardModule, Color, GameState, Rook, Bishop, Knight, Queen, Pawn, King){
    var PieceFactory = {
        fromChar: function(pieceChar){
            switch (pieceChar) {
                case 'r':
                    return new Rook(Color.black);
                case 'n':
                    return new Knight(Color.black);
                case 'b':
                    return new Bishop(Color.black);
                case 'q':
                    return new Queen(Color.black);
                case 'k':
                    return new King(Color.black);
                case 'p':
                    return new Pawn(Color.black);
                case 'R':
                    return new Rook(Color.white);
                case 'N':
                    return new Knight(Color.white);
                case 'B':
                    return new Bishop(Color.white);
                case 'Q':
                    return new Queen(Color.white);
                case 'K':
                    return new King(Color.white);
                case 'P':
                    return new Pawn(Color.white);
                default:
                    return undefined;
            }
        }
    };

    function validateSize(arr){
        var arrSizeOk = arr.length == 8;
        var rowsSizesOk = _.every(arr, function(row){
            return _.isString(row) && row.length === 8;
        });
        return arrSizeOk && rowsSizesOk;
    }

    function loadFromArray(arr) {
        if(!validateSize(arr)){
            throw new Error("Cannot load chessboard from array - invalid array");
        }

        var chessboard = new ChessboardModule.Chessboard();
        _.each(arr, function(rowString, rowIndex){
            // need to compute realRowIndex because first element of arr refers to the last row (fields marked as a8, b8, c8...)
            var realRowIndex = 7 - rowIndex;

            _.each(rowString, function(pieceChar, columnIndex){
                chessboard.setPiece(new Field(columnIndex, realRowIndex), PieceFactory.fromChar(pieceChar));
            });
        });
        return chessboard;
    }

    function getInitialPosition() {
        var initialPositionInput =
            ['rnbqkbnr',
                'pppppppp',
                'xxxxxxxx',
                'xxxxxxxx',
                'xxxxxxxx',
                'xxxxxxxx',
                'PPPPPPPP',
                'RNBQKBNR'
            ];
        return loadFromArray(initialPositionInput);
    }

    var ChessboardFactory = {
        loadFromArray: loadFromArray,
        getInitialPosition: getInitialPosition
    };

    return {
        Field: Field,
        Move: Move,
        Chessboard: ChessboardModule.Chessboard,
        ChessboardFactory: ChessboardFactory,
        Color: Color,
        GameState: GameState,
        Rook: Rook,
        Bishop: Bishop,
        Knight: Knight,
        Queen: Queen,
        Pawn: Pawn,
        King: King
    };
});
