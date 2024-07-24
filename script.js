const availableCharacters = ['A', 'B', 'C', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

function generateCode(length) {
    let code = '';
    for (let i = 0; i < length; i++) {
        code += availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
    }
    return code;
}

const unlockCodeDisplay = document.getElementById('unlockCodeDisplay');

let code;
let codeSpliced;

function showValueToDisplay1(input) {
    if (input.length > 0) {
        unlockCodeDisplay.innerHTML = input[0];
        // console.log(input);
        codeSpliced.shift();
        showValueToDisplay2();
    }
}
function showValueToDisplay2() {
    setTimeout(() => {
        showValueToDisplay1(codeSpliced);
    }, 750);
}

//contract accepting and money

let inventory = {
    cash: 0,
    BYTEcoin: 0,
    CatCoin: 0,
    rep: 0,
    contractsCompleted: 0,
    contractsFailed: 0,
    //survival stuff
    food: 50,
    water: 100,
    //bonuses
    earningBonus: 0,
};

function updateWallet() {
    document.getElementById('cash').innerHTML = inventory.cash;
    document.getElementById('bytecoin').innerHTML = inventory.BYTEcoin;
    document.getElementById('catcoin').innerHTML = inventory.CatCoin;
}


let currentContractInformation = [];

function acceptContract(difficulty, information) {
    // console.log(`acceptContract(${difficulty}, ${information})`);
    currentContractInformation = information.split(':;');

    code = generateCode(Number(difficulty));
    console.log(code);
    codeSpliced = code.split('');
    codeSpliced.push('Enter code below:');
    setTimeout(() => {
        unlockCodeDisplay.innerHTML = 'ready?';
    }, 500);
    setTimeout(() => {
        unlockCodeDisplay.innerHTML = 'set...';
    }, 1000);
    setTimeout(() => {
        unlockCodeDisplay.innerHTML = 'go!';
    }, 1500);
    setTimeout(() => {
        showValueToDisplay1(codeSpliced);
    }, 2000);
}

let CodeInput = [];

function keypad(input) {
    if (input != 'E' && input != 'D') {
        CodeInput.push(input);
        document.getElementById('inputCodeDisplay').value = CodeInput.join(' ');
    }
    if (input == 'D') {
        CodeInput.pop();
        document.getElementById('inputCodeDisplay').value = CodeInput.join(' ');
    }
    if (input == "E") {
        if (CodeInput.join('') == code) {
            inventory.cash += Number(currentContractInformation[0]) * inventory.earningBonus;
            dayEarnings += Number(currentContractInformation[0]);
            inventory.rep += Number(currentContractInformation[1]) * inventory.earningBonus;
            inventory.contractsCompleted++;
        }
        else {
            inventory.contractsFailed++;
            inventory.cash -= Number(currentContractInformation[0] / 2);
            inventory.rep -= Number(currentContractInformation[1]);
        }
        updateWallet();
        document.getElementById(currentContractInformation[2]).remove();
        CodeInput = [];
        document.getElementById('inputCodeDisplay').value = "-";
        unlockCodeDisplay.innerHTML = "-";
    }
}

let numberOfContractsEver = 0;
function generateNewContract() {
    // Create a clone of element with id ddl_1:
    let clone = document.querySelector('#contract0').cloneNode(true);
    numberOfContractsEver++;

    // Change the id attribute of the newly created element:
    clone.setAttribute('id', 'contract' + numberOfContractsEver);
    clone.setAttribute('style', 'display: block;');
    clone.querySelector('h3').textContent = 'Contract ' + (numberOfContractsEver);

    let head = '#contract' + String(numberOfContractsEver);

    // console.log(head);

    clone.querySelector('#contract0difficulty').innerHTML = Math.floor(Math.random() * 10) + 1;

    clone.querySelector('#contract0cash').innerHTML = clone.querySelector('#contract0difficulty').innerHTML * 100;

    clone.querySelector('#contract0rep').innerHTML = clone.querySelector('#contract0difficulty').innerHTML * 10;

    //* Separator is :;
    clone.querySelector('#acceptContract').setAttribute('onclick', `acceptContract('${Number(clone.querySelector('#contract0difficulty').innerHTML) + 1}', '${String(clone.querySelector('#contract0cash').innerHTML)}:;${String(clone.querySelector('#contract0rep').innerHTML)}:;${'contract' + (numberOfContractsEver)}')`);

    clone.querySelector('#contract0difficulty').setAttribute('id', head + 'difficulty');
    // console.log(head + 'difficulty');
    clone.querySelector('#contract0cash').setAttribute('id', head + 'cash');
    // console.log(head + 'cash');
    clone.querySelector('#contract0rep').setAttribute('id', head + 'rep');
    // console.log(head + 'rep');

    // Append the newly created element on element p
    document.querySelector('#contractsDisplay').appendChild(clone);
}

//Tick count
let tickInterval = 1000;
let tickTrue = true;

let contractSpawnRate = 20;

let time = {
    day: 1,
    hour: 12,
};

function tick() {
    //! Degrading system doesn't really work. Will need to rework this.
    // let contracts = document.querySelectorAll('.contract');
    // contracts.forEach(contract => {
    //     console.log(contract);
    //     console.log(contract.querySelector('.box'));
    //     console.log(contracts.findIndex(contract + 1));
    //     if (Math.floor(Math.random() * 10) == 1) {
    //         let cash = contract.querySelector('.box').querySelector(`#contract${contracts.findIndex(contract+1)}cash`).textContent;
    //         let rep = contract.querySelector('.box').querySelector(`#contract1rep`).textContent;

    //         let newCash = parseInt(cash) - 10;
    //         let newRep = parseInt(rep) - 1;

    //         contract.querySelector('.box').querySelector(`#contract1cash`).textContent = newCash;
    //         contract.querySelector('.box').querySelector(`#contract1rep`).textContent = newRep;

    //         if (newCash <= 0) {
    //             contract.remove();
    //         }
    //     }
    // });
    if (Math.floor(Math.random() * 100) < contractSpawnRate) {
        generateNewContract();
    }
    //day counter
    time.hour += 0.5;
    if (time.hour == 24) {
        time.hour = 0;
        time.day++;
        taxPayment();
    }

    if (time.hour % 1 != 0) {
        document.getElementById('timeM').innerHTML = 3;
    }
    else {
        document.getElementById('timeM').innerHTML = 0;
    }
    document.getElementById('day').innerHTML = time.day;
    document.getElementById('timeH').innerHTML = Math.floor(time.hour);

    //survival stuff
    inventory.food -= 1;
    inventory.water -= 2;
    if (inventory.food <= 0 || inventory.water <= 0) {
        inventory.food = 0;
        inventory.water = 0;
        // alert('You have died');
    }
    document.getElementById('food').innerHTML = inventory.food;
    document.getElementById('water').innerHTML = inventory.water;

    //calls
    if (time.day === 1 && time.hour === 13) {
        alertBanner('hint', 'Press ESC to pause, where there is a startup guide! Pause is also in the Misc column.');
    }

    //assistant
    if (assistantToggle) {
        assistant();
    }
}

setInterval(() => {
    if (tickTrue) {
        tick();
        // console.log('Tick');
    }
}, tickInterval);

//Assistant
let assistantToggle = false;

function toggleAssistant() {
    console.log('Toggled assistant');
    if (upgrades.basicUpgrades.assistant.level > 0) {
        if (assistantToggle) {
            assistantToggle = false;
        }
        else {
            assistantToggle = true;
        }
    }
}

function assistant() {
    if (upgrades.basicUpgrades.assistant.level >= 1 && document.getElementById('assistantFoodInput').value == '' && document.getElementById('assistantWaterInput').value == '') {
        if (inventory.cash >= 50) {
            inventory.cash -= 50;
            inventory.food += 50;
        }
        if (inventory.cash >= 25) {
            inventory.cash -= 25;
            inventory.water += 50;
        }
    }
    else if (upgrades.basicUpgrades.assistant.level === 2 && document.getElementById('assistantFoodInput').value != '' && document.getElementById('assistantWaterInput').value != ''){
        if (inventory.cash >= 50 && inventory.food < document.getElementById('assistantFoodInput').value) {
            inventory.cash -= 50;
            inventory.food += 50;
        }
        if (inventory.cash >= 25 && inventory.water < document.getElementById('assistantWaterInput').value) {
            inventory.cash -= 25;
            inventory.water += 50;
        }
    }
    updateWallet();
}

//taxes
let taxPercent = 0.35;
let dayEarnings = 0;
function taxPayment() {
    dayEarnings = 0;
    inventory.cash -= Math.floor(inventory.cash * taxPercent);
    updateWallet();
}

//* On Start
document.getElementById('day').innerHTML = time.day;
document.getElementById('timeH').innerHTML = Math.floor(time.hour);

setTimeout(() => {
    document.getElementById('menuModal').style.display = 'block';
    tickTrue = false;
}, 100);

//focussing of tab
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        tickTrue = false;
        document.getElementById('pauseModal').style.display = 'block';
    }
});

