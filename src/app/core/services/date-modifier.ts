export class DateModifier {
    constructor() {
    }
    modifier(dateConvert) {
        var dateToConvert = new Date(dateConvert);
        var getMmonth = (dateToConvert.getMonth() + 1) < 10 ? ("0" + (dateToConvert.getMonth() + 1)) : (dateToConvert.getMonth() + 1);
        var getDate = dateToConvert.getDate() < 10 ? "0" + dateToConvert.getDate() : dateToConvert.getDate();
        return `${dateToConvert.getFullYear()}-${getMmonth}-${getDate}`;
    }
}
