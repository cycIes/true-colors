# The Project Design
The project is a monolithic game webpage using Flask, HTML, Javascript, and CSS.

## Flask and Python
Flask renders HTML templates and handles the game logic inside routes. I chose to program the game logic with Flask because I had more confidence in Python, and I wanted to separate the game logic from the user interface logic. It was also more intuitive to me to store information about the user's game in the Flask server, and writing the game in Python made it easier to share data. Jinja with templates also made it easy to modify webpages on certain conditions and reduces some redundant html code.

The main route (/) renders `index.html` with important game variables, including the status of the game.
Upon loading, Flask sets certain game variables like the color the user has to guess and resets containers for holding information about the user's game, like the user's guesses and the status of the round. 
When a user submits their guess, `index.html` posts the guess to the /check route. When Flask receives the guess, it records the guess and iterates through each digit in the guess to record the correct, partially correct, and incorrect digits, and then its determines if the user has won, lost, or neither. If the game has ended, the check function updates the status of game and redirects the user to the main route.
The /lose route, when called, updates the game status and reloads the page to end the game without a victory.
The /new route resets the game variables, generates a new random hexcode answer, and reloads the main page.
The /settings route updates the settings dictionary, which contains information about the user's preferred color scheme and game mode.
The /data route sends a dictionary of certain variables about the game required by JavaScript.

## HTML and CSS
The main html file, `index.html`, extends the basic code in `base.html`. I decided to create a base template to allow myself to add more webpages in the future, if I were to expand on the project.

Jinja integrated with Flask provides a convenient method of accessing server-side variables about the game and helps modify the html based on variables sent from Flask or change the page based on certain conditions. For example, I use Jinja to apply user settings on page load. In another instance, I loop through data about the user's past guesses to visualize them. Jinja also hides (and reveals) the modals shown to users who have ended the game. I appreciate that big changes to html elements stay in the html file itself.

Bootstrap aids the user interface with its custom classes, components, and variables. Bootstrap offers convenient, already designed features and helps with consistency. I use several different bootstrap classes to modify the appearance of elements. The two components I use are modals and switches. I use modals to show additional information without leaving the page, and use switches for aesthetic settings toggles. I use three modals for the information cards and settings tab, located at the bottom of the document. In addition, I display user's results upon ending the game in a modal, which I find to be more aesthetically cohesive. For styles, I make use of existing color variables for readability and a maintaining a consistent palette.
As the project is rather simple, I have chosen simple, clean, and neutral aesthetics for the webpage, as theming around a specific set of colors would be strange for a game about guessing random colors. Much of the base styling comes with Bootstrap's style reboot. CSS in the linked stylesheet `styles.css` further customizes the layout, sizing, and design of particular elements.

### Header and Color
At the top of the page is the title, a simple toolbar, and the color the user must guess. I use Jinja inside a style tag to communicate the selected color. The toolbar links to the information and settings modals, so that the website provides enough readability and customizability without cluttering the main page.

### User Input Fields
In the middle of the page are a series of input fields. One row is for the user to type into. This row is enclosed in a form in order to post the user's guess to the server. The others are generated with Jinja for simplicity and either exist to display the user's previous guesses or show how many guesses the user has left, both providing helpful information about the game.

### Keyboard
At the bottom of the page is a set of buttons that act as keys for the valid digits, as well as a backspace. The keys are meant to behave the same as the user's keys and provide an alternate method of typing. When the user receives colored feedback after submitting a guess, the corresponding keys on the keyboard will also change to the appropriate color. Changing the keyboard colors offers a summary of the user's overall guess feedback, which makes it easier for the user to keep track of which digits are in the correct position, which are not, and which are not in the hexcode. 

## Javascript
There are two Javascript sources, one inside a script tag in `index.html`, and `index.js`, which is linked to `index.html`. Javascript handles the functionality and dynamic aesthetics of the website. The main purpose of JavaScript is to enhance the user experience.

The reason why some of the JavaScript code is inside `index.html` is so that it can work with server variables without making requests. When the page loads, JavaScript directly in `index.html` checks if each key has a special class, sent in a list from Flask, and assigns the class if it exists. These classes represent the three results of a guess, correct, partially correct, and incorrect. Depending on whether the game has ended or not, JavaScript may show a special results modal with the aid of Jinja.

The external script includes most of the webpage functionality. The main functions are user keyboard behavior for the input fields and settings for the game.
JavaScript listens for keyboard and focus events on inputs to improve the user experience. After typing a character, the webpage will automatically focus the next input field. Javascript also allows the user to use certain keys like Backspace and the Arrow keys to navigate between inputs.
JavaScript also listens for clicks on the keyboard keys to edit the input fields.
Finally, Javascript listens for clicks on the settings switchers to adjust the page to user preferences and post the user's preferences to the server. To aid in implementing user settings, the script fetches some data from the server side for information about the game and the user's recorded settings. For switching between UI color-schemes, JavaScript modifies the bootstrap theme property on the body which already sets the color-scheme to light or dark for itself and its children. For switching game modes, JavaScript checks if the user would have already lost the limited game mode, and if not, generates extra input rows to represent the remaining guesses.

