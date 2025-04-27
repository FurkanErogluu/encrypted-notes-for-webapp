import { useState } from 'react';
import './Features.css';

const Features = () => {
    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('tr');

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
        document.body.classList.toggle('dark-theme');
    };

    const toggleLanguage = () => {
        setLanguage(language === 'tr' ? 'en' : 'tr');
    };

    return (
        <div className="features-container">
            <div className="feature-item">
                <button
                    onClick={toggleTheme}
                    className="theme-toggle"
                    title={language === 'tr' ? 'Tema Değiştir' : 'Toggle Theme'}
                >
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
            </div>
            <div className="feature-item">
                <button
                    onClick={toggleLanguage}
                    className="language-toggle"
                    title={language === 'tr' ? 'Dil Değiştir' : 'Change Language'}
                >
                    {language === 'tr' ? '🇬🇧' : '🇹🇷'}
                </button>
            </div>
        </div>
    );
};

export default Features; 