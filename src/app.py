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

def reset():
    global color
    global attempts
    global count
    global end
    global won
    global correct_digits
    global partial_digits
    global incorrect_digits
    global key_classes
    
    color = random_color()
    attempts = []
    count = 0
    end = False
    won = False
    correct_digits = []
    partial_digits = []
    incorrect_digits = []
    key_classes = {}

reset()

MAX_ATTEMPTS = 10

dark_mode = False
limited_mode = False

@app.route("/")
def index():
    return render_template("index.html", color=f"#{color}", hex=color, attempts=attempts, max=MAX_ATTEMPTS, end=end, victory=won, count=count, key_classes=key_classes, dark_mode=dark_mode, limited_mode=limited_mode)

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
            key_classes[digit] = "correct"
        elif digit in color:
            partial_guesses.append({"digit": digit, "index": i})
            correct = "incorrect"
            victory = False
        else:
            correct = "incorrect"
            victory = False
            key_classes[digit] = "incorrect"
        attempt.append({"value": digit, "correct": correct})
        guessed_color += digit
    
    for guess in partial_guesses:
        if guess["digit"] in remaining:
            index = remaining.index(guess["digit"])
            attempt[guess["index"]]["correct"] = "partial"
            remaining[index] = ""
            key_classes[guess["digit"]] = "partial"
            
    attempts.append({"attempt": attempt, "color": guessed_color})
    
    if victory:
        global won
        global end
        
        won = True
        end = True
    return redirect("/")

@app.route("/new")
def new():
    reset()
    return redirect("/")

@app.route("/settings", methods=["GET", "POST"])
def settings():
    if request.method == "POST":
        settings = request.form
        
        global dark_mode
        global limited_mode
        
        dark_mode = settings.get("darkMode") == "true"
        limited_mode = settings.get("limitedMode") == "true"
    
        return settings
    else:
        return {"dark_mode": dark_mode, "limited_mode": limited_mode}