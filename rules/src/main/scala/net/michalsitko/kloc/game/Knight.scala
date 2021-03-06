package net.michalsitko.kloc.game

/**
 * Created with IntelliJ IDEA.
 * User: michal
 * Date: 5/25/13
 * Time: 8:15 PM
 * To change this template use File | Settings | File Templates.
 */

abstract trait Knight extends Piece {
  def getDirections(): List[(Int, Int)] = Knight.getDirections()

  def checkMoveCorrect(chessboard: Chessboard, move: Move, gameState: GameState): Boolean = {
    move.to.isKnightAccessible(move.from)
  }
}

object KnightFactory extends PieceFactory {
  def forColor(color: Color): Knight = {
    color match {
      case White() => WhiteKnight
      case Black() => BlackKnight
    }
  }
}

object Knight{
  def getDirections() = {
    List((1, 2), (2, 1), (-1, 2), (-2, 1), (1, -2), (2, -1), (-1, -2), (-2, -1))
  }
}

case object WhiteKnight extends Knight {
  def getSymbol(): Char = 'N'

  def getColor(): Color = new White
}

case object BlackKnight extends Knight {
  def getSymbol(): Char = WhiteKnight.getSymbol().toLower

  def getColor(): Color = new Black
}