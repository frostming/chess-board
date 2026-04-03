/**
 * Parse a FEN-like string into a 2D board array.
 * @param {string} fen - The FEN string
 * @param {Object} pieceMap - Valid piece characters map
 * @param {number} expectedRows - Number of rows (10 for xiangqi, 8 for chess)
 * @param {number} expectedCols - Number of columns (9 for xiangqi, 8 for chess)
 * @returns {Array<Array<string|null>>}
 */
function parseFEN(fen, pieceMap, expectedRows, expectedCols) {
  const rows = fen.split('/');
  if (rows.length !== expectedRows) {
    throw new Error(`Expected ${expectedRows} rows, got ${rows.length}`);
  }

  const board = [];
  for (let r = 0; r < expectedRows; r++) {
    const row = [];
    for (const ch of rows[r]) {
      if (ch >= '1' && ch <= '9') {
        for (let i = 0; i < parseInt(ch); i++) row.push(null);
      } else if (pieceMap[ch]) {
        row.push(ch);
      } else {
        throw new Error(`Unknown piece character: '${ch}'`);
      }
    }
    if (row.length !== expectedCols) {
      throw new Error(`Row ${r} has ${row.length} columns, expected ${expectedCols}`);
    }
    board.push(row);
  }
  return board;
}

/**
 * Compute cell size and padding that fit within the viewport.
 * @param {number} preferredSize - Ideal cell size in px
 * @param {number} gridCells - Number of cells across (cols-1 for xiangqi, cols for chess)
 * @param {number} preferredPadding - Ideal padding on each side in px
 * @returns {{ cellSize: number, padding: number }}
 */
function responsiveLayout(preferredSize, gridCells, preferredPadding) {
  var container = document.querySelector('.container');
  var maxWidth = container ? container.clientWidth : window.innerWidth;
  var needed = gridCells * preferredSize + preferredPadding * 2;
  if (needed <= maxWidth) return { cellSize: preferredSize, padding: preferredPadding };
  // Shrink padding first (min 12px), then shrink cellSize
  var minPadding = 12;
  var padding = Math.max(minPadding, Math.floor((maxWidth - gridCells * preferredSize) / 2));
  if (padding > minPadding) return { cellSize: preferredSize, padding: padding };
  var cellSize = Math.floor((maxWidth - minPadding * 2) / gridCells);
  return { cellSize: cellSize, padding: minPadding };
}

/**
 * Set up a HiDPI canvas and return the 2D context.
 * @param {HTMLCanvasElement} canvas
 * @param {number} w - Logical width
 * @param {number} h - Logical height
 * @returns {CanvasRenderingContext2D}
 */
function setupCanvas(canvas, w, h) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return ctx;
}

/**
 * Main entry: read ?board= param, parse FEN, call drawBoard.
 * @param {Object} config
 * @param {Object} config.pieceMap
 * @param {number} config.rows
 * @param {number} config.cols
 * @param {string} config.defaultFEN
 * @param {function} config.drawBoard
 */
var GITHUB_URL = 'https://github.com/frostming/chess-board';

function initToolbar(fen) {
  var toolbar = document.getElementById('toolbar');

  // Share button
  var shareBtn = document.createElement('button');
  shareBtn.innerHTML =
    '<svg viewBox="0 0 16 16"><path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zM2.5 6a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>' +
    'Share';
  shareBtn.onclick = function () {
    var url = window.location.origin + window.location.pathname + '?board=' + encodeURIComponent(fen);
    navigator.clipboard.writeText(url).then(function () {
      shareBtn.classList.add('copied');
      shareBtn.innerHTML =
        '<svg viewBox="0 0 16 16"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z"/></svg>' +
        'Copied!';
      setTimeout(function () {
        shareBtn.classList.remove('copied');
        shareBtn.innerHTML =
          '<svg viewBox="0 0 16 16"><path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zM2.5 6a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>' +
          'Share';
      }, 2000);
    });
  };
  toolbar.appendChild(shareBtn);

  // GitHub link
  var ghLink = document.createElement('a');
  ghLink.href = GITHUB_URL;
  ghLink.target = '_blank';
  ghLink.rel = 'noopener noreferrer';
  ghLink.innerHTML =
    '<svg viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>' +
    'GitHub';
  toolbar.appendChild(ghLink);
}

function main(config) {
  var params = new URLSearchParams(window.location.search);
  var fen = params.get('board');
  var activeFEN = fen ? decodeURIComponent(fen) : config.defaultFEN;

  try {
    var board = parseFEN(activeFEN, config.pieceMap, config.rows, config.cols);
    config.drawBoard(board);
    if (!fen) {
      document.getElementById('info').textContent =
        'Usage: ?board=' + config.defaultFEN;
    }
  } catch (e) {
    document.getElementById('info').innerHTML = '<span class="error">' +
      (fen ? 'Invalid board: ' : '') + e.message + '</span>';
  }

  initToolbar(activeFEN);
}
