package net.michalsitko.kloc.game

import java.nio.file.{Files, Paths}
import io.Source
import java.io.FileNotFoundException

/**
 * Created with IntelliJ IDEA.
 * User: michal
 * Date: 5/25/13
 * Time: 4:19 PM
 * To change this template use File | Settings | File Templates.
 */
class Chessboard {
  private val fields = Array.fill[Option[Piece]](8, 8)(None)
  protected val allFields = for (letter <- 'a' to 'h'; number <- 1 to 8) yield {letter.toString() + number}

  def getFieldOfKing(color: Color): Option[Field] = {
    val expectedKing = KingFactory.forColor(color)
    allFields.map(Field.fromString((_))).find(getPiece(_).getOrElse(null) == expectedKing)
  }

  def withAppliedMove[T] (move: Move) (fn: (Chessboard) => T): T = {
    val activePiece = getPiece(move.from)
    val old = getPiece(move.to)
    applyMove(move)
    val result = fn(this)
    setPiece(move.to, old)
    setPiece(move.from, activePiece)
    result
  }

  def isPinned(move: Move): Boolean = {
    val activeColor = getPiece(move.from).get.getColor()
    val fieldOfKing = getFieldOfKing(activeColor)

    // TODO: refactor
    if(!fieldOfKing.isDefined || getPiece(move.from).get == WhiteKing || getPiece(move.from).get == BlackKing)
      return false

    val king = KingFactory.forColor(activeColor)
    withAppliedMove(move){
      king.isChecked(_, fieldOfKing.get)
    }
  }

  def somethingBetweenHorizontally(field: Field, anotherField: Field): Boolean = {
    field.nextFieldsTo(getDirectionForHorizontal(field, anotherField), anotherField).exists(getPiece(_).map(_ => true).getOrElse(false))
  }

  def somethingBetweenVertically(field: Field, anotherField: Field): Boolean = {
    field.nextFieldsTo(getDirectionForVertical(field, anotherField), anotherField).exists(getPiece(_).map(_ => true).getOrElse(false))
  }

  def somethingBetweenDiagonally(field: Field, anotherField: Field): Boolean = {
    field.nextFieldsTo(getDirectionForDiagonal(field, anotherField), anotherField).exists(getPiece(_).map(_ => true).getOrElse(false))
  }

  def getFieldsBetween(field: Field, anotherField: Field): List[Field] = {
    if (field.row == anotherField.row)
      return field.nextFieldsTo(getDirectionForHorizontal(field, anotherField), anotherField)

    if (field.column == anotherField.column)
      return field.nextFieldsTo(getDirectionForVertical(field, anotherField), anotherField)

    if (field.sameDiagonal(anotherField))
      return field.nextFieldsTo(getDirectionForDiagonal(field, anotherField), anotherField)

    List()
  }

  def getDirectionForHorizontal(field: Field, anotherField: Field): (Int, Int) = {
    require(field.sameRow(anotherField))

    if (field.column < anotherField.column)
      (0, 1)
    else
      (0, -1)
  }

  def getDirectionForVertical(field: Field, anotherField: Field): (Int, Int) = {
    require(field.sameColumn(anotherField))

    if (field.row < anotherField.row)
      (1, 0)
    else
      (-1, 0)
  }

  def getDirectionForDiagonal(field: Field, anotherField: Field): (Int, Int) = {
    require(field.sameDiagonal(anotherField))

    val rowIncrease = if (field.row < anotherField.row) 1 else -1
    val columnIncrease = if (field.column < anotherField.column) 1 else -1
    (rowIncrease, columnIncrease)
  }

  def somethingBetween(field: Field, anotherField: Field): Boolean = {
    if (field.row == anotherField.row)
      return somethingBetweenHorizontally(field, anotherField)

    if (field.column == anotherField.column)
      return somethingBetweenVertically(field, anotherField)

    if (field.sameDiagonal(anotherField))
      return somethingBetweenDiagonally(field, anotherField)

    return true
  }

  def setPiece(field: Field, piece: Option[Piece]) {
    fields(field.row)(field.column) = piece
  }

  def applyMove(move: Move) {
     // this method assumes that move is legal
    setPiece(move.to, getPiece(move.from))
    setPiece(move.from, None)
  }

  def isMoveCorrect(move: Move): Boolean = {
    if (getPiece((move.from)).isDefined)
      return getPiece(move.from).get.isMoveCorrect(this, move)
    return false
  }

  def getPiece(field: Field): Option[Piece] = {
    getPiece(field.row, field.column)
  }

  def getPiece(row: Int, column: Int): Option[Piece] = {
    fields(row)(column)
  }

  def getFieldsOfPieces(color: Color) = {
    allFields.filter(getPiece(_).map(_.getColor() == color).getOrElse(false)).map(Field.fromString(_))
  }
}

object Chessboard{
  val symbolToPieceMap = createSymbolToPieceMap()

  def loadFromFile(fileName: String): Chessboard = {
    val chessboard = new Chessboard
    try{
      val source = Source.fromURL(getClass.getResource(fileName))
      val content = source.mkString.replaceAll("""\s+""", "")

      val iterator = content.iterator
      for (row <- chessboard.fields.reverse; i <- 0 to (row.size - 1)){
        row(i) = symbolToPieceMap.get(iterator.next())
      }
      chessboard
    } catch {
      case ex: NullPointerException => throw new FileNotFoundException()
    }
  }

  private def createSymbolToPieceMap(): Map[Char, Piece] = {
    (for (piece <- Piece.values) yield (piece.getSymbol -> piece)).toMap
  }
}
