document.addEventListener('DOMContentLoaded', () => {
    const body = document.querySelector('body');
    const input = document.querySelector('#input');
    const fields = input.querySelectorAll('input');
    const valid_special_keys = ['Backspace', 'Shift', 'ArrowLeft', 'ArrowRight', 'Tab'];
    const valid_digit_keys = ['A', 'B', 'C', 'D', 'E', 'F', 'a', 'b', 'c', 'd', 'e', 'f', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    const keyboard = document.querySelector('#keyboard');
    const dark_mode_toggle = document.querySelector('#switchDarkMode');

    let color_scheme;
    fetch("/settings")
    .then(response => response.json())
    .then(data => data.dark_mode ? color_scheme = 'dark' : color_scheme = 'light');

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

    // POST settings data
    function saveSettings()
    {
        let data = new FormData();
        const settings = document.querySelector("#settings-container");
        const modes = settings.querySelectorAll('input');
        for (const mode of modes) 
        {
            data.append(mode.name, mode.checked);
        }
        fetch("/settings", {
            "method": "POST",
            "body": data
        })
        .then(response => response.json());
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
});
