const { readFileSync, appendFileSync, writeFileSync, existsSync } = require('fs')
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
let secret = Array(tabHideWord.length).fill('_') // print _ _ _ of random word
let countBadChoice = 0
let countTry = 0
let name = ''
let stateGame = false

//TO DO LIST SCORE ...  //
//TO DO possibility type entire word ... //


if (readlineSync.keyInYN('Veux tu lancer le jeux du pendu ?')) {
  name = readlineSync.question('Quel est ton prenom ?  ')
  console.log(chalk.cyan(`Ok c'est parti! tu as 7 chances`))

  while (secret.join(' ') !== tabHideWord.join(' ')) {
    const win = () => {
      console.log(chalk.green(`Bravo ${name} tu as trouvé, le mot était: ${hideWord}`))
      console.log(chalk.cyan(`tu as réussis en ${countTry} coups.`))
      const drawBravo = bravo
      console.log(chalk.yellow(bravo[0]))
      stateGame = true
    }
    countTry++
    console.log(secret.join(' '))
    const leave = '*'
    const wholeWord = '!'

    let Try = readlineSync.keyIn('Tape une lettre entre a et z, tape ! si tu pense savoir quel est le mot pur le taper en entier. Tape * pour quitter a tout moment : ', {
      limit: `$<a-z>|${leave}|${wholeWord
        }`
    }).toLowerCase()
    if (Try === leave) { process.exit(1) }
    if (Try === wholeWord) {
      console.log(tabHideWord)
      console.log(tabHideWord.join(''))
      Try = readlineSync.question('\n Tu as une idée tape le mot en entier pour verifier: ')
      console.log(Try)
      if (Try === tabHideWord.join('')) {
        win()
        break
      }
    }
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
    switch (countBadChoice) {
      case 1:
        console.log(drawHangman[0])
        break;
      case 2:
        console.log(drawHangman[1])
        break;
      case 3:
        console.log(drawHangman[2])
        break;
      case 4:
        console.log(drawHangman[3])
        break;
      case 5:
        console.log(drawHangman[4])
        break;
      case 6:
        console.log(drawHangman[5])
        break;
      case 7:
        console.log(chalk.red(drawHangman[6]))
        console.log(chalk.red(`Dommage ${name}, tu as perdu`))
        process.exit(1)
        break;

      default:
        break;
    }

    if (secret.join(' ') === tabHideWord.join(' ')) {
      win()
    }
  }

} else {
  console.log(`d'accord, jouons une autre fois ...`)
}

if (existsSync('./highScore.json')) {
  const readScores = readFileSync('highScore.json', 'utf-8')
  const scoresGame = JSON.parse(readScores)
  scoresGame.scores.push({ name: name, countTry: countTry })
  const addScore = JSON.stringify(scoresGame)
  writeFileSync('./highScore.json', addScore)
  console.log('voici les derniers scores')
  console.log()

  for (elem of scoresGame.scores) {
    console.log('Name: ' + elem.name + ' Score:' + elem.countTry)

  }
}