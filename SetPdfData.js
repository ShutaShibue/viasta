/** "shidouStudent"と請求書テンプレートをもとに、PDFを作成し、そのリンクを配列で出力 */
function SetPdfData(shidouPerson, ss, personalData, dates) {

  const pType = shidouPerson.pType
  let invoiceS
  if (pType == "student") invoiceS = ss.getSheetByName('invoice') //請求書または給与明細のテンプレートを取得
  else invoiceS = ss.getSheetByName('payment')

  const personURLs = {
    name: [],
    email: [],
    url: [],
  };
  
  for (var pID in shidouPerson) {
    if (typeof (shidouPerson[pID]) == "string") continue
    const data = shidouPerson[pID];
    const name = data[pType][0];  //修正
    
    const paySheet = invoiceS.copyTo(ss); //new sheet
    paySheet.setName(name);    //請求書テンプレをコピーして各人の名前のシートを作成
    let smallTotal = 0  //小計
    let othertotal = 0  //調整系の合計

    let endofShidou = 23  //備考直前までの長さ
    let noteLength = 1    //備考の長さ

    if (data.date.length) { //指導データがある場合
      const shidouLength = data.date.length;  //指導データの長さ
      endofShidou += shidouLength - 1;
      //小計の計算
      for (var i = 0; i < shidouLength; i++) {
        smallTotal += data.money[i];
      }

      //指導データを入れるために、フィールドを拡張
      for (let i = 1; i < shidouLength; i++) {
        paySheet.getRange('17:17').activate();
        paySheet.insertRowsAfter(paySheet.getActiveRange().getLastRow(), 1);
        paySheet.getRange('E18:F18').activate().mergeAcross();
        paySheet.getRange('G18:H18').activate().mergeAcross();
      }
      //var bigTotal = smallTotal + other;
  
  
      //シートのメインの配列に値を設定する
      const stConvert = pType === "student" ? "tutor" : "student" //生徒なら講師名を、講師なら生徒名を入れる
      paySheet.getRange(17, 2, shidouLength).setValues(data.date.map(x => [x]));
      paySheet.getRange(17, 3, shidouLength).setValues(data.startTime.map(x => [x]));
      paySheet.getRange(17, 4, shidouLength).setValues(data.endTime.map(x => [x]));
      paySheet.getRange(17, 5, shidouLength).setValues(data[stConvert].map(x => [x]));
      paySheet.getRange(17, 7, shidouLength).setValues(data.material.map(x => [x]));
      paySheet.getRange(17, 9, shidouLength).setValues(data.money.map(x => [x]));
      paySheet.getRange(17 + shidouLength, 9).setValue(smallTotal);
    }

    if (data.salary != undefined) {   //講師で授業外の給与がある場合
      othertotal = data.salary + data.specialPay
      const contents = []
      if (data.salary) contents.push("固定給")
      if (data.specialPay) contents.push("時間外給与")
      noteLength = contents.length
      writeNotes(contents)
    }

    if (data.outline != undefined) {  //生徒で調整管理データがある場合
      noteLength = data.outline.length
      othertotal = data.adjustMoney
      writeNotes(data.outline)
    }

    function writeNotes(contents){  //シートを伸ばし、備考を書き込む(調整管理、時間外給与)
      for (let i = 0; i < noteLength -1 ; i++) {
        paySheet.getRange(endofShidou + ':17').activate();
        paySheet.insertRowsAfter(endofShidou-1, 1);
        paySheet.getRange(`B${endofShidou}:I${endofShidou}`).activate().mergeAcross();
      }
      paySheet.getRange(endofShidou, 2, noteLength).setValues(contents.map(x => [x])); //伸ばす
    }
  
    //小計、合計を書き込む
    const bigTotal = smallTotal + othertotal 
    paySheet.getRange(endofShidou - 4 , 9).setValue(othertotal); 
    paySheet.getRange(endofShidou - 3, 9).setValue(bigTotal);

    //シート上部に情報を設定する
    paySheet.getRange(13, 3).setValue("¥" + bigTotal + "—");
    paySheet.getRange('B3').setValue(name);
    const month = ('0' + dates.mo).slice(-2) //0埋め, 5月→05月

    let title
    if (pType == "student") title = "Viasta Online Consulting — " + dates.yr + "年" + month + "月分"
    else title = "Viasta 個別指導料金 — " + dates.yr + "年" + month + "月分"
    paySheet.getRange('C7').setValue(title);
    const documentID = dates.yr + month + "-" + pID;
    paySheet.getRange('I3').setValue(documentID);
  
    Utilities.sleep(1000); //1秒待機（待機中に情報を更新）
    SpreadsheetApp.flush(); //挿入したシートの情報更新
   
    //PDF化
    const ssId = ss.getId();                                    //スプレッドシートIDを取得
    const sheetId = paySheet.getSheetId();                             //取引先のシートIDを取得
    const folderurl = paySheet.getRange('M3').getValue();              //newInvoiceのセルJ2の値（PDF保管先のフォルダURL）
    const folder = DriveApp.getFolderById(folderurl);                    //PDF保管先のfolderを設定
    PDFexport(ssId, sheetId, endofShidou + noteLength, folder, documentID, name);
    ss.deleteSheet(paySheet);
  
    //OUTPUT
    const pDataID = personalData.name.indexOf(name)
    personURLs.name.push(name);
    personURLs.email.push(personalData.email[pDataID]);
    personURLs.url.push("");
  }
  Logger.log(personURLs);
}
  