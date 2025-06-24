declare module 'react-calendar-heatmap' {
  import * as React from 'react';

  export interface CalendarHeatmapValue {
    date: string | Date;
    count?: number;
  }

  export interface CalendarHeatmapProps {
    startDate: string | Date;
    endDate: string | Date;
    values: CalendarHeatmapValue[];
    classForValue?: (value: CalendarHeatmapValue) => string;
    tooltipDataAttrs?: (value: CalendarHeatmapValue) => Record<string, string>;
    showWeekdayLabels?: boolean;
  }

  const CalendarHeatmap: React.FC<CalendarHeatmapProps>;

  export default CalendarHeatmap;
}