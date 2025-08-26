export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          ホーム画面
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">編成</h2>
            <p className="text-gray-600 mb-4">
              パーティメンバーを編成しましょう
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              編成画面へ
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">ダンジョン</h2>
            <p className="text-gray-600 mb-4">
              冒険に出かけましょう
            </p>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
              ダンジョン選択へ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}