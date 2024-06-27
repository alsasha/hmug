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

// todo добавить при клике на самолет чтобы дергались кнопки тоже если там что-то не заполнено
const Home: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const [startDate, setStartDate] = useState<moment.Moment | null>(null);
    const [endDate, setEndDate] = useState<moment.Moment | null>(null);
    const [travelers, setTravelers] = useState(1)
    const [selectedClass, setSelectedClass] = useState<Classes>(Classes.Economy)

    const togglePopup = () => {
        if (isOpen) {
            setIsClosing(true);
            setTimeout(() => {
                setIsOpen(false);
                setIsClosing(false);
            }, 500); // Длительность анимации закрытия
        } else {
            setIsOpen(true);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            togglePopup();
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

    // @ts-ignore
    return (
        <Layout>
            <div className="home-wrapper">
                <header className="header-wrapper">
                    <img className="header-logo" src={hmugLogo} alt="HTUG Logo"/>
                    <h1 className="header-title semi-bold-weight">Travel calculator</h1>
                    <p className="header-subtitle">Let us do the math</p>
                    <CityInput/>
                    <div className="header-icon-buttons">
                        <div className="header-icon-button" onClick={togglePopup}>
                            <img src={calendarIcon} alt="calendar icon"/>
                            <span>Dates</span>
                        </div>
                        <div className="header-icon-button">
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
                    value={startDate && endDate ? `${startDate.format('MM/DD/YYYY')} - ${endDate.format('MM/DD/YYYY')}` : 'Select Date Range'}
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
                                    togglePopup={togglePopup}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Home;
