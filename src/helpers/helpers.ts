import {asiaDestinations, europe} from "../constants/destinations";
import {currencies} from "../constants/currencies";
import {countries} from "../constants/countries";

enum SectionTypes {
    Accommodation = 'Accommodation',
    AirportTransfer = 'Airport Transfer',
    DayTransport = 'Day to day transport',
    eSIM = 'eSIM with data',
    Food = 'Food',
    Entertainment = 'Entertainment',
    Nightlife = 'Nightlife',
    OtherExpenses = 'Other expenses'
}

export const ACCOMMODATION_DESTINATION_FIELDS = {
    'Hostel': '1* Hotel',
    '2-Star Hotel': '2* Hotel',
    '3-Star Hotel': '3* Hotel',
    '4-Star Hotel': '4* Hotel',
    '5-Star Hotel': '5* Hotel',
    'Economy Airbnb': 'Airbnb Economy',
    'Middle Class Airbnb': 'Airbnb Business',
    'Fancy living Airbnb': 'Airbnb First Class',
}

export const AIRPORT_DESTINATION_FIELDS = {
    'Bus': 'Airport Bus',
    'Train': 'Airport Train',
    'Subway': 'Airport Metro',
    'Shuttle': 'Airport Shuttle',
    'Taxi': 'Airport Taxi',
}

export const TRANSPORT_DESTINATION_FIELDS = {
    // todo спросить
    'Public transport': 'Daily Public Transport',
    'Taxi': 'Daily Taxi',
}

export const ESIM_DESTINATION_FIELDS = {
    '5 GB': 'SIM 5GB',
    '10 GB': 'SIM 10GB',
    '25 GB': 'SIM 20GB',
}

export const FOOD_DESTINATION_FIELDS = {
    'Fast-food': 'Daily Fast-Food',
    'Casual dining': 'Daily Casual Dining',
    'Fine dining': 'Daily Fine Dining',
    'GB': 'SIM',
}

export const ENTERTAINMENT_DESTINATION_FIELDS = {
    'Casual': 'Casual Entertainment',
    'Middle': 'Local Entertainment',
    'Full tourist experience': 'Tourist Entertainment',
}


export const NIGHT_DESTINATION_FIELDS = {
    'Moderate drinking': 'Moderate Drink',
    'Some': 'Some',
    'Crazy drinking': 'Crazy Drinking',
}


export const MERGED_REVERSED_FIELDS = {
    '1* Hotel': 'Hostel',
    '2* Hotel': '2-Star Hotel',
    '3* Hotel': '3-Star Hotel',
    '4* Hotel': '4-Star Hotel',
    '5* Hotel': '5-Star Hotel',
    'Airbnb Economy': 'Economy Airbnb',
    'Airbnb Business': 'Middle Class Airbnb',
    'Airbnb First Class': 'Fancy living Airbnb',
    'Airport Bus': 'Bus',
    'Airport Train': 'Train',
    'Airport Metro': 'Subway',
    'Airport Shuttle': 'Shuttle',
    'Airport Taxi': 'Taxi',
    'Daily Public Transport': 'Public transport',
    'Daily Taxi': 'Taxi',
    'SIM 5GB': '5 GB',
    'SIM 10GB': '10 GB',
    'SIM 20GB': '25 GB',
    'Daily Fast-Food': 'Fast-food',
    'Daily Casual Dining': 'Casual dining',
    'Daily Fine Dining': 'Fine dining',
    'SIM': 'GB',
    'Casual Entertainment': 'Casual',
    'Local Entertainment': 'Middle',
    'Tourist Entertainment': 'Full tourist experience',
    'Moderate Drink': 'Moderate drinking',
    'Some': 'Some',
    'Crazy Drinking': 'Crazy drinking'
}

export const getCityData = (inputValue: string) => {
    if (!inputValue) {
        return ''
    }
    const normalizedCity = inputValue.trim().toLowerCase();
    const europeCity = europe.find(cityObj => cityObj.Destination.toLowerCase() === normalizedCity);
    const asiaCity = asiaDestinations.find(cityObj => cityObj.Destination.toLowerCase() === normalizedCity);
    const foundCity = europeCity || asiaCity

    if (foundCity) {
        const currency = currencies.find(({ name }) => name === foundCity.Country)
        const country = countries.find(({ name }) => name === foundCity.Country)
        const sections = Object.entries(foundCity).reduce((acc, next) => {
            const [key, amount] = next

            // @ts-ignore
            if (MERGED_REVERSED_FIELDS[key]) {
                // @ts-ignore
                acc[MERGED_REVERSED_FIELDS[key]] = amount
            }

            return acc
        }, {})
        const cityObjectData = {
            currency,
            sections,
            country
        }
        return cityObjectData
    }

    return ''
}