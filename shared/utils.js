module.exports = {
    emailValidator: function (email) {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (email.match(emailRegex)) return true;
        return false;
    },
    formatTimeAgo(date) {
        if(date == undefined) {
            return 'NaN'
        }

        // https://blog.webdevsimplified.com/2020-07/relative-time-format/
        const formatter = new Intl.RelativeTimeFormat('th', {
            numeric: 'auto'
        });

        const DIVISIONS = [
            { amount: 60, name: 'seconds' },
            { amount: 60, name: 'minutes' },
            { amount: 24, name: 'hours' },
            { amount: 7, name: 'days' },
            { amount: 4.34524, name: 'weeks' },
            { amount: 12, name: 'months' },
            { amount: Number.POSITIVE_INFINITY, name: 'years' }
        ];

        let duration = (date - new Date()) / 1000;
        for (let i = 0; i <= DIVISIONS.length; i++) {
            const division = DIVISIONS[i]
            if (Math.abs(duration) < division.amount) {
                return formatter.format(Math.round(duration), division.name)
            }
            duration /= division.amount
        }
    }
}