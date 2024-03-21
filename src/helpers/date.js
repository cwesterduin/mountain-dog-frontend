export function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}

export function makeDate(e) {
    try {
        const monthNames = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
        let dateParts
        dateParts = e.split("-");
        let jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0, 2));
        jsDate = `${ordinal_suffix_of(jsDate.getDate())} ${monthNames[jsDate.getMonth()]} ${jsDate.getFullYear()}`
        return jsDate
    } catch (e) {
        return null
    }
}