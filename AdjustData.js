class AdjustData{
    constructor() {
        this.student = []
        this.outline = []
        this.adjustMoney = []
    }
    import(ss, dates) {
    const data=ss.getSheetByName('adjust').getDataRange().getValues()  //get sheet
        for (let row = 1; row < data.length; row++) {
            const day = dayjs.dayjs(Utilities.formatDate(data[row][5], "JST", "yyyy/MM/dd"));
            if (day.year() == dates.yr && day.month() + 1 == dates.mo) {    //その年・月のデータであれば、Dictに授業のデータを入れる
                this.student.push(data[row][1])
                this.outline.push(data[row][2])
                this.adjustMoney.push(data[row][3])
            }
        }
    }
}