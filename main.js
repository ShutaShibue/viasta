function main() {

  /** PART 1: 指導報告書データの処理 */

  /* Variable一覧 */  
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();  //ファイル
  var invoiceS = spreadsheet.getSheetByName('invoice');  //インプットの年月
  var inputDeadline = invoiceS.getRange("M6").getValue(); //int Month
  var inputYear = invoiceS.getRange("M7").getValue(); //int Year
  var inputMonth = invoiceS.getRange("M8").getValue(); //int Month
  Logger.log(inputYear + "年" + inputMonth + "月"); //正しい年月の請求書を発行しているか確認

  /* 講師・生徒データベースを作成 */
  var tutorDataS = spreadsheet.getSheetByName('tutor');
  var tutorDatas = tutorDataS.getDataRange().getValues();
  var tutorData = constructTutorDict(tutorDatas);

  var studentDataS = spreadsheet.getSheetByName('student');
  var studentDatas = studentDataS.getDataRange().getValues(); //講師データを取り入れて、各項目をKeyにDict"tutorData"を作成
  var studentData = constructStudentDict(studentDatas); //生徒データを取り入れて、各項目をKeyにDict"studentData"を作成
  Logger.log(studentData);
  Logger.log(tutorData);

  /* 指導報告書をDictで管理 */
  var shidouS = spreadsheet.getSheetByName('shidou');
  var shidou = shidouS.getDataRange().getValues();
  var shidouMonth = constructShidouDict(shidou, inputYear, inputMonth);　//全指導報告書データから今月分のデータを抽出し、Dict "shidouMonth" を作成
  var shidouStudent = constructShidouStudentDict(shidouMonth, studentData); //今月分のデータDictから、各生徒のデータDict "shidouStudent" を作成
  var shidouTutor = constructShidouTutorDict(shidouMonth, tutorData); //今月分のデータDictから、各講師のデータDict "shidouTutor" を作成
  Logger.log(shidouStudent);
  Logger.log(shidouTutor);
  
  /** PART TWO: PDF作成 */

  var studentURLs = pdfStudents(shidouStudent, spreadsheet, invoiceS, studentData, inputYear, inputMonth, inputDeadline) //各生徒に対して、請求書のPDFを作成する
  Logger.log(studentURLs);

  //各講師に対して、給与明細のPDFを作成する
};