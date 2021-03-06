'use strict'

define(['game', 'underscore'], function(Game, _){
        var white = Game.Color.white;
        var black = Game.Color.black;

        describe("Castling", function() {
            var chessboard;
            var gameState;

            beforeEach(function(){
                chessboard= new Game.Chessboard();
                chessboard.setPiece(new Game.Field("e1"), new Game.King(white));
                chessboard.setPiece(new Game.Field("a1"), new Game.Rook(white));
                chessboard.setPiece(new Game.Field("h1"), new Game.Rook(white));

                gameState = new Game.GameState();
            });

            it("It is possible to perform a short castling", function(){
                expect(chessboard.isLegalMove(new Game.Move(new Game.Field("e1"), new Game.Field("g1")), gameState)).toBe(true);
            });

            it("It is possible to perform a long castling", function(){
                expect(chessboard.isLegalMove(new Game.Move(new Game.Field("e1"), new Game.Field("c1")), gameState)).toBe(true);
            });

            it("It is impossible to perform short castling if it is not the first move of the king", function(){
                gameState = chessboard.applyMove(new Game.Move(new Game.Field("e1"), new Game.Field("d1")), gameState);

                expect(gameState.forColor(white).shortCastlingEnabled).toBe(false);
                expect(gameState.forColor(black).shortCastlingEnabled).toBe(true);
                expect(chessboard.isLegalMove(new Game.Move(new Game.Field("d1"), new Game.Field("g1")), gameState)).toBe(false);

                gameState = chessboard.applyMove(new Game.Move(new Game.Field("d1"), new Game.Field("e1")), gameState);

                expect(gameState.forColor(white).shortCastlingEnabled).toBe(false);
                expect(chessboard.isLegalMove(new Game.Move(new Game.Field("e1"), new Game.Field("g1")), gameState)).toBe(false);
            });

            it("It is impossible to perform short castling if it is not the first move of the rook", function(){
                gameState = chessboard.applyMove(new Game.Move(new Game.Field("h1"), new Game.Field("f1")), gameState);

                expect(gameState.forColor(white).shortCastlingEnabled).toBe(false);
                expect(gameState.forColor(white).longCastlingEnabled).toBe(true);
                expect(chessboard.isLegalMove(new Game.Move(new Game.Field("e1"), new Game.Field("g1")), gameState)).toBe(false);

                gameState = chessboard.applyMove(new Game.Move(new Game.Field("f1"), new Game.Field("h1")), gameState);

                expect(gameState.forColor(white).shortCastlingEnabled).toBe(false);
                expect(gameState.forColor(white).longCastlingEnabled).toBe(true);
                expect(chessboard.isLegalMove(new Game.Move(new Game.Field("e1"), new Game.Field("g1")), gameState)).toBe(false);
            });

            it("It is impossible to perform long castling if it is not the first move of the king", function(){
                gameState = chessboard.applyMove(new Game.Move(new Game.Field("e1"), new Game.Field("f1")), gameState);

                expect(gameState.forColor(white).longCastlingEnabled).toBe(false);
                expect(chessboard.isLegalMove(new Game.Move(new Game.Field("f1"), new Game.Field("c1")), gameState)).toBe(false);

                gameState = chessboard.applyMove(new Game.Move(new Game.Field("f1"), new Game.Field("e1")), gameState);

                expect(gameState.forColor(white).longCastlingEnabled).toBe(false);
                expect(chessboard.isLegalMove(new Game.Move(new Game.Field("e1"), new Game.Field("c1")), gameState)).toBe(false);
            });

            it("It is impossible to perform long castling if it is not the first move of the rook", function(){
                gameState = chessboard.applyMove(new Game.Move(new Game.Field("a1"), new Game.Field("b1")), gameState);

                expect(gameState.forColor(white).longCastlingEnabled).toBe(false);
                expect(gameState.forColor(white).shortCastlingEnabled).toBe(true);
                expect(chessboard.isLegalMove(new Game.Move(new Game.Field("e1"), new Game.Field("c1")), gameState)).toBe(false);

                gameState = chessboard.applyMove(new Game.Move(new Game.Field("b1"), new Game.Field("a1")), gameState);

                expect(gameState.forColor(white).longCastlingEnabled).toBe(false);
                expect(gameState.forColor(white).shortCastlingEnabled).toBe(true);
                expect(chessboard.isLegalMove(new Game.Move(new Game.Field("e1"), new Game.Field("c1")), gameState)).toBe(false);
            });

            it("It is impossible to perform short castling when there is some piece between", function(){
                chessboard.setPiece(new Game.Field("f1"), new Game.Bishop(white));
                expect(chessboard.isLegalMove(new Game.Move(new Game.Field("e1"), new Game.Field("g1")), gameState)).toBe(false);
            });

            it("It is impossible to perform long castling when there is some piece between", function(){
                chessboard.setPiece(new Game.Field("b1"), new Game.Bishop(white));
                expect(chessboard.isLegalMove(new Game.Move(new Game.Field("e1"), new Game.Field("c1")), gameState)).toBe(false);
            });

            it("It is impossible to perform short castling when king is checked", function(){
                chessboard.setPiece(new Game.Field("b4"), new Game.Bishop(black));
                expect(chessboard.isLegalMove(new Game.Move(new Game.Field("e1"), new Game.Field("g1")), gameState)).toBe(false);
            });

            it("It is impossible to perform long castling when king is checked", function(){
                chessboard.setPiece(new Game.Field("b4"), new Game.Bishop(black));
                expect(chessboard.isLegalMove(new Game.Move(new Game.Field("e1"), new Game.Field("c1")), gameState)).toBe(false);
            });

            it("It is impossible to perform short castling when any field king travels is checked", function(){
                // from c4 black bishop attacks field f1 by which king must travel to reach g1
                chessboard.setPiece(new Game.Field("c4"), new Game.Bishop(black));
                expect(chessboard.isLegalMove(new Game.Move(new Game.Field("e1"), new Game.Field("g1")), gameState)).toBe(false);
            });

            it("It is impossible to perform long castling when any field king travels is checked", function(){
                // from f3 black bishop attacks field d1 by which king must travel to reach c1
                chessboard.setPiece(new Game.Field("f3"), new Game.Bishop(black));
                expect(chessboard.isLegalMove(new Game.Move(new Game.Field("e1"), new Game.Field("c1")), gameState)).toBe(false);
            });

            it("It is possible to perform short castling when some field rook travels is attacked", function(){
                chessboard.setPiece(new Game.Field("e4"), new Game.Bishop(black));
                expect(chessboard.isLegalMove(new Game.Move(new Game.Field("e1"), new Game.Field("g1")), gameState)).toBe(true);
            });

            it("It is possible to perform long castling when some field rook travels is attacked", function(){
                chessboard.setPiece(new Game.Field("e4"), new Game.Bishop(black));
                expect(chessboard.isLegalMove(new Game.Move(new Game.Field("e1"), new Game.Field("c1")), gameState)).toBe(true);
            });

            it("After performed short castling rook is in correct place", function(){
                chessboard.applyMove(new Game.Move(new Game.Field("e1"), new Game.Field("g1")), new Game.GameState());
                expect(chessboard.getPiece(new Game.Field("g1"))).toEqual(new Game.King(white));
                expect(chessboard.getPiece(new Game.Field("f1"))).toEqual(new Game.Rook(white));
                expect(chessboard.getPiece(new Game.Field("e1"))).toBeUndefined();
                expect(chessboard.getPiece(new Game.Field("h1"))).toBeUndefined();
            });

            it("After performed long castling rook is in correct place", function(){
                chessboard.applyMove(new Game.Move(new Game.Field("e1"), new Game.Field("c1")), new Game.GameState());
                expect(chessboard.getPiece(new Game.Field("c1"))).toEqual(new Game.King(white));
                expect(chessboard.getPiece(new Game.Field("d1"))).toEqual(new Game.Rook(white));
                expect(chessboard.getPiece(new Game.Field("e1"))).toBeUndefined();
                expect(chessboard.getPiece(new Game.Field("a1"))).toBeUndefined();
            });
        });

    }
);