export const getMinAndMaxTime = () => {
  const minTime = new Date();
  minTime.setHours(10, 30, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(20, 0, 0, 0);

  return {minTime, maxTime};
}