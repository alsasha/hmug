import React, {useState, useRef, useEffect, Ref, ChangeEvent} from 'react';
import './CityInput.css';
import {cities} from "../constants/cities"; // Импортируем файл CSS
import planeIcon from '../assets/planeIcon.svg';

type Props = {
    inputRef: Ref<HTMLInputElement>
    inputValue: string
    handleChange: (val: ChangeEvent<HTMLInputElement>) => void
    handleSubmit: () => void
    errorMessage: string
    isResultState: boolean
    isShowFilteredCitiesAndCountries: boolean
    setIsShowFilteredCitiesAndCountries: (val: boolean) => void
    handleClear: () => void
    handleClearCity: () => void
    filteredCitiesAndCountries: Record<string, string | number>[]
    handleSelectCity: (value: Record<string, string | number>) => void
    handleFocus: () => void
}

const citiesPlaceholder = [
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix",
    "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"
];

const CityInput = ({ inputRef, inputValue, handleChange, handleSubmit, errorMessage, isResultState, handleClear, handleClearCity, filteredCitiesAndCountries, handleSelectCity, handleFocus, isShowFilteredCitiesAndCountries, setIsShowFilteredCitiesAndCountries }: Props)  => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmit()
        }
    };

    const [placeholder, setPlaceholder] = useState('');
    const intervalRef = useRef<NodeJS.Timeout | null>(null);


    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
            setIsShowFilteredCitiesAndCountries(false)
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const stopPlaceholderAnimation = () => {
        // @ts-ignore
            clearInterval(intervalRef?.current);
            intervalRef.current = null;
        setPlaceholder('');
    };

    // console.log('===>placeholder', placeholder)

    const onFocus = () => {
        // console.log('===>onFocus')
        // stopPlaceholderAnimation();
        handleFocus()
    }

    const handleBlur = () => {
        // console.log('===>handleBlur')
        console.log('===>handleBlur inputValue', inputValue)
        if (!inputValue && !intervalRef.current) {
            startPlaceholderAnimation();
        }
    };

    const startPlaceholderAnimation = () => {
        console.log('===>startPlaceholderAnimation')
        let cityIndex = 0;
        let charIndex = 0;
        let adding = true;

        intervalRef.current = setInterval(() => {
            if (adding) {
                setPlaceholder(prev => prev + citiesPlaceholder[cityIndex][charIndex]);
                charIndex += 1;
                if (charIndex === citiesPlaceholder[cityIndex].length) {
                    adding = false;
                }
            } else {
                setPlaceholder(prev => {
                    if (prev.length === 0) {
                        charIndex = 0;
                        cityIndex = (cityIndex + 1) % citiesPlaceholder.length;
                        adding = true;
                        return '';
                    }
                    return prev.slice(0, -1);
                });
            }
        }, 150);
    };

    useEffect(() => {
        if (!inputValue) {
            startPlaceholderAnimation();
        } else {
            stopPlaceholderAnimation();
        }
    }, [inputValue]);

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <>
            <div className="city-input-container" ref={wrapperRef}>
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={onFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className={`city-input ${filteredCitiesAndCountries?.length && isShowFilteredCitiesAndCountries ? 'is-suggestions' : ''} `}
                />
                {isResultState ? (
                    <>
                        <button onClick={handleClear} className="back-button">
                            <svg width="11" height="19" viewBox="0 0 11 19" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M4.23486 9.5L10.4916 3.05421C11.1695 2.35581 11.1695 1.22219 10.4916 0.523795C9.81366 -0.174598 8.7133 -0.174598 8.03539 0.523794L0.480182 8.30733C-0.160061 8.96693 -0.160061 10.0348 0.480182 10.6927L8.03539 18.4762C8.7133 19.1746 9.81366 19.1746 10.4916 18.4762C11.1695 17.7778 11.1695 16.6442 10.4916 15.9458L4.23486 9.5Z"
                                    fill="#91918F"/>
                            </svg>
                        </button>
                        <button onClick={handleClearCity} className="clear-button">
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <circle cx="14" cy="14" r="14" fill="#E7EBEA"/>
                                <path
                                    d="M17.5715 8.99981C17.966 8.60531 18.6056 8.60531 19 8.99981C19.3945 9.3943 19.3945 10.0339 19 10.4284L10.4285 18.9999C10.034 19.3944 9.39444 19.3944 8.99995 18.9999C8.60546 18.6054 8.60546 17.9658 8.99995 17.5713L17.5715 8.99981Z"
                                    fill="#8BA19B"/>
                                <path
                                    d="M19 17.5713C19.3945 17.9658 19.3945 18.6054 19 18.9999C18.6056 19.3944 17.966 19.3944 17.5715 18.9999L8.99995 10.4284C8.60546 10.0339 8.60546 9.3943 8.99995 8.99981C9.39444 8.60531 10.034 8.60531 10.4285 8.99981L19 17.5713Z"
                                    fill="#8BA19B"/>
                            </svg>
                        </button>
                    </>
                ) : (
                    <button onClick={handleSubmit} className="submit-button">
                        <img src={planeIcon} alt="plane icon"/>
                    </button>
                )}
                {Boolean(filteredCitiesAndCountries?.length) && isShowFilteredCitiesAndCountries && (
                    <ul className="suggestions-list">
                        {filteredCitiesAndCountries.map((suggestion, index) => (
                            <li key={index} onClick={() => handleSelectCity(suggestion)} className="suggestion-item">
                                {suggestion.Destination}, {suggestion.Country}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </>
    );
};

export default CityInput;
