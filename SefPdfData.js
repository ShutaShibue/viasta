/** "shidouStudent"と請求書テンプレートをもとに、PDFを作成し、そのリンクを配列で出力 */
function SetPdfData(shidouStudent, spreadsheet, invoiceS, studentData, inputYear, inputMonth, inputDeadline) {
    const studentURLs = {
      name : [],
      email : [],
      url : [],
    };
  
    for (var studentID in shidouStudent) {
      const data = shidouStudent[studentID];
      const name = data.student;  //修正
      const length = data.date.length;
      Logger.log("pdfStudents:name is "+name);
      //小計の計算
      var smallTotal = 0;
      for (var i = 0; i < data.money.length; i++) {
        smallTotal += data.money[i];
      }
      Logger.log(smallTotal);
  
      //請求書テンプレをコピーして新しい「生徒名」のシートを作成
      const newInvoice = invoiceS.copyTo(spreadsheet); //new sheet
      const sheetName = data.student[1];
      newInvoice.setName(sheetName);
      
      
      //データを入れるために、フィールドを拡張
      for(var i = 1; i < length; i++){
        newInvoice.getRange('17:17').activate();
        newInvoice.insertRowsAfter(newInvoice.getActiveRange().getLastRow(), 1);
        newInvoice.getRange('E18:F18').activate().mergeAcross();
        newInvoice.getRange('G18:H18').activate().mergeAcross();
      }
  
      //var bigTotal = smallTotal + other;
  
      const endLine = 22 + length;
  
      //シートのメインの配列に値を設定する
      newInvoice.getRange(17,2, length).setValues(data.date.map(x => [x]));
      newInvoice.getRange(17,3, length).setValues(data.startTime.map(x => [x]));
      newInvoice.getRange(17,4, length).setValues(data.endTime.map(x => [x]));
      newInvoice.getRange(17,5, length).setValues(data.tutor.map(x => [x]));
      newInvoice.getRange(17,7, length).setValues(data.material.map(x => [x]));
      newInvoice.getRange(17,9, length).setValues(data.money.map(x => [x]));
      newInvoice.getRange(17 + length,9).setValue(smallTotal);
      //newInvoice.getRange(17 + length + 1,9).setValue(other);
      //newInvoice.getRange(17 + length + 2,9).setValue(bigTotal);
  
      
      //シート上部に情報を設定する
      //newInvoice.getRange(13,3).setValue("¥" + bigTotal + "—");
      newInvoice.getRange('B3').setValue(name);
  
      const today = dayjs.dayjs();
      const hiduke = today.format('YYYY/MM/DD');
      newInvoice.getRange('I4').setValue(hiduke); //今日の請求日    
      
      newInvoice.getRange('C7').setValue("Viasta 指導料金 — " + inputYear + "年" + inputMonth +"月分");
      newInvoice.getRange('C8').setValue(Utilities.formatDate(inputDeadline,"JST", "yyyy/MM/dd").toString());
      newInvoice.getRange('C8').setHorizontalAlignment("left")
      const invoiceID = inputYear + "-" + inputMonth + "-"+ studentID;
      newInvoice.getRange('I3').setValue(invoiceID);
  
      Utilities.sleep(1000); //1秒待機（待機中に情報を更新）
      SpreadsheetApp.flush(); //挿入したシートの情報更新
   
      //PDF化
      const ssId = spreadsheet.getId();                                    //スプレッドシートIDを取得
      const sheetId = newInvoice.getSheetId();                             //取引先のシートIDを取得
      const folderurl = newInvoice.getRange('M3').getValue();              //newInvoiceのセルJ2の値（PDF保管先のフォルダURL）
      const folder = DriveApp.getFolderById(folderurl);                    //PDF保管先のfolderを設定
      PDFexport(ssId, sheetId, endLine, folder, invoiceID, name);
      spreadsheet.deleteSheet(newInvoice);
  
      //OUTPUT
      studentURLs[name].push(name);
      studentURLs[email].push(studentData.pEmail);
      studentURLs[url].push("null");
    }
    Logger.log(studentURLs);
  };