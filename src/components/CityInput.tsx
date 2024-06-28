import React, {useState, useRef, Ref, ChangeEvent} from 'react';
import './CityInput.css';
import {cities} from "../constants/cities"; // Импортируем файл CSS
import planeIcon from '../assets/planeIcon.svg';

type Props = {
    inputRef: Ref<HTMLInputElement>
    inputValue: string
    handleChange: (val: ChangeEvent<HTMLInputElement>) => void
    handleSubmit: () => void
    errorMessage: string
}

const CityInput = ({ inputRef, inputValue, handleChange, handleSubmit, errorMessage }: Props)  => {
    // const [inputValue, setInputValue] = useState('');
    // const [errorMessage, setErrorMessage] = useState('');
    // const inputRef = useRef<HTMLInputElement>(null);
    //
    // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = event.target.value;
    //     // todo вопрос какие можно вводить - ?
    //     if (/^[a-zA-Zа-яА-Я\s-]*$/.test(value)) {
    //         setInputValue(value);
    //         if (errorMessage) {
    //             setErrorMessage('')
    //         }
    //     }
    // };
    //
    // const handleSubmit = () => {
    //     const normalizedCity = inputValue.trim().toLowerCase();
    //     const cityExists = cities.some(cityObj => cityObj.city === normalizedCity);
    //
    //     if (!cityExists) {
    //         if (inputRef.current) {
    //             inputRef.current.classList.add('shake');
    //             setTimeout(() => {
    //                 inputRef.current && inputRef.current.classList.remove('shake');
    //             }, 500);
    //         }
    //         // todo нужно ли ?
    //         // setErrorMessage('City not found');
    //     } else {
    //         setErrorMessage('');
    //         alert(`Город ${inputValue} найден!`);
    //     }
    // };

    return (
        <>
            <div className="city-input-container">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="city-input"
                />
                <button onClick={handleSubmit} className="submit-button">
                    <img src={planeIcon} alt="plane icon"/>
                </button>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </>
    );
};

export default CityInput;
