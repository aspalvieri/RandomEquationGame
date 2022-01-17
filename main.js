//Author: Alex Spalvieri
//ID: 200403578

let max = 100;
let min = 1;

let button = document.querySelector("button#submit");
let clearSave = document.querySelector("button#delete-data");
let skip = document.querySelector("button#skip");
let input = document.querySelector("input#input");
let equation = document.querySelector("#equation");
let score = document.querySelector("#score");
let history = document.querySelector("#history");
let template = document.querySelector("#template-entry");
let inctemplate = document.querySelector("#template-score");
let incdiv = document.querySelector("#score-list");
let minval = document.querySelector("#min");
let maxval = document.querySelector("#max");

let saveSlots = [];
for (let i = 1; i < 4; i++) {
    saveSlots.push(document.querySelector("#saveSlot"+i));
}

let addbox = document.querySelector("#addition");
let subbox = document.querySelector("#subtraction");
let multbox = document.querySelector("#multiplication");
let divbox = document.querySelector("#division");

const storage = window.localStorage;
let saveArray = [{},{},{}];
let saveSlot = 0;

function Game() {
    this.score = 0;
    this.history = [];
    this.runOnce = false;
    this.verifySlots();
    this.loadGameSlot();
    this.load(saveSlot);
    this.reset();
}

Game.prototype.add = function() {
    return this.value1 + this.value2;
}

Game.prototype.subtract = function() {
    return this.value1 - this.value2;
}

Game.prototype.multiply = function() {
    return this.value1 * this.value2;
}

Game.prototype.divide = function() {
    return (this.value1 / this.value2).toFixed(2);
}

Game.prototype.evaluate = function(number) {
    let sum = (typeof this.type == "function") ? this.type() : this.type;
    if (sum == number) {
        this.win(sum, number);
    }
    else {
        this.lose(sum, number);
    }
}

Game.prototype.buildSlots = function() {
    this.types = [];
    this.symbols = [];
    if (addbox.checked) {
        this.types.push(this.add);
        this.symbols.push("+");
    }
    if (subbox.checked) {
        this.types.push(this.subtract);
        this.symbols.push("-");
    }
    if (multbox.checked) {
        this.types.push(this.multiply);
        this.symbols.push("*");
    }
    if (divbox.checked) {
        this.types.push(this.divide);
        this.symbols.push("/");
    }
}

Game.prototype.getSlot = function() {
    this.buildSlots();
    return Math.floor(Math.random() * this.types.length);
}

Game.prototype.reset = function() {
    if (this.runOnce == false) {
        let slot = this.getSlot();
        this.type = this.types[slot];
        this.symbol = this.symbols[slot];
        this.value1 = Math.floor(Math.random() * (max - min + 1) + min);
        this.value2 = Math.floor(Math.random() * (max - min + 1) + min);
    }
    else {
        this.runOnce = false;
    }
    equation.textContent = `${this.value1} ${this.symbol} ${this.value2}`;
    input.value = "";
    score.textContent = this.score;
    this.buildHistory();
    this.save();
}

Game.prototype.win = function(sum, number) {
    this.score++;
    let entry = [this.value1, this.symbol, this.value2, number, sum, true];
    let temp = inctemplate.content.cloneNode(true);
    let tempScore = temp.querySelector(".score-symbol");
    tempScore.textContent = String.fromCharCode(160)+"+1";
    tempScore.style.color = "Green";
    incdiv.appendChild(tempScore);
    setTimeout(function() {
        tempScore.style.opacity = 0;
        tempScore.style.width = "200px";
    }, 500);
    setTimeout(function() {
        tempScore.remove();
    }, 1500)
    this.history.push(entry);
    this.reset();
}

Game.prototype.lose = function(sum, number) {
    this.score--;
    let entry = [this.value1, this.symbol, this.value2, number, sum, false];
    let temp = inctemplate.content.cloneNode(true);
    let tempScore = temp.querySelector(".score-symbol");
    tempScore.textContent = String.fromCharCode(160)+"-1";
    tempScore.style.color = "Red";
    incdiv.appendChild(tempScore);
    setTimeout(function() {
        tempScore.style.opacity = 0;
        tempScore.style.width = "200px";
    }, 500);
    setTimeout(function() {
        tempScore.remove();
    }, 1500)
    this.history.push(entry);
    this.reset();
}

Game.prototype.buildHistory = function() {
    history.innerHTML = "";
    for (let e of this.history)
    {
        let color = (e[5] == true) ? "green" : "red";
        let temp = template.content.cloneNode(true);
        temp.querySelector("tr").classList.add(color);
        temp.querySelector(".template-equation").textContent = `${e[0]} ${e[1]} ${e[2]}`;
        temp.querySelector(".template-input").textContent = `${e[3]}`;
        temp.querySelector(".template-answer").textContent = `${e[4]}`;
        history.appendChild(temp);
    }
}

