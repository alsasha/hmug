import {asiaDestinations, europe} from "../constants/destinations";
import {currenciesWithCountries} from "../constants/currenciesWithCountries";
import {countries} from "../constants/countries";

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
        const currency = currenciesWithCountries.find(({ name }) => name === foundCity.Country)
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
        return {
            currency,
            sections,
            country,
            city: inputValue
        }
    }

    return ''
}

interface BookingSearchParams {
    city?: string;
    region?: string;
    country?: string;
    fromDate?: string;
    toDate?: string;
    adults?: number;
    rooms?: number;
    personCountryCode?: string;
    personCurrency?: string;
}

export const generateBookingUrl = (params: BookingSearchParams): string => {
    const {
        city = '',
        region = '',
        country = '',
        fromDate = '',
        toDate = '',
        adults = 1,
        rooms = 1,
        personCountryCode = '',
        personCurrency = ''
    } = params;

    if (!city) {
        return ''
    }
    // Encode city, region, and country for URL
    const location = `${city}, ${region}, ${country}`.replace(/ /g, '+');

    const baseUrl = `https://www.booking.com/searchresults.${personCountryCode}.html`;
    const queryParams = new URLSearchParams({
        ss: location,
        sb: '1',
        src: 'index',
        src_elem: 'sb',
        checkin: fromDate,
        checkout: toDate,
        group_adults: adults.toString(),
        no_rooms: rooms.toString(),
        search_selected: 'true',
        soz: '1',
        lang: personCountryCode,
        lang_changed: '1',
        selected_currency: personCurrency
    });
    return `${baseUrl}?${queryParams.toString()}`;
}

interface AiraloSearchParams {
    country?: string;
    languageCode?: string;
}

export const generateAiraloUrl = (params: AiraloSearchParams): string => {
    const {
        country,
        languageCode = 'en-US' // lang передается в качестве необязательного параметра
    } = params;

    if (!country) {
        return ''
    }

    // Encode country for URL
    const encodedCountry = country.replace(/ /g, '-');

    // Construct the URL
    const baseUrl = 'https://www.airalo.com';
    const path = `/${encodedCountry}-esim`;
    // const path = `/${languageCode}/${encodedCountry}-esim`;

    // Combine base URL and path and return the generated URL
    return `${baseUrl}${path}`;
}

export const getUberUrl = ({
                               countryCode = 'es',
                               langCode = 'en'
                           }) => {
    return `https://www.uber.com/${countryCode}/${langCode}/`
}