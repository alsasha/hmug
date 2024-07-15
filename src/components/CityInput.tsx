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
            <div className={`city-input-container ${filteredCitiesAndCountries?.length && isShowFilteredCitiesAndCountries ? 'is-suggestions' : ''}`} ref={wrapperRef}>
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={onFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className={`city-input`}
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
                        <svg width="81" height="40" viewBox="0 0 81 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g mask="url(#mask0_2165_787)">
                                <path
                                    d="M38.8295 27.2974C37.0666 27.7238 35.4071 28.1378 33.7418 28.5241C32.0898 28.9073 30.4326 29.269 28.7754 29.6271C28.4925 29.6882 28.3425 29.8144 28.234 30.0793C27.7412 31.2867 27.2278 32.4873 26.7048 33.683C26.6398 33.833 26.4905 34.0198 26.3449 34.0568C24.9225 34.4225 23.4929 34.7592 22.0032 35.1194C22.143 34.4866 22.2691 33.8979 22.403 33.3101C22.7653 31.7131 23.1237 30.1152 23.5 28.5212C23.5628 28.2546 23.522 28.0693 23.3397 27.8565C21.8848 26.1608 20.4448 24.4532 18.944 22.6823C19.3952 22.5732 19.7913 22.4774 20.1873 22.3817C21.1609 22.1462 22.1383 21.9262 23.1051 21.667C23.4305 21.5792 23.6383 21.6579 23.8738 21.8569C24.8603 22.692 25.858 23.5154 26.8645 24.3285C26.9904 24.4306 27.2162 24.5212 27.3609 24.4844C30.7054 23.6221 34.0463 22.7415 37.4633 21.8444C34.9001 16.9459 32.3522 12.0791 29.7794 7.16111C29.9845 7.0979 30.1287 7.04396 30.2774 7.00803C31.6116 6.68264 32.9508 6.37697 34.2785 6.02867C34.6771 5.92412 34.9137 5.98942 35.1799 6.29445C38.8758 10.5261 42.5912 14.7412 46.2815 18.9768C46.599 19.3412 46.8678 19.4069 47.3354 19.2802C50.4058 18.4496 53.4904 17.6656 56.56 16.8317C57.4614 16.5864 58.3487 16.6024 59.1449 16.9699C60.1092 17.4147 60.6558 18.2555 60.8858 19.2772C61.236 20.8317 60.2172 22.7154 58.1066 23.1505C54.9584 23.7983 51.8287 24.5333 48.6857 25.2063C48.2754 25.2937 48.1058 25.4591 48.0114 25.8467C46.6858 31.3063 45.3383 36.7611 44.0149 42.2219C43.912 42.648 43.7144 42.8301 43.2798 42.9261C41.8154 43.2512 40.361 43.621 38.808 43.9966C38.8149 38.4493 38.8224 32.9627 38.83 27.2991L38.8295 27.2974Z"
                                    fill="#DDF344"/>
                            </g>
                        </svg>
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
