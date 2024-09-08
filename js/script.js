// Game Class
class Game {
    constructor(ui) {
        this.ui = ui;
        this.buttons = [];
        this.correctOrder = [];
        this.userOrder = [];
        this.numberOfButtons = 0;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('goButton').addEventListener('click', () => this.startGame());
    }

    startGame() {
        const input = document.getElementById('buttonNumber').value;
        this.numberOfButtons = parseInt(input);

        // Input validation (between 3 and 7)
        if (this.numberOfButtons >= 3 && this.numberOfButtons <= 7) {
            alert(messages.start); // Game start message
            this.ui.clearButtons();
            this.buttons = this.createButtons(this.numberOfButtons);
            this.correctOrder = this.buttons.map(button => button.index); // Store the correct order
            this.userOrder = []; // Clear user order
            this.ui.arrangeButtons(this.buttons);
            
            // Pause for 'n' seconds before starting the scrambling
            this.pauseForSeconds(this.numberOfButtons, () => this.startScrambling());
        } else {
            alert(messages.validation); // Input validation message
        }
    }

    createButtons(n) {
        const buttons = [];
        for (let i = 0; i < n; i++) {
            const button = new Button(i, this.ui);
            buttons.push(button);
            this.ui.addButton(button.element);
        }
        return buttons;
    }

    pauseForSeconds(seconds, callback) {
        setTimeout(callback, seconds * 1000); // Pauses for 'seconds'
    }

    startScrambling() {
        let scrambleCount = 0;

        const scrambleInterval = setInterval(() => {
            if (scrambleCount < this.numberOfButtons) {
                this.ui.scrambleButtons(this.buttons); // Scramble buttons
                scrambleCount++;
            } else {
                clearInterval(scrambleInterval); // Stop scrambling after n times
                this.hideNumbers();
            }
        }, this.numberOfButtons * 1000); // Pause between scrambles is 'n' seconds
    }

    hideNumbers() {
        this.buttons.forEach(button => button.hideNumber());
        this.ui.makeButtonsClickable(this.buttons, this.handleButtonClick.bind(this));
    }

    handleButtonClick(buttonIndex) {
        // Check if the clicked button is in the correct order
        if (buttonIndex === this.correctOrder[this.userOrder.length]) {
            // Correct button, reveal the number
            this.userOrder.push(buttonIndex);
            this.buttons[buttonIndex].revealNumber();

            // If all buttons are clicked correctly, game is won
            if (this.userOrder.length === this.correctOrder.length) {
                alert(messages.success); // Correct sequence message
            }
        } else {
            // Incorrect button, game over
            alert(messages.failure); // Incorrect sequence message
            this.ui.revealCorrectOrder(this.buttons, this.correctOrder);
        }
    }
}

// Button Class
class Button {
    constructor(index, ui) {
        this.index = index;
        this.ui = ui;
        this.element = this.createButton();
    }

    createButton() {
        const button = document.createElement('button');
        button.textContent = this.index + 1;
        button.style.backgroundColor = this.ui.getRandomColor();
        button.style.height = '5em';
        button.style.width = '10em';
        return button;
    }

    hideNumber() {
        this.element.textContent = '';
    }

    revealNumber() {
        this.element.textContent = this.index + 1;
    }

    setPosition(left, top) {
        this.element.style.position = 'absolute';
        this.element.style.left = `${left}px`;
        this.element.style.top = `${top}px`;
    }

    getRandomPosition() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const maxX = windowWidth - this.element.offsetWidth;
        const maxY = windowHeight - this.element.offsetHeight;

        const left = Math.floor(Math.random() * maxX);
        const top = Math.floor(Math.random() * maxY);

        return { left, top };
    }
}

// UI Class
class UI {
    constructor() {
        this.container = document.getElementById('buttonContainer');
    }

    clearButtons() {
        this.container.innerHTML = '';
    }

    addButton(buttonElement) {
        this.container.appendChild(buttonElement);
    }

    arrangeButtons(buttons) {
        buttons.forEach(button => {
            button.element.style.position = 'relative';
        });
    }

    scrambleButtons(buttons) {
        buttons.forEach(button => {
            const { left, top } = button.getRandomPosition();
            button.setPosition(left, top);
        });
    }

    makeButtonsClickable(buttons, clickHandler) {
        buttons.forEach((button, index) => {
            button.element.onclick = () => clickHandler(index);
        });
    }

    revealCorrectOrder(buttons, correctOrder) {
        correctOrder.forEach((index, i) => {
            buttons[index].revealNumber();
        });
    }

    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}

// Initialize the Game
const ui = new UI();
const game = new Game(ui);
