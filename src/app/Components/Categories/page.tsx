import Image from "next/image";

export default function Categories() {
  return (
    <>
        <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
          <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
              📋
            </span>
            Category Management
          </h2>

          {/* Add New Category Form */}
          <div className="bg-slate-50 rounded-lg p-6 mb-8 border-2 border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Add New Category</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Groceries"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Type
                  </label>
                  <select className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors bg-white text-slate-800">
                    <option value="">Select Type</option>
                    <option value="expense">Expense</option>
                    <option value="revenue">Revenue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Color
                  </label>
                  <input
                    type="color"
                    defaultValue="#3b82f6"
                    className="w-full h-12 px-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-lg"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>

          {/* Category List */}
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Existing Categories</h3>
            <div className="space-y-3">
              {/* Expense Categories */}
              <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
                <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">-</span>
                  Expense Categories
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-red-200">
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full bg-blue-500"></span>
                      <span className="font-medium text-slate-800">Food & Dining</span>
                    </div>
                    <button className="text-red-500 hover:text-red-700 font-bold">×</button>
                  </div>
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-red-200">
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full bg-purple-500"></span>
                      <span className="font-medium text-slate-800">Transportation</span>
                    </div>
                    <button className="text-red-500 hover:text-red-700 font-bold">×</button>
                  </div>
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-red-200">
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full bg-yellow-500"></span>
                      <span className="font-medium text-slate-800">Utilities</span>
                    </div>
                    <button className="text-red-500 hover:text-red-700 font-bold">×</button>
                  </div>
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-red-200">
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full bg-pink-500"></span>
                      <span className="font-medium text-slate-800">Entertainment</span>
                    </div>
                    <button className="text-red-500 hover:text-red-700 font-bold">×</button>
                  </div>
                </div>
              </div>

              {/* Revenue Categories */}
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">+</span>
                  Revenue Categories
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full bg-emerald-500"></span>
                      <span className="font-medium text-slate-800">Salary</span>
                    </div>
                    <button className="text-red-500 hover:text-red-700 font-bold">×</button>
                  </div>
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full bg-teal-500"></span>
                      <span className="font-medium text-slate-800">Freelance</span>
                    </div>
                    <button className="text-red-500 hover:text-red-700 font-bold">×</button>
                  </div>
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full bg-cyan-500"></span>
                      <span className="font-medium text-slate-800">Investments</span>
                    </div>
                    <button className="text-red-500 hover:text-red-700 font-bold">×</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
          </>
  );
}
