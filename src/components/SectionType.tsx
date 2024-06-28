import React, { useState } from 'react';
import './AccommodationDropdown.scss';

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
    selectedCityData?: any
    personCurrency?: string
}

const AccommodationDropdown = ({
    title, icon, description, subtitles, siteType, siteUrl, svg, selectedCityData, personCurrency
}: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeType, setActiveType] = useState<string>('2-Star Hotel');

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleTypeClick = (type: string) => {
        setActiveType(type);
    };

    const onOpenSite = (url?: string) => {
        if (url) {
            window.open(url, '_blank')
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
                    <span className="dropdown-price">₾ 1345 GEL</span>
                </div>

                <div className="dropdown-header-bottom">
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
                    <div className="dropdown-description">{description}</div>
                    <span className="dropdown-euro">€ 463 EUR</span>
                </div>
            </div>
            <div className={`dropdown-list-container ${isOpen ? 'open' : ''}`}>
                <ul className="dropdown-list">
                    {subtitles?.map(({ name: type }) => (
                        <li
                            key={type}
                            className={`dropdown-item ${type === activeType ? 'active' : ''}`}
                            onClick={() => handleTypeClick(type)}
                        >
                            <svg width="5" height="4" viewBox="0 0 5 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="2.5" cy="2" r="2" />
                            </svg>
                            <span>
                                {type}
                            </span>
                            <span>
                                {selectedCityData?.sections?.[type] === '—' ? '' : personCurrency}
                                {' '}
                                {selectedCityData?.sections?.[type]}
                            </span>
                        </li>
                    ))}
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
