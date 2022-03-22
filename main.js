/** 指導報告書・調整管理・給与登録からデータを読み取り、その月のTransfers表を返す */
function main() {

  /** PART 1: 指導報告書データの処理 */

  /* Variable一覧 */  
  const ss = SpreadsheetApp.getActiveSpreadsheet();  //ファイル
  const invoiceS = ss.getSheetByName('invoice');  //インプットの年月
  const dates = getDates(invoiceS) //年、月、期限を取得
  Logger.log(dates.yr + "年" + dates.mo + "月"); //正しい年月の請求書を発行しているか確認

  /* 講師・生徒データベースを作成 */
  const tutorData = new TutorData();
  tutorData.import(ss)
  const studentData = new StudentData();  //StudentDataクラスをインスタンス化
  studentData.import(ss)  //生徒データを取り入れて、各項目をKeyにDict"studentData"を作成
  Logger.log(studentData);
  Logger.log(tutorData);

  /* 指導報告書をDictで管理 */
  const shidouMonth = new ShidouData();
  shidouMonth.month(ss, dates)//全指導報告書データから今月分のデータを抽出し、Dict "shidouMonth" を作成
  
  const shidouStudent = new ShidouPerson("student", shidouMonth, studentData); //今月分のデータDictから、各生徒のデータDict "shidouStudent" を作成
  const shidouTutor = new ShidouPerson("tutor", shidouMonth, tutorData); //今月分のデータDictから、各講師のデータDict "shidouTutor" を作成
  Logger.log(shidouStudent);
  Logger.log(shidouTutor);
  
  /** PART TWO: PDF作成 */

  const studentURLs = SetPdfData("student", shidouStudent, ss, studentData, dates) //各生徒に対して、請求書のPDFを作成する
  Logger.log(studentURLs);

  //各講師に対して、給与明細のPDFを作成する
};

function getDates(invoiceS) {
  const dates = {
    yr: invoiceS.getRange("M7").getValue(),
    mo: invoiceS.getRange("M8").getValue(),
    deadline : invoiceS.getRange("M6").getValue()
  }
  return dates
}