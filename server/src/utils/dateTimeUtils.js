const moment = require('moment');


const convertDateToDBFormat = (date) => {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
};

const getTodayAtMidnight = () => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return today;
}

module.exports = {
    convertDateToDBFormat,
    getTodayAtMidnight
};