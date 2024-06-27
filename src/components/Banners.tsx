import React from 'react';
import './Banners.css';
import {banners} from "../constants/banners"; // Импортируем файл CSS

const Banners: React.FC = () => {
    return (
        <div className="banners-container">
            {banners.map((banner) => (
                <div key={banner.id} className="banner">
                    <div className="banner-header">
                        <div>
                            <h2>{banner.title}</h2>
                            <h3>{banner.subtitle}</h3>
                        </div>
                        <span className="banner-icon">
                            <img src={banner.icon} alt={banner.subtitle}/>
                        </span>
                    </div>
                    <img src={banner.image} alt={banner.subtitle} className="banner-image" />
                    <button onClick={() => console.log('test')} className="banner-button">
                        Learn more
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Banners;
