const sortByTotal = () => {

    // sorting helper functions, to be used with array.sort()
    const sortAsc = (a, b) => {
        const yarnA = parseFloat(a.total);
        const yarnB = parseFloat(b.total);
        if (yarnA < yarnB) return -1;
        if (yarnA > yarnB) return 1;
        return 0;
    };

    const sortDesc = (a, b) => {
        return sortAsc(a, b) * -1;
    };

    // check state and sort opposite
    if (totalSortState === undefined || totalSortState === 'descending') {
        yarns.sort(sortAsc);
        totalSortState = 'ascending';
    } else {
        yarns.sort(sortDesc);
        totalSortState = 'descending';
    }

    saveData();
    displayData();
    costSortState = undefined;

};
