import {sectionTypes} from "../constants/sectionTypes";
import AccommodationDropdown from "./SectionType";

type Props = {
    personCurrency?: string
    selectedCityData: any
}

export const SectionTypeWrapper = ({ selectedCityData, personCurrency }: Props) => {
    return <div className="section-type-wrapper">
        {sectionTypes.map((item) => {
            return (
                <AccommodationDropdown personCurrency={personCurrency} selectedCityData={selectedCityData} {...item} />
            )
        })}
    </div>
}