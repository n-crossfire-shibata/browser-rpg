'use client';

export default function BattlePage() {
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">戦闘画面</h1>
        </div>

        {/* Battle Field */}
        <div className="grid grid-rows-[auto_auto_1fr] gap-6 min-h-[600px]">
          
          {/* Enemy Area */}
          <div className="bg-red-900/30 rounded-lg p-4 border-2 border-red-700">
            <h2 className="text-xl font-bold text-red-300 mb-4">敵</h2>
            <div className="flex justify-center items-center space-x-4 min-h-[120px]">
              {/* モック敵キャラクター */}
              <div className="bg-red-800/50 rounded-lg p-3 w-28 h-32 border border-red-600 flex-shrink-0">
                <div className="text-white text-center">
                  <div className="text-sm font-bold">ゴブリン</div>
                  <div className="text-xs mt-2">HP: 50/50</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                    <div className="bg-red-500 h-2 rounded-full w-full"></div>
                  </div>
                </div>
              </div>
              <div className="bg-red-800/50 rounded-lg p-3 w-28 h-32 border border-red-600 flex-shrink-0">
                <div className="text-white text-center">
                  <div className="text-sm font-bold">オーク</div>
                  <div className="text-xs mt-2">HP: 80/80</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                    <div className="bg-red-500 h-2 rounded-full w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Player Area */}
          <div className="bg-blue-900/30 rounded-lg p-4 border-2 border-blue-700">
            <h2 className="text-xl font-bold text-blue-300 mb-4">味方</h2>
            <div className="flex justify-center items-center space-x-4 min-h-[120px]">
              {/* モック味方キャラクター */}
              <div className="bg-blue-800/50 rounded-lg p-3 w-28 h-32 border border-blue-600 flex-shrink-0">
                <div className="text-white text-center">
                  <div className="text-sm font-bold">戦士</div>
                  <div className="text-xs mt-2">HP: 85/100</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
              </div>
              <div className="bg-blue-800/50 rounded-lg p-3 w-28 h-32 border border-blue-600 flex-shrink-0">
                <div className="text-white text-center">
                  <div className="text-sm font-bold">魔法使い</div>
                  <div className="text-xs mt-2">HP: 70/70</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                    <div className="bg-green-500 h-2 rounded-full w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Area */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Hand Area */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
              <h3 className="text-lg font-bold text-white mb-3">手札 (3/5)</h3>
              <div className="flex space-x-2">
                {/* モック手札カード */}
                <div className="bg-gray-700 rounded p-2 w-20 h-28 border border-gray-500 cursor-grab">
                  <div className="text-white text-xs text-center">
                    <div className="font-bold">攻撃</div>
                    <div className="text-[10px] mt-1">ダメージ 20</div>
                  </div>
                </div>
                <div className="bg-gray-700 rounded p-2 w-20 h-28 border border-gray-500 cursor-grab">
                  <div className="text-white text-xs text-center">
                    <div className="font-bold">回復</div>
                    <div className="text-[10px] mt-1">HP回復 30</div>
                  </div>
                </div>
                <div className="bg-gray-700 rounded p-2 w-20 h-28 border border-gray-500 cursor-grab">
                  <div className="text-white text-xs text-center">
                    <div className="font-bold">防御</div>
                    <div className="text-[10px] mt-1">防御力UP</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Area */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-white">行動エリア (0/3)</h3>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-bold">
                  行動開始
                </button>
              </div>
              <div className="border-2 border-dashed border-gray-500 rounded-lg h-32 flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <div>カードをドラッグ＆ドロップ</div>
                  <div className="text-sm">(最大3枚)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Battle Info */}
        <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-gray-600">
          <div className="flex justify-between items-center text-white">
            <div>
              <span className="font-bold">ターン:</span> 1
            </div>
            <div>
              <span className="font-bold">フェーズ:</span> 
              <span className="ml-2 bg-yellow-600 px-2 py-1 rounded text-sm">計画</span>
            </div>
            <div>
              <span className="font-bold">山札残り:</span> 12枚
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}