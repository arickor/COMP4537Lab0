// Game Class: Manages the overall game logic, including button creation, scrambling, and user interactions.
class Game {
    constructor(ui) {
        this.ui = ui;
        this.buttons = [];
        this.correctOrder = [];
        this.userOrder = [];
        this.numberOfButtons = 0;
        this.setupEventListeners(); // Set up the event listener for starting the game.
    }

    setupEventListeners() {
        document.getElementById('goButton').addEventListener('click', () => this.startGame());
    }

    // Starts the game by creating buttons and initiating scrambling.
    startGame() {
        const input = document.getElementById('buttonNumber').value;
        this.numberOfButtons = parseInt(input);

        if (this.numberOfButtons >= 3 && this.numberOfButtons <= 7) {
            alert(messages.start);
            this.ui.clearButtons();
            this.buttons = this.createButtons(this.numberOfButtons);
            this.correctOrder = this.buttons.map(button => button.index); // Store the correct order of buttons.
            this.userOrder = [];
            this.ui.arrangeButtons(this.buttons); // Arrange buttons in their initial positions.
            
            this.pauseForSeconds(this.numberOfButtons, () => this.startScrambling());
        } else {
            alert(messages.validation);
        }
    }

    // Creates the specified number of buttons and returns an array of Button instances.
    createButtons(n) {
        const buttons = [];
        for (let i = 0; i < n; i++) {
            const button = new Button(i, this.ui);
            buttons.push(button); // Add the button to the array.
            this.ui.addButton(button.element); // Append the button element to the UI.
        }
        return buttons;
    }

    // Pauses for a given number of seconds before executing the callback.
    pauseForSeconds(seconds, callback) {
        setTimeout(callback, seconds * 1000);
    }

    // Scrambles the buttons at intervals and then hides the numbers.
    startScrambling() {
        let scrambleCount = 0;
    
        this.ui.scrambleButtons(this.buttons);
        scrambleCount++;
    
        const scrambleInterval = setInterval(() => {
            if (scrambleCount < this.numberOfButtons) {
                this.ui.scrambleButtons(this.buttons); // Scramble buttons after each interval.
                scrambleCount++;
            } else {
                clearInterval(scrambleInterval); // Stop scrambling after 'n' times.
                this.hideNumbers(); // Hide the numbers on the buttons after scrambling.
            }
        }, this.numberOfButtons * 1000); // Pause between scrambles is 'n' seconds.
    }    

    hideNumbers() {
        this.buttons.forEach(button => button.hideNumber());
        this.ui.makeButtonsClickable(this.buttons, this.handleButtonClick.bind(this));
    }

    // Handles the user's button clicks and checks if they are in the correct order.
    handleButtonClick(buttonIndex) {
        // Check if the clicked button matches the expected button in the correct order.
        if (buttonIndex === this.correctOrder[this.userOrder.length]) {
            // If the correct button is clicked, reveal the number and add it to the user order.
            this.userOrder.push(buttonIndex);
            this.buttons[buttonIndex].revealNumber();

            // If all buttons are clicked in the correct order, display success message.
            if (this.userOrder.length === this.correctOrder.length) {
                alert(messages.success);
            }
        } else {
            // If the wrong button is clicked, display failure message and reveal the correct order.
            alert(messages.failure);
            this.ui.revealCorrectOrder(this.buttons, this.correctOrder); // Reveal the correct button order.
        }
    }
}

// Button Class: Represents a button in the game with properties and methods to manage its state.
class Button {
    constructor(index, ui) {
        this.index = index; // Store the button's index.
        this.ui = ui;
        this.element = this.createButton();
    }

    // Creates a button element with a random background color and dimensions.
    createButton() {
        const button = document.createElement('button');
        button.textContent = this.index + 1; // Set the button's order to its index + 1.
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

    // Sets the button's position within the container.
    setPosition(left, top) {
        this.element.style.position = 'absolute';
        this.element.style.left = `${left}px`;
        this.element.style.top = `${top}px`;
    }

    // Generates a random position for the button within the window boundaries.
    getRandomPosition() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Calculate the maximum position where the button can be placed within the window.
        const maxX = windowWidth - this.element.offsetWidth;
        const maxY = windowHeight - this.element.offsetHeight;

        // Generate random left and top positions within the allowed window area.
        const left = Math.floor(Math.random() * maxX);
        const top = Math.floor(Math.random() * maxY);

        return { left, top };
    }
}

// UI Class: Manages interactions with the DOM, such as adding buttons, scrambling them, and handling user clicks.
class UI {
    constructor() {
        this.container = document.getElementById('buttonContainer'); // Reference to the button container in the DOM.
    }

    // Clears all buttons from the container.
    clearButtons() {
        this.container.innerHTML = '';
    }

    // Adds a button element to the container.
    addButton(buttonElement) {
        this.container.appendChild(buttonElement);
    }

    // Arranges buttons in their initial positions.
    arrangeButtons(buttons) {
        buttons.forEach(button => {
            button.element.style.position = 'relative';
        });
    }

    // Scrambles the buttons by randomly positioning them within the container.
    scrambleButtons(buttons) {
        buttons.forEach(button => {
            const { left, top } = button.getRandomPosition();
            button.setPosition(left, top);
        });
    }

    // Makes buttons clickable by assigning a click handler to each button.
    makeButtonsClickable(buttons, clickHandler) {
        buttons.forEach((button, index) => {
            button.element.onclick = () => clickHandler(index); // Attach the click handler to the button.
        });
    }

    // Reveals the correct order of buttons by displaying their numbers.
    revealCorrectOrder(buttons, correctOrder) {
        correctOrder.forEach((index, i) => {
            buttons[index].revealNumber();
        });
    }

    // Generates a random hex color for the buttons.
    getRandomColor() {
        const letters = '0123456789ABCDEF'; // Hexadecimal characters for colors.
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)]; // Generate a random hex color.
        }
        return color;
    }
}

const ui = new UI();
const game = new Game(ui);
