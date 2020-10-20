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

        const sortArrow = '<img src="icon_arrow.png" class="sort-arrow" />';

        table.innerHTML = `
            <tr>
                <th scope="col" class="name">yarn name</th>
                <th scope="col" id="sort-yards" class="sort-option num">yards per skein ${sortArrow}</th>
                <th scope="col" id="sort-skeins" class="sort-option num">skeins needed ${sortArrow}</th>
                <th scope="col" id="sort-cost" class="sort-option num">cost per skein ${sortArrow}</th>
                <th scope="col" id="sort-total" class="sort-option num">total cost ${sortArrow}</th>
                <th scope="col" class="td-center"></th>
           </tr>
        `

        // add sorting event listeners
        document.querySelector('#sort-total').addEventListener('click', () => {
            sortColumn('#sort-total','total');
        });
        document.querySelector('#sort-cost').addEventListener('click', () => {
            sortColumn('#sort-cost','costPer');
        });
        document.querySelector('#sort-skeins').addEventListener('click', () => {
            sortColumn('#sort-skeins','skeins');
        });
        document.querySelector('#sort-yards').addEventListener('click', () => {
            sortColumn('#sort-yards','yardsPer');
        });

        loadData();

        patternNameInput.value = pattern.name;
        patternYardsInput.value = pattern.yards;

        for (let i = 0; i < yarns.length; i++) {
            const yarn = yarns[i];
            const newRow = table.insertRow();

            // add the name
            const name = newRow.insertCell();
            const nameInput = document.createElement('input');
            nameInput.className = 'input-table name';
            nameInput.value = yarn.name;
            name.appendChild(nameInput);
            nameInput.addEventListener('blur', () => {
                yarn.name = nameInput.value;
                saveData();
            });

            // add yards per
            const yardsPer = newRow.insertCell();
            const yardsPerInput = document.createElement('input');
            yardsPerInput.className = 'input-table num';
            yardsPerInput.value = yarn.yardsPer;
            yardsPer.appendChild(yardsPerInput);
            yardsPerInput.addEventListener('blur', () => {
                yarn.yardsPer = yardsPerInput.value;
                saveData();
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
            yarn.skeins = skeinInput;

            // add cost per
            const costPer = newRow.insertCell();
            const costPerInput = document.createElement('input');
            costPerInput.className = 'input-table num';
            costPerInput.value = yarn.costPer;
            costPer.appendChild(costPerInput);
            costPerInput.addEventListener('blur', () => {
                yarn.costPer = costPerInput.value;
                saveData();
            });

            // calculated cell -- total cost      
            const totalCost = yarn.costPer * skeinInput;
            let totalInput;
            if (totalCost > 0) {
                totalInput = totalCost.toFixed(2);
            } else {
                totalInput = '0.00';
            }
            newRow.insertCell().innerHTML = `<p class="calculated" id="total-cost">$${totalInput}</p>`;
            yarn.total = totalInput;

            const removeButton = newRow.insertCell();
            removeButton.innerHTML = '<button class="button" id="remove-button">x</button>';
            removeButton.addEventListener('click', () => {
                yarns.splice(i, 1);
                saveData();
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

        // (this seems a little convoluted, but it works for now ...)
        table.lastElementChild.firstElementChild.firstElementChild.focus();
    };

    // --- sorting functions ---

    // sorting variables
    let columnStates = {};

    // sorting helper functions
    const sortAsc = (prop) => {
        yarns.sort(function (a, b) {
            const yarnA = parseFloat(a[prop]);
            const yarnB = parseFloat(b[prop]);
            if (yarnA < yarnB) return -1;
            if (yarnA > yarnB) return 1;
            return 0;
        });
    };

    const rotateArrow = (id, prop) => {
        const arrow = document.querySelector([id]).lastChild;
        if (columnStates[prop] === 'ascending') {
            arrow.className = "sort-arrow-asc";
        } else if (columnStates[prop] === 'descending') {
            arrow.className = "sort-arrow-desc";
        }
    };

    const sortColumn = (id, prop) => {
        
        // check state and sort opposite
        if (columnStates[prop] === undefined || columnStates[prop] === 'descending') {
            sortAsc(prop);
            columnStates[prop] = 'ascending';
        } else {
            sortAsc(prop);
            yarns.reverse();
            columnStates[prop] = 'descending';
        }

        saveData();
        displayData();

        for (let key in columnStates) {
            if (key != prop) {
                columnStates[key] = undefined;
            }
        }

        rotateArrow(id, prop);
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

    // calculate input data
    document.querySelector('#button-compare').addEventListener('click', (e) => {
        e.preventDefault();
        displayData();
    });

    // clear all comparison table data 
    document.querySelector('#button-clear-cost').addEventListener('click', (e) => {
        e.preventDefault();
        clearData();
    });

    // add a blank row
    document.querySelector('#button-add-tr').addEventListener('click', (e) => {
        e.preventDefault();
        addRow();
    });

};