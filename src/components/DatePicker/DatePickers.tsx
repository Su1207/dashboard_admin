import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import "./DatePicker.scss";

type Props = {
  setSelectDate: React.Dispatch<React.SetStateAction<Date | null>>;
};

const DatePickers = (props: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>();

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    props.setSelectDate(date);
    console.log(props.setSelectDate);
  };

  return (
    <div className="date-picker-container">
      <div className="date-pic">
        <DatePicker
          className="datePicker"
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd-MMM-yyyy"
          startDate={selectedDate}
        />
        <div className="calendar">
          <FaCalendarAlt />
        </div>
      </div>
    </div>
  );
};

export default DatePickers;
