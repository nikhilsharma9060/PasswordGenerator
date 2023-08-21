const inputSlider = document.querySelector("[dataLengthSlider]");
const lengthDisplay = document.querySelector("[dataLength]");
const passwordDisplay = document.querySelector("[dataPasswordDisplay]");
const copyBtn = document.querySelector("[dataCopy]");
const copyMsg = document.querySelector("[dataCopiedMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[dataStrengthIndicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBoxes = document.querySelector("input[type=checkbox]");
const symbols = '!@#$%^&*()_+=-/><,.?{}[]|\:;';

let password = "";
let passwordLength = 10;
let checkCount = 1;
uppercaseCheck.checked = true;
handleSlider();
//set default color to gray
setIndicator('#ccc');

//set password length according to slider
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize =
      ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

// set the strength of password
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// get random integer
function getRandInt(min, max){
    return Math.floor(Math.random() * (max-min)) + min;
}

//generate random number
function generateRandomNumber(){
    return getRandInt(0,9);
}

//generate random lowercase
function generateLowerCase(){
    return String.fromCharCode(getRandInt(97,123));
}

//generate random uppercase
function generateUpperCase(){
    return String.fromCharCode(getRandInt(65,91));
}

//generate random symbol
function generateSymbol(){
    const r = getRandInt(0, symbols.length);
    return symbols.charAt(r);
}

//calculate Strength
function calStrength(){
    let hasUppper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUppper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasLower && hasUppper && hasSym && hasNum && passwordLength>=16){
        setIndicator('#00ff00');
    }
    else if(hasLower && hasUppper && (hasSym || hasNum) && passwordLength>=10){
        setIndicator('#0000ff');
    }
    else if((hasLower || hasUppper) && (hasNum || hasSym) && passwordLength >=6){
        setIndicator('#ffff00');
    }
    else{
        setIndicator('#ff0000');
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
        if(passwordDisplay.value==""){
            throw(e);
        }
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    // to make copy span visible 
    copyMsg.classList.add("active");
    setTimeout ( () => {
        copyMsg.classList.remove("active");
    },3000);
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBoxes.forEach( (checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    })
    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

Array.from(allCheckBoxes).forEach((checkbox)=> {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordLength>0){
        copyContent();
    }
})

//shuffling function
function shufflePassword(array){
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

generateBtn.addEventListener('click', () => {
    // none checkbox selected
    if(checkCount==0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    // first remove the old password
    password = "";

    let funcarr = [];

    if(uppercaseCheck.checked){
        funcarr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcarr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcarr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcarr.push(generateSymbol);
    }

    //compulsory addition 
    for(let i = 0; i<funcarr.length; i++){
        password += funcarr[i]();
    }

    // remaining addition
    for(let i = 0; i<passwordLength-funcarr.length;i++){
        let randIndex = getRandInt(0,funcarr.length);
        password += funcarr[randIndex]();
    }

    //shuffling
    password = shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;

    //calculating the strength
    calStrength();
})