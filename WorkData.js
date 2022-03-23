class WorkData{
    constructor() {
        this.tutor = []
        this.date = []
        this.salary = []
        this.specialPay = []
    }
    import(ss, dates) {
    const data=ss.getSheetByName('work').getDataRange().getValues()  //get sheet
        for (let row = 1; row < data.length; row++) {
            const day = dayjs.dayjs(Utilities.formatDate(data[row][2], "JST", "yyyy/MM/dd"));
            if (day.year() == dates.yr && day.month() + 1 == dates.mo) {    //その年・月のデータであれば、Dictに授業のデータを入れる
                this.tutor.push(data[row][1])
                this.date.push(data[row][2])
                this.salary.push(data[row][3])
                this.specialPay.push(data[row][4])
            }
        }
    }
}