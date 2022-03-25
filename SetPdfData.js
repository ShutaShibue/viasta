/** "shidouStudent"と請求書テンプレートをもとに、PDFを作成し、そのリンクを配列で出力 */
function SetPdfData(pType, shidouPerson, ss, personalData, dates) {
  const invoiceS = ss.getSheetByName('invoice');
  const studentURLs = {
    name: [],
    email: [],
    url: [],
  };
  
  for (var pID in shidouPerson) {
    if (typeof (shidouPerson[pID]) == "string") continue
    const data = shidouPerson[pID];
    const name = data[pType][0];  //修正 調整管理データのみの場合、data.student.name.lengthは1。
    
    const paySheet = invoiceS.copyTo(ss); //new sheet
    paySheet.setName(name);    //請求書テンプレをコピーして各人の名前のシートを作成
    let smallTotal = 0;
    let othertotal = 0
    let endLine = 23

    if (data.date.length) { //指導データがある場合
      endLine -= 1  //指導データ0の場合だけ空列ができるため 
      const length = data.date.length;
      endLine += length;
      //小計の計算
      for (var i = 0; i < length; i++) {
        smallTotal += data.money[i];
      }

      //データを入れるために、フィールドを拡張
      for (let i = 1; i < length; i++) {
        paySheet.getRange('17:17').activate();
        paySheet.insertRowsAfter(paySheet.getActiveRange().getLastRow(), 1);
        paySheet.getRange('E18:F18').activate().mergeAcross();
        paySheet.getRange('G18:H18').activate().mergeAcross();
      }
      //var bigTotal = smallTotal + other;
  
  
      //シートのメインの配列に値を設定する
      const stConvert = pType === "student" ? "tutor" : "student"
      paySheet.getRange(17, 2, length).setValues(data.date.map(x => [x]));
      paySheet.getRange(17, 3, length).setValues(data.startTime.map(x => [x]));
      paySheet.getRange(17, 4, length).setValues(data.endTime.map(x => [x]));
      paySheet.getRange(17, 5, length).setValues(data[stConvert].map(x => [x]));
      paySheet.getRange(17, 7, length).setValues(data.material.map(x => [x]));
      paySheet.getRange(17, 9, length).setValues(data.money.map(x => [x]));
      paySheet.getRange(17 + length, 9).setValue(smallTotal);
    }

    if (data.outline) {
      othertotal = data.adjustMoney

      for (let i = 1; i < data.outline.length; i++) {
        paySheet.getRange(endLine + ':17').activate();
        paySheet.insertRowsAfter(endLine-1, 1);
        paySheet.getRange(`B${endLine}:I${endLine}`).activate().mergeAcross();
      }
      paySheet.getRange(endLine, 2, data.outline.length).setValues(data.outline.map(x => [x])); //伸ばす
    }
    
    const bigTotal = smallTotal + othertotal
    paySheet.getRange(endLine - 4 , 9).setValue(othertotal); 
    paySheet.getRange(endLine - 3, 9).setValue(bigTotal);

    //シート上部に情報を設定する
    paySheet.getRange(13, 3).setValue("¥" + bigTotal + "—");
    paySheet.getRange('B3').setValue(name);
    const month = ('0' + dates.mo).slice(-2) //0埋め, 5月→05月
    paySheet.getRange('C7').setValue("Viasta Online Consulting — " + dates.yr + "年" + month + "月分");
    const invoiceID = dates.yr + month + "-" + pID;
    paySheet.getRange('I3').setValue(invoiceID);
  
    Utilities.sleep(1000); //1秒待機（待機中に情報を更新）
    SpreadsheetApp.flush(); //挿入したシートの情報更新
   
    //PDF化
    const ssId = ss.getId();                                    //スプレッドシートIDを取得
    const sheetId = paySheet.getSheetId();                             //取引先のシートIDを取得
    const folderurl = paySheet.getRange('M3').getValue();              //newInvoiceのセルJ2の値（PDF保管先のフォルダURL）
    const folder = DriveApp.getFolderById(folderurl);                    //PDF保管先のfolderを設定
    PDFexport(ssId, sheetId, endLine+data.outline.length, folder, invoiceID, name);
    ss.deleteSheet(paySheet);
  
    //OUTPUT
    const pDataID = personalData.name.indexOf(name)
    studentURLs.name.push(name);
    studentURLs.email.push(personalData.email[pDataID]);
    studentURLs.url.push("null");
  }
  Logger.log(studentURLs);
}
  