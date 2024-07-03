import React from 'react';
import './Layout.css'; // Импортируем файл CSS
import { useLocation } from 'react-router-dom';
import {Pathnames} from "../constants/pathnames";
import { useHistory } from 'react-router-dom';

type LayoutProps = {
    children: React.ReactNode;
    isConverter?: boolean
};

const Layout: React.FC<LayoutProps> = ({ children, isConverter }) => {
    const { pathname } = useLocation();
    const history = useHistory();

    const handleClickConverter = () => {
        history.push(Pathnames.Converter);
    };

    const handleClickSummary = () => {
        history.push(Pathnames.Summary);
    };

    return (
        <div className={`layout ${isConverter ? 'layout-converter' : ''}`}>
            {children}
            <footer className="footer">
                <button
                    onClick={handleClickSummary}
                    className={`footer-button ${pathname === Pathnames.Summary ? 'footer-button-active' : ''}`}
                >
                    <span className="button-icon">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M7.91667 0.909091C7.91667 0.407014 8.32368 0 8.82576 0H11.1742C11.6763 0 12.0833 0.407014 12.0833 0.909091V4.9707L14.9553 2.09872C15.3103 1.74369 15.8859 1.74369 16.241 2.09872L17.9016 3.75934C18.2566 4.11436 18.2566 4.68996 17.9016 5.04499L15.0299 7.91667H19.0909C19.593 7.91667 20 8.32368 20 8.82576V11.1742C20 11.6763 19.593 12.0833 19.0909 12.0833H12.0833V19.0909C12.0833 19.593 11.6763 20 11.1742 20H8.82576C8.32368 20 7.91667 19.593 7.91667 19.0909V15.0299L5.04511 17.9015C4.69009 18.2565 4.11449 18.2565 3.75946 17.9015L2.09884 16.2408C1.74382 15.8858 1.74382 15.3102 2.09884 14.9552L4.9707 12.0833H0.909091C0.407014 12.0833 0 11.6763 0 11.1742V8.82576C0 8.32368 0.407015 7.91667 0.909092 7.91667H7.91667V0.909091Z"
                                fill="#044532"/>
                            <path
                                d="M6.1367 2.60114C7.11301 3.57745 7.11301 5.16034 6.1367 6.13665C5.16037 7.11299 3.57747 7.11299 2.60117 6.13665C1.62486 5.16034 1.62486 3.57745 2.60117 2.60114C3.57747 1.62481 5.16037 1.62481 6.1367 2.60114Z"
                                fill="#044532"/>
                            <path
                                d="M17.3867 17.3867C18.363 16.4103 18.363 14.8274 17.3867 13.8511C16.4104 12.8748 14.8275 12.8748 13.8512 13.8511C12.8749 14.8274 12.8749 16.4103 13.8512 17.3867C14.8275 18.363 16.4104 18.363 17.3867 17.3867Z"
                                fill="#044532"/>
                        </svg>
                    </span>
                    Summary
                </button>
                <button
                    onClick={handleClickConverter}
                    className={`footer-button ${pathname === Pathnames.Converter ? 'footer-button-active' : ''}`}
                >
                    <span className="button-icon">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M10.5761 0C10.2498 0 9.98523 0.26492 9.98523 0.591716V10H0.590842C0.264529 10 1.11113e-07 10.2649 9.68494e-08 10.5917L0 12.8107C-1.42636e-08 13.1374 0.264529 13.4024 0.590842 13.4024H4.14553L1.62468 15.9269C1.39395 16.158 1.39395 16.5327 1.62468 16.7638L3.23156 18.373C3.4623 18.6041 3.8364 18.6041 4.06714 18.373L6.58789 15.8485V19.4083C6.58789 19.7351 6.85242 20 7.17873 20H9.39439C9.7207 20 9.98523 19.7351 9.98523 19.4083V10H19.4092C19.7355 10 20 9.73508 20 9.40828V7.18935C20 6.86255 19.7355 6.59763 19.4092 6.59763L15.8544 6.59763L18.3753 4.07303C18.606 3.84195 18.606 3.4673 18.3753 3.23622L16.7684 1.62697C16.5377 1.39589 16.1636 1.39589 15.9328 1.62697L13.4121 4.15142V0.591716C13.4121 0.26492 13.1476 0 12.8213 0H10.5761Z"
                                fill="#99A0AA"/>
                        </svg>
                    </span>
                    Converter
                </button>
            </footer>
        </div>
    );
};

export default Layout;
