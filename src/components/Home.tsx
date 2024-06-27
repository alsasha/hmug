import React, {useEffect, useRef, useState} from 'react';
import hmugLogo from '../assets/HMUGLogo.svg';
import DateRangePickerComponent from './DateRangePickerComponent';
import Layout from "./Layout";
import moment from "moment/moment";

const Home: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const [startDate, setStartDate] = useState<moment.Moment | null>(null);
    const [endDate, setEndDate] = useState<moment.Moment | null>(null);

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
                <img src={hmugLogo} alt="HTUG Logo"/>
                <h1>Travel calculator</h1>
                <p>Everything but the travel tickets</p>
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
                                <button onClick={togglePopup} className="close-button">Close</button>
                                <DateRangePickerComponent
                                    startDate={startDate} setStartDate={setStartDate}
                                    endDate={endDate} setEndDate={setEndDate}
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
