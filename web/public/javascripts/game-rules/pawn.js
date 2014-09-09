define(['piece', 'color', 'chessboard'], function(Piece, Color, ChessboardModule){
    var ChessboardUtil = ChessboardModule.ChessboardUtil;

    var Pawn = function(color) {
        Piece.call(this, color);
    };

    Pawn.prototype.fromStartPosition = function(from) {
        if(this.color === Color.white){
            return from.row === 1;
        }else{
            return from.row === 6;
        }
    };

    Pawn.prototype.legalDiffsForGoingForward = function(from) {
        var diffs = this.fromStartPosition(from) ? [1, 2] : [1];
        if(this.color === Color.black){
            diffs = _.map(diffs, function(diff){
                return -diff;
            });
        }
        return diffs;
    };

    Pawn.prototype.legalDiffForTaking = function() {
        return this.color === Color.white ? 1 : -1;
    }

    Pawn.prototype.isGoingForward = function(chessboard, move) {
        if(move.from.sameColumn(move.to) && chessboard.getPiece(move.to) === undefined){
            var diff = move.to.row - move.from.row;
            var legalDiffs = this.legalDiffsForGoingForward(move.from);
            var somethingBetween = chessboard.somethingBetween(move.from, move.to);
            return _.contains(legalDiffs, diff) && !somethingBetween;
        }
        return false;
    };

    Pawn.prototype.isTakingEnemy = function(move, chessboard) {
        var pieceOnDestination = chessboard.getPiece(move.to);
        var enemyOnDestinationField = pieceOnDestination !== undefined && pieceOnDestination.color !== this.color;
        if(enemyOnDestinationField){
            var nextColumn = Math.abs(move.to.column - move.from.column) === 1;
            var diff = move.to.row - move.from.row;
            return nextColumn && diff === this.legalDiffForTaking();
        }
        return false;
    }

    Pawn.prototype.isLegalMove = function(chessboard, move) {
        return this.isGoingForward(chessboard, move) || this.isTakingEnemy(move, chessboard);
    };

    return Pawn;
});
/**
 * Created by michal on 09/09/14.
 */