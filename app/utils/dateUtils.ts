export function calculateDuration(startTime: string, endTime: string): string {
  // Convert 12-hour format to 24-hour format
  const convertTo24Hour = (time: string) => {
    const [timeStr, meridiem] = time.split(' ');
    let [hours, minutes] = timeStr.split(':').map(Number);
    
    if (meridiem === 'PM' && hours !== 12) {
      hours += 12;
    } else if (meridiem === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return { hours, minutes };
  };

  const start = convertTo24Hour(startTime);
  const end = convertTo24Hour(endTime);

  // Calculate duration
  let durationHours = end.hours - start.hours;
  let durationMinutes = end.minutes - start.minutes;

  // Handle next day arrival
  if (durationHours < 0) {
    durationHours += 24;
  }

  // Adjust minutes if negative
  if (durationMinutes < 0) {
    durationHours--;
    durationMinutes += 60;
  }

  // Format duration
  if (durationHours === 0) {
    return `${durationMinutes} mins`;
  } else if (durationMinutes === 0) {
    return `${durationHours} hrs`;
  } else {
    return `${durationHours} hrs ${durationMinutes} mins`;
  }
} 