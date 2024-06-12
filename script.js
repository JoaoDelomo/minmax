document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('reset');
    const statusText = document.getElementById('status');
    const player = 'X';
    const ai = 'O';
    let board = Array(9).fill(' ');

    function verificarVitoria(board, jogador) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
            [0, 4, 8], [2, 4, 6]  // Diagonais
        ];
        return winPatterns.some(pattern => pattern.every(index => board[index] === jogador));
    }

    function verificarEmpate(board) {
        return board.every(cell => cell !== ' ');
    }

    function minimax(board, profundidade, maximizando) {
        if (verificarVitoria(board, player)) return -10 + profundidade;
        if (verificarVitoria(board, ai)) return 10 - profundidade;
        if (verificarEmpate(board)) return 0;

        if (maximizando) {
            let melhorValor = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === ' ') {
                    board[i] = ai;
                    let valor = minimax(board, profundidade + 1, false);
                    board[i] = ' ';
                    melhorValor = Math.max(melhorValor, valor);
                }
            }
            return melhorValor;
        } else {
            let piorValor = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === ' ') {
                    board[i] = player;
                    let valor = minimax(board, profundidade + 1, true);
                    board[i] = ' ';
                    piorValor = Math.min(piorValor, valor);
                }
            }
            return piorValor;
        }
    }

    function melhorJogada(board) {
        let melhorValor = -Infinity;
        let movimento;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === ' ') {
                board[i] = ai;
                let valor = minimax(board, 0, false);
                board[i] = ' ';
                if (valor > melhorValor) {
                    melhorValor = valor;
                    movimento = i;
                }
            }
        }
        return movimento;
    }

    function handleCellClick(event) {
        const index = event.target.dataset.index;
        if (board[index] !== ' ') return;

        board[index] = player;
        event.target.textContent = player;

        if (verificarVitoria(board, player)) {
            statusText.textContent = "Humano venceu!";
            cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
            return;
        }

        if (verificarEmpate(board)) {
            statusText.textContent = "Empate!";
            return;
        }

        const aiMove = melhorJogada(board);
        board[aiMove] = ai;
        cells[aiMove].textContent = ai;

        if (verificarVitoria(board, ai)) {
            statusText.textContent = "IA venceu!";
            cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
            return;
        }

        if (verificarEmpate(board)) {
            statusText.textContent = "Empate!";
            return;
        }
    }

    function resetGame() {
        board = Array(9).fill(' ');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.addEventListener('click', handleCellClick);
        });
        statusText.textContent = '';
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);
});
