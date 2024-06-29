import React, {Ref} from 'react';
import './CityInput.css';
import {Classes, SelectedSectionsType} from "../types/types";
import './TravelersForm.scss'
import {initialSectionTypesByClass} from "../constants/initialSectionTypes";

type Props = {
    isOpen: boolean
    isClosing: boolean
    popupRef: Ref<HTMLDivElement>
    selectedClass: Classes
    setSelectedClass: (value: Classes) => void
    travelers: number
    setTravelers: (value: number) => void
    onDone: () => void
    setSelectedSections: (value: SelectedSectionsType) => void
}

const ProfilePopup = ({ isOpen, isClosing, popupRef, onDone, selectedClass, setSelectedClass, travelers, setTravelers, setSelectedSections }: Props)  => {

    const incrementTravelers = () => {
        // @ts-ignore
        setTravelers((prev) => prev + 1);
    };

    const decrementTravelers = () => {
        // @ts-ignore
        setTravelers(prev => (prev > 1 ? prev - 1 : 1));
    };

    return (
        <div>
            {isOpen && (
                <div className={`popup profile-popup ${isClosing ? 'closing' : ''}`} ref={popupRef}>
                    <div className="popup-content">
                        <div className="travelers-form">
                            <h2>Travelers and class</h2>
                            <div className="travelers-input">
                                <div className="travelers-input-left">
                                    <span className="travelers-input-left-top">People</span>
                                    <span className="travelers-input-left-bottom">Multiply expenses by</span>
                                </div>
                                <div className="counter">
                                    <button onClick={decrementTravelers} className="counter-button">
                                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="18" cy="18" r="18" fill="#E7EBEA"/>
                                            <rect opacity="0.42" x="25" y="17" width="2" height="14"
                                                  transform="rotate(90 25 17)" fill="#0C3B2E"/>
                                        </svg>
                                    </button>
                                    <span className="counter-value">{travelers}</span>
                                    <button onClick={incrementTravelers} className="counter-button">
                                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="18" cy="18" r="18" fill="#006659"/>
                                            <path d="M17 11H19V25H17V11Z" fill="white"/>
                                            <path d="M25 17V19L11 19L11 17L25 17Z" fill="white"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="class-selector">
                                {Object.values(Classes).map((className) => (
                                    <div
                                        key={className}
                                        className={`class-option ${selectedClass === className ? 'selected' : ''}`}
                                        onClick={() => {
                                            setSelectedClass(className as Classes)
                                            setSelectedSections(initialSectionTypesByClass[className])
                                        }}
                                    >
                                        {className}
                                        {selectedClass === className && (
                                            <span className="check-mark"><svg width="14"
                                              height="11"
                                              viewBox="0 0 14 11"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M13.3797 2.30737L5.37968 10.3074C5.27376 10.4138 5.14785 10.4983 5.00918 10.5559C4.87052 10.6135 4.72184 10.6432 4.57168 10.6432C4.42153 10.6432 4.27285 10.6135 4.13418 10.5559C3.99552 10.4983 3.86961 10.4138 3.76368 10.3074L0.334685 6.87937C0.12039 6.66508 0 6.37443 0 6.07137C0 5.92131 0.0295564 5.77273 0.0869817 5.63409C0.144407 5.49545 0.228576 5.36948 0.334685 5.26337C0.440793 5.15727 0.566761 5.0731 0.705398 5.01567C0.844035 4.95825 0.992625 4.92869 1.14268 4.92869C1.44574 4.92869 1.73639 5.04908 1.95068 5.26337L4.57068 7.88337L11.7647 0.691374C11.8708 0.585266 11.9968 0.501096 12.1354 0.443671C12.274 0.386246 12.4226 0.356689 12.5727 0.356689C12.7227 0.356689 12.8713 0.386246 13.01 0.443671C13.1486 0.501096 13.2746 0.585266 13.3807 0.691374C13.4868 0.797482 13.571 0.923451 13.6284 1.06209C13.6858 1.20072 13.7154 1.34931 13.7154 1.49937C13.7154 1.64943 13.6858 1.79802 13.6284 1.93666C13.571 2.0753 13.4858 2.20127 13.3797 2.30737Z"
                                                fill="#0C3B2E"/>
                                            </svg>
                                            </span>
                                        )}
                                    </div>
                                ))}
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

export default ProfilePopup;
