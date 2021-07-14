'use strict';

import '../sass/app.scss';

//-- Autocomplete component
((root) => {
    const node = root.querySelectorAll('.autocomplete-component')[0];
    const optionList = root.createElement('div');
    optionList.classList.add('autocomplete-component__option-list');

    const input = root.createElement('input');
    input.classList.add('autocomplete-component__input');
    input.setAttribute('placeholder', node.getAttribute('placeholder'));

    let tempValue = '';

    input.addEventListener('input', async (e) => {
        addCloseButton();
        if (e.target.value.length >= 2) {
            try {
                const response = await fetch(`http://localhost:3000/api/states?term=${e.target.value}`);
                const states = await response.json();

                if (states && states.data && states.data.length > 0) {
                    hideOptionList();
                    optionList.classList.remove('autocomplete-component__size-1');
                    optionList.classList.remove('autocomplete-component__size-2');
                    optionList.classList.remove('autocomplete-component__size-3');
                    optionList.classList.remove('autocomplete-component__size-4');
                    optionList.classList.remove('autocomplete-component__size-5');
                    optionList.classList.add('autocomplete-component__size-' + (states.data.length > 5 ? 5 : states.data.length));

                    states.data.forEach(state => {
                        const option = root.createElement('button');
                        option.classList.add('autocomplete-component__option');

                        option.addEventListener('click', (e) => {
                            input.value = e.target.innerText;
                            hideOptionList();
                            input.focus();
                        })
                        option.addEventListener('keydown', (e) => {
                            switch(e.key) {
                                case 'ArrowDown':
                                    e.preventDefault();
                                    if (e.target.nextElementSibling) {
                                        e.target.nextElementSibling.focus();
                                    } else {
                                        input.focus();
                                        input.value = tempValue;
                                    }
                                
                                    break;
                                case 'ArrowUp':
                                    e.preventDefault();
                                    if (e.target.previousElementSibling) {
                                        e.target.previousElementSibling.focus();
                                    } else {
                                        input.focus();
                                        input.value = tempValue;
                                    }
                                    
                                    break;
                            }
                            console.log('keydown', e)
                        });
                        option.innerText = state.name;
                        optionList.appendChild(option);
                        option.addEventListener('focus', (e) => {
                            input.value = e.target.innerText;
                            console.log('focus', e)
                        });
                    });
                    
                    showOptionList();
        
                } else {
                    throw new Error('No result');
                }
            } catch(err) {
                hideOptionList();
            }
        } else {
            hideOptionList();
        }
    });

    input.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                tempValue = input.value;
                optionList.firstChild && optionList.firstChild.focus();
                break;
            case 'ArrowUp':
                e.preventDefault();
                tempValue = input.value;
                optionList.lastChild && optionList.lastChild.focus();
                break;
        }
        console.log(e)
    })

    const addCloseButton = () => {
        if (!node.querySelector('.autocomplete-component__close-button')) {
            const closeButton = root.createElement('button');
            closeButton.classList.add('autocomplete-component__close-button');
            closeButton.innerHTML = 'x';
            closeButton.addEventListener('click', () => {
                input.value = '';
                hideOptionList();
                closeButton.parentNode.removeChild(closeButton);
                input.focus();
            });    
            node.appendChild(closeButton);    
        }
    };

    const hideOptionList = () => {
        optionList.innerHTML = '';
        optionList.classList.add('autocomplete-component--hide');
    };

    const showOptionList = () => {
        optionList.classList.remove('autocomplete-component--hide');
    };

    node.appendChild(input);

    node.appendChild(optionList);
    hideOptionList();
})(window.document);