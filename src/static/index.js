document.addEventListener('DOMContentLoaded', () => {
    const body = document.querySelector('body');
    const input = document.querySelector('#input');
    const fields = input.querySelectorAll('input');
    const valid_special_keys = ['Backspace', 'Shift', 'ArrowLeft', 'ArrowRight', 'Tab'];
    const valid_digit_keys = ['A', 'B', 'C', 'D', 'E', 'F', 'a', 'b', 'c', 'd', 'e', 'f', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    const keyboard = document.querySelector('#keyboard');
    const dark_mode_toggle = document.querySelector('#switchDarkMode');
    const limited_mode_toggle = document.querySelector('#switchGuessMode');
    const digits_count = 6;

    let color_scheme;
    let limited_mode;
    fetch('/settings')
    .then(response => response.json())
    .then(data => {
        color_scheme = data.dark_mode ? color_scheme = 'dark' : color_scheme = 'light';
        limited_mode = data.limited_mode;
    });

    let max_attempts;
    let count;
    fetch('/data')
    .then(response => response.json())
    .then(data => {
        max_attempts = data.max_attempts;
        count = data.count;
    });

    // Focus the next element
    function focusNext(current)
    {
        const next = current.nextElementSibling;
        if (next)
        {
            next.focus();
        }
    }

    // Focus the previous element
    function focusPrevious(current)
    {
        const previous = current.previousElementSibling;
        if (previous)
        {
            previous.focus();
        }
    }

    // Create extra input fields
    function createExtraInputs()
    {
        const extra = document.querySelector('#extra');

        let remaining = max_attempts - count - 1;
        for (let i = 0; i < remaining; i++) 
        {
            let div = document.createElement('div');
            div.className = 'inputs';
            extra.appendChild(div);

            let hashSign = document.createElement('p');
            hashSign.textContent = '#'
            hashSign.className = 'inline fs-1 fw-bolder align-middle mb-0';
            hashSign.style.color = '#000';
            div.appendChild(hashSign);

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

    function deleteExtraInputs()
    {
        const extra = document.querySelector('#extra');
        extra.replaceChildren();
    }

    // POST settings data
    function saveSettings()
    {
        let data = new FormData();
        const settings = document.querySelector('#settings-container');
        const modes = settings.querySelectorAll('input');
        for (const mode of modes) 
        {
            data.append(mode.name, mode.checked);
        }
        fetch('/settings', {
            'method': 'POST',
            'body': data
        })
    }

    // Focus next input element after typing a valid key
    fields.forEach((field) => field.addEventListener('keyup', (e) => {
        if (valid_digit_keys.includes(e.key) || e.key === 'ArrowRight')
        {
            field.blur();
            focusNext(field);
        }
    }));

    // Prevent typing invalid keys, add special key behavior, and focus previous input element on special keys
    fields.forEach((field) => field.addEventListener('keydown', (e) => {
        const key = e.key;
        if ((key === 'Backspace' && field.value === '') || key === 'ArrowLeft')
        {
            field.blur();
            focusPrevious(field);
        }
        else if (!((valid_digit_keys.includes(key)) || (valid_special_keys).includes(key)))
        {
            e.preventDefault();
        }
        else if (valid_digit_keys.includes(key))
        {
            field.value = key.toUpperCase();
            e.preventDefault();
        }
        else if (key === 'Backspace')
        {
            field.value = '';
        }
    }));

    // Type with provided keyboard
    keyboard.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('key') || target.parentElement.classList.contains('key')) 
        {
            const focused = document.activeElement;
            if (Array.from(fields).includes(focused))
            {
                if (target.id === 'backspace' || target.parentElement.id === 'backspace')
                {
                    if (focused.value === '')
                    {
                        focusPrevious(focused);
                        return;
                    }
                    focused.value = '';
                    return;
                }
                focused.value = target.id;
                focusNext(focused);
            }
        }
    });

    // Prevent input fields from losing focus on button click
    keyboard.addEventListener('focusin', (e) => {
        const related = e.relatedTarget;
        if (related && Array.from(fields).includes(related)) {
            related.focus();
        }
    })

    // Toggle dark mode
    dark_mode_toggle.addEventListener('click', () => {
        if (dark_mode_toggle.checked)
        {
            color_scheme = 'dark';
        }
        else
        {
            color_scheme = 'light';
        }
        body.setAttribute('data-bs-theme', color_scheme);
        saveSettings();
    });

    // Toggle limited guess mode
    limited_mode_toggle.addEventListener('click', () => {
        limited_mode = !limited_mode;
        saveSettings();
        if (limited_mode)
        {
            if (count >= max_attempts)
            {
                fetch('/lose')
                .then(response => {
                    if (response.redirected) {
                        window.location = response.url;
                    }
                })
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
});
