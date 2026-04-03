---
name: chinese-chess-board
description: Encode and decode Chinese Chess (Xiangqi) board positions using a FEN-like notation for URL-based rendering.
---

# Chinese Chess Board Encoding / Decoding

This project renders a Chinese Chess (Xiangqi) board from a URL parameter using a FEN-like encoding.

## Board Coordinate System

The board has **9 columns** (0-8, left to right) and **10 rows** (0-9, top to bottom).
Row 0 is Black's back rank; Row 9 is Red's back rank.

```
       col 0 1 2 3 4 5 6 7 8
row 0:     r  n  b  a  k  a  b  n  r    <-- Black's back rank
row 1:     .  .  .  .  .  .  .  .  .
row 2:     .  c  .  .  .  .  .  c  .
row 3:     p  .  p  .  p  .  p  .  p
row 4:     .  .  .  .  .  .  .  .  .
           --------- River ---------
row 5:     .  .  .  .  .  .  .  .  .
row 6:     P  .  P  .  P  .  P  .  P
row 7:     .  C  .  .  .  .  .  C  .
row 8:     .  .  .  .  .  .  .  .  .
row 9:     R  N  B  A  K  A  B  N  R    <-- Red's back rank
```

## Piece Notation

Red pieces use **uppercase** letters; Black pieces use **lowercase**.

| Letter | Red  | Black | Chinese        |
|--------|------|-------|----------------|
| `K`/`k` | 帥   | 將    | King (General) |
| `A`/`a` | 仕   | 士    | Advisor        |
| `B`/`b` | 相   | 象    | Bishop (Elephant) |
| `N`/`n` | 馬   | 馬    | Knight (Horse) |
| `R`/`r` | 車   | 車    | Rook (Chariot) |
| `C`/`c` | 炮   | 砲    | Cannon         |
| `P`/`p` | 兵   | 卒    | Pawn (Soldier) |

## Encoding Rules

The encoding is a **FEN-like** string describing each row from top (row 0) to bottom (row 9):

1. **Row serialization**: Scan each row left to right (column 0 to 8). Write the piece letter for occupied positions.
2. **Empty positions**: Consecutive empty positions are collapsed into a single digit `1`-`9`.
3. **Row separator**: Rows are joined by `/`.

### Formal Grammar

```
board   = row ( "/" row ){9}
row     = token+                  ; tokens must sum to exactly 9 columns
token   = piece | empty
piece   = [KABNRCPkabnrcp]       ; occupies 1 column
empty   = [1-9]                   ; occupies N columns
```

## Encoding Example

**Initial position** (standard opening setup):

```
Row 0: r  n  b  a  k  a  b  n  r   -> "rnbakabnr"
Row 1: .  .  .  .  .  .  .  .  .   -> "9"
Row 2: .  c  .  .  .  .  .  c  .   -> "1c5c1"
Row 3: p  .  p  .  p  .  p  .  p   -> "p1p1p1p1p"
Row 4: .  .  .  .  .  .  .  .  .   -> "9"
Row 5: .  .  .  .  .  .  .  .  .   -> "9"
Row 6: P  .  P  .  P  .  P  .  P   -> "P1P1P1P1P"
Row 7: .  C  .  .  .  .  .  C  .   -> "1C5C1"
Row 8: .  .  .  .  .  .  .  .  .   -> "9"
Row 9: R  N  B  A  K  A  B  N  R   -> "RNBAKABNR"
```

Full string:
```
rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR
```

## Decoding Algorithm

```
Input: FEN string
Output: 10x9 board array

1. Split string by "/". Assert exactly 10 segments.
2. For each segment (row):
   a. Initialize empty row array.
   b. For each character:
      - If digit D ('1'-'9'): append D null entries (empty positions).
      - If letter in [KABNRCPkabnrcp]: append that piece.
      - Otherwise: error.
   c. Assert row length == 9.
3. Return the 10-row board.
```

## Encoding Algorithm

```
Input: 10x9 board array (null = empty, letter = piece)
Output: FEN string

1. For each row:
   a. Initialize empty string, empty_count = 0.
   b. For each cell:
      - If empty: empty_count += 1.
      - If piece:
        - If empty_count > 0: append digit, reset to 0.
        - Append piece letter.
   c. If empty_count > 0 at end of row: append digit.
2. Join all row strings with "/".
```

## URL Usage

```
index.html?board=<FEN_STRING>
```

The FEN string should be URL-encoded when placed in the query parameter. In practice, the only character needing encoding is `/` -> `%2F`, but most browsers handle this transparently.

If no `board` parameter is provided, the page renders the standard initial position.