//character/menu
let characterMenu = false;
let selectedCharacter = '';
let possibleFirstNames = ['Gavin', 'Tim', 'Edward', 'Jack', 'Nathan', 'Andrew', 'Leo', 'Sam'];
function initiateCharacterSelect() {
    if (characterMenu === false) {
        possibleFirstNames = possibleFirstNames.sort(() => Math.random() - 0.5);
        characterMenu = true;
        document.getElementById('charSelectModal').style.display = 'block';

        // console.log(possibleFirstNames);
        Array.from(document.getElementsByClassName('character1')).forEach(element => {
            element.innerHTML = possibleFirstNames[0];
        });
        Array.from(document.getElementsByClassName('character2')).forEach(element => {
            element.innerHTML = possibleFirstNames[1];
        });
        Array.from(document.getElementsByClassName('character3')).forEach(element => {
            element.innerHTML = possibleFirstNames[2];
        });
    }
}

function selectCharacter(character) {
    selectedCharacter = possibleFirstNames[character - 1];
    switch (character) {
        case 1:
            inventory.cash = 75;
            inventory.rep = 25;
            inventory.earningBonus = 0.7;
            break;
        case 2:
            inventory.earningBonus = 1.1;
            break;
        case 3:
            inventory.rep = -100;
            inventory.earningBonus = 1.7;
            break;
        default:
            console.error('Error executing character select. script.js: L272.');
            break;
    }

    document.getElementById('charSelectModal').style.display = 'none';
    document.getElementById('menuModal').style.display = 'none';
    document.getElementById('pauseModal').style.display = 'none';
    tickTrue = true;
}
//pause modal stuff

