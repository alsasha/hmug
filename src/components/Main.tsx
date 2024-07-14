import React, {useEffect, useState} from "react";
import Home from "./Home";
import Converter from "./Converter";
import {CurrenciesValuesType} from "../types/types";
import {ConversionResult} from "../services/services";

type Props = {
    currenciesValues: CurrenciesValuesType
    setCurrenciesValues: (value: CurrenciesValuesType) => void
    fetchConversion: (
        amount?: number, fromCurrency?: string, toCurrency?: string
    ) => Promise<ConversionResult>
}

const Main = ({ currenciesValues, setCurrenciesValues, fetchConversion }: Props)  => {
    const [activeTab, setActiveTab] = useState<'summary' | 'converter'>('summary')
    // todo
    const [subtitle, setSubtitle ] = useState('1')
    const [isFirstRender, setIsFirstRender] = useState(true)

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false)
            return
        }
        const newValue = (Number(subtitle) + 1)
        if (newValue > 3) {
            setSubtitle('1')
        } else {
            setSubtitle(newValue.toString())
        }
    }, [activeTab, isFirstRender]);

    return (
        activeTab === 'summary' ? (
            <Home
                currenciesValues={currenciesValues}
                setCurrenciesValues={setCurrenciesValues}
                // @ts-ignore
                fetchConversion={fetchConversion}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                subtitle={subtitle}
                setSubtitle={setSubtitle}
            />
        ) : (
            <Converter
                currenciesValues={currenciesValues}
                setCurrenciesValues={setCurrenciesValues}
                // @ts-ignore
                fetchConversion={fetchConversion}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
        )
    )
}

export default Main