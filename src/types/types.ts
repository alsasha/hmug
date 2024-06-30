export enum Classes {
    Economy = 'Economy',
    MiddleClass = 'Middle class',
    FancyLiving = 'Fancy living',
}

export type CountryType = {
    name: string, country: string, flag: string
}

export type CurrencyType = {
    name: string,
    country: string,
    currency: string,
    symbol: string,
    code: string
    flag?: string
}

export type SelectedCityType = {
    currency: CurrencyType
    sections: Record<string, string>
    country: CountryType
    city: string
}

export enum SectionTypes {
    Accommodation = 'Accommodation',
    AirportTransfer = 'Airport Transfer',
    DayTransport = 'Day to day transport',
    eSIM = 'eSIM with data',
    Food = 'Food',
    Entertainment = 'Entertainment',
    Nightlife = 'Nightlife',
    OtherExpenses = 'Other expenses'
}

export type SelectedSectionsType = {
    [SectionTypes.Accommodation]: string
    [SectionTypes.AirportTransfer]: string
    [SectionTypes.DayTransport]: string
    [SectionTypes.eSIM]: string
    [SectionTypes.Food]: string
    [SectionTypes.Entertainment]: string
    [SectionTypes.Nightlife]: string
    [SectionTypes.OtherExpenses]: string
}

export type CurrenciesValuesType = Record<string, Record<string, number>>

export enum SelectedSelect {
    First = 'First',
    Second = 'Second'
}