/** "shidouStudent"と請求書テンプレートをもとに、PDFを作成し、そのリンクを配列で出力 */
function SetPdfData(pType, shidouPerson, spreadsheet, invoiceS, personalData, inputYear, inputMonth, inputDeadline) {
    const studentURLs = {
      name : [],
      email : [],
      url : [],
    };
  
    for (var pID in shidouPerson) {
      const data = shidouPerson[pID];
      const name = data[pType][0];  //修正
      const length = data.date.length;
        Logger.log(pType + " is " + name);
      //小計の計算
      var smallTotal = 0;
      for (var i = 0; i < length; i++) {
        smallTotal += data.money[i];
      }
      Logger.log("小計: "+smallTotal);
  
      //請求書テンプレをコピーして各人の名前のシートを作成
      const paySheet = invoiceS.copyTo(spreadsheet); //new sheet
      paySheet.setName(name);
      
      
      //データを入れるために、フィールドを拡張
      for(var i = 1; i < length; i++){
        paySheet.getRange('17:17').activate();
        paySheet.insertRowsAfter(paySheet.getActiveRange().getLastRow(), 1);
        paySheet.getRange('E18:F18').activate().mergeAcross();
        paySheet.getRange('G18:H18').activate().mergeAcross();
      }
  
      //var bigTotal = smallTotal + other;
  
      const endLine = 22 + length;
  
      //シートのメインの配列に値を設定する
      const stConvert = pType==="student"?"tutor":"student"
      paySheet.getRange(17,2, length).setValues(data.date.map(x => [x]));
      paySheet.getRange(17,3, length).setValues(data.startTime.map(x => [x]));
      paySheet.getRange(17,4, length).setValues(data.endTime.map(x => [x]));
      paySheet.getRange(17,5, length).setValues(data[stConvert].map(x => [x]));
      paySheet.getRange(17,7, length).setValues(data.material.map(x => [x]));
      paySheet.getRange(17,9, length).setValues(data.money.map(x => [x]));
      paySheet.getRange(17 + length,9).setValue(smallTotal);
      //newInvoice.getRange(17 + length + 1,9).setValue(other);
      //newInvoice.getRange(17 + length + 2,9).setValue(bigTotal);
  
      
      //シート上部に情報を設定する
      //newInvoice.getRange(13,3).setValue("¥" + bigTotal + "—");
      paySheet.getRange('B3').setValue(name);    
      const month = ('0' + inputMonth).slice(-2) //0埋め, 5月→05月
      paySheet.getRange('C7').setValue("Viasta Online Consulting — " + inputYear + "年" + month +"月分");
      const invoiceID = inputYear  + inputMonth + "-"+ pID;
      paySheet.getRange('I3').setValue(invoiceID);
  
      Utilities.sleep(1000); //1秒待機（待機中に情報を更新）
      SpreadsheetApp.flush(); //挿入したシートの情報更新
   
      //PDF化
      const ssId = spreadsheet.getId();                                    //スプレッドシートIDを取得
      const sheetId = paySheet.getSheetId();                             //取引先のシートIDを取得
      const folderurl = paySheet.getRange('M3').getValue();              //newInvoiceのセルJ2の値（PDF保管先のフォルダURL）
      const folder = DriveApp.getFolderById(folderurl);                    //PDF保管先のfolderを設定
      PDFexport(ssId, sheetId, endLine, folder, invoiceID, name);
      spreadsheet.deleteSheet(paySheet);
  
      //OUTPUT
      const pDataID = personalData.name.indexOf(name)
      studentURLs.name.push(name);
      studentURLs.email.push(personalData.email[pDataID]);
      studentURLs.url.push("null");
    }
    Logger.log(studentURLs);
  };