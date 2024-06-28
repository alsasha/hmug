import React, {useState, useRef, Ref, ChangeEvent} from 'react';
import './CityInput.css';
import DateRangePickerComponent from "./DateRangePickerComponent";
import {Classes} from "../types/types";
import './TravelersForm.scss'
import './SearchInput.scss'

type Props = {
    isOpen: boolean
    isClosing: boolean
    popupRef: Ref<HTMLDivElement>
    selectedClass: Classes
    setSelectedClass: (value: Classes) => void
    travelers: number
    setTravelers: (value: number) => void
    onDone: () => void
}

const CitizenshipPopup = ({ isOpen, isClosing, popupRef, onDone, selectedClass, setSelectedClass, travelers, setTravelers }: Props)  => {
    const [country, setCountry] = useState<string>('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (/^[a-zA-Zа-яА-Я\s-]*$/.test(value)) {
            setCountry(value);
        }
    };

    return (
        <div>
            {isOpen && (
                <div className={`popup profile-popup ${isClosing ? 'closing' : ''}`} ref={popupRef}>
                    <div className="popup-content">
                        <div className="travelers-form">
                            <h2>Citizenship</h2>
                            <div className="search-input-container">
                                <span className="search-icon">🔍</span>
                                <input
                                    type="text"
                                    value={country}
                                    onChange={handleChange}
                                    placeholder="Search"
                                    className="search-input"
                                />
                            </div>
                            <div className="travelers-input">
                                <div className="travelers-input-left">
                                    <span className="travelers-input-left-top">People</span>
                                    <span className="travelers-input-left-bottom">Multiply expenses by</span>
                                </div>
                            </div>
                            <div className="class-selector">
                            </div>
                        </div>
                    </div>

                    <button
                        className="popup-done-button popup-done-button-profile"
                        onClick={onDone}
                    >
                        Done
                    </button>
                </div>
            )}
        </div>
    );
};

export default CitizenshipPopup;
