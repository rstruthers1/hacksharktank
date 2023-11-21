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
    try {
        const startDateAsDate = new Date(startDate);
        const dayAfter = new Date(startDateAsDate.getTime() + MILLIS_IN_ONE_DAY);
        return dayAfter.getTime();
    } catch (err) {
        console.error(err);
        return getTodayAtMidnight().getTime() + MILLIS_IN_ONE_DAY;
    }
}

export const formatDateTime = (dateTime) => {
    if (!dateTime) {
        return '';
    }
    try {
        const dateTimeAsDate = new Date(dateTime);
        return dateTimeAsDate.toLocaleString();
    } catch (err) {
        console.error(err);
        return '';
    }
}

export const formatDateTimeAsDate  = (date) => {
    if (!date) {
        return '';
    }
    try {
        const dateAsDate = new Date(date);
        return dateAsDate.toLocaleDateString();
    } catch (err) {
        console.error(err);
        return '';
    }
}