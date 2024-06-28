import React, {useEffect, useRef, useState, useMemo} from 'react';
import hmugLogo from '../assets/HMUGLogo.svg';
import calendarIcon from '../assets/calendarIcon.svg';
import profileIcon from '../assets/profileIcon.svg';
import passport from '../assets/passport.svg';
import DateRangePickerComponent from './DateRangePickerComponent';
import Layout from "./Layout";
import moment from "moment/moment";
import CityInput from "./CityInput";
import {Classes, CountryType} from "../types/types";
import Banners from "./Banners";
import ProfilePopup from "./ProfilePopup";
import CitizenshipPopup from "./CitizenshipPopup";
import {SectionTypeWrapper} from "./SectionTypeWrapper";
import {getCityData} from "../helpers/helpers";
import {currencies} from "../constants/currencies";

// todo добавить при клике на самолет чтобы дергались кнопки тоже если там что-то не заполнено
const Home: React.FC = () => {
    const [isResultState, setIsResultState] = useState(false)
    const [selectedCityData, setSelectedCityData] = useState<{ section: Record<string, string>, currency: any} | null>(null)
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isProfileClosing, setIsProfileClosing] = useState(false);

    const [isCitizenshipOpen, setIsCitizenshipOpen] = useState(false);
    const [isCitizenshipClosing, setIsCitizenshipClosing] = useState(false);

    const popupRef = useRef<HTMLDivElement>(null);
    const popupProfileRef = useRef<HTMLDivElement>(null);
    const popupCitizenshipRef = useRef<HTMLDivElement>(null);

    const [startDateSelected, setStartDateSelected] = useState<moment.Moment | null>(null);
    const [endDateSelected, setEndDateSelected] = useState<moment.Moment | null>(null);

    const [startDate, setStartDate] = useState<moment.Moment | null>(null);
    const [endDate, setEndDate] = useState<moment.Moment | null>(null);
    const [travelers, setTravelers] = useState(1)
    const [selectedClass, setSelectedClass] = useState<Classes>(Classes.Economy)

    const [citizenship, setCitizenship] = useState<CountryType | null>(null)

    const [inputValue, setInputValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const datesRef = useRef<HTMLDivElement>(null);
    const citizenshipRef = useRef<HTMLDivElement>(null);

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

    const personCurrency = useMemo(() => {
        return currencies.find(({ name }) => name === citizenship?.name)?.symbol
    }, [citizenship])

    const handleSubmit = () => {
        const cityExists = getCityData(inputValue);
        let hasError = false

        // todo check dates
        if (!cityExists) {
            hasError = true
            if (inputRef.current) {
                console.log('===>1232323')
                inputRef.current.classList.add('shake');
                setTimeout(() => {
                    inputRef.current && inputRef.current.classList.remove('shake');
                }, 500);
            }
            // todo нужно ли ?
            // setErrorMessage('City not found');
        }

        if (!citizenship) {
            hasError = true

            if (citizenshipRef.current) {
                citizenshipRef.current.classList.add('shake');
                setTimeout(() => {
                    citizenshipRef.current && citizenshipRef.current.classList.remove('shake');
                }, 500);
            }
        }

        if (!startDateSelected || !endDateSelected) {
            hasError = true
            if (datesRef.current) {
                datesRef.current.classList.add('shake');
                setTimeout(() => {
                    datesRef.current && datesRef.current.classList.remove('shake');
                }, 500);
            }
        }

        if (!hasError) {
            setErrorMessage('');
            setIsResultState(true)
            // @ts-ignore
            setSelectedCityData(cityExists)
        }
    };

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

    const toggleCitizenshipPopup = () => {
        if (isCitizenshipOpen) {
            setIsCitizenshipClosing(true);
            setTimeout(() => {
                setIsCitizenshipOpen(false);
                setIsCitizenshipClosing(false);
            }, 500); // Длительность анимации закрытия
        } else {
            setIsCitizenshipOpen(true);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            togglePopup();
        }
    };

    const handleProfileClickOutside = (event: MouseEvent) => {
        if (popupProfileRef.current && !popupProfileRef.current.contains(event.target as Node)) {
            toggleProfilePopup();
        }
    };

    const handleCitizenshipClickOutside = (event: MouseEvent) => {
        if (popupCitizenshipRef.current && !popupCitizenshipRef.current.contains(event.target as Node)) {
            toggleCitizenshipPopup();
        }
    };

    const handleClear = () => {
        // todo спросить как должно работать ?
        setInputValue('')
        setIsResultState(false)
    }

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

    useEffect(() => {
        if (isCitizenshipOpen) {
            document.addEventListener('mousedown', handleCitizenshipClickOutside);
        } else {
            document.removeEventListener('mousedown', handleCitizenshipClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleCitizenshipClickOutside);
        };
    }, [isCitizenshipOpen]);

    const onCloseDatesDone = () => {
        togglePopup();
    }

    // @ts-ignore
    return (
        <Layout>
            <div className={`home-wrapper ${isResultState ? 'home-wrapper-is-result' : ''}`}>
                <header className="header-wrapper">
                    <img className="header-logo" src={hmugLogo} alt="HTUG Logo"/>
                    {!isResultState && (
                        <>
                            <h1 className="header-title semi-bold-weight">Travel calculator</h1>
                            <p className="header-subtitle">Let us do the math</p>
                        </>
                    )}

                    <CityInput
                        inputRef={inputRef}
                        inputValue={inputValue}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        errorMessage={errorMessage}
                        isResultState={isResultState}
                        handleClear={handleClear}
                    />
                    <div className="header-icon-buttons">
                        <div ref={datesRef}
                             className={`header-icon-button header-icon-button-dates ${startDateSelected && endDateSelected ? 'header-icon-button-dates-selected' : ''}`}
                             onClick={togglePopup}>
                            <img src={calendarIcon} alt="calendar icon"/>
                            <span className="header-icon-buttons-selected-dates">{startDateSelected && endDateSelected ? (
                                    <>
                                        <span>{startDateSelected.format('D MMM')}</span>
                                            <span className="divider"/>
                                        <span>
                                        {endDateSelected.format('D MMM')}
                                        </span>
                                    </>
                                )
                                : 'Dates'}
                            </span>
                        </div>
                        <div onClick={toggleProfilePopup} className="header-icon-button header-icon-button-profile">
                            <img src={profileIcon} alt="profile icon"/>
                            <span>{travelers}, {selectedClass}</span>
                        </div>
                        <div ref={citizenshipRef} onClick={toggleCitizenshipPopup}
                             className={`header-icon-button header-icon-button-citizenship ${citizenship ? 'header-icon-button-citizenship-selected' : ''}`}
                        >
                            <img src={passport} alt="passport icon"/>
                            <span>{citizenship ? citizenship.flag : 'Citizenship'}</span>
                        </div>
                    </div>
                    {isResultState && (
                        <div className="city-travel-info">
                        <div className="city-travel-info-top">
                            <div className="city-travel-info-top__left">
                                <div className="city-travel-info-top__left__title">
                                    Milan
                                </div>
                                <div className="city-travel-info-top__left__subtitle">
                                    <span>
                                       🇮🇹
                                    </span>
                                    <span>
                                        Italy
                                    </span>
                                </div>
                            </div>
                            <div className="city-travel-info-top__right">
                                <div className="city-travel-info-top__right__title">
                                    ₾ 5 626 GEL
                                </div>
                                <div className="city-travel-info-top__right__subtitle">
                                    € 1 946 EUR
                                </div>
                            </div>
                        </div>
                        <div className="city-travel-info-bottom">
                            <div className="city-travel-info-bottom-left">
                                Passport control
                            </div>
                            <div className="city-travel-info-bottom-right">
                                Visa-free | 90 days
                            </div>
                        </div>
                    </div>)}
                </header>

                {!isResultState && <Banners/>}

                {isResultState && <SectionTypeWrapper personCurrency={personCurrency} selectedCityData={selectedCityData} />}

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

                <CitizenshipPopup

                 isOpen={isCitizenshipOpen}
                    isClosing={isCitizenshipClosing}
                    popupRef={popupCitizenshipRef}
                    citizenship={citizenship}
                     setCitizenship={setCitizenship}
                    onDone={toggleCitizenshipPopup}
                />
            </div>
        </Layout>
    );
};

export default Home;
