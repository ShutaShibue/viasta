/** 指導報告書・調整管理・給与登録からデータを読み取り、その月のTransfers表を返す */
function main() {

  /** PART 1: 指導報告書データの処理 */

  /* Variable一覧 */  
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();  //ファイル
  const invoiceS = spreadsheet.getSheetByName('invoice');  //インプットの年月
  const inputDeadline = invoiceS.getRange("M6").getValue(); //int Month
  const inputYear = invoiceS.getRange("M7").getValue(); //int Year
  const inputMonth = invoiceS.getRange("M8").getValue(); //int Month
  Logger.log(inputYear + "年" + inputMonth + "月"); //正しい年月の請求書を発行しているか確認

  /* 講師・生徒データベースを作成 */
  const tutorDataS = spreadsheet.getSheetByName('tutor');
  const tutorDatas = tutorDataS.getDataRange().getValues();
  const tutorData = new TutorData(tutorDatas);

  const studentDataS = spreadsheet.getSheetByName('student');
  const studentDatas = studentDataS.getDataRange().getValues(); //講師データを取り入れて、各項目をKeyにDict"tutorData"を作成
  const studentData = new StudentData(studentDatas); //生徒データを取り入れて、各項目をKeyにDict"studentData"を作成
  Logger.log(studentData);
  Logger.log(tutorData);

  /* 指導報告書をDictで管理 */
  const shidouS = spreadsheet.getSheetByName('shidou');
  const shidou = shidouS.getDataRange().getValues();
  const shidouMonth = new ShidouData();
  shidouMonth.month(shidou, inputYear, inputMonth)//全指導報告書データから今月分のデータを抽出し、Dict "shidouMonth" を作成
  const shidouStudent = new ShidouPerson("student",shidouMonth, studentData); //今月分のデータDictから、各生徒のデータDict "shidouStudent" を作成
  const shidouTutor = new ShidouPerson("tutor",shidouMonth,tutorData); //今月分のデータDictから、各講師のデータDict "shidouTutor" を作成
  Logger.log(shidouStudent);
  Logger.log(shidouTutor);
  
  /** PART TWO: PDF作成 */

  const studentURLs = pdfStudents(shidouStudent, spreadsheet, invoiceS, studentData, inputYear, inputMonth, inputDeadline) //各生徒に対して、請求書のPDFを作成する
  Logger.log(studentURLs);

  //各講師に対して、給与明細のPDFを作成する
};