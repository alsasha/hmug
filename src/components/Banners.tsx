import React from 'react';
import './Banners.css';
import {banners} from "../constants/banners"; // Импортируем файл CSS

const Banners: React.FC = () => {
    return (
        <div className="banners-container">
            {banners.map((banner) => (
                <div key={banner.id} className="banner" style={{ background: banner.backgroundColor}}>
                    <div className="banner-header">
                        <div>
                            <h2 style={{ color: banner.titleColor }}>{banner.title}</h2>
                            <h3 style={{ color: banner.titleColor }}>{banner.subtitle}</h3>
                        </div>
                        <span className="banner-icon">
                            <img src={banner.icon} alt={banner.subtitle}/>
                        </span>
                    </div>
                    <img src={banner.image} alt={banner.subtitle} className="banner-image" />
                    <button onClick={() => console.log('test')} className="banner-button" style={{ background: banner.buttonColor }}>
                        Learn more
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Banners;
