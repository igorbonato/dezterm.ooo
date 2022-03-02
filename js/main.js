document.addEventListener("DOMContentLoaded", () => {
    // also in local storage
    let currentWordIndex = 0;
    let guessedWordCount = 0;
    let availableSpace = 1;
    let guessedWords = [[]];

    window.localStorage.clear()
    
    let arr;
    
    fetch("./dicio2.txt")
    .then(response => response.text())
    .then((text) => {
    arr = text.split("\n");
    console.log(arr)
    })

    class Board {
      constructor(numero, palavra = null, encerrado = false) {
        this.numero = numero;
        this.palavra = palavra;
        this.encerrado = encerrado;
      }
    }
    
    const words = [["vinho", "scott", "sitio", "vacas", "ufrgs", "morte", "gatos", "tenda", "rocha", "porto"],
                   ["tempo", "corpo", "sitio", "vacas", "comer", "carne", "holly", "arroz", "lebre", "porta"],
                   ["vinho", "corpo", "sitio", "vacas", "comer", "carne", "holly", "arroz", "lebre", "porta"],
                   ["vinho", "corpo", "sitio", "vacas", "comer", "carne", "holly", "arroz", "lebre", "porta"],
                   ["vinho", "corpo", "sitio", "vacas", "comer", "carne", "holly", "arroz", "lebre", "porta"],
                   ["vinho", "corpo", "sitio", "vacas", "comer", "carne", "holly", "arroz", "lebre", "porta"],
                   ["vinho", "corpo", "sitio", "vacas", "comer", "carne", "holly", "arroz", "lebre", "porta"],
                   ["vinho", "corpo", "sitio", "vacas", "comer", "carne", "holly", "arroz", "lebre", "porta"],
                   ["vinho", "corpo", "sitio", "vacas", "comer", "carne", "holly", "arroz", "lebre", "porta"],
                   ["vinho", "corpo", "sitio", "vacas", "comer", "carne", "holly", "arroz", "lebre", "porta"]];
          
    let currentWord = words[currentWordIndex];
    let total_boards = [];
    for (let i = 0; i < words[0].length; i++) {
      let board_i = new Board(i, currentWord[i], false);
      total_boards.push(board_i);
    }

    initLocalStorage();
    initHelpModal();
    initStatsModal();
    createTenBoards();
    addKeyboardClicks();
    loadLocalStorage();
  
    function initLocalStorage() {
      const storedCurrentWordIndex =
        window.localStorage.getItem("currentWordIndex");
      if (!storedCurrentWordIndex) {
        window.localStorage.setItem("currentWordIndex", currentWordIndex);
      } else {
        currentWordIndex = Number(storedCurrentWordIndex);
        currentWord = words[currentWordIndex];
      }
    }
  
    function loadLocalStorage() {
      currentWordIndex =
        Number(window.localStorage.getItem("currentWordIndex")) ||
        currentWordIndex;
      guessedWordCount =
        Number(window.localStorage.getItem("guessedWordCount")) ||
        guessedWordCount;
      availableSpace =
        Number(window.localStorage.getItem("availableSpace")) || availableSpace;
      guessedWords =
        JSON.parse(window.localStorage.getItem("guessedWords")) || guessedWords;
  
      currentWord = words[currentWordIndex];
  
      const storedBoardContainer = window.localStorage.getItem("boardContainer");
      if (storedBoardContainer) {
        document.getElementById("board-container").innerHTML =
          storedBoardContainer;
      }
  
      const storedKeyboardContainer =
        window.localStorage.getItem("keyboardContainer");
      if (storedKeyboardContainer) {
        document.getElementById("keyboard-container").innerHTML =
          storedKeyboardContainer;

        addKeyboardClicks()
          }
    }
  
    function resetGameState() {
      window.localStorage.removeItem("guessedWordCount");
      window.localStorage.removeItem("guessedWords");
      window.localStorage.removeItem("keyboardContainer");
      window.localStorage.removeItem("boardContainer");
      window.localStorage.removeItem("availableSpace");
    }
  
    function createTenBoards() {
      const tenBoards = document.getElementById("board-container");

      for (let i = 0; i < 10; i++){
        let board = document.createElement("div");
        board.classList.add("board");
        board.setAttribute("id", `board_${i}`);
        tenBoards.appendChild(board);
        createSquares(i) 
      }
    }

    function createSquares(i) {
      const gameBoard = document.getElementById(`board_${i}`);
  
      for (let i = 0; i < 100; i++) {
        let square = document.createElement("div");
        square.classList.add("animate__animated");
        square.classList.add("square");
        square.classList.add(i + 1);
        gameBoard.appendChild(square);
      }
    }
  
    function preserveGameState() {
      window.localStorage.setItem("guessedWords", JSON.stringify(guessedWords));
  
      const keyboardContainer = document.getElementById("keyboard-container");
      window.localStorage.setItem(
        "keyboardContainer",
        keyboardContainer.innerHTML
      );
  
      const boardContainer = document.getElementById("board-container");
      window.localStorage.setItem("boardContainer", boardContainer.innerHTML);
    }
  
    function getCurrentWordArr() {
      const numberOfGuessedWords = guessedWords.length;
      return guessedWords[numberOfGuessedWords - 1];
    }
  
    function updateGuessedLetters(letter) {
      const currentWordArr = getCurrentWordArr();
  
      if (currentWordArr && currentWordArr.length < 5) {
        currentWordArr.push(letter);
  
        const availableSpaceEl = document.getElementsByClassName(availableSpace);
        for (var i=0; i<availableSpaceEl.length; i++) {
          if (total_boards[i].encerrado == false){
          availableSpaceEl[i].textContent = letter
          }
        }
        availableSpace = availableSpace + 1;
      }
    }
  
    function updateTotalGames() {
      const totalGames = window.localStorage.getItem("totalGames") || 0;
      window.localStorage.setItem("totalGames", Number(totalGames) + 1);
    }
  
    function showResult() {
      const finalResultEl = document.getElementById("final-score");
      finalResultEl.textContent = "DEZTERMO 1 - You win!";
  
      const totalWins = window.localStorage.getItem("totalWins") || 0;
      window.localStorage.setItem("totalWins", Number(totalWins) + 1);
  
      const currentStreak = window.localStorage.getItem("currentStreak") || 0;
      window.localStorage.setItem("currentStreak", Number(currentStreak) + 1);
    }
  
    function showLosingResult() {
      const finalResultEl = document.getElementById("final-score");
      finalResultEl.textContent = `DEZTERMO - Unsuccessful Today! as palavras eram:`;
      currentWord.forEach(element => {
        let palavra = document.createElement("p")
        palavra.textContent = element  + ","
        palavra.classList.add("resp-certas")
        finalResultEl.appendChild(palavra)
      })
      window.localStorage.setItem("currentStreak", 0);
    }
  
    function clearBoard() {
      for (let i = 0; i < 100; i++) {
        let square = document.getElementsByClassName(i + 1);
        for (let j = 0; j < square.length; j++) {
          square[j].textContent = "";
          if (i < 50) {
            square[j].style.backgroundColor = "rgb(0, 91, 187)";
            square[j].style.borderColor = "rgb(0, 91, 187)";
          } else {
            square[j].style.backgroundColor = "rgb(189, 161, 6)";
            square[j].style.borderColor = "rgb(189, 161, 6)";
          }     
        }
      }
  
      const keys = document.getElementsByClassName("keyboard-button");
  
      for (var key of keys) {
        key.disabled = true;
      }
    }
  
    function getIndicesOfLetter(letter, arr) {
      const indices = [];
      let idx = arr.indexOf(letter);
      while (idx != -1) {
        indices.push(idx);
        idx = arr.indexOf(letter, idx + 1);
      }
      return indices;
    }
  
    function getTileClass(letter, index, currentWordArr) {
      let color_responses = []
      for (let j = 0; j < total_boards.length; j++) {
      const isCorrectLetter = total_boards[j].palavra
        .toUpperCase()
        .includes(letter.toUpperCase());
  
      if (!isCorrectLetter) {
        color_responses.push("incorrect-letter");
        continue;
      }
  
      const letterInThatPosition = total_boards[j].palavra.charAt(index);
      const isCorrectPosition =
        letter.toLowerCase() === letterInThatPosition.toLowerCase();
  
      if (isCorrectPosition) {
        color_responses.push("correct-letter-in-place");
        continue;
      }
  
      const isGuessedMoreThanOnce =
        currentWordArr.filter((l) => l === letter).length > 1;
  
      if (!isGuessedMoreThanOnce) {
        color_responses.push("correct-letter");
        continue;
      }
  
      const existsMoreThanOnce =
      total_boards[j].palavra.split("").filter((l) => l === letter).length > 1;
  
      // is guessed more than once and exists more than once
      if (existsMoreThanOnce) {
        color_responses.push("correct-letter");
        continue;
      }
  
      const hasBeenGuessedAlready = currentWordArr.indexOf(letter) < index;
  
      const indices = getIndicesOfLetter(letter, total_boards[j].palavra.split(""));
      const otherIndices = indices.filter((i) => i !== index);
      const isGuessedCorrectlyLater = otherIndices.some(
        (i) => i > index && currentWordArr[i] === letter
      );
  
      if (!hasBeenGuessedAlready && !isGuessedCorrectlyLater) {
        color_responses.push("correct-letter")
        continue ;
      }
  
      color_responses.push("incorrect-letter");
      continue;
    }
    return color_responses
    }
  
    function updateWordIndex() {
      console.log({ currentWordIndex });
      window.localStorage.setItem("currentWordIndex", currentWordIndex + 1);
    }
  
    async function handleSubmitWord() {
      const currentWordArr = getCurrentWordArr();
      const guessedWord = currentWordArr.join("");
  
      if (guessedWord.length !== 5) {
        return;
      }

      if (arr.includes(guessedWord)) {
        const firstLetterId = guessedWordCount * 5 + 1;
  
        localStorage.setItem("availableSpace", availableSpace);
  
        const interval = 200;
        currentWordArr.forEach((letter, index) => {
          setTimeout(() => {
            const tileClass = getTileClass(letter, index, currentWordArr);
            if (tileClass) {
              const letterId = firstLetterId + index;
              const letterEl = document.getElementsByClassName(letterId);

              for (var i=0; i<letterEl.length; i++) {
                if (total_boards[i].encerrado == false){
                letterEl[i].classList.add("animate__flipInX");
                letterEl[i].classList.add(tileClass[i])};  
              }
  
              const keyboardEl = document.querySelector(`[data-key=${letter}]`);
              if (tileClass.every(elemen => elemen === "incorrect-letter")) {
                keyboardEl.classList.add(tileClass[0]);
              }
            }
  
            if (index === 4) {
              preserveGameState();
            } 
          }, index * interval);
        });
        
        setTimeout(() => {
          for (let tabuleiro = 0; tabuleiro < total_boards.length; tabuleiro++) {
          if (total_boards[tabuleiro].palavra === guessedWord) {
            total_boards[tabuleiro].encerrado = true;
          };
        };
        }, 1200);
        

        guessedWordCount += 1;
        window.localStorage.setItem("guessedWordCount", guessedWordCount);

        let allwords = guessedWords.map( element => element.join(""))
        console.log(allwords)
        console.log(guessedWords)
        if (currentWord.every(word => allwords.includes(word))) {
          setTimeout(() => {
            const okSelected = window.confirm("boaaaaa!");
            if (okSelected) {
              clearBoard();
              showResult();
              updateWordIndex();
              updateTotalGames();
              resetGameState();
            }
            return;
          }, 1200);
        }
  
        if (guessedWords.length === 20 && !(currentWord.every(word => allwords.includes(word)))) {
          setTimeout(() => {
            const okSelected = window.confirm(
              `dsclp, acabaram suas chances! as palavras eram ${currentWord }.`
            );
            if (okSelected) {
              clearBoard();
              showLosingResult();
              updateWordIndex();
              updateTotalGames();
              resetGameState();
            }
            return;
          }, 1200);
        }
  
        guessedWords.push([]);
        } else {
        window.alert("palavra nao existe, pelamor de deus");
      }
    }

  
    function handleDelete() {
      const currentWordArr = getCurrentWordArr();
  
      if (!currentWordArr.length) {
        return;
      }
  
      currentWordArr.pop();
  
      guessedWords[guessedWords.length - 1] = currentWordArr;
  
      const lastLetterEl = document.getElementsByClassName(availableSpace - 1);
      for (var i=0; i<lastLetterEl.length; i++) {
        lastLetterEl[i].innerHTML = "";
      }

      availableSpace = availableSpace - 1;
    }
  
    function addKeyboardClicks() {
      const keys = document.querySelectorAll(".keyboard-row button");
      for (let i = 0; i < keys.length; i++) {
        keys[i].addEventListener("click", ({ target }) => {
          const key = target.getAttribute("data-key");
  
          if (key === "enter") {
            handleSubmitWord();
            return;
          }
  
          if (key === "del") {
            handleDelete();
            return;
          }
  
          updateGuessedLetters(key)
        });
      }
    }
  
    function initHelpModal() {
      const modal = document.getElementById("help-modal");
  
      // Get the button that opens the modal
      const btn = document.getElementById("help");
  
      // Get the <span> element that closes the modal
      const span = document.getElementById("close-help");
  
      // When the user clicks on the button, open the modal
      btn.addEventListener("click", function () {
        modal.style.display = "block";
      });
  
      // When the user clicks on <span> (x), close the modal
      span.addEventListener("click", function () {
        modal.style.display = "none";
      });
  
      // When the user clicks anywhere outside of the modal, close it
      window.addEventListener("click", function (event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      });
    }
  
    function updateStatsModal() {
      const currentStreak = window.localStorage.getItem("currentStreak");
      const totalWins = window.localStorage.getItem("totalWins");
      const totalGames = window.localStorage.getItem("totalGames");
  
      document.getElementById("total-played").textContent = totalGames;
      document.getElementById("total-wins").textContent = totalWins;
      document.getElementById("current-streak").textContent = currentStreak;
  
      const winPct = Math.round((totalWins / totalGames) * 100) || 0;
      document.getElementById("win-pct").textContent = winPct;
    }
  
    function initStatsModal() {
      const modal = document.getElementById("stats-modal");
  
      // Get the button that opens the modal
      const btn = document.getElementById("stats");
  
      // Get the <span> element that closes the modal
      const span = document.getElementById("close-stats");
  
      // When the user clicks on the button, open the modal
      btn.addEventListener("click", function () {
        updateStatsModal();
        modal.style.display = "block";
      });
  
      // When the user clicks on <span> (x), close the modal
      span.addEventListener("click", function () {
        modal.style.display = "none";
      });
  
      // When the user clicks anywhere outside of the modal, close it
      window.addEventListener("click", function (event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      });
    }
    document.addEventListener ('keydown', (event) => {
      const keyName = event.key;
      if (keyName === "Enter") {
        handleSubmitWord();
        return;
      }
  
      if (keyName === "Backspace") {
        handleDelete();
        return;
      }
      if (['a','b','c','d','e','f','g','h','i','j','k','l','m','n',
      'o','p','q','r','s','t','u','v','x','w','y','z'].includes(keyName.toLowerCase())){
      updateGuessedLetters(keyName.toLowerCase())
      }
    });
  });