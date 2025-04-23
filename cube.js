class RubiksCube {
    constructor() {
        this.cube = document.getElementById('cube');
        this.container = document.getElementById('container');
        this.faces = {
            front: document.querySelector('.front'),
            back: document.querySelector('.back'),
            right: document.querySelector('.right'),
            left: document.querySelector('.left'),
            top: document.querySelector('.top'),
            bottom: document.querySelector('.bottom')
        };

        // Initialize cube state
        this.state = {
            front: [
                ['green', 'green', 'green'],
                ['green', 'green', 'green'],
                ['green', 'green', 'green']
            ],
            back: [
                ['blue', 'blue', 'blue'],
                ['blue', 'blue', 'blue'],
                ['blue', 'blue', 'blue']
            ],
            right: [
                ['red', 'red', 'red'],
                ['red', 'red', 'red'],
                ['red', 'red', 'red']
            ],
            left: [
                ['orange', 'orange', 'orange'],
                ['orange', 'orange', 'orange'],
                ['orange', 'orange', 'orange']
            ],
            top: [
                ['white', 'white', 'white'],
                ['white', 'white', 'white'],
                ['white', 'white', 'white']
            ],
            bottom: [
                ['yellow', 'yellow', 'yellow'],
                ['yellow', 'yellow', 'yellow'],
                ['yellow', 'yellow', 'yellow']
            ]
        };
        
        // Initialize rotation state
        this.rotationX = -30;
        this.rotationY = 30;
        this.isMouseDown = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        
        this.initializeCube();
        this.setupMouseControls();
        this.setupKeyboardControls();
    }

    initializeCube() {
        for (let face in this.faces) {
            const faceElement = this.faces[face];
            for (let i = 0; i < 9; i++) {
                const cubie = document.createElement('div');
                cubie.className = 'cubie';
                cubie.classList.add(this.state[face][Math.floor(i/3)][i%3]);
                faceElement.appendChild(cubie);
            }
        }
        this.updateCubeRotation();
    }

    setupMouseControls() {
        this.container.addEventListener('mousedown', (e) => {
            this.isMouseDown = true;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isMouseDown) return;
            const deltaX = e.clientX - this.lastMouseX;
            const deltaY = e.clientY - this.lastMouseY;
            this.rotationY += deltaX * 0.8;
            this.rotationX -= deltaY * 0.8;
            this.rotationY = this.rotationY % 360;
            this.rotationX = this.rotationX % 360;
            this.updateCubeRotation();
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        });

        document.addEventListener('mouseup', () => this.isMouseDown = false);
        document.addEventListener('mouseleave', () => this.isMouseDown = false);
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            // Don't handle keyboard controls if the move input is focused
            if (document.getElementById('moveInput') === document.activeElement) {
                return;
            }

            const key = e.key.toLowerCase();
            const isShift = e.shiftKey;

            if ('fblrudm'.includes(key)) {
                e.preventDefault();
                switch(key) {
                    case 'f': isShift ? this.FPrime() : this.F(); break;
                    case 'b': isShift ? this.BPrime() : this.B(); break;
                    case 'r': isShift ? this.RPrime() : this.R(); break;
                    case 'l': isShift ? this.LPrime() : this.L(); break;
                    case 'u': isShift ? this.UPrime() : this.U(); break;
                    case 'd': isShift ? this.DPrime() : this.D(); break;
                    case 'm': isShift ? this.MPrime() : this.M(); break;
                }
            }
        });
    }

    updateCubeRotation() {
        this.cube.style.transform = `rotateX(${this.rotationX}deg) rotateY(${this.rotationY}deg)`;
    }

    updateVisual() {
        for (let face in this.faces) {
            const faceElement = this.faces[face];
            const cubies = faceElement.children;
            for (let i = 0; i < 9; i++) {
                const cubie = cubies[i];
                cubie.className = 'cubie ' + this.state[face][Math.floor(i/3)][i%3];
            }
        }
    }

    // Helper function for face rotation
    rotateFaceMatrix(face, clockwise) {
        const oldState = JSON.parse(JSON.stringify(this.state[face]));
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (clockwise) {
                    this.state[face][i][j] = oldState[2-j][i];
                } else {
                    this.state[face][i][j] = oldState[j][2-i];
                }
            }
        }
    }

    F() {
        const oldState = JSON.parse(JSON.stringify(this.state));
        this.rotateFaceMatrix('front', true);
        for (let i = 0; i < 3; i++) {
            const temp = oldState.top[2][i];
            this.state.top[2][i] = oldState.left[2-i][2];
            this.state.left[2-i][2] = oldState.bottom[0][2-i];
            this.state.bottom[0][2-i] = oldState.right[i][0];
            this.state.right[i][0] = temp;
        }
        this.updateVisual();
    }

    FPrime() {
        const oldState = JSON.parse(JSON.stringify(this.state));
        this.rotateFaceMatrix('front', false);
        for (let i = 0; i < 3; i++) {
            const temp = oldState.top[2][i];
            this.state.top[2][i] = oldState.right[i][0];
            this.state.right[i][0] = oldState.bottom[0][2-i];
            this.state.bottom[0][2-i] = oldState.left[2-i][2];
            this.state.left[2-i][2] = temp;
        }
        this.updateVisual();
    }

    U() {
        const oldState = JSON.parse(JSON.stringify(this.state));
        this.rotateFaceMatrix('top', true);
        for (let i = 0; i < 3; i++) {
            const temp = oldState.front[0][i];
            this.state.front[0][i] = oldState.right[0][i];
            this.state.right[0][i] = oldState.back[0][i];
            this.state.back[0][i] = oldState.left[0][i];
            this.state.left[0][i] = temp;
        }
        this.updateVisual();
    }

    UPrime() {
        const oldState = JSON.parse(JSON.stringify(this.state));
        this.rotateFaceMatrix('top', false);
        for (let i = 0; i < 3; i++) {
            const temp = oldState.front[0][i];
            this.state.front[0][i] = oldState.left[0][i];
            this.state.left[0][i] = oldState.back[0][i];
            this.state.back[0][i] = oldState.right[0][i];
            this.state.right[0][i] = temp;
        }
        this.updateVisual();
    }

    R() {
        const oldState = JSON.parse(JSON.stringify(this.state));
        this.rotateFaceMatrix('right', true);
        for (let i = 0; i < 3; i++) {
            const temp = oldState.front[i][2];
            this.state.front[i][2] = oldState.bottom[i][2];
            this.state.bottom[i][2] = oldState.back[2-i][0];
            this.state.back[2-i][0] = oldState.top[i][2];
            this.state.top[i][2] = temp;
        }
        this.updateVisual();
    }

    RPrime() {
        const oldState = JSON.parse(JSON.stringify(this.state));
        this.rotateFaceMatrix('right', false);
        for (let i = 0; i < 3; i++) {
            const temp = oldState.front[i][2];
            this.state.front[i][2] = oldState.top[i][2];
            this.state.top[i][2] = oldState.back[2-i][0];
            this.state.back[2-i][0] = oldState.bottom[i][2];
            this.state.bottom[i][2] = temp;
        }
        this.updateVisual();
    }

    L() {
        const oldState = JSON.parse(JSON.stringify(this.state));
        this.rotateFaceMatrix('left', true);
        for (let i = 0; i < 3; i++) {
            const temp = oldState.front[i][0];
            this.state.front[i][0] = oldState.top[i][0];
            this.state.top[i][0] = oldState.back[2-i][2];
            this.state.back[2-i][2] = oldState.bottom[i][0];
            this.state.bottom[i][0] = temp;
        }
        this.updateVisual();
    }

    LPrime() {
        const oldState = JSON.parse(JSON.stringify(this.state));
        this.rotateFaceMatrix('left', false);
        for (let i = 0; i < 3; i++) {
            const temp = oldState.front[i][0];
            this.state.front[i][0] = oldState.bottom[i][0];
            this.state.bottom[i][0] = oldState.back[2-i][2];
            this.state.back[2-i][2] = oldState.top[i][0];
            this.state.top[i][0] = temp;
        }
        this.updateVisual();
    }

    D() {
        const oldState = JSON.parse(JSON.stringify(this.state));
        this.rotateFaceMatrix('bottom', true);
        for (let i = 0; i < 3; i++) {
            const temp = oldState.front[2][i];
            this.state.front[2][i] = oldState.left[2][i];
            this.state.left[2][i] = oldState.back[2][i];
            this.state.back[2][i] = oldState.right[2][i];
            this.state.right[2][i] = temp;
        }
        this.updateVisual();
    }

    DPrime() {
        const oldState = JSON.parse(JSON.stringify(this.state));
        this.rotateFaceMatrix('bottom', false);
        for (let i = 0; i < 3; i++) {
            const temp = oldState.front[2][i];
            this.state.front[2][i] = oldState.right[2][i];
            this.state.right[2][i] = oldState.back[2][i];
            this.state.back[2][i] = oldState.left[2][i];
            this.state.left[2][i] = temp;
        }
        this.updateVisual();
    }

    B() {
        const oldState = JSON.parse(JSON.stringify(this.state));
        this.rotateFaceMatrix('back', true);
        for (let i = 0; i < 3; i++) {
            const temp = oldState.top[0][i];
            this.state.top[0][i] = oldState.right[i][2];
            this.state.right[i][2] = oldState.bottom[2][2-i];
            this.state.bottom[2][2-i] = oldState.left[2-i][0];
            this.state.left[2-i][0] = temp;
        }
        this.updateVisual();
    }

    BPrime() {
        const oldState = JSON.parse(JSON.stringify(this.state));
        this.rotateFaceMatrix('back', false);
        for (let i = 0; i < 3; i++) {
            const temp = oldState.top[0][i];
            this.state.top[0][i] = oldState.left[2-i][0];
            this.state.left[2-i][0] = oldState.bottom[2][2-i];
            this.state.bottom[2][2-i] = oldState.right[i][2];
            this.state.right[i][2] = temp;
        }
        this.updateVisual();
    }

    M() {
        const oldState = JSON.parse(JSON.stringify(this.state));
        
        // Rotate middle layer pieces
        for (let i = 0; i < 3; i++) {
            const temp = oldState.top[i][1];
            this.state.top[i][1] = oldState.back[2-i][1];
            this.state.back[2-i][1] = oldState.bottom[i][1];
            this.state.bottom[i][1] = oldState.front[i][1];
            this.state.front[i][1] = temp;
        }

        // Rotate centers
        const temp = oldState.top[1][1];
        this.state.top[1][1] = oldState.back[1][1];
        this.state.back[1][1] = oldState.bottom[1][1];
        this.state.bottom[1][1] = oldState.front[1][1];
        this.state.front[1][1] = temp;

        this.updateVisual();
    }

    MPrime() {
        const oldState = JSON.parse(JSON.stringify(this.state));
        
        // Rotate middle layer pieces
        for (let i = 0; i < 3; i++) {
            const temp = oldState.top[i][1];
            this.state.top[i][1] = oldState.front[i][1];
            this.state.front[i][1] = oldState.bottom[i][1];
            this.state.bottom[i][1] = oldState.back[2-i][1];
            this.state.back[2-i][1] = temp;
        }

        // Rotate centers
        const temp = oldState.top[1][1];
        this.state.top[1][1] = oldState.front[1][1];
        this.state.front[1][1] = oldState.bottom[1][1];
        this.state.bottom[1][1] = oldState.back[1][1];
        this.state.back[1][1] = temp;

        this.updateVisual();
    }

    M2() {
        this.M();
        this.M();
    }

    async rotateFace(face, direction) {
        switch(face) {
            case 'R':
                direction === 'clockwise' ? this.R() : this.RPrime();
                break;
            case 'L':
                direction === 'clockwise' ? this.L() : this.LPrime();
                break;
            case 'U':
                direction === 'clockwise' ? this.U() : this.UPrime();
                break;
            case 'D':
                direction === 'clockwise' ? this.D() : this.DPrime();
                break;
            case 'F':
                direction === 'clockwise' ? this.F() : this.FPrime();
                break;
            case 'B':
                direction === 'clockwise' ? this.B() : this.BPrime();
                break;
            case 'M':
                direction === 'clockwise' ? this.M() : this.MPrime();
                break;
        }
        // Add a small delay to make the animation visible
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

// Move Parser
class MoveParser {
    constructor(cube) {
        this.cube = cube;
        this.moveInput = document.getElementById('moveInput');
        this.executeButton = document.getElementById('executeButton');
        this.invertButton = document.getElementById('invertButton');
        this.clearButton = document.getElementById('clearButton');
        this.moveStatus = document.getElementById('moveStatus');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.executeButton.addEventListener('click', () => this.executeMoves());
        this.invertButton.addEventListener('click', () => this.invertMoves());
        this.clearButton.addEventListener('click', () => this.clearInput());
        this.moveInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.executeMoves();
            }
        });
    }

    parseMoves(moveString) {
        const moves = moveString.trim().split(/\s+/);
        const validMoves = [];
        const errors = [];

        // Helper function to check if two moves are redundant
        const areMovesRedundant = (move1, move2) => {
            if (move1.face !== move2.face) return false;
            
            // If both moves are the same face
            if (move1.direction === move2.direction) {
                // If both are clockwise or both are counterclockwise, they're redundant
                return true;
            }
            
            // If one is clockwise and one is counterclockwise, they cancel out
            if (move1.direction === 'clockwise' && move2.direction === 'counterclockwise') {
                return true;
            }
            
            // If one is clockwise and one is double, they're equivalent to counterclockwise
            if ((move1.direction === 'clockwise' && move2.count === 2) ||
                (move2.direction === 'clockwise' && move1.count === 2)) {
                return true;
            }
            
            // If one is counterclockwise and one is double, they're equivalent to clockwise
            if ((move1.direction === 'counterclockwise' && move2.count === 2) ||
                (move2.direction === 'counterclockwise' && move1.count === 2)) {
                return true;
            }
            
            // If both are double moves, they cancel out
            if (move1.count === 2 && move2.count === 2) {
                return true;
            }
            
            return false;
        };

        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            if (!move) continue;

            let face = move[0].toUpperCase();
            let direction = move.length > 1 ? move[1] : '';
            let count = move.length > 2 ? parseInt(move[2]) : 1;

            // Check if it's a valid face
            if (!['R', 'L', 'U', 'D', 'F', 'B', 'M'].includes(face)) {
                errors.push(`Invalid face: ${face}`);
                continue;
            }

            // Check if it's a valid direction
            if (direction && direction !== "'" && direction !== '2') {
                errors.push(`Invalid direction: ${direction}`);
                continue;
            }

            // Check if it's a valid count
            if (isNaN(count) || count < 1) {
                errors.push(`Invalid count: ${count}`);
                continue;
            }

            const currentMove = {
                face,
                direction: direction === "'" ? 'counterclockwise' : 'clockwise',
                count: direction === '2' ? 2 : count
            };

            // Check for redundancy with previous move
            if (validMoves.length > 0) {
                const previousMove = validMoves[validMoves.length - 1];
                if (areMovesRedundant(previousMove, currentMove)) {
                    errors.push(`Redundant moves: ${moves[i-1]} and ${move}`);
                    continue;
                }
            }

            validMoves.push(currentMove);
        }

        return { validMoves, errors };
    }

    async executeMoves() {
        const moveString = this.moveInput.value;
        const { validMoves, errors } = this.parseMoves(moveString);

        if (errors.length > 0) {
            this.showError(errors.join(', '));
            return;
        }

        if (validMoves.length === 0) {
            this.showError('No valid moves to execute');
            return;
        }

        this.executeButton.disabled = true;
        this.invertButton.disabled = true;
        this.clearButton.disabled = true;

        for (const move of validMoves) {
            for (let i = 0; i < move.count; i++) {
                await this.cube.rotateFace(move.face, move.direction);
            }
        }

        this.executeButton.disabled = false;
        this.invertButton.disabled = false;
        this.clearButton.disabled = false;
        this.showSuccess(`Executed ${validMoves.length} moves`);
    }

    invertMoves() {
        const moveString = this.moveInput.value;
        const { validMoves, errors } = this.parseMoves(moveString);

        if (errors.length > 0) {
            this.showError(errors.join(', '));
            return;
        }

        if (validMoves.length === 0) {
            this.showError('No valid moves to invert');
            return;
        }

        const invertedMoves = validMoves
            .reverse()
            .map(move => {
                // For 180-degree turns, the inverse is the same move
                if (move.count === 2) {
                    return `${move.face}2`;
                }
                // For other moves, invert the direction
                return {
                    ...move,
                    direction: move.direction === 'clockwise' ? 'counterclockwise' : 'clockwise'
                };
            })
            .map(move => {
                if (typeof move === 'string') return move;
                const direction = move.direction === 'clockwise' ? '' : "'";
                return `${move.face}${direction}`;
            })
            .join(' ');

        this.moveInput.value = invertedMoves;
        this.showSuccess('Moves inverted');
    }

    clearInput() {
        this.moveInput.value = '';
        this.moveStatus.textContent = '';
        this.moveStatus.className = '';
    }

    showError(message) {
        this.moveStatus.textContent = message;
        this.moveStatus.className = 'error';
    }

    showSuccess(message) {
        this.moveStatus.textContent = message;
        this.moveStatus.className = 'success';
    }
}

// Initialize the cube and move parser
const cube = new RubiksCube();
const moveParser = new MoveParser(cube);

window.addEventListener('load', () => new RubiksCube()); 