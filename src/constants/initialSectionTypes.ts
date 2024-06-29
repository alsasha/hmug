import {Classes, SectionTypes} from "../types/types";

export const initialSectionTypesByClass = {
    [Classes.Economy]: {
        [SectionTypes.Accommodation]: 'Hostel',
        [SectionTypes.AirportTransfer]: 'Bus',
        [SectionTypes.DayTransport]: 'Public transport',
        [SectionTypes.eSIM]: '5 GB',
        [SectionTypes.Food]: 'Fast-food',
        [SectionTypes.Entertainment]: 'Casual',
        [SectionTypes.Nightlife]: 'Some',
        [SectionTypes.OtherExpenses]: '',
    },
    [Classes.MiddleClass]: {
        [SectionTypes.Accommodation]: '4-Star Hotel',
        [SectionTypes.AirportTransfer]: 'Shuttle',
        [SectionTypes.DayTransport]: 'Public transport',
        [SectionTypes.eSIM]: '10 GB',
        [SectionTypes.Food]: 'Casual dining',
        [SectionTypes.Entertainment]: 'Middle',
        [SectionTypes.Nightlife]: 'Some',
        [SectionTypes.OtherExpenses]: '',
    },
    [Classes.FancyLiving]: {
        [SectionTypes.Accommodation]: 'Fancy living Airbnb',
        [SectionTypes.AirportTransfer]: 'Taxi',
        [SectionTypes.DayTransport]: 'Taxi',
        [SectionTypes.eSIM]: '10 GB',
        [SectionTypes.Food]: 'Fine dining',
        [SectionTypes.Entertainment]: 'Full tourist experience',
        [SectionTypes.Nightlife]: 'Crazy drinking',
        [SectionTypes.OtherExpenses]: '',
    }
}