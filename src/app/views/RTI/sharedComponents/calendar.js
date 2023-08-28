import { CalendarComponent } from "@syncfusion/ej2-react-calendars";
import React, { useState } from "react";

function Calendar(props) {
    const [date, setDate] = useState(new Date());

    return (
        <div id="rtiCalendar">
            <CalendarComponent
                id="calendar"
                change={(args) => {
                    props.handleChange(args.value);
                    setDate(args.value);
                }}
                value={date}
            />
        </div>
    );
}

export default Calendar;