function pauseToggle() {
    if (characterMenu === true) {
        tickTrue = !tickTrue;
        if (tickTrue) {
            document.getElementById('pauseModal').style.display = 'none';
            document.getElementById('charSelectModal').style.display = 'none';
            document.getElementById('menuModal').style.display = 'none';
        } else {
            document.getElementById('pauseModal').style.display = 'block';
        }
    }
}

//escape to toggle pause
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        pauseToggle();
    }
});

function commandLineEnter() {
    let command = (String(document.getElementById('commandInput').value).toUpperCase()).split("'");
    let clone = document.querySelector('#output1').cloneNode(true);
    clone.setAttribute('id', 'output' + document.getElementsByClassName('output').length);
    clone.textContent = document.getElementById('commandInput').value.toUpperCase();
    document.getElementById('commandOutput').appendChild(clone);

    document.getElementById('commandInput').value = '';

    for (let i = 0; i < command.length; i++) {
        if (command[i] === ' ' || command[i] === '' || command[i] === null) {
            command.splice(i, 1);
            i--;
        }
    }
    switch (command[0]) {
        case "HELP":
            if (command.length === 1) {
                outputCommandLine(`Available commands: Help, Inventory, Stats, Shop. Command "help''" usage: help 'params [command for more information]' Inside each help menu you will get the information on how to use the command (what goes in the param).`);
                outputCommandLine(`Help: Get a list of commands and/or learn the usage of a command.'`);
                outputCommandLine(`Inventory: View your current inventory.'`);
                outputCommandLine(`Stats: View your current stats.'`);
                outputCommandLine(`Shop: Buy items and look at what is for sale.'`);
                outputCommandLine(`Upgrades: Buy upgrades to make your life easier. REQUIRES UPGRADE ACCESS; PURCHASE IN SHOP MENU.`);
            }
            else {
                switch (command[1]) {
                    case 'SHOP':
                        outputCommandLine(`Shop'' command can be used to buy items. Usage: Shop'' to look at the list. Shop 'Param[item]' to buy that item. Capitalization and spelling counts.`);
                        break;
                    default:
                        outputCommandLine(`Invalid parameter`);
                        break;
                }
            }
            break;
        case "SHOP":
            if (command.length === 1) {
                outputCommandLine(`Available items:`);
                outputCommandLine(`FOOD: $100 for 50 units of food`);
                outputCommandLine(`WATER: $50 for 50 units of water`);
                outputCommandLine(`BOTH: $100 for 25 units of food and 50 units of water`);
                outputCommandLine(`UPGRADE ACCESS: $200 for permanent access to the Upgrades'' command.`);
                outputCommandLine(`Usage: Shop 'Param[item]'`);
            }
            else {
                switch (command[1]) {
                    case 'FOOD':
                        if (inventory.cash >= 100) {
                            inventory.cash -= 100;
                            inventory.food += 50;
                            outputCommandLine(`Bought 50 units of food for $100.`);
                        }
                        else {
                            outputCommandLine(`Not enough cash.`);
                        }
                        break;
                    case 'WATER':
                        if (inventory.cash >= 50) {
                            inventory.cash -= 50;
                            inventory.water += 50;
                            outputCommandLine(`Bought 50 units of water for $50.`);
                        }
                        else {
                            outputCommandLine(`Not enough cash.`);
                        }
                        break;
                    case 'BOTH':
                        if (inventory.cash >= 100) {
                            inventory.cash -= 100;
                            inventory.food += 25;
                            inventory.water += 50;
                            outputCommandLine(`Bought 25 units of food and 50 units of water for $100.`);
                        }
                        else {
                            outputCommandLine(`Not enough cash.`);
                        }
                        break;
                    case 'UPGRADE ACCESS':
                        if (inventory.cash >= 200 && !upgrades.upgradeMenuUnlocked) {
                            inventory.cash -= 200;
                            upgrades.upgradeMenuUnlocked = true;
                            outputCommandLine(`Bought upgrade access for $200.`);
                        }
                        else {
                            outputCommandLine(`Not enough cash or you already have upgrade access.`);
                        }
                        break;
                    default:
                        break;
                }
                updateWallet();
            }
            break;
        case "UPGRADES":
            if (upgrades.upgradeMenuUnlocked) {
                openUpgrades();
            }
            else{
                outputCommandLine('Upgrades are not available yet. Purchase access in the shop menu.');
            }
            break;
        default:
            outputCommandLine(`Invalid command. See help'' for a list.`);
            break;
    }
    document.getElementById('commandOutput').appendChild(clone);
}

