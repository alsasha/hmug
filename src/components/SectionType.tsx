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
    personCurrency?: CurrencyType
    selectedSections?: SelectedSectionsType
    setSelectedSections: (value: SelectedSectionsType) => void
    daysBetween: number
    currenciesValues: CurrenciesValuesType
    otherAmount: number
    otherAmountInCountryCurrency: number
    setOtherAmount: (value: number) => void
}

const AccommodationDropdown = ({
    title, icon, description, subtitles, siteType, siteUrl, svg, selectedCityData, personCurrency, selectedSections, setSelectedSections, daysBetween, currenciesValues, otherAmount, setOtherAmount, otherAmountInCountryCurrency
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

    const onOpenSite = (url?: string) => {
        if (url) {
            window.open(url, '_blank')
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
                            <span>{personCurrency?.symbol}</span>
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
                            {personCurrency?.symbol}
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
                        {selectedCityData?.currency?.symbol}
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
                                    {selectedCityData?.sections?.[type] === '—' ? '' : personCurrency?.symbol}
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
                    <div className="bottom-buttons" onClick={() => onOpenSite(siteUrl)}>
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
