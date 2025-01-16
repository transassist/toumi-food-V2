import React from 'react';

const DateRangePicker = ({ startDate, endDate, handleStartDateChange, handleEndDateChange }) => {
  return (
    <div className="flex gap-4 mb-4">
      <div>
        <label htmlFor="start-date" className="block mb-1">تاريخ البداية</label>
        <input
          type="date"
          id="start-date"
          value={startDate}
          onChange={(e) => handleStartDateChange(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      <div>
        <label htmlFor="end-date" className="block mb-1">تاريخ النهاية</label>
        <input
          type="date"
          id="end-date"
          value={endDate}
          onChange={(e) => handleEndDateChange(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
