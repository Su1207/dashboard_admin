import { useState } from "react";
import "./WinData.scss";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";

const WinData = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  if (!selectedDate) {
    const currentDate = new Date();
    setSelectedDate(currentDate);
  }

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault(); // Prevent the default behavior (opening the keyboard)
  };

  return (
    <div>
      <div>
        <h2>Win Data</h2>
        <div className="date-picker-container">
          <div className="date-pic">
            <DatePicker
              className="datePicker"
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd-MMM-yyyy"
              onFocus={handleInputFocus}
              maxDate={new Date()} // Set the maximum date to the current date

              //   placeholderText="Select a Date"
            />
            <div className="calendar">
              <FaCalendarAlt />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinData;
