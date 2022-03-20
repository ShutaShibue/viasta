/**
 * 生徒データを取り入れて、各項目をKeyにDict"studentData"を作成
 * @type {Dictionary} 
 */
class StudentData{
  constructor(sheetData) {
    this.studentID = []
    this.name = []
    this.email = []
    this.pEmail = [] //parents email

    for (let row = 1; row < sheetData.length; row++) {
      this.studentID.push(sheetData[row][0]);    // 0 生徒ID
      this.name.push(sheetData[row][1]);       // 1 名前	
      this.email.push(sheetData[row][2]);      // 2 メールアドレス
      this.pEmail.push(sheetData[row][3]);       // 3 親メールアドレス	
    }
  }
}

/**
 * 講師データを取り入れて、各項目をKeyにDict"tutorData"を作成
 * @type {Dictionary} 
 */
 class TutorData{
  constructor(sheetData) {
    this.tutorID = []
    this.name= []
    this.email= []
    this.wage= []
    this.percent = []
    
    for (let row = 1; row < sheetData.length; row++) {
      this.tutorID.push(sheetData[row][0]);    // 0 講師ID
      this.name.push(sheetData[row][1]);       // 1 名前	
      this.email.push(sheetData[row][2]);      // 2 メールアドレス
      this.wage.push(sheetData[row][3]);       // 3 給料	
      this.percent.push(sheetData[row][4]);    // 4 固定給(%)
    }
  }
}