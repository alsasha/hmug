import React from 'react';
import './Layout.css'; // Импортируем файл CSS

type LayoutProps = {
    children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return <div className="layout">{children}</div>;
};

export default Layout;
