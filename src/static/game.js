document.addEventListener('DOMContentLoaded', () => {
    // Instance variables
    let color = '';
    let attempts = [];
    let count = 0;
    let key_classes = {};
    let won;
    let end;
    let dark_mode = false;
    let limited_mode = false;

    const MAX_ATTEMPTS = 10

    // Document nodes
    const check = document.querySelector('#check');
    const input = document.querySelector('#input');
    const keys = document.querySelectorAll('.key');

    function randomColor() 
    {
        color = 'ABCDEF';
    }

    function checkGuess(digits) 
    {
        let attempt = [];
        let victory = true;
        let guessed_color = '#';
        let length = 6; // TODO: change

        // Classify every digit in the user's guess
        let remaining = color.split('');
        let partial_guesses = [];
        let correct;

        for (let i = 0; i < length; i++)
        {
            let digit = digits[i];
            if (digit === color[i]) 
            {
                correct = 'correct';
                remaining[i] = '';
                key_classes[digit] = 'correct';
            }
            else if (color.includes(digit))
            {
                // Add digit as a possible partially correct guess
                partial_guesses.push({'digit': digit, 'index': i});
                correct = 'incorrect';
                victory = false;
            }
            else 
            {
                correct = 'incorrect';
                victory = false;
                key_classes[digit] = 'incorrect';
            }
            // Store guess and feedback about guess
            attempt.push({'value': digit, 'correct': correct});
            guessed_color += digit;
        }

        // Check each partially possible correct guess
        for (const guess of partial_guesses)
        {
            if (remaining.includes(guess['digit']))
            {
                index = remaining.findIndex((value) => value === guess['digit']);
                attempt[guess['index']]['correct'] = "partial";
                remaining[index] = '';
                key_classes[guess['digit']] = 'partial';
            }
        }

        // Record the guess
        attempts.push({'attempt': attempt, 'color': guessed_color});
        console.log(key_classes);

        // Check if the user won or lost
        if (victory) 
        {
            won = true;
            end = true;
        }
        else if (limited_mode && count >= MAX_ATTEMPTS)
        {
            end = true;
        }
    }

    function keyboardFeedback() 
    {
        // Add specific color class to each key if its digit was a part of a previous guess
        keys.forEach((key) => {
            if (key_classes[key.id])
            {
                key.classList.add(key_classes[key.id]);
            }
        });
    }

    // Event listeners

    input.addEventListener('submit', (e) => {
        e.preventDefault();
        count++;

        const current_guess = input.querySelector('#current');
        const inputs = current_guess.querySelectorAll('input');
        let digits = [];
        for (const input of inputs) 
        {
            digits.push(input.value.toUpperCase());
        }
        checkGuess(digits);
        keyboardFeedback();
    });

    // Run on load

    randomColor();
});