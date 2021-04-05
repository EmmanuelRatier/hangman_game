const { readFileSync } = require('fs')
const { randomInt } = require('crypto')
const chalk = require('chalk')
const readlineSync = require('readline-sync')

const { hangman, bravo } = require('./hangmanASCII.js')

const dico = readFileSync('./dict.txt', 'utf-8')
const dicoTab = dico.split('\n')

const randomWord = randomInt(0, dicoTab.length)

//console.log(`random word: ${dicoTab[randomWord]}`) // string of random word

const hideWord = dicoTab[randomWord]
const tabHideWord = hideWord.split('') // array of random word
const tabHideWordLength = hideWord.split('').length // length of array random word
let secret = Array(tabHideWordLength).fill('_') // print _ _ _ of random word
let countBadChoice = 0

//TO DO LIST SCORE ...  //
//TO DO possibility type entire word ... //

let countTry = 0

if (readlineSync.keyInYN('Veux tu lancer le jeux du pendu ?')) {
  let name = readlineSync.question('Quel est ton prenom ?')
  console.log(chalk.cyan(`Ok c'est parti! tu as 7 chances`))

  while (secret.join(' ') !== tabHideWord.join(' ')) {
    countTry++
    console.log(secret.join(' '))
    let leave = '!'
    let Try = readlineSync.keyIn('Tape une lettre entre a et z, tape ! pour quitter a tout moment : ', { limit: `$<a-z>|${leave}` }).toLowerCase()
    Try === leave ? process.exit(1) : false

    let allIndex = [] // init empty tab
    let idx = tabHideWord.indexOf(Try)
    while (idx !== -1) {
      allIndex.push(idx)
      idx = tabHideWord.indexOf(Try, idx + 1) // while you find an occurrence, you go to the next index and search for that same occurrence
    }
    if (allIndex.length > 0) {
      for (const elem of allIndex) { // print index find
        secret[elem] = Try // replace index in array secret word 
      }
    } else {
      countBadChoice++
      console.log(chalk.yellow('bad choice'))
    }
    // print the hangman if bad choice
    const drawHangman = hangman
    countBadChoice === 1 ? console.log(drawHangman[0]) : false
    countBadChoice === 2 ? console.log(drawHangman[1]) : false
    countBadChoice === 3 ? console.log(drawHangman[2]) : false
    countBadChoice === 4 ? console.log(drawHangman[3]) : false
    countBadChoice === 5 ? console.log(drawHangman[4]) : false
    countBadChoice === 6 ? console.log(drawHangman[5]) : false
    countBadChoice === 7 ? console.log(chalk.red(drawHangman[6])) : false
    if (countBadChoice === 7) {
      console.log(chalk.red(`Dommage ${name}, tu as perdu`))
      process.exit(1)
    }
    if (secret.join(' ') === tabHideWord.join(' ')) {
      console.log(chalk.green(`Bravo ${name} tu as trouvé le mot était: ${hideWord}`))
      console.log(chalk.cyan(`tu as réussis en ${countTry} coups.`))
      const drawBravo = bravo
      console.log(chalk.yellow(bravo[0]))
    }
  }

} else {
  console.log(`d'accord, jouons une autre fois ...`)
}