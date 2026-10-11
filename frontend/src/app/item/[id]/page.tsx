export default function ItemDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
      {/* Left Column: Item Image and Core Details */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center text-gray-500 border border-gray-300">
          [Item Image Placeholder]
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Black Nike Backpack</h1>
            <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full uppercase tracking-wide text-sm">
              Lost
            </span>
          </div>
          <p className="text-gray-700 mb-6">
            Black canvas backpack with a small red Nike logo on the front pocket. Contains a laptop charger and a notebook.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <p>📍 <strong>Location:</strong> University Cafeteria</p>
            <p>🕒 <strong>Time:</strong> 2:30 PM, Oct 8</p>
          </div>
        </div>
      </div>

      {/* Right Column: AI Match & Actions */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-t-4 border-t-blue-500">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">AI Match Analysis</h2>
          <div className="text-4xl font-bold text-blue-600 mb-4">92% Match</div>
          
          <ul className="space-y-3 text-sm text-gray-700 mb-6">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span> 60% Image Similarity
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span> Semantic description matches 'red logo'
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span> Found 180m from reported location
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span> Time gap: 40 minutes
            </li>
          </ul>

          <button className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors mb-3">
            Contact Finder
          </button>
          <button className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-md hover:bg-gray-200 transition-colors">
            Not My Item
          </button>
        </div>
      </div>
    </div>
  );
}