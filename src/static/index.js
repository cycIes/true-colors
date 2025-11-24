document.addEventListener('DOMContentLoaded', () => {
    let input = document.querySelector('#input');
    let fields = input.querySelectorAll('input');
    let valid_special_keys = ['Backspace', 'Shift', 'ArrowLeft', 'ArrowRight', 'Tab'];
    let valid_digit_keys = ['A', 'B', 'C', 'D', 'E', 'F', 'a', 'b', 'c', 'd', 'e', 'f', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

    fields.forEach((field) => field.addEventListener('keyup', (e) => {
        if (valid_digit_keys.includes(e.key))
        {
            field.blur();
            next = field.nextElementSibling;
            if (next) 
            {
                next.focus();
            }
        }
    }));
    fields.forEach((field) => field.addEventListener('keydown', (e) => {
        key = e.key;
        if ((key === 'Backspace' && field.value === '') || key === 'ArrowLeft')
        {
            field.blur();
            previous = field.previousElementSibling;
            if (previous)
            {
                previous.focus();
            }
        }
        else if (!((valid_digit_keys.includes(key)) || (valid_special_keys).includes(key)))
        {
            e.preventDefault();
        }
    }));
});
