import React, {useState, useMemo, ChangeEvent, useRef} from 'react';
import './AccommodationDropdown.scss';
import {
    CurrenciesValuesType,
    CurrencyType,
    SectionTypes,
    SelectedCityType,
    SelectedSectionsType
} from "../types/types";

const accommodationTypes = [
    'Hostel',
    '2-Star Hotel',
    '3-Star Hotel',
    '4-Star Hotel',
    '5-Star Hotel',
    'Economy Airbnb',
    'Middle Class Airbnb',
    'Fancy living Airbnb'
];

type Props = {
    title: string
    icon: string
    description: string
    subtitles: { name: string, siteType: string }[]
    siteType?: string
    siteUrl?: string
    svg?: React.ReactNode
    selectedCityData?: SelectedCityType
    personCurrency: CurrencyType | null
    selectedSections?: SelectedSectionsType
    setSelectedSections: (value: SelectedSectionsType) => void
    daysBetween: number
    currenciesValues: CurrenciesValuesType
    otherAmount: number
    otherAmountInCountryCurrency: number
    setOtherAmount: (value: number) => void
    onBookingClick: () => void
    onAiraloClick: () => void
    onUberClick: () => void
}

const AccommodationDropdown = ({
    title, icon, description,
    subtitles, siteType, siteUrl, svg, selectedCityData,
    personCurrency, selectedSections, setSelectedSections,
    daysBetween, currenciesValues, otherAmount, setOtherAmount, otherAmountInCountryCurrency,
    onBookingClick, onAiraloClick, onUberClick
}: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [width, setWidth] = useState(12);

    const widthRef = useRef<HTMLDivElement>(null)

    const isOther = title === 'Other expenses'
    const toggleDropdown = () => {
        if (isOther) {
            return
        }
        setIsOpen(!isOpen);
    };

    const handleTypeClick = (type: string) => {
        // @ts-ignore
        setSelectedSections((prev: SelectedSectionsType) => {
            return ({...prev, [title as SectionTypes]: type}) as SelectedSectionsType
        })
    };

    const onOpenSite = () => {
        if (siteType === 'booking') {
            onBookingClick()
        }
        if (siteType === 'Uber') {
            onUberClick()
        }
        if (siteType === 'Airalo') {
            onAiraloClick()
        }
    }

    const sectionAmountInDollars = useMemo(() => {
        const selectedType = selectedSections?.[title as SectionTypes]
        if (selectedType) {
            const res = selectedCityData?.sections?.[selectedType] === '—' ? 0 : selectedCityData?.sections?.[selectedType]
            return Number(res || 0)
        }
        return 0
    }, [selectedSections, title])

    const amountForAllDaysInDollars = sectionAmountInDollars * daysBetween

    const dropDownPrice = Math.round(amountForAllDaysInDollars * (currenciesValues['USD'][personCurrency?.code || ''] || 0))

    const handleOtherChange = (e: ChangeEvent<HTMLInputElement>) => {
        const numericRegex = /^[0-9]+$/;
        const value = e.target.value
        const scientificNotationRegex = /[eE]/;

        if (numericRegex.test(value) && !scientificNotationRegex.test(value) || value === '') {
            setOtherAmount(Number(value))
            if (widthRef.current) {
                widthRef.current.innerText = `${Number(value)}`
                setWidth(widthRef?.current?.offsetWidth || 12)
            }
        }
    }

    return (
        <div className="accommodation-dropdown">
            <div className="dropdown-header" onClick={toggleDropdown}>
                <div className="dropdown-header-top">
                    <span className="dropdown-title">
                        <span>
                            {icon}
                        </span>
                        <span>
                            {title}
                        </span>
                    </span>
                    {isOther ? (
                        <span className={`dropdown-price ${isOther ? 'dropdown-price-isOther' : ''}`}>
                            <span>
                                {personCurrency?.symbol === '₽' ? (
                                    <svg width="12" height="12" viewBox="0 0 49 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M17.7931 35.2919H29.6316C33.2281 35.2919 36.425 34.6175 39.2223 33.2688C42.0196 31.8701 44.1924 29.872 45.7409 27.2744C47.3394 24.6269 48.1386 21.4299 48.1386 17.6834C48.1386 13.9369 47.3394 10.7649 45.7409 8.16734C44.1924 5.51982 42.0196 3.49672 39.2223 2.09803C36.425 0.699344 33.2281 0 29.6316 0H17.7931H10.5252H6.55401V25.2513H0.635269V35.2919H6.55401V38.0111H0.603516V46.857H6.55401V50.2029H17.7931V46.857H32.221V38.0111H17.7931V35.2919ZM17.7931 25.2513H30.0812C32.6786 25.2513 34.4769 24.7518 35.4759 23.7527C36.4749 22.7037 36.9745 20.6806 36.9745 17.6834C36.9745 14.6363 36.4749 12.6132 35.4759 11.6141C34.4769 10.615 32.6786 10.1155 30.0812 10.1155H17.7931V25.2513Z" fill="white"/>
                                    </svg>
                                ) : personCurrency?.symbol}
                            </span>
                            <div>
                                <input
                                    style={{ width }}
                                    type='tel'
                                    value={otherAmount}
                                    onChange={handleOtherChange}
                                />
                            </div>
                            <span>{personCurrency?.code}</span>
                    </span>
                    ) : (
                        <span className={`dropdown-price`}>
                            {personCurrency?.symbol === '₽' ? (
                                <svg width="12" height="12" viewBox="0 0 49 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M17.7931 35.2919H29.6316C33.2281 35.2919 36.425 34.6175 39.2223 33.2688C42.0196 31.8701 44.1924 29.872 45.7409 27.2744C47.3394 24.6269 48.1386 21.4299 48.1386 17.6834C48.1386 13.9369 47.3394 10.7649 45.7409 8.16734C44.1924 5.51982 42.0196 3.49672 39.2223 2.09803C36.425 0.699344 33.2281 0 29.6316 0H17.7931H10.5252H6.55401V25.2513H0.635269V35.2919H6.55401V38.0111H0.603516V46.857H6.55401V50.2029H17.7931V46.857H32.221V38.0111H17.7931V35.2919ZM17.7931 25.2513H30.0812C32.6786 25.2513 34.4769 24.7518 35.4759 23.7527C36.4749 22.7037 36.9745 20.6806 36.9745 17.6834C36.9745 14.6363 36.4749 12.6132 35.4759 11.6141C34.4769 10.615 32.6786 10.1155 30.0812 10.1155H17.7931V25.2513Z" fill="white"/>
                                </svg>
                            ) : personCurrency?.symbol}
                            {' '}
                            {dropDownPrice}
                            {' '}
                            {personCurrency?.code}
                        </span>
                    )}
                </div>

                <div className={`dropdown-header-bottom ${isOther ? 'dropdown-header-bottom-isOther' : ''}`}>
                    {isOther ? (
                        <svg width="5" height="4" viewBox="0 0 5 4" fill="#91918F" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="2.5" cy="2" r="2"/>
                        </svg>
                    ) : (
                        <div className={`dropdown-icon ${isOpen ? 'open' : ''}`}>
                            <svg width="15" height="16" viewBox="0 0 15 16" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect x="15" y="0.5" width="15" height="15" rx="7.5" transform="rotate(90 15 0.5)"
                                      fill="white"/>
                                <path
                                    d="M7.5 9.07506L10.214 6.2311C10.5081 5.92297 10.9854 5.92297 11.2795 6.2311C11.5735 6.53924 11.5735 7.03941 11.2795 7.34755L8.00217 10.7817C7.72445 11.0728 7.27484 11.0728 6.99782 10.7817L3.72054 7.34755C3.42649 7.03941 3.42649 6.53924 3.72054 6.2311C4.01461 5.92296 4.49192 5.92296 4.78598 6.2311L7.5 9.07506Z"
                                    fill="#91918F"/>
                            </svg>
                        </div>
                    )}

                    <div className="dropdown-description">{description}</div>
                    <span className="dropdown-euro">
                        {selectedCityData?.currency?.symbol === '₽' ? (
                            <svg width="10" height="10" viewBox="0 0 49 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M17.7931 35.2919H29.6316C33.2281 35.2919 36.425 34.6175 39.2223 33.2688C42.0196 31.8701 44.1924 29.872 45.7409 27.2744C47.3394 24.6269 48.1386 21.4299 48.1386 17.6834C48.1386 13.9369 47.3394 10.7649 45.7409 8.16734C44.1924 5.51982 42.0196 3.49672 39.2223 2.09803C36.425 0.699344 33.2281 0 29.6316 0H17.7931H10.5252H6.55401V25.2513H0.635269V35.2919H6.55401V38.0111H0.603516V46.857H6.55401V50.2029H17.7931V46.857H32.221V38.0111H17.7931V35.2919ZM17.7931 25.2513H30.0812C32.6786 25.2513 34.4769 24.7518 35.4759 23.7527C36.4749 22.7037 36.9745 20.6806 36.9745 17.6834C36.9745 14.6363 36.4749 12.6132 35.4759 11.6141C34.4769 10.615 32.6786 10.1155 30.0812 10.1155H17.7931V25.2513Z" fill="#9EA9B7"/>
                            </svg>
                        ) : selectedCityData?.currency?.symbol}
                        {' '}
                        {isOther ? otherAmountInCountryCurrency
                            :
                            Math.round(amountForAllDaysInDollars * (currenciesValues['USD'][selectedCityData?.currency?.code || ''] || 0))
                        }
                        {' '}
                        {selectedCityData?.currency?.code}
                    </span>
                </div>
            </div>
            {isOther ? <div ref={widthRef} className="dropdown-price-other-ref">0</div> : null}
            <div className={`dropdown-list-container ${isOpen ? 'open' : ''}`}>
                <ul className="dropdown-list">
                    {subtitles?.map(({name: type}) => {
                            return (
                                <li
                                    key={type}
                                    className={`dropdown-item ${type === selectedSections?.[title as SectionTypes] ? 'active' : ''}`}
                                    onClick={() => {
                                        handleTypeClick(type)
                                    }}
                                >
                                    <svg width="5" height="4" viewBox="0 0 5 4" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="2.5" cy="2" r="2"/>
                                    </svg>
                                    <span>
                                    {type}
                                </span>
                                    <span>
                                        {selectedCityData?.sections?.[type] === '—'
                                            ? ''
                                            : personCurrency?.symbol === '₽' ? (
                                                <svg className="ruble-symbol" width="10" height="10" viewBox="0 0 49 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M17.7931 35.2919H29.6316C33.2281 35.2919 36.425 34.6175 39.2223 33.2688C42.0196 31.8701 44.1924 29.872 45.7409 27.2744C47.3394 24.6269 48.1386 21.4299 48.1386 17.6834C48.1386 13.9369 47.3394 10.7649 45.7409 8.16734C44.1924 5.51982 42.0196 3.49672 39.2223 2.09803C36.425 0.699344 33.2281 0 29.6316 0H17.7931H10.5252H6.55401V25.2513H0.635269V35.2919H6.55401V38.0111H0.603516V46.857H6.55401V50.2029H17.7931V46.857H32.221V38.0111H17.7931V35.2919ZM17.7931 25.2513H30.0812C32.6786 25.2513 34.4769 24.7518 35.4759 23.7527C36.4749 22.7037 36.9745 20.6806 36.9745 17.6834C36.9745 14.6363 36.4749 12.6132 35.4759 11.6141C34.4769 10.615 32.6786 10.1155 30.0812 10.1155H17.7931V25.2513Z" fill="white"/>
                                                </svg>
                                            ) : personCurrency?.symbol}
                                        {' '}
                                        {selectedCityData?.sections?.[type] === '—' ? (
                                            '—'
                                        ) : (
                                            Math.round(Number(selectedCityData?.sections?.[type] === '—' ? 0 : selectedCityData?.sections?.[type] || 0) * (currenciesValues['USD'][personCurrency?.code || ''] || 0))
                                        )}
                                </span>
                                </li>
                            )
                        }
                    )}
                </ul>

                {siteType && (
                    <div className="bottom-buttons" onClick={onOpenSite}>
                        <button className="checkout-button">Check out now</button>
                        <button className="booking-button">
                            {svg}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccommodationDropdown;
