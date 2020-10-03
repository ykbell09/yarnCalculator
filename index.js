window.onload = () => {

    // --- length calculator ---

    // intantiate message display
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

    // --- yarn comparison table ---

    // global variables
    let yarns = [];
    let pattern;
    const patternNameInput = document.querySelector('#pattern-name');
    const patternYardsInput = document.querySelector('#pattern-yards');
    const table = document.querySelector('#table-comparison');

    const defaultData = {
        name: '',
        yardsPer: '',
        costPer: ''
    };

    const defaultPattern = {
        name: '',
        yards: ''
    };


    // check local storage for data to populate table
    const loadData = () => {
        yarns = JSON.parse(localStorage.getItem('yarns'));
        if (!yarns) {
            yarns = [defaultData];
        }

        pattern = JSON.parse(localStorage.getItem('pattern'));
        if (!pattern) {
            pattern = defaultPattern;
        }
    };

    const displayData = () => {
        console.log(pattern);

        table.innerHTML = `
            <tr>
                <th scope="col">yarn name</th>
                <th scope="col">yards per skein</th>
                <th scope="col">skeins needed</th>
                <th scope="col">cost per skein</th>
                <th scope="col" id="sort-total" class="sort-option">total cost</th>
                <th scope="col" class="td-center"></th>
           </tr>
        `
        loadData();

        patternNameInput.value = pattern.name;
        patternYardsInput.value = pattern.yards;
        
        for (let i = 0; i < yarns.length; i++) {
            const yarn = yarns[i];
            const newRow = table.insertRow();

            // add the name
            const name = newRow.insertCell();
            const nameInput = document.createElement('input');
            nameInput.className = 'input-table';
            nameInput.value = yarn.name;
            name.appendChild(nameInput);
            nameInput.addEventListener('blur', () => {
                yarn.name = nameInput.value;
                saveData();
            });

            // add yards per
            const yardsPer = newRow.insertCell();
            const yardsPerInput = document.createElement('input');
            yardsPerInput.className = 'input-table';
            yardsPerInput.value = yarn.yardsPer;
            yardsPer.appendChild(yardsPerInput);
            yardsPerInput.addEventListener('blur', () => {
                yarn.yardsPer = yardsPerInput.value;
                saveData();
                displayData();
            });

            // calculated cell -- skeins needed
            const skeinsNeeded = pattern.yards / yarn.yardsPer;
            let skeinInput;
            if (skeinsNeeded !== Infinity && skeinsNeeded > 0) {
                skeinInput = Math.ceil(skeinsNeeded);
            } else {
                skeinInput = '';
            }
            newRow.insertCell().innerHTML = `<p class="calculated" id="skeins-needed">${skeinInput}</p>`;

            // add cost per
            const costPer = newRow.insertCell();
            const costPerInput = document.createElement('input');
            costPerInput.className = 'input-table';
            costPerInput.value = yarn.costPer;
            costPer.appendChild(costPerInput);
            costPerInput.addEventListener('blur', () => {
                yarn.costPer = costPerInput.value;
                saveData();
                displayData();
            });

            // calculated cell -- total cost      
            const totalCost = yarn.costPer * skeinsNeeded;
            let totalInput;
            if (totalCost > 0) {
                totalInput = totalCost.toFixed(2);
            } else {
                totalInput = '0.00';
            }         
            newRow.insertCell().innerHTML = `<p class="calculated" id="total-cost">$${totalInput}</p>`;
            yarn.total = totalInput;
            console.log(yarn.total);
            console.log(yarns);
            
            const removeButton = newRow.insertCell();
            removeButton.innerHTML = '<button class="button" id="remove-button">x</button>';
            removeButton.addEventListener('click', () => {
                yarns.splice(i, 1);
                saveData();
                displayData();
            });

            
        }
    };

    const saveData = () => {
        localStorage.setItem('pattern', JSON.stringify(pattern));
        localStorage.setItem('yarns', JSON.stringify(yarns));
    };

    const clearData = () => {
        yarns = [defaultData];
        pattern = defaultPattern;
        saveData();
        displayData();
    };

    const addRow = () => {
        const newYarn = defaultData;
        yarns.push(newYarn);
        saveData();
        displayData();
    };


    // --- initialize page display ---
    displayData();

    // --- event listeners -- 

    // calculate yarn length
    document.querySelector('#button-calculate').addEventListener('click', (e) => {
        e.preventDefault();
        updateDisplay(calculateLength());
    });

    // clear yarn length calculator
    document.querySelector('#button-clear').addEventListener('click', () => {
        if (yarnMessage !== '') { yarnMessage.innerHTML = ''; }
    });

    // update new pattern yardage data and calculations
    patternYardsInput.addEventListener('blur', () => {
        pattern.yards = patternYardsInput.value;
        saveData();
        displayData();
    });

    patternNameInput.addEventListener('blur', () => {
        pattern.name = patternNameInput.value;
        saveData();
    });

    // clear comparison all comparison table data 
    document.querySelector('#button-clear-cost').addEventListener('click', (e) => {
        e.preventDefault();
        clearData();
    });

    // add a blank row
    document.querySelector('#button-add-tr').addEventListener('click', (e) => {
        e.preventDefault();
        addRow();
    });

    // // sort table by total cost
    // document.querySelector('#sort-total').addEventListener('click', () => {

    //     const test = yarns.sort();
    //     console.log(test);




    // });

};