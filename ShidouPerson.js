/** 今月分のデータDictから、各生徒のデータDict "shidouStudent" を作成 */
function constructShidouStudentDict(shidouMonth, studentData) {
  //key: 生徒ID
  //value: 授業データ
  //Dict<生徒ID, Dict<shidouMonth.keys(), data>>

  var hourly = 5900; //授業料

  var shidouStudent = {};
  for (var i = 0; i < shidouMonth.date.length; i++) {  //今月行われた全授業を生徒毎に振り分けていく  
    var studentName = shidouMonth.student[i];
    var findStudentID = studentData.name.indexOf(studentName);
    if (findStudentID == -1) {
      Logger.log("Error! Cannot find student in database");
    }
    var studentID = studentData.studentID[findStudentID]; //生徒名をIDに変換
    if (!(studentID in shidouStudent)) { //if new
      shidouStudent[studentID] = {};
      for (var key in shidouMonth) {
        shidouStudent[studentID][key] = [];
      }
    } 
    for (var key in shidouMonth) {
      if (key == "money") {
        shidouStudent[studentID][key].push(shidouMonth.mins[i] * hourly / 60);
      } else {
        shidouStudent[studentID][key].push(shidouMonth[key][i]);
      }
    }
  }
  return shidouStudent;
}