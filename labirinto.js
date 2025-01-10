document.addEventListener('DOMContentLoaded', function () {
    const maze = document.getElementById('maze');
    let rows = 10;
    let cols = 10;
    const maxSize = 20; // Tamanho máximo do labirinto
    let maxTime = 60; // Tempo inicial em segundos
    const minTime = 10; // Tempo mínimo permitido
    let playerPosition = { row: 0, col: 0 };
    let moves = 0;
    let remainingTime = maxTime; // Variável para a contagem regressiva
    let timerInterval;

    // Som do movimento
    const moveSound = new Audio('sons/pulo2.mp3'); // Caminho para o arquivo de som

    const directions = [
        { row: -1, col: 0 }, // Cima
        { row: 1, col: 0 },  // Baixo
        { row: 0, col: -1 }, // Esquerda
        { row: 0, col: 1 }   // Direita
    ];

    function createMaze() {
        maze.innerHTML = '';
        for (let r = 0; r < rows; r++) {
            let row = maze.insertRow();
            for (let c = 0; c < cols; c++) {
                let cell = row.insertCell();
                cell.classList.add('wall'); // Todas as células começam como paredes
            }
        }
    }

    function generateMaze(row, col) {
        maze.rows[row].cells[col].classList.remove('wall');
        const shuffledDirections = directions.sort(() => Math.random() - 0.5);
        for (let direction of shuffledDirections) {
            const newRow = row + direction.row * 2;
            const newCol = col + direction.col * 2;
            if (isValidCell(newRow, newCol)) {
                maze.rows[row + direction.row].cells[col + direction.col].classList.remove('wall');
                generateMaze(newRow, newCol);
            }
        }
    }

    function isValidCell(row, col) {
        return row >= 0 && row < rows && col >= 0 && col < cols && maze.rows[row].cells[col].classList.contains('wall');
    }

    function ensureGoalAccess() {
        if (cols > 1) {
            maze.rows[rows - 1].cells[cols - 2].classList.remove('wall');
        }
        if (rows > 1) {
            maze.rows[rows - 2].cells[cols - 1].classList.remove('wall');
        }
        maze.rows[rows - 1].cells[cols - 1].style.borderLeft = 'none';
    }

    function movePlayer(newRow, newCol) {
        const newCell = maze.rows[newRow]?.cells[newCol];
        if (newCell && !newCell.classList.contains('wall')) {
            maze.rows[playerPosition.row].cells[playerPosition.col].classList.remove('player');
            newCell.classList.add('player');
            playerPosition = { row: newRow, col: newCol };
            moves++;
            document.getElementById('moves').textContent = moves;

            // Reproduzir o som ao mover
            moveSound.currentTime = 0; // Reinicia o som
            moveSound.play();

            if (newCell.classList.contains('goal')) {
                clearInterval(timerInterval);

                // Verificar o tamanho máximo antes de aumentar o labirinto
                if (rows < maxSize && cols < maxSize) {
                    rows++;
                    cols++;

                    // Reduzir o tempo máximo em 15 segundos, respeitando o limite mínimo
                    maxTime = Math.max(minTime, maxTime - 5);

                    resetGame();
                } else {
                    alert('Você atingiu o tamanho máximo do labirinto!');
                }
            }
        }
    }

    document.addEventListener('keydown', function (event) {
        const key = event.key;
        switch (key) {
            case 'ArrowUp':
                movePlayer(playerPosition.row - 1, playerPosition.col);
                break;
            case 'ArrowDown':
                movePlayer(playerPosition.row + 1, playerPosition.col);
                break;
            case 'ArrowLeft':
                movePlayer(playerPosition.row, playerPosition.col - 1);
                break;
            case 'ArrowRight':
                movePlayer(playerPosition.row, playerPosition.col + 1);
                break;
        }
    });

    function startTimer() {
        remainingTime = maxTime; // Reinicie o tempo restante com o novo maxTime
        document.getElementById('time').textContent = remainingTime;
        timerInterval = setInterval(() => {
            remainingTime--;
            document.getElementById('time').textContent = remainingTime;

            // Verificar se o tempo acabou
            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                alert('O tempo acabou! Tente novamente.');
                resetGame();
            }
        }, 1000);
    }

    function resetGame() {
        clearInterval(timerInterval);
        moves = 0;
        document.getElementById('moves').textContent = moves;

        createMaze();
        generateMaze(0, 0);
        ensureGoalAccess();

        maze.rows[0].cells[0].classList.add('player');
        maze.rows[rows - 1].cells[cols - 1].classList.remove('wall');
        maze.rows[rows - 1].cells[cols - 1].classList.add('goal');

        playerPosition = { row: 0, col: 0 };
        startTimer();
    }

    resetGame();

    document.getElementById('restart').addEventListener('click', () => {
        rows = 10; // Redefinir o tamanho do labirinto ao reiniciar
        cols = 10;
        maxTime = 60; // Redefinir o tempo máximo ao reiniciar
        resetGame();
    });
});
