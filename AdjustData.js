class AdjustData{
    constructor(dates) {
        this.student = []
        this.outline = []
        this.money = []
        this.yr = dates.yr
        this.mo = dates.mo
    }
    import(SS) {
        //get sheet
        for (let row = 1; row < sheetData.length; row++) {
            const day = dayjs.dayjs(Utilities.formatDate(sheetData[row][5], "JST", "yyyy/MM/dd"));
            if (day.year() == inputYear && day.month() + 1 == inputMonth) {
                this.student.push(sheetData[row][1])
                this.outline.push(sheetData[row][2])
                this.money.push(sheetData[row][3])
            }
        }
    }
}