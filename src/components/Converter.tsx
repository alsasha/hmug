import React, {useEffect, useRef} from 'react';
import Layout from "./Layout";
import {CurrenciesValuesType, CurrencyType, SelectedSelect} from "../types/types";
import {useState} from 'react'
import './Converter.scss'
import CurrencyPopup from "./CurrencyPopup";
import {ConversionResult} from "../services/services";
import TabSwitcher from "./Tabs";

type Props = {
    currenciesValues: CurrenciesValuesType
    setCurrenciesValues: (value: CurrenciesValuesType) => void
    fetchConversion: (
        amount?: number, fromCurrency?: string, toCurrency?: string
    ) => Promise<ConversionResult>
    activeTab: 'summary' | 'converter'
    setActiveTab: (value: 'summary' | 'converter') => void
}

// todo чтобы нельзя было выбрать curr который уже выбран
const Converter = ({ currenciesValues, setCurrenciesValues, fetchConversion, activeTab, setActiveTab }: Props) => {
    const [selectedSelect, setSelectedSelect] = useState(SelectedSelect.First)
    const [clickedSelect, setClickedSelect] = useState(SelectedSelect.First)
    const [firstCurrency, setFirstCurrency] = useState<CurrencyType | null>(    {
        "name": "United States",
        "country": "US",
        "currency": "US Dollar",
        "symbol": "$",
        "code": "USD",
        "flag": "🇺🇸"
    })
    const [secondCurrency, setSecondCurrency] = useState<CurrencyType | null>({
        "name": "Spain",
        "country": "ES",
        "currency": "Euro",
        "symbol": "€",
        "code": "EUR",
        "flag": "🇪🇸"
    })
    const [firstCurrencyValue, setFirstCurrencyValue] = useState('0')
    const [secondCurrencyValue, setSecondCurrencyValue] = useState('0')

    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [isPopupClosing, setIsPopupClosing] = useState(false)

    const popupRef = useRef<HTMLDivElement>(null);

    const calculateValue = (value: string) => {
        let expression = value.replaceAll('÷', '/').replaceAll('×', '*').replaceAll(',', '.');
        const symbols = ['%', '÷', '×', '-', '+', ',']
        if (symbols.includes(expression[expression.length - 1])) {
            expression = expression.slice(0, -1)
        }
        const result = eval(expression); // Будьте осторожны с использованием eval
        const roundedResult = parseFloat(result.toFixed(2)); // округление до 2 знаков
        return roundedResult.toString()
    }

    const onClickSame = (value?: SelectedSelect) => {
        const currentSelectedSelect = value || selectedSelect
        const calculatingValue = currentSelectedSelect === SelectedSelect.First ? firstCurrencyValue : secondCurrencyValue
        const setCalculatingValue = currentSelectedSelect === SelectedSelect.First ? setFirstCurrencyValue : setSecondCurrencyValue
        try {
            let expression = calculatingValue
            const symbols = ['%', '÷', '×', '-', '+', ',']
            if (symbols.includes(expression[expression.length - 1])) {
                expression = expression.slice(0, -1)
            }
            expression = expression.replaceAll('÷', '/').replaceAll('×', '*').replaceAll(',', '.');
            const result = eval(expression); // Будьте осторожны с использованием eval
            const roundedResult = parseFloat(result.toFixed(2)); // округление до 2 знаков
            const replaced = roundedResult.toString().replace('.', ',')
            setCalculatingValue(replaced);
        } catch {
            setCalculatingValue('0');
        }
    }

    const handleClick = (value: string) => {
        const calculatingValue = selectedSelect === SelectedSelect.First ? firstCurrencyValue : secondCurrencyValue
        const fromCurrency = selectedSelect === SelectedSelect.First ? firstCurrency : secondCurrency
        const toCurrency = selectedSelect === SelectedSelect.First ? secondCurrency : firstCurrency
        const setCalculatingValue = selectedSelect === SelectedSelect.First ? setFirstCurrencyValue : setSecondCurrencyValue
        const setCalculatedValue = selectedSelect === SelectedSelect.First ? setSecondCurrencyValue : setFirstCurrencyValue
        if (value === 'C') {
            setCalculatingValue('0');
            setCalculatedValue('0')
        } else if (value === '←') {
            const symbols = ['%', '÷', '×', '-', '+', ',']
            const expression = calculatingValue.slice(0, -1) || '0'
            if (symbols.includes(expression[expression.length - 1])) {
                setCalculatingValue(expression);
            } else {
                const valueByCurrency = Number(expression) * currenciesValues[fromCurrency?.code || ''][toCurrency?.code || '']
                const roundedResult = parseFloat(valueByCurrency.toFixed(2)); // округление до 2 знаков
                const replaced = roundedResult.toString().replace('.', ',')
                setCalculatingValue(expression);
                setCalculatedValue(replaced)
            }
        } else if (value === '=') {
            try {
                let expression = calculatingValue.replaceAll('÷', '/').replaceAll('×', '*').replaceAll(',', '.');
                const symbols = ['%', '÷', '×', '-', '+', ',']
                if (symbols.includes(expression[expression.length - 1])) {
                    expression = expression.slice(0, -1)
                }
                const result = eval(expression); // Будьте осторожны с использованием eval
                const roundedResult = parseFloat(result.toFixed(2)); // округление до 2 знаков
                const replaced = roundedResult.toString().replace('.', ',')
                setCalculatingValue(replaced);

                const valueByCurrency = Number(roundedResult) * currenciesValues[fromCurrency?.code || ''][toCurrency?.code || '']
                const roundedResultCalculated = parseFloat(valueByCurrency.toFixed(2)); // округление до 2 знаков
                const replacedCalculated = roundedResultCalculated.toString().replace('.', ',')
                setCalculatedValue(replacedCalculated)
            } catch {
                setCalculatingValue('0');
                setCalculatedValue('0')
            }
        } else {
            const symbolsValues = ['%', '÷', '×', '-', '+']
            if (symbolsValues.includes(value)) {
                const isLastSymbol = symbolsValues.includes(calculatingValue[calculatingValue.length - 1])
                if (isLastSymbol) {
                    return;
                }
            }
            if (value === ',') {
                const splitted = calculatingValue.split(/[%÷×\-+]/)
                const isLastIncludedComma = splitted[splitted.length - 1].includes(',') || splitted[splitted.length - 1].includes('.')
                if (isLastIncludedComma) {
                    return
                }
            }
            const symbolsValuesWithComma = ['%', '÷', '×', '-', '+', ',']
            if (calculatingValue[calculatingValue.length - 1] === '0' &&
                ((calculatingValue[calculatingValue.length - 2] && symbolsValuesWithComma.includes(calculatingValue[calculatingValue.length - 2]))
                || calculatingValue.length === 1)
            ) {
                if (value === '0' ||
                    value === '1' ||
                    value === '2' ||
                    value === '3' ||
                    value === '4' ||
                    value === '5' ||
                    value === '6' ||
                    value === '7' ||
                    value === '8' ||
                    value === '9'
                ) {
                    const calculatingValueSliced = calculatingValue.slice(0, -1)
                    const res = calculatingValueSliced + value
                    setCalculatingValue(res);

                    if (calculatingValue.split('').every((el) => !symbolsValues.includes(el))) {
                        const clearedRes = res.replaceAll(',', '.')
                        const valueByCurrency = Number(clearedRes) * currenciesValues[fromCurrency?.code || ''][toCurrency?.code || '']
                        const roundedResultCalculated = parseFloat(valueByCurrency.toFixed(2)); // округление до 2 знаков
                        const replacedCalculated = roundedResultCalculated.toString().replace('.', ',')
                        setCalculatedValue(replacedCalculated)
                    }
                } else {
                    setCalculatingValue(calculatingValue + value);
                }
            } else {
                setCalculatingValue(calculatingValue + value);

                if ((calculatingValue + value).split('').every((el) => !symbolsValues.includes(el))) {
                    const clearedRes = (calculatingValue + value).replaceAll(',', '.')
                    const valueByCurrency = Number(clearedRes) * currenciesValues[fromCurrency?.code || ''][toCurrency?.code || '']
                    const roundedResultCalculated = parseFloat(valueByCurrency.toFixed(2)); // округление до 2 знаков
                    const replacedCalculated = roundedResultCalculated.toString().replace('.', ',')
                    setCalculatedValue(replacedCalculated)
                }
            }
        }
    };

    const togglePopup = () => {
        if (isPopupOpen) {
            setIsPopupClosing(true);
            setTimeout(() => {
                setIsPopupOpen(false);
                setIsPopupClosing(false);
            }, 500); // Длительность анимации закрытия
        } else {
            setIsPopupOpen(true);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            togglePopup();
        }
    };

    useEffect(() => {
        if (isPopupOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPopupOpen]);

    // todo на ввод цифры- если последний не , и не символ то перевести в валюту

    const handleSetSelectedCurrency = async (value: CurrencyType | null) => {
        if (clickedSelect === SelectedSelect.First) {
            setFirstCurrency(value)
        } else {
            setSecondCurrency(value)
        }
        let resData = currenciesValues[value?.code || '']
        if (!currenciesValues[value?.code || '']) {
            const res = await fetchConversion(1, value?.code)
            if (res?.rates) {
                resData = res?.rates
            }
        }
        if (clickedSelect === SelectedSelect.First) {
            // todo посчитать как клик на равно при клике на другой селект
            const calculatedValue = calculateValue(firstCurrencyValue)
            if (secondCurrency?.code) {
                const valueByCurrency = Number(calculatedValue) * resData[secondCurrency?.code]
                const roundedResult = parseFloat(valueByCurrency.toFixed(2)); // округление до 2 знаков
                const replaced = roundedResult.toString().replace('.', ',')
                setSecondCurrencyValue(replaced)
            }
        } else {
            const calculatedValue = calculateValue(secondCurrencyValue)
            if (firstCurrency?.code) {
                const valueByCurrency = Number(calculatedValue) * resData[firstCurrency?.code]
                const roundedResult = parseFloat(valueByCurrency.toFixed(2)); // округление до 2 знаков
                const replaced = roundedResult.toString().replace('.', ',')
                setFirstCurrencyValue(replaced)
            }
        }
        // todo check if currency exist
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); // Пустой массив зависимостей гарантирует, что этот эффект выполнится только один раз при монтировании


    return (
        <Layout isConverter>
            <div className={`home-wrapper home-wrapper-is-result home-wrapper-converter`}>
                <header className="header-wrapper">
                    <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
                    <div className="converter-select-wrapper">
                        <div className={`converter-select ${selectedSelect === SelectedSelect.First ? 'converter-select-selected' : ''}`}>
                            <div
                                onClick={() => {
                                    onClickSame()
                                    setClickedSelect(SelectedSelect.First)
                                    togglePopup()
                                }}
                                className="converter-flag-wrapper"
                            >
                                {firstCurrency?.flag}
                            </div>
                            <div className="converter-country-wrapper"
                                 onClick={() => {
                                     onClickSame()
                                     setClickedSelect(SelectedSelect.First)
                                     togglePopup()
                                 }}
                            >
                                <div className="converter-currency-code">
                                    {firstCurrency?.code}
                                </div>
                                <div className="converter-currency-text">
                                    {firstCurrency?.currency}
                                </div>
                            </div>
                            <div onClick={() => {
                                onClickSame()
                                setSelectedSelect(SelectedSelect.First)
                            }} className="converter-result-wrapper">
                                <span>
                                    {firstCurrencyValue}
                                </span>
                            </div>
                        </div>
                        <div className={`converter-select ${selectedSelect === SelectedSelect.Second ? 'converter-select-selected' : ''}`}>
                            <div className="converter-flag-wrapper"
                                 onClick={() => {
                                     onClickSame()
                                     setClickedSelect(SelectedSelect.Second)
                                     togglePopup()
                                 }}
                            >
                                {secondCurrency?.flag}
                            </div>
                            <div className="converter-country-wrapper"
                                 onClick={() => {
                                     onClickSame()
                                     setClickedSelect(SelectedSelect.Second)
                                     togglePopup()
                                 }}
                            >
                                <div className="converter-currency-code">
                                    {secondCurrency?.code}
                                </div>
                                <div className="converter-currency-text">
                                    {secondCurrency?.currency}
                                </div>
                            </div>
                            <div onClick={() => {
                                // todo check
                                onClickSame()
                                setSelectedSelect(SelectedSelect.Second)
                            }} className="converter-result-wrapper">
                                <span>
                                    {secondCurrencyValue}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="calculator-wrapper">
                    <div className="calculator">
                        <div className="buttons">
                            {['C', '←', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', ',', '='].map((btn) => (
                                <button key={btn} onClick={() => handleClick(btn)}>
                                    {btn === '←' ? (
                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0.181233 7.05646C-0.0604102 7.30146 -0.0604102 7.69871 0.181233 7.94371L6.81022 14.6949C7.05183 14.9399 7.44359 14.9399 7.68523 14.6949L8.73527 13.6302C8.97689 13.3852 8.97689 12.988 8.73527 12.7429L5.0276 8.95386L14.3888 8.95386C14.7264 8.95386 15 8.66243 15 8.30293L15 6.74067C15 6.38117 14.7264 6.08973 14.3888 6.08973L4.98457 6.08973L8.7353 2.257C8.97695 2.012 8.97695 1.61477 8.7353 1.36975L7.68526 0.305056C7.44365 0.0600525 7.05189 0.0600525 6.81024 0.305056L0.181233 7.05646Z" fill="#FEFEFE"/>
                                        </svg>
                                    ) : btn}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <CurrencyPopup
                    isOpen={isPopupOpen}
                        isClosing={isPopupClosing}
                        popupRef={popupRef}
                        selectedCurrency={clickedSelect === SelectedSelect.First ? firstCurrency : secondCurrency}
                    setSelectedCurrency={handleSetSelectedCurrency}
                        onDone={togglePopup}
                />
            </div>
        </Layout>
    );
};

export default Converter;
