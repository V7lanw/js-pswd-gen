// Array of special characters to be included in password
var specialCharacters = [
  '@',
  '%',
  '+',
  '\\',
  '/',
  "'",
  '!',
  '#',
  '$',
  '^',
  '?',
  ':',
  ',',
  ')',
  '(',
  '}',
  '{',
  ']',
  '[',
  '~',
  '-',
  '_',
  '.'
];

// Array of numeric characters to be included in password
var numericCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

// Array of lowercase characters to be included in password
var lowerCasedCharacters = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z'
];

// Array of uppercase characters to be included in password
var upperCasedCharacters = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z'
];

// Function to check if a string variable is a number
const isNumeric = function (str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

const getPasswordLengthBits = function () {}

// Function to assign 1 to some kind of "yes" and 0 to some kind of "no"
const yes1no0 = function (userInput) {
  if (userInput === "y"   || userInput === "yes" || userInput === "yep"  || userInput === "yeah" || userInput === "ye" ||
      userInput === "Y"   || userInput === "Yes" || userInput === "Yep"  || userInput === "Yeah" || userInput === "Ye" ||
      userInput === "YES" || userInput === "YEP" || userInput === "YEAH" || userInput === "YE") {
    return 1;
  } else {
    return 0;
  }
}

// Function to prompt user for password options
function getPasswordOptions() {
  // Password option, it is a binary number, like a bank of switches.
  // The structure of pswdOpt is at the end of this function.
  let pswdOpt = "";
  const shortestPswdLen = 8;
  const longestPswdLen = 128;
  const normalPswdLen = 12;
  const pswdLen = prompt(`Choose the length of password: \n At least ${shortestPswdLen} characters but no more than ${longestPswdLen}.`, `${normalPswdLen}`);
  // console.log(typeof(pswdLen)); // string
  // if (!isNumeric(pswdLen)) {
  //   alert(`"${pswdLen}" is not a number, please refresh this page and re-enter the length of code.`, location.reload());
  // } else if (pswdLen < shortestPswdLen) {
  //   const pswdLenBits = Number(shortestPswdLen).toString(2);
  // } else if (pswdLen > longestPswdLen) {
  //   const pswdLenBits = Number(longestPswdLen).toString(2);
  // } else {
  //   const pswdLenBits = Number(pswdLen).toString(2);
  // }
  const pswdLenBits = (!isNumeric(pswdLen)) 
                      ? confirm(`"${pswdLen}" is not a number, please refresh this page and re-enter the length of code.`, location.reload())
                      : (pswdLen < shortestPswdLen) 
                        ? Number(shortestPswdLen).toString(2)
                        : (pswdLen > longestPswdLen)
                          ? Number(longestPswdLen).toString(2)
                          : Number(pswdLen).toString(2);
  console.log(`pswdLenBits = ${pswdLenBits}`);
  let lcOpt = 1;
  const userInput1 = prompt("Do you need lowercase English letters? y/n", "y");
  lcOpt = yes1no0(userInput1);
  console.log(`lcOpt = ${lcOpt}`);
  let ucOpt = 1;
  const userInput2 = prompt("Do you need uppercase English letters? y/n", "y");
  ucOpt = yes1no0(userInput2);
  console.log(`ucOpt = ${ucOpt}`);
  let numOpt = 1;
  const userInput3 = prompt("Do you need Hindu-Arabic numerals? y/n", "y");
  numOpt = yes1no0(userInput3);
  console.log(`numOpt = ${numOpt}`);
  // Some old systems must not special characters in passwords.
  let spOpt = 0;
  const userInput4 = prompt("Do you need OWASP special characters? \n (Default \"no\" is for some old system) y/n", "n");
  spOpt = yes1no0(userInput4);
  console.log(`spOpt = ${spOpt}`);
  // At least one character type should be selected
  if (lcOpt + ucOpt + numOpt + spOpt < 1) {
    confirm(`This password only support English letters, Hindu-Arabic numerals, and OWASP special characters, if you choose noone of them, a password contains them all will be generated. \n If that is not what you want, please manually refresh this page and re-enter your characters settings.`);
    lcOpt = 1;
    ucOpt = 1;
    numOpt = 1;
    spOpt = 1;
  }
  // Password option structure
  // Explanation by example, a password option looks like:
  //    "|1 0 0 0 0 0 0 0|1|1|1|0|"
  //    "|_ _ _ _ 1 0 0 0|1|0|1|1|"
  //     |_ _ _ _ _ _ _ _|_|_|_|_| LSB
  // MSB 1110 9 8 7 6 5 4 3 2 1 0  LSB
  //    bit 0: OWASP special characters option, 1 for chosen, 0 for not chosen.
  //    bit 1: Hindu-Arabic numerals option, 1 for chosen, 0 for not chosen.
  //    bit 2: uppercase English letters, 1 for chosen, 0 for not chosen.
  //    bit 3: lowercase English letters, 1 for chosen, 0 for not chosen.
  // bit 4~11: password length in binary format.
  pswdOpt = pswdLenBits.concat(
    Number(lcOpt).toString(2), Number(ucOpt).toString(2), 
    Number(numOpt).toString(2), Number(spOpt).toString(2));
  console.log(`pswdOpt = ${pswdOpt}`);
  return pswdOpt;
}

// Function for getting a random element from an array
function getRandom(arr) {
  arrLen = arr.length;
  console.log(arrLen);
  return arrLen;
}

// Function to generate password with user input
function generatePassword() {
  const password = getPasswordOptions();
  // const password = getRandom(lowerCasedCharacters);
  return password;
}

// Get references to the #generate element
var generateBtn = document.querySelector('#generate');

// Write password to the #password input
function writePassword() {
  var password = generatePassword();
  var passwordText = document.querySelector('#password');

  passwordText.value = password;
}

// Add event listener to generate button
generateBtn.addEventListener('click', writePassword);