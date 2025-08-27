# Browser RPG

ブラウザで動作するRPGゲームです。

## 技術スタック

- **Next.js 15.5.0** (React 19.1.0)
- **TypeScript 5.x**
- **Tailwind CSS 4.x**
- **ESLint** (コード品質管理)

## 開発環境セットアップ

### 依存関係のインストール

```bash
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアプリケーションを確認できます。

### その他のコマンド

```bash
# プロダクションビルド (Turbopack使用)
npm run build

# プロダクションサーバー起動
npm start

# リント実行
npm run lint

# TypeScript型チェック
npx tsc --noEmit

# テスト実行
npm test

# カバレッジ付きテスト
npm run test:coverage
```

## ゲーム概要

### ゲームフロー

```mermaid
flowchart TD
    Start[スタート画面] --> Home[ホーム画面]
    
    Home --> Party[編成画面]
    Party --> Home
    
    Home --> DungeonSelect[ダンジョン選択画面]
    DungeonSelect --> Home
    DungeonSelect --> Dungeon[ダンジョン画面]
    
    Dungeon --> Battle[戦闘画面]
    Dungeon --> Event[イベント画面]
    Event --> Dungeon
    
    Battle --> GameOver[ゲームオーバー画面]
    GameOver --> Start
    
    Battle --> Result[リザルト画面]
    Result --> Dungeon
    Result --> DungeonClear[ダンジョンクリア画面]
    Result --> GameClear[ゲームクリア画面]
    
    DungeonClear --> Home
    GameClear --> Start
    
    classDef startEnd fill:#ff6b6b,stroke:#333,stroke-width:2px,color:#fff
    classDef main fill:#4ecdc4,stroke:#333,stroke-width:2px,color:#fff
    classDef dungeon fill:#45b7d1,stroke:#333,stroke-width:2px,color:#fff
    classDef result fill:#96ceb4,stroke:#333,stroke-width:2px,color:#fff
    
    class Start,GameOver,DungeonClear,GameClear startEnd
    class Home,Party,DungeonSelect main
    class Dungeon,Battle,Event dungeon
    class Result result
```

### 主要機能

- パーティ編成システム
- ダンジョン探索
- ターンベース戦闘
- イベントシステム
- 進行管理（ダンジョンクリア・ゲームクリア）

## 開発について

- **App Router**: Next.js 15の最新App Routerを使用
- **Turbopack**: 高速な開発・ビルド体験
- **型安全性**: TypeScriptによる厳密な型チェック
- **モダンスタイリング**: Tailwind CSS 4.xによるユーティリティファーストCSS

詳細な開発ガイドは `CLAUDE.md` を参照してください。
