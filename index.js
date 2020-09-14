window.onload = () => {

    // initialize message display
    const yarnMessage = document.querySelector('#yarn-length');

    const calculateLength = () => {
        const grams = document.querySelector('#grams').value;
        const yards = document.querySelector('#yards').value;
        const weight = document.querySelector('#weight').value;
        return Math.floor(weight / (grams / yards));
    };

    const updateDisplay = (length) => {

        let message;
        if (length > 0) {
            message = `approximate stash yarn length: ${length} yards`;
        } else {
            message = 'Please enter valid numbers only';
        }

        yarnMessage.innerHTML = message;

    };

    // add event listeners to buttons
    document.querySelector('#button-calculate').addEventListener('click', (e) => {
        e.preventDefault();
        updateDisplay(calculateLength());
    });

    document.querySelector('#button-clear').addEventListener('click', () => {
        if (yarnMessage !== '') { yarnMessage.innerHTML = ''; }
    });

}