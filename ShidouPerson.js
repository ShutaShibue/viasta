/** 今月分のデータDictから、各生徒のデータDict "shidouStudent/shidouTutor" を作成 */
class ShidouPerson{
  //key: 生徒ID
  //value: 授業データ
  //Dict<生徒ID, Dict<shidouMonth.keys(), data>>

  /**
   * 
   * @param {string} personType student or tutor
   * @param {ShidouMonthData} shidouMonth
   * @param {TutorData} PersonData 
   * @returns 
   */
  constructor(personType, shidouMonth, PersonData) {

    for (let i = 0; i < shidouMonth.date.length; i++) {  //今月行われた全授業を各人に振り分けていく  
      const personName = shidouMonth[personType][i];
      const findID = PersonData.name.indexOf(personName);
      if (findID == -1) {
        throw new Error("Cannot find "+ personType +" in database");
      }
      const personID = PersonData[personType+"ID"][findID]; //名前をIDに変換
      let hourly
      if (personType == "student") hourly = 5900; //授業料
      else hourly = PersonData.wage[findID] //給料

      if (!(personID in this)) { //if new
        this[personID] = new ShidouData()
      }
      for (let key in shidouMonth) {
        if (key == "money") {
          this[personID][key].push(Math.round(shidouMonth.mins[i] * hourly / 600)*10);
        } else {
          this[personID][key].push(shidouMonth[key][i]);
        }
      }
    }
  }
}