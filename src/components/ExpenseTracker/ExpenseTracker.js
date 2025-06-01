import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import './ExpenseTracker.css';

// 解构需要的图标
const { 
  Home, 
  TrendingUp, 
  Plus, 
  Settings, 
  ArrowUp, 
  ArrowDown, 
  Camera,
  X,
  Edit3,
  PieChart,
  Download,
  Palette,
  DollarSign,
  ShoppingCart,
  Car,
  Coffee,
  Gamepad2,
  Briefcase,
  ChevronLeft,
  ChevronRight
} = LucideIcons;

// 预设分类数据
const defaultCategories = {
  expense: [
    { id: 'food', name: '餐饮', icon: Coffee, color: '#F59E0B' },
    { id: 'transport', name: '交通', icon: Car, color: '#3B82F6' },
    { id: 'shopping', name: '购物', icon: ShoppingCart, color: '#8B5CF6' },
    { id: 'entertainment', name: '娱乐', icon: Gamepad2, color: '#EF4444' },
  ],
  income: [
    { id: 'salary', name: '工资', icon: Briefcase, color: '#10B981' },
    { id: 'investment', name: '投资', icon: TrendingUp, color: '#06B6D4' },
  ]
};

const ExpenseTracker = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showAddForm, setShowAddForm] = useState(false);
  const [transactions, setTransactions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [categories, setCategories] = useState(defaultCategories);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [settings, setSettings] = useState({
    currency: '¥',
    theme: 'blue'
  });

  // 添加记录表单状态
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
    photo: null
  });

  // 生成示例数据
  useEffect(() => {
    const sampleTransactions = [
      {
        id: 1,
        amount: 28.50,
        type: 'expense',
        category: 'food',
        date: '2025-06-01',
        note: '午餐',
        photo: null
      },
      {
        id: 2,
        amount: 5000,
        type: 'income',
        category: 'salary',
        date: '2025-06-01',
        note: '工资',
        photo: null
      },
      {
        id: 3,
        amount: 120,
        type: 'expense',
        category: 'transport',
        date: '2025-05-31',
        note: '油费',
        photo: null
      },
      {
        id: 4,
        amount: 299,
        type: 'expense',
        category: 'shopping',
        date: '2025-05-30',
        note: '衣服',
        photo: null
      }
    ];
    setTransactions(sampleTransactions);
  }, []);

  // 计算统计数据
  const getMonthlyStats = () => {
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth.getMonth() && 
             transactionDate.getFullYear() === currentMonth.getFullYear();
    });

    const income = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expense, balance: income - expense };
  };

  // 获取分类统计
  const getCategoryStats = () => {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const categoryTotals = {};
    
    expenseTransactions.forEach(t => {
      if (!categoryTotals[t.category]) {
        categoryTotals[t.category] = 0;
      }
      categoryTotals[t.category] += t.amount;
    });

    return Object.entries(categoryTotals).map(([categoryId, amount]) => {
      const category = categories.expense.find(c => c.id === categoryId) || 
                     categories.income.find(c => c.id === categoryId);
      return {
        name: category?.name || categoryId,
        value: amount,
        color: category?.color || '#6B7280'
      };
    });
  };

  // 添加交易记录
  const addTransaction = () => {
    if (!formData.amount || !formData.category) return;

    const newTransaction = {
      id: Date.now(),
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      date: formData.date,
      note: formData.note,
      photo: formData.photo
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setFormData({
      amount: '',
      type: 'expense',
      category: '',
      date: new Date().toISOString().split('T')[0],
      note: '',
      photo: null
    });
    setShowAddForm(false);
  };

  // 删除交易记录
  // eslint-disable-next-line no-unused-vars
  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const stats = getMonthlyStats();
  const categoryStats = getCategoryStats();

  // 首页组件
  const HomePage = () => (
    <div className="p-4 pb-20 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">记账本</h1>
          <p className="text-gray-600">{currentMonth.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
            className="p-2 rounded-lg bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
            className="p-2 rounded-lg bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">收入</span>
            <ArrowUp className="text-green-500" size={16} />
          </div>
          <p className="text-xl font-bold text-green-600">{settings.currency}{stats.income.toFixed(2)}</p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">支出</span>
            <ArrowDown className="text-red-500" size={16} />
          </div>
          <p className="text-xl font-bold text-red-600">{settings.currency}{stats.expense.toFixed(2)}</p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">余额</span>
            <TrendingUp className={stats.balance >= 0 ? 'text-green-500' : 'text-red-500'} size={16} />
          </div>
          <p className={`text-xl font-bold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {settings.currency}{Math.abs(stats.balance).toFixed(2)}
          </p>
        </div>
      </div>

      {/* 支出分类图表 */}
      {categoryStats.length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/20 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">支出分类</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <PieChart
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </PieChart>
                <Tooltip formatter={(value) => `${settings.currency}${value.toFixed(2)}`} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 近期交易 */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">近期交易</h3>
          <button className="text-blue-600 text-sm">查看全部</button>
        </div>
        
        <div className="space-y-3">
          {transactions.slice(0, 5).map(transaction => {
            const category = categories[transaction.type].find(c => c.id === transaction.category);
            const IconComponent = category?.icon || ShoppingCart;
            
            return (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-white/40 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${category?.color}20` }}>
                    <IconComponent size={20} style={{ color: category?.color }} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{category?.name}</p>
                    <p className="text-sm text-gray-600">{transaction.note || '无备注'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}{settings.currency}{transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString('zh-CN')}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 悬浮添加按钮 */}
      <button
        onClick={() => setShowAddForm(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
      >
        <Plus className="text-white" size={24} />
      </button>
    </div>
  );

  // 统计页面
  const StatsPage = () => {
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
      });
      
      const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expense = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      
      return {
        month: date.toLocaleDateString('zh-CN', { month: 'short' }),
        income,
        expense
      };
    }).reverse();

    return (
      <div className="p-4 pb-20 bg-gradient-to-br from-slate-50 to-purple-50 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">统计分析</h1>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl">
            <Download size={16} />
            <span>导出</span>
          </button>
        </div>

        {/* 趋势图 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/20 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">收支趋势</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${settings.currency}${value.toFixed(2)}`} />
                <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={3} />
                <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 分类占比 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/20 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">支出分类占比</h3>
          <div className="space-y-3">
            {categoryStats.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>
                  <span className="text-gray-700">{category.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">{settings.currency}{category.value.toFixed(2)}</span>
                  <div className="text-sm text-gray-500">
                    {((category.value / stats.expense) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 添加记录页面
  const AddTransactionPage = () => (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-green-50 z-50">
      <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
        <button
          onClick={() => setShowAddForm(false)}
          className="p-2 rounded-lg hover:bg-gray-100/50"
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-semibold">添加记录</h2>
        <button
          onClick={addTransaction}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-medium hover:scale-105 transition-transform"
        >
          保存
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* 金额输入 */}
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-800 mb-4">
            {settings.currency}{formData.amount || '0.00'}
          </div>
          <input
            type="number"
            placeholder="输入金额"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            className="w-full text-center text-2xl p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 收入/支出切换 */}
        <div className="flex bg-white/60 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
          <button
            onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: '' }))}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              formData.type === 'expense'
                ? 'bg-red-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            支出
          </button>
          <button
            onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: '' }))}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              formData.type === 'income'
                ? 'bg-green-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            收入
          </button>
        </div>

        {/* 分类选择 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">选择分类</h3>
          <div className="grid grid-cols-4 gap-4">
            {categories[formData.type].map(category => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                  className={`p-4 rounded-xl transition-all ${
                    formData.category === category.id
                      ? 'bg-blue-500 text-white shadow-lg scale-105'
                      : 'bg-white/50 hover:bg-white/80 text-gray-700'
                  }`}
                >
                  <IconComponent size={24} className="mx-auto mb-2" />
                  <p className="text-sm font-medium">{category.name}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 日期和备注 */}
        <div className="space-y-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <label className="block text-sm font-medium text-gray-700 mb-2">日期</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full p-3 bg-white/50 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
            <input
              type="text"
              placeholder="添加备注..."
              value={formData.note}
              onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
              className="w-full p-3 bg-white/50 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 拍照功能 */}
        <button className="w-full py-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center space-x-2 hover:bg-white/80 transition-all">
          <Camera size={20} />
          <span>添加发票照片</span>
        </button>
      </div>
    </div>
  );

  // 设置页面
  const SettingsPage = () => (
    <div className="p-4 pb-20 bg-gradient-to-br from-slate-50 to-amber-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">设置</h1>
      
      <div className="space-y-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DollarSign className="text-green-500" size={20} />
              <span className="font-medium">货币单位</span>
            </div>
            <select
              value={settings.currency}
              onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
              className="bg-white/50 rounded-lg px-3 py-2 border border-white/20"
            >
              <option value="¥">¥ 人民币</option>
              <option value="$">$ 美元</option>
              <option value="€">€ 欧元</option>
            </select>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Palette className="text-purple-500" size={20} />
              <span className="font-medium">主题颜色</span>
            </div>
            <div className="flex space-x-2">
              {['blue', 'purple', 'green'].map(color => (
                <button
                  key={color}
                  onClick={() => setSettings(prev => ({ ...prev, theme: color }))}
                  className={`w-6 h-6 rounded-full ${
                    color === 'blue' ? 'bg-blue-500' : 
                    color === 'purple' ? 'bg-purple-500' : 'bg-green-500'
                  } ${settings.theme === color ? 'ring-2 ring-gray-400' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
          <button className="w-full flex items-center space-x-3 text-left">
            <Edit3 className="text-blue-500" size={20} />
            <span className="font-medium">分类管理</span>
          </button>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
          <button className="w-full flex items-center space-x-3 text-left">
            <Download className="text-green-500" size={20} />
            <span className="font-medium">数据备份</span>
          </button>
        </div>
      </div>
    </div>
  );

  // 底部导航栏
  const BottomNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200/50 px-4 py-2">
      <div className="flex justify-around">
        {[
          { key: 'home', icon: Home, label: '首页' },
          { key: 'stats', icon: PieChart, label: '统计' },
          { key: 'add', icon: Plus, label: '添加' },
          { key: 'settings', icon: Settings, label: '设置' }
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => key === 'add' ? setShowAddForm(true) : setActiveTab(key)}
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all ${
              activeTab === key
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'
            }`}
          >
            <Icon size={20} />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative overflow-hidden">
      {/* 主要内容区域 */}
      {activeTab === 'home' && <HomePage />}
      {activeTab === 'stats' && <StatsPage />}
      {activeTab === 'settings' && <SettingsPage />}
      
      {/* 添加记录表单 */}
      {showAddForm && <AddTransactionPage />}
      
      {/* 底部导航栏 */}
      <BottomNavigation />
    </div>
  );
};

export default ExpenseTracker;