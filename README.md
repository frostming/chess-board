# Chinese Chess Board Viewer

A single-page static site that renders a Chinese Chess (Xiangqi) board from a URL parameter.

## Usage

Open `index.html` in a browser. Pass a FEN-like string via the `board` query parameter:

```
index.html?board=rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR
```

If no `board` parameter is provided, the standard initial position is displayed.

## Encoding Format

The board is encoded as a FEN-like string — 10 rows from top (Black's back rank) to bottom (Red's back rank), separated by `/`.

- Consecutive empty positions are collapsed into a digit `1`–`9`
- Red pieces: uppercase letters; Black pieces: lowercase letters

| Letter  | Red | Black | Piece             |
|---------|-----|-------|-------------------|
| `K`/`k` | 帥  | 將    | King (General)    |
| `A`/`a` | 仕  | 士    | Advisor           |
| `B`/`b` | 相  | 象    | Bishop (Elephant) |
| `N`/`n` | 馬  | 馬    | Knight (Horse)    |
| `R`/`r` | 車  | 車    | Rook (Chariot)    |
| `C`/`c` | 炮  | 砲    | Cannon            |
| `P`/`p` | 兵  | 卒    | Pawn (Soldier)    |

See [SKILL.md](SKILL.md) for the full encoding/decoding specification.

## Font

Pieces are rendered using [京華老宋体 (Jinghua Old Song)](https://github.com/frostming/jinghua-webfont) webfont in traditional Chinese characters.

## License

[MIT](LICENSE)
