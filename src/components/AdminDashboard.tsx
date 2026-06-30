import { useState, useMemo } from 'react';
import { DbMock } from '../dbMock';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, BarChart, Bar, Cell, PieChart, Pie 
} from 'recharts';
import { 
  Users, ShoppingBag, DollarSign, Activity, TrendingUp, Sparkles, 
  Search, Eye, MousePointer, PlusCircle, ArrowUpRight, Award, Trash, Heart
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeChartTab, setActiveChartTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Retrieve metrics dynamically from the simulated database
  const metrics = useMemo(() => {
    return DbMock.getAnalyticsReport();
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#6366f1'];

  const chartData = useMemo(() => {
    if (activeChartTab === 'daily') return metrics.dailySales;
    if (activeChartTab === 'weekly') return metrics.weeklySales;
    return metrics.monthlySales;
  }, [activeChartTab, metrics]);

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-zinc-950/20 space-y-6">
      
      {/* Admin Title Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500 animate-pulse" />
            <span>JUST ORDER Real-time Operations Dashboard</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Displaying live database analytics, client-side click streams, and purchase events instantly.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-950/30 border border-blue-900/60 text-blue-400 font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>LIVE RECORD STREAMING</span>
          </span>
          <span className="bg-zinc-800 px-3 py-1.5 rounded text-zinc-400 font-mono">
            DBMS: PostgreSQL
          </span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="stat-card bg-zinc-900/50 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start text-zinc-500 text-xs">
            <span>Total Registered Users</span>
            <Users className="w-4.5 h-4.5 text-zinc-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-zinc-100 font-mono">{metrics.totalUsers}</div>
            <p className="text-[10px] text-green-500 flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>+{metrics.userGrowth}% user growth</span>
            </p>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="stat-card bg-zinc-900/50 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start text-zinc-500 text-xs">
            <span>Active Users / Sessions</span>
            <Activity className="w-4.5 h-4.5 text-zinc-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-zinc-100 font-mono">{metrics.activeUsers}</div>
            <p className="text-[10px] text-blue-400 font-mono mt-0.5">
              Avg duration: {metrics.sessionDurationAvg}
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="stat-card bg-zinc-900/50 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start text-zinc-500 text-xs">
            <span>Total Orders Placed</span>
            <ShoppingBag className="w-4.5 h-4.5 text-zinc-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-zinc-100 font-mono">{metrics.totalOrders}</div>
            <p className="text-[10px] text-zinc-400 mt-0.5 font-mono">
              Today: {metrics.todayOrdersCount} orders
            </p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="stat-card bg-zinc-900/50 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start text-zinc-500 text-xs">
            <span>Total Sales Revenue</span>
            <DollarSign className="w-4.5 h-4.5 text-zinc-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-zinc-100 font-mono">${metrics.totalRevenue.toFixed(2)}</div>
            <p className="text-[10px] text-green-500 flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>Today: +${metrics.todayRevenue.toFixed(2)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Sales chart (Line chart) */}
        <div className="stat-card bg-zinc-900/40 p-5 rounded-xl border border-zinc-850 col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <h3 className="font-semibold text-xs text-zinc-400 uppercase tracking-wider">Revenue Growth Trend</h3>
            
            <div className="flex gap-1.5 bg-zinc-950 p-1 rounded-md border border-zinc-800">
              {(['daily', 'weekly', 'monthly'] as const).map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveChartTab(tab)}
                  className={`text-[10px] font-bold px-2 py-1 rounded transition-all cursor-pointer uppercase ${
                    activeChartTab === tab ? 'bg-blue-600 text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} className="font-mono" />
                <YAxis stroke="#6b7280" fontSize={11} className="font-mono" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  labelStyle={{ color: '#9ca3af', fontSize: '11px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#3b82f6', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2.5} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category-wise Sales Pie Chart */}
        <div className="stat-card bg-zinc-900/40 p-5 rounded-xl border border-zinc-850 space-y-4">
          <h3 className="font-semibold text-xs text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-3">Category Wise Sales</h3>
          
          <div className="h-60 flex items-center justify-center">
            {metrics.categorySalesChart.length === 0 ? (
              <p className="text-zinc-600 text-xs">No catalog sales recorded yet</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.categorySalesChart}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {metrics.categorySalesChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', fontSize: '11px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Pie Chart Legend */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400 max-h-20 overflow-y-auto pr-1">
            {metrics.categorySalesChart.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="truncate">{entry.name}: ${entry.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Second Analytics Row: Secondary Demographics and Behaviors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* State wise Sales */}
        <div className="stat-card bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 space-y-3">
          <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-2">State Wise Sales (INR/$)</h4>
          <div className="h-44">
            {metrics.stateSalesChart.length === 0 ? (
              <p className="text-zinc-600 text-xs text-center pt-10">Waiting for checkouts...</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.stateSalesChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={9} />
                  <YAxis stroke="#6b7280" fontSize={9} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '10px' }} />
                  <Bar dataKey="value" fill="#8b5cf6">
                    {metrics.stateSalesChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Device Wise Users */}
        <div className="stat-card bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 space-y-3">
          <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-2">Device Breakdown</h4>
          <div className="h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.deviceChart}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  style={{ fontSize: '9px', fill: '#9ca3af' }}
                >
                  {metrics.deviceChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 4) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Browser breakdown */}
        <div className="stat-card bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 space-y-3">
          <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-2">Browser Breakdown</h4>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.browserChart} layout="vertical" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis type="number" stroke="#6b7280" fontSize={9} />
                <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={9} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '10px' }} />
                <Bar dataKey="value" fill="#ec4899" barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid containing granular behavioral reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Most Viewed & Most Clicked Products */}
        <div className="stat-card bg-zinc-900/40 p-5 rounded-xl border border-zinc-850 space-y-3">
          <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-2 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-emerald-500" />
            <span>Product Views & Clicks</span>
          </h4>
          
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-2">Most Viewed Products</p>
              <ul className="space-y-1.5 text-xs font-mono">
                {metrics.mostViewedProducts.length === 0 ? (
                  <p className="text-zinc-600 text-[10px]">No views tracked yet</p>
                ) : (
                  metrics.mostViewedProducts.map((p, idx) => (
                    <li key={idx} className="flex justify-between items-center border-b border-zinc-850 pb-1">
                      <span className="truncate max-w-[180px] text-zinc-300">{p.name}</span>
                      <span className="text-blue-400 font-bold">{p.count} views</span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-2">Most Clicked Products</p>
              <ul className="space-y-1.5 text-xs font-mono">
                {metrics.mostClickedProducts.length === 0 ? (
                  <p className="text-zinc-600 text-[10px]">No clicks tracked yet</p>
                ) : (
                  metrics.mostClickedProducts.map((p, idx) => (
                    <li key={idx} className="flex justify-between items-center border-b border-zinc-850 pb-1">
                      <span className="truncate max-w-[180px] text-zinc-300">{p.name}</span>
                      <span className="text-pink-400 font-bold">{p.count} clicks</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Most Searched & Added To Cart */}
        <div className="stat-card bg-zinc-900/40 p-5 rounded-xl border border-zinc-850 space-y-3">
          <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-2 flex items-center gap-1.5">
            <Search className="w-4 h-4 text-blue-500" />
            <span>Searches & Add-To-Carts</span>
          </h4>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-2">Most Searched Keywords</p>
              <ul className="space-y-1.5 text-xs font-mono">
                {metrics.mostSearched.length === 0 ? (
                  <p className="text-zinc-600 text-[10px]">No search history recorded</p>
                ) : (
                  metrics.mostSearched.map((s, idx) => (
                    <li key={idx} className="flex justify-between items-center border-b border-zinc-850 pb-1">
                      <span className="text-blue-400 italic">"{s.keyword}"</span>
                      <span className="text-zinc-500">{s.count} times</span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-2">Most Added To Cart</p>
              <ul className="space-y-1.5 text-xs font-mono">
                {metrics.mostAddedToCart.length === 0 ? (
                  <p className="text-zinc-600 text-[10px]">No cart events recorded</p>
                ) : (
                  metrics.mostAddedToCart.map((p, idx) => (
                    <li key={idx} className="flex justify-between items-center border-b border-zinc-850 pb-1">
                      <span className="truncate max-w-[180px] text-zinc-300">{p.name}</span>
                      <span className="text-emerald-400 font-bold">{p.count} adds</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Highest Selling & Lowest Selling */}
        <div className="stat-card bg-zinc-900/40 p-5 rounded-xl border border-zinc-850 space-y-3">
          <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-2 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Sales Performers</span>
          </h4>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-2">Highest Selling Products</p>
              <ul className="space-y-1.5 text-xs font-mono">
                {metrics.highestSelling.length === 0 ? (
                  <p className="text-zinc-600 text-[10px]">Waiting for checkout orders</p>
                ) : (
                  metrics.highestSelling.map((p, idx) => (
                    <li key={idx} className="flex justify-between items-center border-b border-zinc-850 pb-1">
                      <span className="truncate max-w-[180px] text-zinc-300">{p.name}</span>
                      <span className="text-emerald-400 font-bold">{p.count} units</span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-2">Lowest Selling Products</p>
              <ul className="space-y-1.5 text-xs font-mono">
                {metrics.lowestSelling.map((p, idx) => (
                  <li key={idx} className="flex justify-between items-center border-b border-zinc-850 pb-1">
                    <span className="truncate max-w-[180px] text-zinc-400">{p.name}</span>
                    <span className="text-zinc-600">{p.count} sold</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Behavioral metrics cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Conversion rate */}
        <div className="stat-card bg-zinc-900/50 rounded-xl p-4 border border-zinc-850">
          <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Conversion Rate</div>
          <div className="text-2xl font-bold font-mono text-zinc-200 mt-1">{metrics.conversionRate}</div>
          <div className="w-full bg-zinc-800 h-1 mt-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[38%]"></div>
          </div>
        </div>

        {/* Cart abandonment */}
        <div className="stat-card bg-zinc-900/50 rounded-xl p-4 border border-zinc-850">
          <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Cart Abandonment</div>
          <div className="text-2xl font-bold font-mono text-zinc-200 mt-1">{metrics.cartAbandonmentRate}</div>
          <div className="w-full bg-zinc-800 h-1 mt-2 rounded-full overflow-hidden">
            <div className="bg-pink-500 h-full w-[68%]"></div>
          </div>
        </div>

        {/* Cancelled/Return Counters */}
        <div className="stat-card bg-zinc-900/50 rounded-xl p-4 border border-zinc-850 flex justify-between items-center">
          <div>
            <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Cancelled Orders</div>
            <div className="text-2xl font-bold font-mono text-red-400 mt-1">{metrics.cancelledOrdersCount}</div>
          </div>
          <Trash className="w-5 h-5 text-red-900/60" />
        </div>

        {/* Returned Orders */}
        <div className="stat-card bg-zinc-900/50 rounded-xl p-4 border border-zinc-850 flex justify-between items-center">
          <div>
            <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Return Requests</div>
            <div className="text-2xl font-bold font-mono text-orange-400 mt-1">{metrics.returnedOrdersCount}</div>
          </div>
          <Heart className="w-5 h-5 text-orange-900/60" />
        </div>

      </div>

      {/* Top customer table */}
      <div className="stat-card bg-zinc-900/40 p-5 rounded-xl border border-zinc-850 space-y-3">
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-2">Top Customers of Just Order (PostgreSQL Query results)</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300 font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px]">
                <th className="py-2.5">Customer Name</th>
                <th className="py-2.5">Email</th>
                <th className="py-2.5">Orders Placed</th>
                <th className="py-2.5 text-right">Total Contributed Value</th>
              </tr>
            </thead>
            <tbody>
              {metrics.topCustomers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-zinc-600">Waiting for live order entries...</td>
                </tr>
              ) : (
                metrics.topCustomers.map((c, idx) => (
                  <tr key={idx} className="border-b border-zinc-850 hover:bg-zinc-850/20">
                    <td className="py-3 font-semibold text-zinc-100">{c.name}</td>
                    <td className="py-3 text-zinc-400">{c.email}</td>
                    <td className="py-3 text-center">{c.ordersCount}</td>
                    <td className="py-3 text-right text-emerald-400 font-bold">${c.spent.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
