import Link from "next/link";

export default function StartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white drop-shadow-lg">
            Browser RPG
          </h1>
          <p className="text-xl text-blue-200">
            冒険の旅が始まります
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/home"
            className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xl px-12 py-4 rounded-lg shadow-lg transition-colors duration-200 transform hover:scale-105"
          >
            ゲーム開始
          </Link>
        </div>
      </div>
    </div>
  );
}
