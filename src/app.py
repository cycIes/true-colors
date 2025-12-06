from flask import Flask, render_template, request, redirect, jsonify
from random import randrange

app = Flask(__name__)

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

def random_color():
    color = ""
    for i in range(3):
        color += str(hex(randrange(0, 255)))[2:].zfill(2).upper()
    return color

def appendUnique(element, list):
    if element not in list:
        list.append(element)

def reset():
    global color
    global attempts
    global count
    global won
    global correctDigits
    global partialDigits
    global incorrectDigits
    
    color = random_color()
    attempts = []
    count = 0
    won = False
    correctDigits = []
    partialDigits = []
    incorrectDigits = []

reset()


@app.route("/")
def index():
    return render_template("index.html", color=f"#{color}", hex=color, attempts=attempts, victory=False)

@app.route("/check", methods=["POST"])
def check():
    global count
    count += 1
    attempt = []
    answers = request.form.values()
    victory = True
    guessed_color = "#"
    length = len(color)
    
    digits = [input.upper() for input in answers]
    remaining = [digit for digit in color]
    partial_guesses = []
    for i in range(length):
        digit = digits[i]
        if digit == color[i]:
            correct = "correct"
            remaining[i] = ""
            appendUnique(digit, correctDigits)
        elif digit in color:
            partial_guesses.append({"digit": digit, "index": i})
            correct = "incorrect"
            victory = False
        else:
            correct = "incorrect"
            victory = False
            appendUnique(digit, incorrectDigits)
        attempt.append({"value": digit, "correct": correct})
        guessed_color += digit
    
    print(partial_guesses)
    print(remaining)
    for guess in partial_guesses:
        if guess["digit"] in remaining:
            index = remaining.index(guess["digit"])
            attempt[guess["index"]]["correct"] = "partial"
            remaining[index] = ""
            appendUnique(digit, partialDigits)
            
    attempts.append({"attempt": attempt, "color": guessed_color})
    
    if victory:
        global won
        won = True
        return redirect("/victory")
    else:
        return redirect("/")
    
@app.route("/victory")
def victory():
    if won:
        # return render_template("index.html", color=f"#{color}", hex=color, attempts=attempts, victory=True, count=count)
        return render_template("victory.html", color=color, count=count, attempts=attempts)
    return redirect("/")

@app.route("/new")
def new():
    reset()
    return redirect("/")