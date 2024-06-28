import React, {useEffect, useRef, useState} from 'react';
import hmugLogo from '../assets/HMUGLogo.svg';
import calendarIcon from '../assets/calendarIcon.svg';
import profileIcon from '../assets/profileIcon.svg';
import passport from '../assets/passport.svg';
import DateRangePickerComponent from './DateRangePickerComponent';
import Layout from "./Layout";
import moment from "moment/moment";
import CityInput from "./CityInput";
import {Classes} from "../types/types";
import Banners from "./Banners";
import {cities} from "../constants/cities";
import ProfilePopup from "./ProfilePopup";

// todo добавить при клике на самолет чтобы дергались кнопки тоже если там что-то не заполнено
const Home: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isProfileClosing, setIsProfileClosing] = useState(false);

    const popupRef = useRef<HTMLDivElement>(null);
    const popupProfileRef = useRef<HTMLDivElement>(null);
    const [startDateSelected, setStartDateSelected] = useState<moment.Moment | null>(null);
    const [endDateSelected, setEndDateSelected] = useState<moment.Moment | null>(null);

    const [startDate, setStartDate] = useState<moment.Moment | null>(null);
    const [endDate, setEndDate] = useState<moment.Moment | null>(null);
    const [travelers, setTravelers] = useState(1)
    const [selectedClass, setSelectedClass] = useState<Classes>(Classes.Economy)


    const [inputValue, setInputValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const datesRef = useRef<HTMLDivElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        // todo вопрос какие можно вводить - ?
        if (/^[a-zA-Zа-яА-Я\s-]*$/.test(value)) {
            setInputValue(value);
            if (errorMessage) {
                setErrorMessage('')
            }
        }
    };

    const handleSubmit = () => {
        const normalizedCity = inputValue.trim().toLowerCase();
        const cityExists = cities.some(cityObj => cityObj.city === normalizedCity);
        let hasError = false

        // todo check dates
        if (!cityExists) {
            hasError = true
            if (datesRef.current) {
                datesRef.current.classList.add('shake');
                setTimeout(() => {
                    datesRef.current && datesRef.current.classList.remove('shake');
                }, 500);
            }
            // todo нужно ли ?
            // setErrorMessage('City not found');
        }

        if (!startDateSelected || !endDateSelected) {
            hasError = true
            if (inputRef.current) {
                inputRef.current.classList.add('shake');
                setTimeout(() => {
                    inputRef.current && inputRef.current.classList.remove('shake');
                }, 500);
            }
        }

        if (!hasError) {
            setErrorMessage('');
            alert(`Город ${inputValue} найден!`);
        }
    };
    console.log('===>startDateSelected', startDateSelected)
    console.log('===>endDateSelected', endDateSelected)
    const togglePopup = () => {
        if (isOpen) {
            setIsClosing(true);
            setTimeout(() => {
                setIsOpen(false);
                setIsClosing(false);
                setStartDate(null)
                setEndDate(null)
            }, 500); // Длительность анимации закрытия
        } else {
            setIsOpen(true);
        }
    };

    const toggleProfilePopup = () => {
        if (isProfileOpen) {
            setIsProfileClosing(true);
            setTimeout(() => {
                setIsProfileOpen(false);
                setIsProfileClosing(false);
            }, 500); // Длительность анимации закрытия
        } else {
            setIsProfileOpen(true);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        console.log('===>handleClickOutside')
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            togglePopup();
        }
    };

    const handleProfileClickOutside = (event: MouseEvent) => {
        if (popupProfileRef.current && !popupProfileRef.current.contains(event.target as Node)) {
            toggleProfilePopup();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);


    useEffect(() => {
        if (isProfileOpen) {
            document.addEventListener('mousedown', handleProfileClickOutside);
        } else {
            document.removeEventListener('mousedown', handleProfileClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleProfileClickOutside);
        };
    }, [isProfileOpen]);

    console.log('===>startDate', startDate)
    console.log('===>endDate', endDate)

    const onCloseDatesDone = () => {
        togglePopup();
    }

    //  inputRef: Ref<HTMLInputElement>
    //     inputValue: string
    //     handleChange: (val: ChangeEvent<HTMLInputElement>) => void
    //     handleSubmit: () => void
    //     errorMessage: string
    // @ts-ignore
    return (
        <Layout>
            <div className="home-wrapper">
                <header className="header-wrapper">
                    <img className="header-logo" src={hmugLogo} alt="HTUG Logo"/>
                    <h1 className="header-title semi-bold-weight">Travel calculator</h1>
                    <p className="header-subtitle">Let us do the math</p>
                    <CityInput
                        inputRef={inputRef}
                        inputValue={inputValue}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        errorMessage={errorMessage}
                    />
                    <div className="header-icon-buttons">
                        <div ref={datesRef} className="header-icon-button" onClick={togglePopup}>
                            <img src={calendarIcon} alt="calendar icon"/>
                            <span className="header-icon-buttons-selected-dates">{startDateSelected && endDateSelected ? (
                                    <>
                                        <span>{startDateSelected.format('D MMM')}</span>
                                        <div className="divider" />
                                        <span>{endDateSelected.format('D MMM')}</span>
                                    </>
                                )
                                : 'Dates'}
                            </span>
                        </div>
                        <div onClick={toggleProfilePopup} className="header-icon-button">
                            <img src={profileIcon} alt="profile icon"/>
                            <span>{travelers}, {selectedClass}</span>
                        </div>
                        <div className="header-icon-button">
                            <img src={passport} alt="passport icon"/>
                            <span>Citizenship</span>
                        </div>
                    </div>
                </header>

                <Banners />

                <input
                    type="text"
                    readOnly
                    value={startDate && endDate ? `${startDate.format('D MMM')} - ${endDate.format('D MMM')}` : 'Select Date Range'}
                    onClick={togglePopup}
                />
                <div>
                    {isOpen && (
                        <div className={`popup ${isClosing ? 'closing' : ''}`} ref={popupRef}>
                            <div className="popup-content">
                                {/*<button onClick={togglePopup} className="close-button">Close</button>*/}
                                <DateRangePickerComponent
                                    startDate={startDate} setStartDate={setStartDate}
                                    endDate={endDate} setEndDate={setEndDate}
                                    setStartDateSelected={setStartDateSelected}
                                    setEndDateSelected={setEndDateSelected}
                                    togglePopup={togglePopup}
                                />
                            </div>

                            <button
                                className="popup-done-button popup-done-button-dates"
                                onClick={onCloseDatesDone}
                            >
                                Done
                            </button>
                        </div>
                    )}
                </div>

                <ProfilePopup
                    isOpen={isProfileOpen}
                    isClosing={isProfileClosing}
                    popupRef={popupProfileRef}
                    selectedClass={selectedClass}
                    setSelectedClass={setSelectedClass}
                    travelers={travelers}
                    setTravelers={setTravelers}
                    onDone={toggleProfilePopup}
                />
            </div>
        </Layout>
    );
};

export default Home;
