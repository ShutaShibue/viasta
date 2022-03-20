/** 全指導報告書データから今月分のデータを抽出し、Dict "shidouMonth" を作成 */
function constructShidouDict(shidou, inputYear, inputMonth) {

  //construct dict of this month w key:each col - val: List of classes
  var shidouMonth = {
    tutor : [],    
    student : [],
    date : [],
    startTime : [],
    endTime : [],
    material : [],
    mins : [],
    money : [],
  };

  for (var row = 2; row < shidou.length; row++) { 
    // Shidou: Column Numbers
    // 0 タイムスタンプ
    // 1 指導有無
    // 2 講師名
    // 3 生徒名
    // 4 授業年月日
    // 5 指導開始時刻
    // 6 指導終了時刻
    // 7 指導内容

    var day = dayjs.dayjs(Utilities.formatDate(shidou[row][4],"JST", "yyyy/MM/dd")); 
    if (day.year() == inputYear && day.month() + 1 == inputMonth) {    //その年・月のデータであれば、Dictに授業のデータを入れる

      //その授業についてのデータを格納
      shidouMonth.tutor.push(shidou[row][2]);
      shidouMonth.student.push(shidou[row][3]);
      shidouMonth.date.push(Utilities.formatDate(shidou[row][4],"JST", "yyyy/MM/dd"));
      shidouMonth.startTime.push(Utilities.formatDate(shidou[row][5],"JST", "HH:mm"));
      shidouMonth.endTime.push(Utilities.formatDate(shidou[row][6],"JST", "HH:mm"));
      shidouMonth.material.push(shidou[row][7]);

      //指導時間をMinsで計算する
      var from = new Date(shidou[row][5]);
      var to = new Date(shidou[row][6]);
      if (from.getTime() < to.getTime()) {
        var ms = to.getTime() - from.getTime();
      } else {
        to.setDate(to.getDate() + 1);
        var ms = to.getTime() - from.getTime();
      }

      var mins = Math.floor(ms/(1000*60)); //msをMinsに変換

      //異常に長い授業時間は、一応レポート
      if (mins > 180) {
        Logger.log("タイムスタンプ：　", shidou[row][0], "　に3時間以上の授業時間が確認されました。");
      }

      //指導時間のデータも格納
      shidouMonth.mins.push(mins); //現時点では分数だが、ここに時給や給与を後から掛ける
    }
  }
  return shidouMonth
};