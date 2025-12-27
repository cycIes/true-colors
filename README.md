# Hexdle
This is Hexdle, a color guessing browser game built with Flask, Python, HTML, CSS, and Javascript.

You can play it at this link: https://hexdle-g6vw.onrender.com

## Installation and Running Locally
You can also play this game locally on your machine. First, download the src folder. Then install Python if you do not have it already. Flask recommends using the latest version of Python. 
Navigate to the src directory. You will need to install the required dependencies in requirements.txt.
Set up a Python virtual environment (venv) in your terminal and activate it. The commands may vary from system to system, but you can probably use:
    `python -m venv` and then...

For Windows cmd.exe:
    `venv\Scripts\activate.bat`

For Windows Powershell:
    `venv\Scripts\Activate.ps1`

For Linux/MacOS:
    `source venv/bin/activate`

where venv is the name of your venv.
You can run `pip install -r requirements.txt` to install all dependencies.
To run the app, execute `flask run`. Then, you can view the website at http://127.0.0.1:5000.

## Playing the game

### Objective
The goal of the game is to guess the hexcode of the color in the box.

### Guesses
The topmost blank row is open for you to start typing your guess. Only characters 0-9 and A-F are allowed. You must type a character in every blank before checking your answer.
When you have typed a valid guess, click the **Check** button to check your answer.
You have unlimited guesses by default, but you can switch to a mode in settings which limits your number of guesses to ten.

### Guess feedback
When you have checked your answer, the tiles and keys should change color accordingly.
Tiles highlighted in green indicate that the digit you guessed at that position is correct.
Tiles highlighted in yellow indicate that the digit is in the hexcode, but not in the correct position.
Tiles in gray are not in the hexcode.
The hash/pound symbol (#) next to each previous guess will change to the color represented by that guess.

### Ending the game
The game ends when you have correctly guessed all the digits in the hexcode (all the tiles are green) or you have exhausted all of your guesses (in limited guessing mode). You will see the answer and how many guesses you used. If you won, you also can see a small representation of your attempts.
You may start a new game by clicking the **Play Again** button.

### Features
There is a three icon toolbar under the title which link to game information, extra information, and settings popups. Game information (linked to the question mark icon) explains the rules of the game, extra information (linked to the i icon) elaborates on hexcodes, and settings allows you to toggle the color mode of the page and the game mode. You can select between having unlimited guesses or only ten guesses.

### Starting a new game
Upon ending the game, you should be able to click the button **Play Again** to start a new game.
To start a new game before the game is over, navigate to http://127.0.0.1:5000/new.

## Project description
[See me showcase my project here.](https://youtu.be/KGW-UA7SKSY)
https://youtu.be/KGW-UA7SKSY