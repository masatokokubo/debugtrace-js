### debugtrace-js 3.0.1 - 2026/9/13

* ブラウザで出力されるファイル名、行番号が間違っているのを修正しました。
* デフォルトの出力関数を`console.info`から`console.debug`に変更しました。

### debugtrace-js 3.0.0 - 2026/8/12

* Bun, DenoおよびChrome, Edge, Firefox, Safariなどのブラウザで動作するようにしました。
* TypeScript用の型定義ファイル (`debugtrace.d.ts`) を追加しました。

### debugtrace-js 2.2.0 - 2025/2/16

* 以下のプロパティを削除しました。

  * `debugtrace.minimumOutputLengthAndSize`
  * `debugtrace.minimumOutputStringLength`
* 以下のプロパティの初期値を変更しました。

  |プロパティ名                  |初期値|旧初期値|
  |:---------------------------|-----:|-----:|
  |`debugtrace.collectionLimit`|   128|   512|
  |`debugtrace.stringLimit`    |   256|  8192|
* `print`関数に`printOptions`引数(省略可)を追加しました。

### debugtrace-js 2.1.2 - 2022/3/13

* `print`, `printMessage`関数は引数値を返すようにしました。

### debugtrace-js 2.1.1 - 2021/10/9

* 型名の出力時に例外がスローされる不具合を修正
* 起動時にNode.jsのバージョンを出力するようにした

### debugtrace-js 2.1.0 - 2021/8/9

* 関数の出力の改善 (関数定義の最初の行のみ出力する)
* `basicPrint` 関数を追加
* データ出力の改行処理を改善

### debugtrace-js 2.0.0 - 2020/8/2

* Node.js 10以降に対応
* データ出力の改行処理を改善

### debugtrace-js 1.1.0 - 2016/11/23

* npmに登録された最初のリリース

### debugtrace-js 1.0.1 - 2016/7/12

* `enterString`と`leaveString`のデフォルト値を変更

### debugtrace-js 1.0.0 - 2016/7/10

* 最初のリリース
