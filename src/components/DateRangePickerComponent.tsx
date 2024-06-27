import React, {useState} from 'react';
import { DateRangePicker, FocusedInputShape } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';

type Props = {
    startDate: moment.Moment | null
    setStartDate: (date: moment.Moment | null) => void
    endDate: moment.Moment | null
    setEndDate: (date: moment.Moment | null) => void
}

const DateRangePickerComponent = ({ startDate, setStartDate, endDate, setEndDate }: Props) => {
    const [focusedInput, setFocusedInput] = useState<FocusedInputShape | null>('startDate');
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const handleDatesChange = ({ startDate, endDate }: { startDate: moment.Moment | null, endDate: moment.Moment | null }) => {
        setStartDate(startDate);
        setEndDate(focusedInput === 'startDate' ? null : endDate);
        setFocusedInput(endDate ? 'startDate' : 'endDate');
    };

    const handleFocusChange = (focused: FocusedInputShape | null) => {
        setFocusedInput(focused);
    };

    const handleClick = () => {
        setIsDatePickerOpen(!isDatePickerOpen);
    };

    return (
        <div>
            <DateRangePicker
                startDatePlaceholderText="Departure"
                endDatePlaceholderText="Return"
                block
                openDirection="up"
                keepOpenOnDateSelect
                startDate={startDate}
                startDateId="your_unique_start_date_id"
                endDate={endDate}
                endDateId="your_unique_end_date_id"
                onDatesChange={handleDatesChange}
                focusedInput={focusedInput || 'startDate'}
                onFocusChange={handleFocusChange}
                orientation="vertical"
                numberOfMonths={12}
                verticalHeight={400}
            />
            <button className="close-button" onClick={handleClick}>Close</button>
        </div>
    );
};

export default DateRangePickerComponent;
