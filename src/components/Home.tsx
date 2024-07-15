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
import {
    generateAiraloUrl,
    generateBookingUrl,
    getCitiesOrCountriesFiltered,
    getCityData,
    getUberUrl
} from "../helpers/helpers";
import {currenciesWithCountries} from "../constants/currenciesWithCountries";
import {initialSectionTypesByClass} from "../constants/initialSectionTypes";
import {ConversionResult} from "../services/services";
import {SURVEY_LINK} from "../constants/url";
import {SUBTITLES} from "../constants/commons";
import TabSwitcher from "./Tabs";

type Props = {
    currenciesValues: CurrenciesValuesType
    setCurrenciesValues: (value: CurrenciesValuesType) => void
    fetchConversion: (
        amount?: number, fromCurrency?: string, toCurrency?: string
    ) => Promise<ConversionResult>
    activeTab: 'summary' | 'converter'
    setActiveTab: (value: 'summary' | 'converter') => void
    subtitle: string
    setSubtitle: (value: string) => void
}

const Home = ({ currenciesValues, setCurrenciesValues, fetchConversion, activeTab, setActiveTab, subtitle, setSubtitle }: Props)  => {
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

    const [filteredCitiesAndCountries, setFilteredCitiesAndCountries] = useState<Record<string, string | number>[]>([])
    const [isShowFilteredCitiesAndCountries, setIsShowFilteredCitiesAndCountries] = useState(false)

    const onChangeSubtitleValue = () => {
        const newValue = (Number(subtitle) + 1)
        if (newValue > 3) {
            setSubtitle('1')
        } else {
            setSubtitle(newValue.toString())
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        // todo вопрос какие можно вводить - ?
        if (/^[a-zA-Zа-яА-Я\s-]*$/.test(value)) {
            setInputValue(value);
            const citiesOrCountries = getCitiesOrCountriesFiltered(value)
            setFilteredCitiesAndCountries(citiesOrCountries)
            setIsShowFilteredCitiesAndCountries(true)
            if (errorMessage) {
                setErrorMessage('')
            }
        }
    };

    const handleSelectCity = (value: Record<string, string | number>) => {
        console.log('value', value)
        setInputValue(value.Destination.toString() || '');
        setFilteredCitiesAndCountries([])
        setIsShowFilteredCitiesAndCountries(false)
    }

    const handleFocusCityInput = () => {
        setIsShowFilteredCitiesAndCountries(true)
    }

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
            onChangeSubtitleValue()
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
        setFilteredCitiesAndCountries([])
        setIsShowFilteredCitiesAndCountries(false)
        setIsResultState(false)
        onChangeSubtitleValue()
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

    const onHelperLinkClick = () => {
        window.open(SURVEY_LINK, '_blank')
    }

    // @ts-ignore
    return (
        <Layout>
            <div className={`home-wrapper ${isResultState ? 'home-wrapper-is-result' : ''}`}>
                <header className="header-wrapper">
                    <div className="header-wrapper-logo-wrapper">
                        <img className="header-logo" src={hmugLogo} alt="HTUG Logo"/>
                        <div className="header-logo-helper-link" onClick={onHelperLinkClick}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <circle cx="10" cy="10" r="10" fill="#FEFEFE"/>
                                <path
                                    d="M10.2571 11.4235H8.94694V11.1059C8.94694 10.7529 9.01633 10.4784 9.1551 10.2824C9.29388 10.0784 9.53878 9.89412 9.8898 9.72941L10.6245 9.37647C10.951 9.21961 11.2082 9.07059 11.3959 8.92941C11.5837 8.78039 11.6776 8.55686 11.6776 8.25882C11.6776 8.03137 11.6367 7.83529 11.5551 7.67059C11.4735 7.50588 11.3184 7.38039 11.0898 7.29412C10.8694 7.2 10.551 7.15294 10.1347 7.15294C9.66122 7.15294 9.2898 7.20392 9.02041 7.30588C8.75918 7.40784 8.57551 7.56078 8.46939 7.76471C8.36327 7.96863 8.3102 8.23137 8.3102 8.55294V8.72941H7V8.54118C7 8.07059 7.1102 7.64706 7.33061 7.27059C7.55918 6.88627 7.90612 6.58039 8.37143 6.35294C8.8449 6.11765 9.44898 6 10.1837 6C10.8531 6 11.3918 6.09804 11.8 6.29412C12.2163 6.48235 12.5184 6.7451 12.7061 7.08235C12.902 7.41176 13 7.78039 13 8.18824C13 8.55686 12.9184 8.87059 12.7551 9.12941C12.6 9.38039 12.4041 9.59216 12.1673 9.76471C11.9306 9.93725 11.6857 10.0824 11.4327 10.2L10.7224 10.5059C10.5429 10.5922 10.4204 10.6824 10.3551 10.7765C10.2898 10.8627 10.2571 10.9804 10.2571 11.1294V11.4235ZM10.3673 14H8.87347V12.2588H10.3673V14Z"
                                    fill="#006659"/>
                            </svg>
                        </div>
                    </div>
                    {!isResultState && (
                        <>
                            <h1 className="header-title semi-bold-weight">Travel calculator</h1>
                            <p className="header-subtitle">{SUBTITLES[subtitle]}</p>
                        </>
                    )}

                    <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

                    <CityInput
                        inputRef={inputRef}
                        inputValue={inputValue}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        errorMessage={errorMessage}
                        isResultState={isResultState}
                        handleClear={handleClear}
                        filteredCitiesAndCountries={filteredCitiesAndCountries}
                        handleSelectCity={handleSelectCity}
                        handleFocus={handleFocusCityInput}
                        isShowFilteredCitiesAndCountries={isShowFilteredCitiesAndCountries}
                        setIsShowFilteredCitiesAndCountries={setIsShowFilteredCitiesAndCountries}
                    />
                    <div className="header-icon-buttons">
                        <div ref={datesRef}
                             className={`header-icon-button header-icon-button-dates ${startDateSelected && endDateSelected ? 'header-icon-button-dates-selected' : ''}`}
                             onClick={togglePopup}>
                            <img src={calendarIcon} alt="calendar icon"/>
                            <span
                                className="header-icon-buttons-selected-dates">{startDateSelected && endDateSelected ? (
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
