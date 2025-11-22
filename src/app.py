from flask import Flask, render_template, jsonify
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
        color += str(hex(randrange(0, 255)))[-2:]
    return "#" + color

# color = random_color()


@app.route("/")
def index():
    color = random_color()
    return render_template("index.html", color=color, hex=color)