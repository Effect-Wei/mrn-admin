export function convertToDate(timestamp: number): Date {
  if (timestamp == null) throw new Error('Invalid timestamp: timestamp is required');

  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid timestamp: not a valid date');
  }

  return date;
}
