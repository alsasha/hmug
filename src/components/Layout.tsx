import React from 'react';
import './Layout.css'; // Импортируем файл CSS

type LayoutProps = {
    children: React.ReactNode;
    isConverter?: boolean
};

const Layout: React.FC<LayoutProps> = ({ children, isConverter }) => {
    return (
        <div className={`layout ${isConverter ? 'layout-converter' : ''}`}>
            {children}
        </div>
    );
};

export default Layout;
