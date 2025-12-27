document.addEventListener('DOMContentLoaded', () => {
    // Instance variables
    let color = '';
    let attempts = [];
    let count = 0;
    let key_classes = {};
    let won = false;
    let end = false;
    let dark_mode = false;
    let limited_mode = false;
    const digits_count = 6;

    const MAX_ATTEMPTS = 10;

    // Document nodes
    const color_box = document.querySelector('#color-box')
    const input = document.querySelector('#input');
    const check = document.querySelector('#check');
    const keys = document.querySelectorAll('.key');
    const limited_mode_toggle = document.querySelector('#switchGuessMode');
    const extra = document.querySelector('#extra');
    const results = document.querySelector('#results');
    const new_game = document.querySelector('#new-game');

    const previous_guesses = input.querySelector('#previous');
    const current_guess = input.querySelector('#current');
    const inputs = current_guess.querySelectorAll('input');
    const play_again = results.querySelector('form');
    const results_header = results.querySelector('h1');
    const results_body = results.querySelector('.modal-body');

    const results_page = new bootstrap.Modal(document.getElementById('results'), {});


    // Reset variables
    function reset() 
    {
        color = randomColor();
        attempts = [];
        count = 0;
        key_classes = {};
        won = false;
        end = false;

        color_box.style.backgroundColor = '#' + color;

        previous_guesses.replaceChildren();
        clearInputs();

        if (limited_mode)
        {
            createExtraInputs();
        }

        results_header.textContent = '';
        results_body.replaceChildren();

        current_guess.hidden = false;
        check.hidden = false;
        keyboardReset();
    }

    // Return a random hexcode
    function randomColor() 
    {
        color = '';

        // Generate random 6 digit hexadecimal number
        for (let i = 0; i < 6; i++)
        {
            color += Math.floor((Math.random() * 16)).toString(16).toUpperCase();
        }
        console.log(color)
        return color;
    }

    // Check the user's guess
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
                attempt[guess['index']]['correct'] = 'partial';
                remaining[index] = '';
                key_classes[guess['digit']] = 'partial';
            }
        }

        // Record the guess
        attempts.push({'attempt': attempt, 'color': guessed_color});

        // Check if the user won or lost
        if (victory) 
        {
            won = true;
            end = true;

            win();
        }
        else if (limited_mode && count >= MAX_ATTEMPTS)
        {
            end = true;
            lose();
        }
    }

    // Clear current user input fields
    function clearInputs() 
    {
        for (const input of inputs) 
        {
            input.value = '';
        }
    }

    // Move past guess up and clear input fields
    function newInputs(last_attempt) 
    {
        const digits = last_attempt['attempt'];
        clearInputs();
        const div = document.createElement('div');
        div.className = 'inputs m-0';
        previous.appendChild(div, current_guess);

        const hash_sign = document.createElement('p');
        hash_sign.textContent = '#';
        hash_sign.className = 'inline fw-bolder align-middle mb-0';
        hash_sign.style.color = last_attempt['color'];
        div.appendChild(hash_sign);

        for (const digit of digits) 
        {
            const input = document.createElement('input');
            input.name = 'attempt';
            input.value = digit['value'];
            input.toggleAttribute('disabled');
            input.className = 'align-middle fs-3 ' + digit['correct'];
            div.appendChild(input);
        }

        if (limited_mode) 
        {
            extra.removeChild(extra.lastChild);
        }
    }

    // Remove keyboard colors
    function keyboardReset()
    {
        keys.forEach((key) => {
            key.className = 'key normal-btn';
        })
    }

    // Color code keyboard according to accuracy of user guesses
    function keyboardFeedback() 
    {
        // Add specific color class to each key if its digit was a part of a previous guess
        keys.forEach((key) => {
            if (key_classes[key.id])
            {
                key.className = 'key normal-btn ' + key_classes[key.id];
            }
        });
    }

    // Create extra input fields
    function createExtraInputs()
    {
        let remaining = MAX_ATTEMPTS - count - 1;
        for (let i = 0; i < remaining; i++) 
        {
            // Append input row
            let div = document.createElement('div');
            div.className = 'inputs m-0';
            extra.appendChild(div);

            // Append hash sign
            let hash_sign = document.createElement('p');
            hash_sign.textContent = '#';
            hash_sign.className = 'inline fw-bolder align-middle mb-0';
            hash_sign.style.color = '#000';
            div.appendChild(hash_sign);

            // Append input fields
            for (let i = 0; i < digits_count; i++)
            {
                let input = document.createElement('input');
                input.name = 'locked';
                input.toggleAttribute('disabled');
                input.className = ('align-middle fs-3');
                div.appendChild(input);
            }
        }
    }

    // Delete extra input fields
    function deleteExtraInputs()
    {
        extra.replaceChildren();
    }

    function win()
    {
        const header_text = results.querySelector('h1');
        header_text.textContent = 'Congratulations!';

        const body = results.querySelector('.modal-body');

        const text = document.createElement('p');
        const start_text = document.createTextNode('You guessed the color ');
        let end = ` in ${count} guess`;
        if (count > 1) 
        {
            end += 'es';
        }
        end += '!';
        const end_text = document.createTextNode(end);
        const span = document.createElement('span');
        span.textContent = span.style.color = '#' + color;
        text.appendChild(start_text);
        text.appendChild(span);
        text.appendChild(end_text);

        const summary = document.createElement('p');
        summary.textContent = 'Here\'s how you did:';

        body.appendChild(text);
        body.appendChild(summary);

        for (const attempt of attempts) 
        {
            const div = document.createElement('div');
            for (const digit of attempt['attempt']) 
            {
                const square = document.createElement('div');
                square.className = 'inline-square ms-1 me-1 mb-1 ' + digit['correct'];
                div.appendChild(square);
            }
            body.appendChild(div);
        }

        // Show victory result modal
        results_page.show();
    }

    function lose() 
    {
        results_header.textContent = 'Sorry, you\'re out of guesses';

        const p = document.createElement('p');
        const start_text = document.createTextNode('The color was ');
        const end_text = document.createTextNode('.');
        const span = document.createElement('span');
        span.textContent = span.style.color = '#' + color;
        p.appendChild(start_text);
        p.appendChild(span);
        p.appendChild(end_text);

        results_body.appendChild(p);

        // Show loss result modal
        results_page.show();
    }

    // Event listeners

    input.addEventListener('submit', (e) => {
        e.preventDefault();
        count++;

        let digits = [];
        for (const input of inputs) 
        {
            digits.push(input.value);
        }
        checkGuess(digits);
        keyboardFeedback();

        const last_attempt = attempts[attempts.length - 1];
        newInputs(last_attempt);

        if (end) 
        {
            current_guess.hidden = true;
            check.hidden = true;
        }
    });

    // Toggle limited guess mode
    limited_mode_toggle.addEventListener('click', () => {
        limited_mode = !limited_mode;
        if (limited_mode)
        {
            if (count >= MAX_ATTEMPTS)
            {
                lose();
            }
            else 
            {
                createExtraInputs();
            }
        }
        else 
        {
            deleteExtraInputs();
        }
    });

    // Start a new game
    new_game.addEventListener('click', () => {
        reset();
    });

    // Start a new game from results page
    play_again.addEventListener('submit', (e) => {
        e.preventDefault();
        results_page.hide();
        reset();
    })

    // Run on load

    color = randomColor();
    color_box.style.backgroundColor = '#' + color;
});