# madoi-sample-ts-react-whiteboard

Madoiを利用したシンプルなホワイトボードアプリのサンプルです。

実行するにはMadoiサーバが必要です。

## Madoiサーバの起動

適当なディレクトリで以下のコマンドを実行し、Madoi の madoi-volatileserver を起動してください。
詳細は、[MadoiのREADME](https://github.com/kcg-edu-future-lab/madoi)も参照してください。


```bash
git clone https://github.com/kcg-edu-future-lab/madoi
cd madoi
docker compose up
```

`docker compose up`を実行すると、Madoiのビルドが行われ、madoi-volatileserverが起動します。

## 必要なソフトウェアのインストール

下記のバージョンのnodejsで動作確認を行なっています。

* nodejs (v22.12.0)

## ビルドと起動

まず、このリポジトリをcloneし、リポジトリのディレクトリに移動してください。

```bash
git clone https://github.com/kcg-edu-future-lab/madoi-sample-ts-react-whiteboard
cd madoi-sample-ts-react-whiteboard
```

次に /src/keys.ts.sample をコピーして /src/keys.ts を作成し、適切に設定を行なってください。

```ts
// Madoi設定
export const madoiUrl = "ws://localhost:8080/madoi/rooms";
export const madoiKey = "MADOI_API_KEY";
```

MadoiサーバのデフォルトのMADOI_API_KEYは、[docker-compose.yml](https://github.com/kcg-edu-future-lab/madoi/blob/master/docker-compose.yml)を参照してください。


次のコマンドを実行して関連ライブラリをインストールしてください。

```bash
npm i
```

devコマンドを実行すると、ブラウザが起動し、ホワイトボードアプリケーションが表示されます。

```bash
npm run dev
```

静的ビルドを行うには、buildコマンドを実行してください。

```bash
npm run build
```
