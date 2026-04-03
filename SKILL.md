---
name: chess-board
description: Encode and decode chess board positions (Xiangqi and International Chess) using FEN notation for URL-based rendering.
---

# Chess Board Encoding / Decoding

This project renders chess board positions from a URL parameter using standard FEN notation. It supports both **Xiangqi (Chinese Chess)** and **International Chess**.

## Common Encoding Rules

Both variants use the same FEN-like encoding scheme:

1. **Row serialization**: Rows are described from top to bottom (row 0 = top of board). Each row is scanned left to right.
2. **Piece characters**: Each piece is represented by a single letter. Uppercase = White/Red, lowercase = Black.
3. **Empty positions**: Consecutive empty squares are collapsed into a single digit (`1`-`9` for xiangqi, `1`-`8` for chess).
4. **Row separator**: Rows are joined by `/`.

### Encoding Algorithm

```
Input: board array (null = empty, letter = piece)
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

### Decoding Algorithm

```
Input: FEN string
Output: board array

1. Split string by "/". Assert correct number of rows.
2. For each segment (row):
   a. Initialize empty row array.
   b. For each character:
      - If digit D: append D null entries (empty positions).
      - If valid piece letter: append that piece.
      - Otherwise: error.
   c. Assert row length matches expected columns.
3. Return the board array.
```

---

## Xiangqi (Chinese Chess)

**Board**: 9 columns x 10 rows

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

### Piece Notation

| Letter   | Red | Black | Piece             |
|----------|-----|-------|-------------------|
| `K`/`k`  | 帥  | 將    | King (General)    |
| `A`/`a`  | 仕  | 士    | Advisor           |
| `B`/`b`  | 相  | 象    | Bishop (Elephant) |
| `N`/`n`  | 馬  | 馬    | Knight (Horse)    |
| `R`/`r`  | 車  | 車    | Rook (Chariot)    |
| `C`/`c`  | 炮  | 砲    | Cannon            |
| `P`/`p`  | 兵  | 卒    | Pawn (Soldier)    |

### Formal Grammar

```
board   = row ( "/" row ){9}
row     = token+                    ; tokens must sum to exactly 9 columns
token   = piece | empty
piece   = [KABNRCPkabnrcp]         ; occupies 1 column
empty   = [1-9]                     ; occupies N columns
```

### Example

Initial position:

```
rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR
```

### URL

```
https://frostming.github.io/chess-board/xiangqi.html?board=<FEN_STRING>
```

---

## International Chess

**Board**: 8 columns x 8 rows

```
       col 0 1 2 3 4 5 6 7
row 0:     r  n  b  q  k  b  n  r    <-- Black's back rank (rank 8)
row 1:     p  p  p  p  p  p  p  p
row 2:     .  .  .  .  .  .  .  .
row 3:     .  .  .  .  .  .  .  .
row 4:     .  .  .  .  .  .  .  .
row 5:     .  .  .  .  .  .  .  .
row 6:     P  P  P  P  P  P  P  P
row 7:     R  N  B  Q  K  B  N  R    <-- White's back rank (rank 1)
```

### Piece Notation

| Letter   | White | Black | Piece  |
|----------|-------|-------|--------|
| `K`/`k`  | King  | King  | King   |
| `Q`/`q`  | Queen | Queen | Queen  |
| `R`/`r`  | Rook  | Rook  | Rook   |
| `B`/`b`  | Bishop| Bishop| Bishop |
| `N`/`n`  | Knight| Knight| Knight |
| `P`/`p`  | Pawn  | Pawn  | Pawn   |

### Formal Grammar

```
board   = row ( "/" row ){7}
row     = token+                    ; tokens must sum to exactly 8 columns
token   = piece | empty
piece   = [KQRBNPkqrbnp]           ; occupies 1 column
empty   = [1-8]                     ; occupies N columns
```

### Example

Initial position:

```
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR
```

### URL

```
https://frostming.github.io/chess-board/chess.html?board=<FEN_STRING>
```

---

## Notes

- The FEN string should be URL-encoded when placed in the query parameter. In practice, `/` is the only character needing encoding (`%2F`), but most browsers handle this transparently.
- If no `board` parameter is provided, the page renders the standard initial position.
- This encoding is a subset of standard FEN -- only the piece placement field is used; turn, castling, en passant, and move counters are not included.
