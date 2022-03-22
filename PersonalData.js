/**
 * 生徒データを取り入れて、各項目をKeyにDict"studentData"を作成
 * @type {Dictionary} 
 */
class StudentData{
  constructor() {
    this.studentID = []
    this.name = []
    this.email = []
    this.pEmail = [] //parents email
  }

  import(ss) {
    const data=ss.getSheetByName('student').getDataRange().getValues()
    for (let row = 1; row < data.length; row++) {
      this.studentID.push(data[row][0]);    // 0 生徒ID
      this.name.push(data[row][1]);       // 1 名前	
      this.email.push(data[row][2]);      // 2 メールアドレス
      this.pEmail.push(data[row][3]);       // 3 親メールアドレス	
    }
  }
}

/**
 * 講師データを取り入れて、各項目をKeyにDict"tutorData"を作成
 * @type {Dictionary} 
 */
 class TutorData{
   constructor() {
     this.tutorID = []
     this.name = []
     this.email = []
     this.wage = []
     this.percent = []
   }

   import(ss) {
    const data=ss.getSheetByName('tutor').getDataRange().getValues()
    for (let row = 1; row < data.length; row++) {
      this.tutorID.push(data[row][0]);    // 0 講師ID
      this.name.push(data[row][1]);       // 1 名前	
      this.email.push(data[row][2]);      // 2 メールアドレス
      this.wage.push(data[row][3]);       // 3 給料	
      this.percent.push(data[row][4]);    // 4 固定給(%)
    }
  }
}