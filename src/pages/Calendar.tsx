import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from 'moment'
import { useEffect, useState } from 'react'

const localizer = momentLocalizer(moment)

// Dummy data for testing
const dummyData = [
  {
    title: 'Team Meeting',
    start: new Date(2025, 10, 8, 10, 0), // Nov 8, 2025, 10:00 AM
    end: new Date(2025, 10, 8, 11, 30),  // Nov 8, 2025, 11:30 AM
  },
  {
    title: 'Lunch Break',
    start: new Date(2025, 10, 8, 12, 0), // Nov 8, 2025, 12:00 PM
    end: new Date(2025, 10, 8, 13, 0),   // Nov 8, 2025, 1:00 PM
  },
  {
    title: 'Project Deadline',
    start: new Date(2025, 10, 10, 9, 0),  // Nov 10, 2025, 9:00 AM
    end: new Date(2025, 10, 10, 17, 0),   // Nov 10, 2025, 5:00 PM
  },
  {
    title: 'Weekly Review',
    start: new Date(2025, 10, 9, 14, 0),  // Nov 9, 2025, 2:00 PM
    end: new Date(2025, 10, 9, 15, 30),   // Nov 9, 2025, 3:30 PM
  },
  {
    title: 'Client Presentation',
    start: new Date(2025, 10, 11, 11, 0), // Nov 11, 2025, 11:00 AM
    end: new Date(2025, 10, 11, 12, 30),  // Nov 11, 2025, 12:30 PM
  }
]

const MyCalendar = ({ todayData = dummyData }) => {
  const [events, setEvents] = useState(dummyData)

  useEffect(() => {
    if (todayData && todayData !== dummyData) {
      // Assuming todayData is an array of events with proper date fields
      const formattedEvents = todayData.map(event => ({
        title: event.title || 'Event',
        start: new Date(event.start),
        end: new Date(event.end || event.start),
      }))
      setEvents(formattedEvents)
    }
  }, [todayData])

  return (
    <div className='h-screen'>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 800 }}
      />
    </div>
  )
}

export default MyCalendar