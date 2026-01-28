# Github desktopの使い方&ミニゲーム
基本的な使い方は以下のサイトに書いてあるので、それを見てください。

[GitHub Desktopの使い方　Installから使用方法まで完全解説 - Qiita](https://qiita.com/yasu_qita/items/3a24322f0ebdd443ba7e)

では、これから新入生交流会イベント限定の事を書いていきます。

まず、新入生交流会イベントミニゲーム制作専用のリポジトリをクローンします。

https://github.com/sawa0103/welcomEvent2026-client.git

このリポジトリをGIthub Desktopでクローンして、自分のPCに配置してください。
<img width="961" height="665" alt="image" src="https://github.com/user-attachments/assets/d2e66d1c-bc60-4497-85aa-c3d7a98ce4dd" />


このような画面になると思います。基本的にブランチはmainのまま変えずに作業をしてください。

## コードを書く前に

<img width="603" height="488" alt="image" src="https://github.com/user-attachments/assets/fe69ade1-ee41-4d4b-a6cc-19ec6018d333" />


ここのボタンを押して、他の人がコードを変更していないか確認してください。それをしないと同じところを編集して、変更が被ってしまうことがあります。
<img width="699" height="419" alt="image" src="https://github.com/user-attachments/assets/c2523e3b-e23a-4ce0-b113-f5e68c962b61" />


変更があった場合はpull origin が出てくるので、クリックしてダウンロードしてください。それをしたら、好きなだけコードを書いてもらって大丈夫です。

## ミニゲーム作成

<img width="659" height="178" alt="image" src="https://github.com/user-attachments/assets/e3c78866-273d-4a3b-8058-40d7d514a6a6" />


ダウンロードすると以下のようなファイル構成になっていると思います。

ミニゲーム作成に使用するのは、templateです。exsampleには試しに作った最低限のクリックゲームがあるので参考にしてください。

まず、templateフォルダをmini_gamesフォルダの中にコピーして、自分で考えたミニゲームの名前に変えてください。
<div style=display:flex>
<img width="33%"  alt="image" src="https://github.com/user-attachments/assets/116bc60f-e364-45b2-a709-edd1fa1ab38b" /><img width="33%" alt="image" src="https://github.com/user-attachments/assets/bbb66a81-d3db-40b4-9df6-6e714c0a9da7" />
<img width="33%" alt="image" src="https://github.com/user-attachments/assets/6970df55-a727-42a4-aa52-e5256ec2e74c" />
</div>


右から左の感じです。

それをしたら自分が作成したフォルダをいじっていってください。**他人のフォルダをいじってはいけません！！**

プログラムの書き方については少し長くなるので、最後に書きます。

## プログラムを書いて、作業が一区切りついたら。

<img width="960" height="651" alt="image" src="https://github.com/user-attachments/assets/939c7692-bdab-4dc7-8bab-b9e4c85d7ac9" />


github desktopを見るとこのような画面になっていると思います。そしたら、
summaryに自分がやったことの概要を書いていってください。

<img width="352" height="342" alt="image" src="https://github.com/user-attachments/assets/fa0cb232-d2aa-4cdd-866d-0cbad5dff0f4" />


descriptionはお好みで大丈夫です。書いたら、commit to mainを押して、変更を確定してください。

<img width="960" height="693" alt="image" src="https://github.com/user-attachments/assets/462906c4-820c-4a7a-945b-6d4f11bf05d2" />


そしたら、fetch がpull originに代わるのでこれを押してアップロードして下さい。これで終了です。

お疲れ様です。

## プログラムについて

基本的にサーバーからの指示を受けて動く形になります。

なので、基本的にゲームを開始する、制限時間を表示するなどの機能を実装する必要はありません。なので、ミニゲームの作成に集中してもらいたいです。

まず、例のexsampleフォルダにあるものを見ていきましょう。

<img width="641" height="147" alt="image" src="https://github.com/user-attachments/assets/7a35c183-e08c-4955-90bc-bf156e21c9bc" />


dataは画像などをいれるファイルです。

基本的に作成する人にはindex.htmlをいじってもらいます。

<img width="1112" height="760" alt="image" src="https://github.com/user-attachments/assets/f3ac3603-9437-4536-a420-cf19fef536d4" />


これはテストのプログラムです。黄色の円で囲んだ部分はデバック時にしか出てきません。なので、本番は出てきません。

このボタンたちは index.htmlのscriptタグの中の関数に対応しています。

- 説明表示→instruction()
- ゲーム開始→gameStart()
- ゲーム終了→gameStop()

本番ではこれらの関数がサーバーから自動的に呼ばれます。

順番としては、まずゲーム読み込みで、初期画面。

ゲームの説明の時にinstruction()が呼ばれます。説明が終わったらganeStartで開始し、30秒立ったらgameStopが呼ばれる感じです。

なので、ミニゲームを作る人には上にあげた3つの関数で完結するようなものを作成してください。

デバックはゲーム終了を押したときに0~100点のスコアが表示されれば成功です。

基本的なところはこれくらいです。

わからないことがあればdb23065に聞いてください。

また、スタイル(css)や演出、背景画像などは変えてもらって全く大丈夫なので、こんなクリックゲームよりもすごいものを作成してください！！お願いします！！

あと、わからないことはgithub copilotに聞くと教えてくれます！！

おすすめのaiは claud 4.5 Sonnetかcloud 4.5 Opusです!!
