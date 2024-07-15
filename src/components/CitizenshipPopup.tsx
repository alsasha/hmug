import React, {useState, Ref, useEffect, useMemo} from 'react';
import './CityInput.css';
import {CountryType} from "../types/types";
import './TravelersForm.scss'
import './SearchInput.scss'
import {countries} from "../constants/countries";

type Props = {
    isOpen: boolean
    isClosing: boolean
    popupRef: Ref<HTMLDivElement>
    citizenship: CountryType | null
    setCitizenship: (value: CountryType | null) => void
    onDone: () => void
}

const CitizenshipPopup = ({ isOpen, isClosing, popupRef, onDone, citizenship, setCitizenship }: Props)  => {
    const [country, setCountry] = useState<string>('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (/^[a-zA-Zа-яА-Я\s-]*$/.test(value)) {
            setCountry(value);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setCountry('')
        }
    }, [isOpen]);

    const filteredCountries = useMemo(() => {
        const normalizedCountry = country.trim().toLowerCase();
        return countries.filter(countryObj => countryObj.name.toLowerCase().includes(normalizedCountry));
    }, [country])

    return (
        <div>
            {isOpen && (
                <div className={`popup citizenship-popup ${isClosing ? 'closing' : ''}`} ref={popupRef}>
                    <div className="popup-content">
                        <div className="travelers-form">
                            <h2>Citizenship</h2>
                            <div className="search-input-container">
                                <span className="search-icon">
                                    <svg width="17" height="18" viewBox="0 0 17 18" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M15.2929 17.2071C15.6834 17.5976 16.3166 17.5976 16.7071 17.2071C17.0976 16.8166 17.0976 16.1834 16.7071 15.7929L15.2929 17.2071ZM12 7.5C12 10.2614 9.76142 12.5 7 12.5V14.5C10.866 14.5 14 11.366 14 7.5H12ZM7 12.5C4.23858 12.5 2 10.2614 2 7.5H0C0 11.366 3.13401 14.5 7 14.5V12.5ZM2 7.5C2 4.73858 4.23858 2.5 7 2.5V0.5C3.13401 0.5 0 3.63401 0 7.5H2ZM7 2.5C9.76142 2.5 12 4.73858 12 7.5H14C14 3.63401 10.866 0.5 7 0.5V2.5ZM10.5355 12.4497L15.2929 17.2071L16.7071 15.7929L11.9497 11.0355L10.5355 12.4497Z"
                                            fill="#9DA9B7"/>
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    value={country}
                                    onChange={handleChange}
                                    placeholder="Search"
                                    className="search-input"
                                />
                            </div>
                        </div>
                        {filteredCountries.length ? (
                            <div className="country-select">
                                <ul>
                                    {filteredCountries.map((item) => {
                                        return (
                                            <li onClick={() => {
                                                setCitizenship(item)
                                                onDone()
                                            }} key={`${item.country}${item.name.replaceAll(' ', '')}`} className="country-select-item">
                                                <div>{item.flag}</div>
                                                <div>{item.name}</div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        ) : (
                            <div className="empty-countries">
                                Are you sure it’s a real place?</div>
                        )}
                    </div>

                    <button
                        className="popup-close-button"
                        onClick={onDone}
                    >
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="14" cy="14" r="14" fill="#E7EBEA"/>
                            <path
                                d="M17.5715 8.99981C17.966 8.60531 18.6056 8.60531 19 8.99981C19.3945 9.3943 19.3945 10.0339 19 10.4284L10.4285 18.9999C10.034 19.3944 9.39444 19.3944 8.99995 18.9999C8.60546 18.6054 8.60546 17.9658 8.99995 17.5713L17.5715 8.99981Z"
                                fill="#8BA19B"/>
                            <path
                                d="M19 17.5713C19.3945 17.9658 19.3945 18.6054 19 18.9999C18.6056 19.3944 17.966 19.3944 17.5715 18.9999L8.99995 10.4284C8.60546 10.0339 8.60546 9.3943 8.99995 8.99981C9.39444 8.60531 10.034 8.60531 10.4285 8.99981L19 17.5713Z"
                                fill="#8BA19B"/>
                        </svg>

                    </button>
                </div>
            )}
        </div>
    );
};

export default CitizenshipPopup;
