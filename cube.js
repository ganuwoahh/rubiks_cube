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
            const key = e.key.toLowerCase();
            const isShift = e.shiftKey;

            if ('fblrud'.includes(key)) {
                e.preventDefault();
                switch(key) {
                    case 'f': isShift ? this.FPrime() : this.F(); break;
                    case 'b': isShift ? this.BPrime() : this.B(); break;
                    case 'r': isShift ? this.RPrime() : this.R(); break;
                    case 'l': isShift ? this.LPrime() : this.L(); break;
                    case 'u': isShift ? this.UPrime() : this.U(); break;
                    case 'd': isShift ? this.DPrime() : this.D(); break;
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
}

window.addEventListener('load', () => new RubiksCube()); 