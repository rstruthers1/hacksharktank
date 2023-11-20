const MILLIS_IN_ONE_DAY = 86400000;

export const getTodayAtMidnight = () => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return today;
}

export const getMinEndDate = (startDate) => {
    if (!startDate) {
        return getTodayAtMidnight().getTime() + MILLIS_IN_ONE_DAY;
    }
    return new Date(startDate.getTime() + MILLIS_IN_ONE_DAY);

}