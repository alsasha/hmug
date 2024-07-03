import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import hmugLogo from '../assets/HMUGLogo.svg';
import calendarIcon from '../assets/calendarIcon.svg';
import profileIcon from '../assets/profileIcon.svg';
import passport from '../assets/passport.svg';
import DateRangePickerComponent from './DateRangePickerComponent';
import Layout from "./Layout";
import moment from "moment/moment";
import CityInput from "./CityInput";
import {Classes, CountryType, CurrenciesValuesType, SelectedCityType, SelectedSectionsType} from "../types/types";
import Banners from "./Banners";
import ProfilePopup from "./ProfilePopup";
import CitizenshipPopup from "./CitizenshipPopup";
import {SectionTypeWrapper} from "./SectionTypeWrapper";
import {generateAiraloUrl, generateBookingUrl, getCityData, getUberUrl} from "../helpers/helpers";
import {currenciesWithCountries} from "../constants/currenciesWithCountries";
import {initialSectionTypesByClass} from "../constants/initialSectionTypes";
import {ConversionResult} from "../services/services";

type Props = {
    currenciesValues: CurrenciesValuesType
    setCurrenciesValues: (value: CurrenciesValuesType) => void
    fetchConversion: (
        amount?: number, fromCurrency?: string, toCurrency?: string
    ) => Promise<ConversionResult>
}

const Home = ({ currenciesValues, setCurrenciesValues, fetchConversion }: Props)  => {
    const [isResultState, setIsResultState] = useState(false)
    const [selectedCityData, setSelectedCityData] = useState<SelectedCityType | undefined>(undefined)
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const [selectedSections, setSelectedSections] = useState<SelectedSectionsType>(initialSectionTypesByClass[Classes.Economy])

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

    const [otherAmount, setOtherAmount] = useState(0)

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
        return currenciesWithCountries.find(({ name }) => name === citizenship?.name)
    }, [citizenship])

    const daysBetween = useMemo(() => {
        if (endDateSelected && startDateSelected) {
            return endDateSelected.diff(startDateSelected, 'days') + 1;
        }
        return 0
    }, [endDateSelected, startDateSelected])

    const totalAmountInDollars = useMemo(() => {
        const selectedTypes = Object.values(selectedSections)
        const totalAmountForOneDay =  Object.entries(selectedCityData?.sections || {}).reduce((acc, next) => {
            const [sectionTypeName, value] = next
            if (selectedTypes.includes(sectionTypeName)) {
                const amountValue = value === '—' ? 0 : value
                acc = acc + Number(amountValue)
            }
            return acc
        }, 0)
        return totalAmountForOneDay * daysBetween
    }, [selectedSections, selectedCityData, daysBetween])

    const otherAmountInCountryCurrency = useMemo(() => {
        const otherAmountInDollars = Math.round(otherAmount / (currenciesValues?.['USD']?.[personCurrency?.code || ''] || 1))
        return Math.round(otherAmountInDollars * (currenciesValues?.['USD']?.[selectedCityData?.currency?.code || ''] || 0))
    }, [otherAmount, currenciesValues, personCurrency, selectedCityData])

    const handleSubmit = () => {
        const cityExists = getCityData(inputValue);
        let hasError = false

        // todo check dates
        if (!cityExists) {
            hasError = true
            if (inputRef.current) {
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

    useEffect(() => {
        window.scrollTo(0, 0);
        if (isResultState) {
            document.body.style.overflow = 'scroll';
        } else {
            document.body.style.overflow = 'scroll';
        }
    }, [isResultState]); // Пустой массив зависимостей гарантирует, что этот эффект выполнится только один раз при монтировании

    const bookingUrl = useMemo(() => {
        const params = {
            city: selectedCityData?.city,
            region: '',
            country: selectedCityData?.country?.name,
            fromDate: startDateSelected?.format('YYYY-MM-DD'),
            toDate: endDateSelected?.format('YYYY-MM-DD'),
            adults: travelers,
            personCountryCode: citizenship?.country,
            personCurrency: personCurrency?.code
        }
        return generateBookingUrl(params);
    }, [selectedCityData, startDateSelected, endDateSelected, travelers, citizenship, personCurrency])

    const airaloUrl = useMemo(() => {
        const params = {
            country: selectedCityData?.country?.name,
        }
        return generateAiraloUrl(params)
    }, [selectedCityData, citizenship])

    const uberUrl = useMemo(() => {
        return getUberUrl({ countryCode: selectedCityData?.country?.country, langCode: citizenship?.country })
    }, [selectedCityData, citizenship])

    const onBookingClick = useCallback(() => {
        window.open(bookingUrl, '_blank')
    }, [bookingUrl])

    const onAiraloClick = useCallback(() => {
        window.open(airaloUrl, '_blank')
    }, [airaloUrl])

    const onUberClick = useCallback(() => {
        window.open(uberUrl, '_blank')
    }, [uberUrl])

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
                                    {selectedCityData?.city}
                                </div>
                                <div className="city-travel-info-top__left__subtitle">
                                    <span>
                                        {selectedCityData?.country?.flag}
                                    </span>
                                    <span>
                                        {selectedCityData?.country?.name}
                                    </span>
                                </div>
                            </div>
                            <div className="city-travel-info-top__right">
                                <div className="city-travel-info-top__right__title">
                                    {personCurrency?.symbol}
                                    {' '}
                                    {Math.round(totalAmountInDollars * (currenciesValues['USD'][personCurrency?.code || ''] || 0)) + otherAmount}
                                    {' '}
                                    {personCurrency?.code}
                                </div>
                                <div className="city-travel-info-top__right__subtitle">
                                    {selectedCityData?.currency?.symbol}
                                    {' '}
                                    {Math.round(totalAmountInDollars * (currenciesValues['USD'][selectedCityData?.currency?.code || ''] || 0)) + otherAmountInCountryCurrency}
                                    {' '}
                                    {selectedCityData?.currency?.code}
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

                {isResultState && <SectionTypeWrapper
                    personCurrency={personCurrency}
                    selectedCityData={selectedCityData}
                    selectedSections={selectedSections}
                    setSelectedSections={setSelectedSections}
                    daysBetween={daysBetween}
                    currenciesValues={currenciesValues}
                    otherAmount={otherAmount}
                    setOtherAmount={setOtherAmount}
                    otherAmountInCountryCurrency={otherAmountInCountryCurrency}
                    onBookingClick={onBookingClick}
                    onAiraloClick={onAiraloClick}
                    onUberClick={onUberClick}
                />}

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
                    setSelectedSections={setSelectedSections}
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
