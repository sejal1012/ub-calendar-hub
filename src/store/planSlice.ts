import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// --- 1. Define the State Shape (Interfaces) ---

/**
 * Defines the structure for a single planning item (e.g., event).
 * We explicitly use Date objects for start/end.
 */
export interface PlanItem {
  title: string;
  start: Date;
  end: Date;
}

/**
 * Defines the structure for the entire slice state.
 */
export interface PlanState {
  value: PlanItem[] | null; // It can be an array of items or null
}

// --- 2. Define Initial State ---

const dummyData: PlanItem[] = [
  {
    title: 'Team Meeting',
    start: new Date(2025, 10, 8, 10, 0), // Nov 8, 2025, 10:00 AM
    end: new Date(2025, 10, 8, 11, 30), // Nov 8, 2025, 11:30 AM
  },
  {
    title: 'Lunch Break',
    start: new Date(2025, 10, 8, 12, 0), // Nov 8, 2025, 12:00 PM
    end: new Date(2025, 10, 8, 13, 0), // Nov 8, 2025, 1:00 PM
  },
  {
    title: 'Project Deadline',
    start: new Date(2025, 10, 10, 9, 0), // Nov 10, 2025, 9:00 AM
    end: new Date(2025, 10, 10, 17, 0), // Nov 10, 2025, 5:00 PM
  },
  {
    title: 'Weekly Review',
    start: new Date(2025, 10, 9, 14, 0), // Nov 9, 2025, 2:00 PM
    end: new Date(2025, 10, 9, 15, 30), // Nov 9, 2025, 3:30 PM
  },
  {
    title: 'Client Presentation',
    start: new Date(2025, 10, 11, 11, 0), // Nov 11, 2025, 11:00 AM
    end: new Date(2025, 10, 11, 12, 30), // Nov 11, 2025, 12:30 PM
  },
];

const initialState: PlanState = {
  value: dummyData,
};



interface RawPlanItem {
  title: string;
  start: string;
  end: string;
}

/** The structure of the complete input object. */
interface RawPlanData {
  plan: RawPlanItem[];
}


// --- 3. Transformation Function ---

function parseDateString(dateStr: string): Date {
  // Regex to capture the date and time components
  const match = dateStr.match(/(\w+) (\d+), (\d+), (\d+):(\d+) (AM|PM)/);

  if (!match) {
    return new Date(2025, 10, 11, 12, 30)
  }
  
  const [_, monthName, day, year, hourStr, minuteStr, ampm] = match;

  // Map month name (e.g., "Nov") to 0-indexed month (e.g., 10)
  const monthMap: { [key: string]: number } = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };

  const monthIndex = monthMap[monthName];
  const dayInt = parseInt(day, 10);
  const yearInt = parseInt(year, 10);
  let hours = parseInt(hourStr, 10);
  const minutes = parseInt(minuteStr, 10);

  // Convert 12-hour format to 24-hour format
  if (ampm === 'PM' && hours < 12) {
    hours += 12;
  } else if (ampm === 'AM' && hours === 12) {
    hours = 0; // 12:xx AM is midnight
  }

  // Construct the Date object using the explicit components
  return new Date(yearInt, monthIndex, dayInt, hours, minutes);
}

/**
 * Transforms the raw plan data structure into an array of PlanItem objects 
 * with proper Date objects for start and end times.
 * @param rawData The input object containing the 'plan' array.
 * @returns An array of PlanItem objects.
 */
function transformPlanData(rawData: RawPlanItem[] | PlanItem[]): PlanItem[]  {
  return rawData.map(item => ({
    title: item.title,
    start: parseDateString(item.start),
    end: parseDateString(item.end),
  }));
}

// --- 4. Generated Output (Constant Array) ---


// --- 3. Create the Slice with Typed Reducers ---

export const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {
    // Reducer with a fully typed action payload
    updateData: (state, action: PayloadAction< RawPlanItem[] | PlanItem[] >) => {
      // action.payload is guaranteed to have the shape { plan: PlanItem[] }
      state.value = transformPlanData(action.payload);
      console.log(state.value)
    },
    // Reducer with no payload (PayloadAction<void> is optional here)
    clearData: (state) => {
      state.value = null;
    },
  },
});

// Export action creators and the reducer
export const { updateData, clearData } = planSlice.actions;
export default planSlice.reducer;