function outputCommandLine(message) {
    let clone = document.querySelector('#output1').cloneNode(true);
    clone.setAttribute('id', 'output' + document.getElementsByClassName('output').length);
    clone.textContent = message;
    document.getElementById('commandOutput').appendChild(clone);
    // document.getElementById('commandOutput').scrollIntoView();
    document.getElementById('commandOutput').lastChild.scrollIntoView();
}

//call tab stuff

function openTab() {
    document.getElementById("callTab").style.width = "250px";
}

function closeTab() {
    document.getElementById("callTab").style.width = "0";
}

//shrink tab
document.querySelector('#callTab').addEventListener('click', function () {
    if (document.getElementById("callTab").style.width == "20px") {
        document.getElementById("callTab").style.width = "250px";
    }
    else {
        document.getElementById("callTab").style.width = "20px";
    }
});

let scripts = {

};

let currentCall;
let currentCallTitle;
let contractCompleted1st = false;

function call(callOrReceive, name, about) {
    console.log("calling...");
    // if calling, it will be true
    if (callOrReceive) {
        document.getElementById('callOrReceive').textContent = 'Calling';
    }
    else {
        document.getElementById('callOrReceive').textContent = 'Receiving';
    }
    document.getElementById('caller').textContent = name;

    currentCallTitle = currentCall[0];
    const callOutput = document.getElementById('callOutput');
    while (callOutput.children.length > 1) {
        callOutput.removeChild(callOutput.children[1]);
    }
}

function callPush1() {
    callOutput(currentCall[0]);
    currentCall.shift();
    if (currentCall.length > 0) {
        setTimeout(() => {
            callPush2();
        }, 700);
    }
    else {
        console.log("call over");
        switch (currentCallTitle) {

        }
    }
}
function callPush2() {
    setTimeout(() => {
        callPush1();
    }, 500);
}

function callOutput(message) {
    let clone = document.querySelector('#callOutput0').cloneNode(true);
    clone.setAttribute('id', 'output' + document.getElementsByClassName('output').length);
    clone.textContent = message;
    document.getElementById('callOutput').appendChild(clone);
}