Game.prototype.save = function() {
    let saveData = saveArray[saveSlot];
    saveData.history = JSON.stringify(this.history);
    saveData.score = this.score;
    saveData.min = min;
    saveData.max = max;
    saveData.addbox = addbox.checked;
    saveData.subbox = subbox.checked;
    saveData.multbox = multbox.checked;
    saveData.divbox = divbox.checked;
    saveData.value1 = this.value1;
    saveData.value2 = this.value2;
    saveData.symbol = this.symbol;
    saveData.type = (typeof this.type == "function") ? this.type() : this.type;
    let holder = JSON.stringify(saveData);
    storage.setItem("saveData"+saveSlot, holder);
}

Game.prototype.load = function(loadSlot) {
    let holder = storage.getItem("saveData"+loadSlot);
    if (holder != null) {
        let saveData = JSON.parse(holder);
        this.history = JSON.parse(saveData.history);
        this.score = saveData.score;
        min = parseInt(saveData.min);
        max = parseInt(saveData.max);
        minval.value = min;
        maxval.value = max;
        addbox.checked = saveData.addbox;
        subbox.checked = saveData.subbox;
        multbox.checked = saveData.multbox;
        divbox.checked = saveData.divbox;
        this.value1 = saveData.value1;
        this.value2 = saveData.value2;
        this.symbol = saveData.symbol;
        this.type = saveData.type;
        this.runOnce = true;
    }
}

Game.prototype.saveGameSlot = function() {
    storage.setItem("saveSlot", saveSlot);
}

Game.prototype.loadGameSlot = function() {
    saveSlot = parseInt(storage.getItem("saveSlot"));
}

Game.prototype.deleteSave = function() {
    storage.removeItem("saveData"+saveSlot);
    location.reload();
}

Game.prototype.verifySlots = function() {
    if (storage.getItem("saveSlot") == null) {
        saveSlot = 0;
        this.saveGameSlot();
    }
    for (let i = 0; i < 3; i++) {
        saveSlot = i;
        if (storage.getItem("saveData"+saveSlot) == null) {
            this.reset();
        }
    }
}

let game = new Game();

//If submit button is pressed, or user sent submit event from input element
button.addEventListener("click", function() {
    let val = parseFloat(input.value);
    if (!isNaN(val)) {
        game.evaluate(val);
    }
});
input.addEventListener("keyup", function(e) {
    if (e.key === "Enter") {
        let val = parseFloat(input.value);
        if (!isNaN(val)) {
            game.evaluate(val);
        }
    }
});

skip.addEventListener("click", function() {
    game.reset();
});

clearSave.addEventListener("click", function() {
    if (confirm("Are you sure you wish to delete all the saved data? This will only delete the save data for the selected slot.")) {
        game.deleteSave();
    }
});

//Check minimum value, cap it at 1-999, and ensure it's lower than max
minval.addEventListener("change", function() {
    let val = parseInt(minval.value);
    if (val < 1 || isNaN(val)) {
        val = 1;
        minval.value = val;
    }
    if (val > 999) {
        val = 999;
        minval.value = val;
    }
    if (val > max) {
        val = max;
        minval.value = val;
    }
    min = val;
    game.save();
});

//Check maximum value, cap it at 1-999, and ensure it's higher than min
maxval.addEventListener("change", function() {
    let val = parseInt(maxval.value);
    if (val < 1) {
        val = 1;
        maxval.value = val;
    }
    if (val > 999 || isNaN(val)) {
        val = 999;
        maxval.value = val;
    }
    if (val < min) {
        val = min;
        maxval.value = val;
    }
    max = val;
    game.save();
});

for (let i = 0; i < 3; i++) {
    if (i == saveSlot) {
        saveSlots[i].classList.add("selected");
    }
    saveSlots[i].addEventListener("click", function() {
        if (saveSlot != i) {
            saveSlots[saveSlot].classList.remove("selected");
            saveSlot = i;
            saveSlots[saveSlot].classList.add("selected");
            game.saveGameSlot();
            game.load(saveSlot);
            game.reset();
        }
    });
}

//Prevent all boxes from being disabled, but make it a separate check for each box, allowing each of them to be their own active state
addbox.addEventListener("change", function() {
    if (!addbox.checked && !subbox.checked && !multbox.checked && !divbox.checked) {
        addbox.checked = true;
    }
    game.save();
});
subbox.addEventListener("change", function() {
    if (!addbox.checked && !subbox.checked && !multbox.checked && !divbox.checked) {
        subbox.checked = true;
    }
    game.save();
});
multbox.addEventListener("change", function() {
    if (!addbox.checked && !subbox.checked && !multbox.checked && !divbox.checked) {
        multbox.checked = true;
    }
    game.save();
});
divbox.addEventListener("change", function() {
    if (!addbox.checked && !subbox.checked && !multbox.checked && !divbox.checked) {
        divbox.checked = true;
    }
    game.save();
});
