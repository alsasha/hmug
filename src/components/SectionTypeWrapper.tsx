import {sectionTypes} from "../constants/sectionTypes";
import AccommodationDropdown from "./SectionType";
import {CurrenciesValuesType, CurrencyType, SelectedCityType, SelectedSectionsType} from "../types/types";

import React from 'react'

type Props = {
    personCurrency: CurrencyType | null
    selectedCityData?: SelectedCityType
    selectedSections?: SelectedSectionsType
    setSelectedSections: (value: SelectedSectionsType) => void
    daysBetween: number
    currenciesValues: CurrenciesValuesType
    otherAmount: number
    otherAmountInCountryCurrency: number
    setOtherAmount: (value: number) => void
    onBookingClick: () => void
    onAiraloClick: () => void
    onUberClick: () => void
}

export const SectionTypeWrapper = ({ selectedCityData, personCurrency, selectedSections, setSelectedSections, daysBetween, currenciesValues, otherAmount, setOtherAmount, otherAmountInCountryCurrency, ...rest }: Props) => {
    return <div className="section-type-wrapper">
        {sectionTypes.map((item) => {
            return (
                <React.Fragment key={item.title}>
                    <AccommodationDropdown
                        personCurrency={personCurrency}
                        selectedCityData={selectedCityData}
                        selectedSections={selectedSections}
                        setSelectedSections={setSelectedSections}
                        daysBetween={daysBetween}
                        currenciesValues={currenciesValues}
                        otherAmount={otherAmount}
                        setOtherAmount={setOtherAmount}
                        otherAmountInCountryCurrency={otherAmountInCountryCurrency}
                        {...rest}
                        {...item}
                    />
                </React.Fragment>
            )
        })}
    </div>
}