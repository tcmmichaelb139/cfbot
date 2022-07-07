function convertToTimeZone(date) {
  const now = new Date();
  date -= now.getTimezoneOffset() * 60;
  date -= (date % 86400) - 86400;
  return date;
}

export default convertToTimeZone;
