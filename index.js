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
    let patternYards;
    const patternYardsInput = document.querySelector('#pattern-yards');
    const table = document.querySelector('#table-comparison');

    const defaultData = {
        name: '',
        yardsPer: '',
        costPer: ''
    };


    // check local storage for data to populate table
    const loadData = () => {
        yarns = JSON.parse(localStorage.getItem('yarns'));
        if (!yarns) {
            yarns = [defaultData];
        }

        patternYards = JSON.parse(localStorage.getItem('patternYards'));
        if (!patternYards) {
            patternYards = '';
        }
    };

    const displayData = () => {
        table.innerHTML = `
            <tr>
                <th>yarn name</th>
                <th>yards per skein</th>
                <th>skeins needed</th>
                <th>cost per skein</th>
                <th>total cost</th>
                <th class="td-center"></th>
           </tr>
        `
        loadData();
        patternYardsInput.value = patternYards;

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
            const skeinsNeeded = patternYards / yarn.yardsPer;
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
        }
    };

    const saveData = () => {
        localStorage.setItem('patternYards', JSON.stringify(patternYards));
        localStorage.setItem('yarns', JSON.stringify(yarns));
    };

    const clearData = () => {
        yarns = [defaultData];
        patternYards = '';
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
        patternYards = patternYardsInput.value;
        saveData();
        displayData();
    });


    // clear comparison all comparison table data 
    document.querySelector('#button-clear-cost').addEventListener('click', (e) => {
        e.preventDefault();
        clearData();
    });

    document.querySelector('#button-add-tr').addEventListener('click', (e) => {
        e.preventDefault();
        addRow();
    });


};