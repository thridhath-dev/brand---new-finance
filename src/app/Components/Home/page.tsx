import React from "react";


export default function Home() {
return (
<section className="space-y-6">
<header>
<h1 className="text-2xl font-semibold">Welcome back 👋</h1>
<p className="text-white/60">Here's a quick snapshot of your finances.</p>
</header>


<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<div className="card">
<div className="card-title">Balance</div>
<div className="card-value">₹ 1,24,500</div>
<div className="card-sub">as of today</div>
</div>
<div className="card">
<div className="card-title">This Month Spend</div>
<div className="card-value">₹ 42,380</div>
<div className="card-sub">September</div>
</div>
<div className="card">
<div className="card-title">Savings Rate</div>
<div className="card-value">18%</div>
<div className="card-sub">vs last month +2%</div>
</div>
</div>


<div className="panel">
<div className="panel-title">Recent Activity</div>
<ul className="divide-y divide-white/10">
<li className="row"><span>Groceries</span><span>- ₹ 1,240</span></li>
<li className="row"><span>Electricity Bill</span><span>- ₹ 2,760</span></li>
<li className="row"><span>Salary</span><span>+ ₹ 68,000</span></li>
</ul>
</div>
</section>
);
}