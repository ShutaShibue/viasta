/** 今月分のデータDictから、各生徒のデータDict "shidouStudent/shidouTutor" を作成 */
class ShidouPerson {
  //key: 生徒ID
  //value: 授業データ<ShidouData>
  //Dict<生徒ID, Dict<shidouMonth.keys(), data>>
  constructor(pType) {
    this.pType = pType
  }
  addShidou(shidouMonth, PersonData) {

    for (let i = 0; i < shidouMonth.date.length; i++) {  //今月行われた全授業を各人に振り分けていく  
      const personName = shidouMonth[this.pType][i];
      const findID = PersonData.name.indexOf(personName);
      if (findID == -1) {
        throw new Error("Cannot find " + this.pType + " in database");
      }
      const personID = PersonData[this.pType + "ID"][findID]; //名前をIDに変換
      let hourly
      if (this.pType == "student") hourly = 5900; //授業料
      else hourly = PersonData.wage[findID] //給料

      // 指導の登録
      if (!(personID in this)) { //if new
        this[personID] = new ShidouData()
      }
      for (let key in shidouMonth) {
        if (key == "money") {
          this[personID][key].push(Math.round(shidouMonth.mins[i] * hourly / 600) * 10);
        } else {
          this[personID][key].push(shidouMonth[key][i]);
        }
      }
    }
  }

  addAdjust(adjustData, studentData) {
    if (this.pType != "student") throw new Error("Method can't be used for " + this.pType)
    
    for (let i = 0; i < adjustData.student.length; i++) {  //AdjustDataを各人に振り分けていく
      const name = adjustData.student[i]
      const findID = studentData.name.indexOf(name);
      if (findID == -1) {
        throw new Error("Cannot find " + this.pType + " in database");
      }
      const id = studentData[this.pType + "ID"][findID]; //名前をIDに変換
    
      if (!this[id]) {
        this[id] = new ShidouData() // if new student
        this[id].student.push(name)
      }
      if (this[id].outline == undefined) { //if new adjust
        this[id].outline = []
        this[id].adjustMoney = 0
      }
      this[id].outline.push(adjustData["outline"][i])
      this[id].adjustMoney += adjustData["adjustMoney"][i]
    }
  }

  addWork(workData, tutorData) {
    if (this.pType != "tutor") throw new Error("Method can't be used for " + this.pType)
    
    for (let i = 0; i < workData.tutor.length; i++) {  //WorkDataを各人に振り分けていく
      const name = workData.tutor[i]
      const findID = tutorData.name.indexOf(name);
      if (findID == -1) {
        throw new Error("Cannot find " + this.pType + " in database");
      }
      const id = tutorData[this.pType + "ID"][findID]; //名前をIDに変換
      
      //処理未追加
    }
  }
}
