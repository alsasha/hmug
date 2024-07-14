// TabSwitcher.tsx
import React from 'react';
import './TabSwitcher.scss';

interface TabSwitcherProps {
    activeTab: 'summary' | 'converter';
    onTabChange: (tab: 'summary' | 'converter') => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="tab-switcher">
            <div className="tabs">
                <div
                    className={`tab ${activeTab === 'summary' ? 'active active-from-right' : ''}`}
                    onClick={() => onTabChange('summary')}
                >
                    Summary
                </div>
                <div
                    className={`tab ${activeTab === 'converter' ? 'active active-from-left' : ''}`}
                    onClick={() => onTabChange('converter')}
                >
                    Converter
                </div>
            </div>
        </div>
    );
};

export default TabSwitcher;
