import axios from 'axios';

export interface ConversionResult {
    convertedAmount: number;
    rate: number;
    rates: Record<string, number>
}

const convertCurrency = async (
    amount = 1,
    fromCurrency = 'USD',
    toCurrency = 'EUR'
): Promise<ConversionResult> => {
    try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);

        const rate = response.data.rates[toCurrency];
        const convertedAmount = amount * rate;

        return {
            convertedAmount,
            rate,
            rates: response.data.rates
        };
    } catch (error) {
        console.error('Error fetching currency conversion:', error);
        throw new Error('Failed to fetch currency conversion.');
    }
};

export default convertCurrency;
