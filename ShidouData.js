/** 全指導報告書データから今月分のデータを抽出し、Dict "shidouMonth" を作成 */
class ShidouData {
  constructor(){
    //construct dict of this month w key:each col - val: List of classes
    this.tutor = []
    this.student = []
    this.date = []
    this.startTime = []
    this.endTime = []
    this.material = []
    this.mins = []
    this.money = []
  }

  month(ss, dates) {
    const shidou = ss.getSheetByName('shidou').getDataRange().getValues();
    
    for (let row = 2; row < shidou.length; row++) {
      // Shidou: Column Numbers
      // 0 タイムスタンプ
      // 1 指導有無
      // 2 講師名
      // 3 生徒名
      // 4 授業年月日
      // 5 指導開始時刻
      // 6 指導終了時刻
      // 7 指導内容
  
      const day = dayjs.dayjs(Utilities.formatDate(shidou[row][4], "JST", "yyyy/MM/dd"));
      if (day.year() == dates.yr && day.month() + 1 == dates.mo) {    //その年・月のデータであれば、Dictに授業のデータを入れる
  
        //その授業についてのデータを格納
        this.tutor.push(shidou[row][2]);
        this.student.push(shidou[row][3]);
        this.date.push(Utilities.formatDate(shidou[row][4], "JST", "yyyy/MM/dd"));
        this.startTime.push(Utilities.formatDate(shidou[row][5], "JST", "HH:mm"));
        this.endTime.push(Utilities.formatDate(shidou[row][6], "JST", "HH:mm"));
        this.material.push(shidou[row][7]);
  
        //指導時間をMinsで計算する
        const from = new Date(shidou[row][5]);
        const to = new Date(shidou[row][6]);
        let ms
        if (from.getTime() < to.getTime()) {
          ms = to.getTime() - from.getTime();
        } else {
          to.setDate(to.getDate() + 1);
          ms = to.getTime() - from.getTime();
        }
  
        const mins = Math.floor(ms / (1000 * 60)); //msをMinsに変換
  
        //異常に長い授業時間は、一応レポート
        if (mins > 180) {
          Logger.log("タイムスタンプ：", shidou[row][0], "　に3時間以上の授業時間が確認されました。");
        }
  
        //指導時間のデータも格納
        this.mins.push(mins); //現時点では分数だが、ここに時給や給与を後から掛ける
      }
    }
  }
}