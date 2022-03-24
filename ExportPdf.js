function PDFexport(ssId, sheetId, row, folder, seikyu_id, student_name) {
  
  //プログラムB-1｜PDF化の条件設定
  const url = 'https://docs.google.com/spreadsheets/d/' + ssId + '/export?';
  const opts = {
    exportFormat: 'pdf',      // ファイル形式の指定
    format: 'pdf',      // ファイル形式の指定
    size: 'A4',       // 用紙サイズの指定
    portrait: 'true',     // true縦向き、false 横向き
    fitw: 'true',     // 幅を用紙に合わせるか？
    sheetnames: 'false',    // シート名を PDF 上部に表示するか？
    printtitle: 'false',    // スプレッドシート名をPDF上部に表示するか？
    pagenumbers: 'false',    // ページ番号の有無
    gridlines: 'false',    // グリッドラインの表示有無
    fzr: 'false',    // 固定行の表示有無
    range: 'A1%3AJ' + row,  // 対象範囲「%3A」 = : (コロン)  
    gid: sheetId    // シート ID を指定 (省略する場合、すべてのシートをダウンロード)
  };
    
  //プログラムB-2｜PDF化のurl作成
  const PDFurl = [];//urlという空配列を設定
  for (optName in opts) {
    PDFurl.push(optName + '=' + opts[optName]);//opts配列の各要素を=でつないだものをurl配列に格納
  }
  const options = PDFurl.join('&');//urlの配列の各要素を&でつなぐ
    
  //プログラムB-3｜PDF化の条件設定
  const token = ScriptApp.getOAuthToken();//アクセストークンを取得
  const response = UrlFetchApp.fetch(url + options, { headers: { 'Authorization': 'Bearer ' + token } }); //PDFのURLからアクセスする
  const blob = response.getBlob().setName(seikyu_id + student_name + '.pdf');//PDFの名前を「取引先+.pdf」とする
  const newFile = folder.createFile(blob);//PDFを所定のフォルダに保管する
  newFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);//共有設定をする：「リンクを知っている人」が「閲覧可能」
}

  