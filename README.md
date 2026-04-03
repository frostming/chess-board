# Chess Board Viewer

Static pages that render chess board positions from a URL parameter using FEN notation.

## Pages

### Xiangqi (Chinese Chess)

```
xiangqi.html?board=rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR
```

10 rows, 9 columns. Pieces rendered in traditional Chinese using [京華老宋体](https://github.com/frostming/jinghua-webfont) webfont.

| Letter  | Red | Black | Piece             |
|---------|-----|-------|-------------------|
| `K`/`k` | 帥  | 將    | King (General)    |
| `A`/`a` | 仕  | 士    | Advisor           |
| `B`/`b` | 相  | 象    | Bishop (Elephant) |
| `N`/`n` | 馬  | 馬    | Knight (Horse)    |
| `R`/`r` | 車  | 車    | Rook (Chariot)    |
| `C`/`c` | 炮  | 砲    | Cannon            |
| `P`/`p` | 兵  | 卒    | Pawn (Soldier)    |

### Chess (International)

```
chess.html?board=rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR
```

8 rows, 8 columns. Pieces rendered as Unicode chess symbols.

| Letter  | White | Black | Piece  |
|---------|-------|-------|--------|
| `K`/`k` | ♔    | ♚    | King   |
| `Q`/`q` | ♕    | ♛    | Queen  |
| `R`/`r` | ♖    | ♜    | Rook   |
| `B`/`b` | ♗    | ♝    | Bishop |
| `N`/`n` | ♘    | ♞    | Knight |
| `P`/`p` | ♙    | ♟    | Pawn   |

## Encoding

Both pages use standard FEN notation: rows from top to bottom separated by `/`, with consecutive empty squares collapsed into digits `1`-`8` (or `1`-`9` for xiangqi). Uppercase = White/Red, lowercase = Black.

If no `board` parameter is provided, the standard initial position is displayed.

See [SKILL.md](SKILL.md) for the full xiangqi encoding/decoding specification.

## Project Structure

```
css/common.css   - Shared layout styles
js/common.js     - Shared FEN parsing and canvas utilities
xiangqi.html     - Chinese Chess renderer
chess.html       - International Chess renderer
```

## License

[MIT](LICENSE)