function alertBanner(dangerLvl, message) {
    document.getElementById('mainAlert').style.display = 'block';
    document.getElementById('alertMessage').textContent = message;
    switch (dangerLvl) {
        case 'hint':
            document.getElementById('mainAlert').style.backgroundColor = 'rgb(255, 255, 0)';
            document.getElementById('alertLevel').textContent = 'Hint!';
            document.getElementById('mainAlert').style.color = 'black';
            break;
        case 'warning':
            document.getElementById('mainAlert').style.backgroundColor = 'rgb(255, 165, 0)';
            document.getElementById('alertLevel').textContent = 'Alert!';
            document.getElementById('mainAlert').style.color = 'black';
            break;
        case 'danger':
            document.getElementById('mainAlert').style.backgroundColor = 'rgb(255, 0, 0)';
            document.getElementById('alertLevel').textContent = 'Danger!';
            document.getElementById('mainAlert').style.color = 'white';
            break;

        default:
            break;
    }
}
//upgrades
let upgrades = {
    upgradeMenuUnlocked: false,
    basicUpgrades: {
        assistant: {
            level: 0,
            cost: 250,
            maxLevel: 2,
            costIncrease: 1.25,
            title: 'Assistant',
            description: 'Hire an assistant to help micromanage. MK1 allows you to automagically order food and water while you have money. MK2 allows you to control how much food and water you want at any given time, and assistant will automagically fill to that bar only.',
        },
        factionAccess: {
            level: 0,
            cost: 500,
            maxLevel: 1,
            costIncrease: 1.5,
            title: 'Faction Access',
            description: 'Gain access to factions. This is how you access more powerful upgrades and continue the story.',
        },
    }
};


function openUpgrades(){
    document.getElementById('upgradeModal').style.display = 'block';
    const basicUpgrades = document.getElementById('basicUpgrades');
    while (basicUpgrades.children.length > 1) {
        basicUpgrades.removeChild(basicUpgrades.children[1]);
    }
    for (const upgrade in upgrades.basicUpgrades) {
        if (upgrades.basicUpgrades[upgrade].level >= upgrades.basicUpgrades[upgrade].maxLevel) {

        }
        else{
            let clone = document.querySelector('#upgrade0').cloneNode(true);
            clone.setAttribute('id', 'upgrade' + upgrades.basicUpgrades[upgrade].title);
            clone.style.display = 'block';
            clone.querySelector('#upgradeTitle').textContent = upgrades.basicUpgrades[upgrade].title;
            clone.querySelector('#upgradeDescription').textContent = upgrades.basicUpgrades[upgrade].description;
            clone.querySelector('#upgradeLevel').textContent = upgrades.basicUpgrades[upgrade].level;
            clone.querySelector('#upgradeCost').textContent = '$' + upgrades.basicUpgrades[upgrade].cost;
            clone.querySelector('#upgradeButton').setAttribute('onclick', `buyUpgrade('${upgrades.basicUpgrades[upgrade].title}')`);
            document.getElementById('basicUpgrades').appendChild(clone);
        }
    }
}

function closeUpgrades(){
    document.getElementById('upgradeModal').style.display = 'none';
}

document.getElementById('upgradeCloseButton').addEventListener('click', function(){
    closeUpgrades();
}
);

//upgrades
function buyUpgrade(item) {
    switch (item) {
        case 'Assistant':
            if (inventory.cash >= upgrades.basicUpgrades.assistant.cost && upgrades.basicUpgrades.assistant.level < upgrades.basicUpgrades.assistant.maxLevel) {
                inventory.cash -= upgrades.basicUpgrades.assistant.cost;
                upgrades.basicUpgrades.assistant.level++;
                upgrades.basicUpgrades.assistant.cost = Math.floor(upgrades.basicUpgrades.assistant.cost * upgrades.basicUpgrades.assistant.costIncrease);
                updateWallet();
                if(upgrades.basicUpgrades.assistant.level === 1){
                    document.getElementById('assistantMK1Ad').style.display = 'none';
                    document.getElementById('assistantToggleButton').disabled = false;
                }
                else if(upgrades.basicUpgrades.assistant.level === 2){
                    document.getElementById('assistantMK2Ad').style.display = 'none';
                    document.getElementById('upgrade' + upgrades.basicUpgrades.assistant.title).remove();
                    document.getElementById('assistantFoodInput').disabled = false;
                    document.getElementById('assistantWaterInput').disabled = false;
                }

            }
            else {
                outputCommandLine('Not enough cash or you have reached the max level.');
            }
            break;
        case 'Faction Access':
            console.log('Faction Access');
            if (inventory.cash >= upgrades.basicUpgrades.factionAccess.cost && upgrades.basicUpgrades.factionAccess.level < upgrades.basicUpgrades.factionAccess.maxLevel) {
                inventory.cash -= upgrades.basicUpgrades.factionAccess.cost;
                upgrades.basicUpgrades.factionAccess.level++;
                upgrades.basicUpgrades.factionAccess.cost = Math.floor(upgrades.basicUpgrades.factionAccess.cost * upgrades.basicUpgrades.factionAccess.costIncrease);
                updateWallet();
                document.getElementById('factionAccessAd').style.display = 'none';
            }
            else {
                outputCommandLine('Not enough cash or you have reached the max level.');
            }
            break;
        default:
            break;
    }
    closeUpgrades();
}

