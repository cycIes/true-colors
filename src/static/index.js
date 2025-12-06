document.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector('#input');
    const fields = input.querySelectorAll('input');
    const valid_special_keys = ['Backspace', 'Shift', 'ArrowLeft', 'ArrowRight', 'Tab'];
    const valid_digit_keys = ['A', 'B', 'C', 'D', 'E', 'F', 'a', 'b', 'c', 'd', 'e', 'f', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    const keyboard = document.querySelector('#keyboard');
    const key_btns = document.querySelectorAll('.key');

    function focusNext(current)
    {
        const next = current.nextElementSibling;
        if (next)
        {
            next.focus();
        }
    }

    function focusPrevious(current)
    {
        const previous = current.previousElementSibling;
        if (previous)
        {
            previous.focus();
        }
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
});
