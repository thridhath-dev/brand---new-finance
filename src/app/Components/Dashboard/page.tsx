import React from "react";


export default function DashboardPage() {
return (
<section className="space-y-6">
<header>
<h1 className="text-2xl font-semibold">Dashboard</h1>
<p className="text-white/60">Overview of key metrics.</p>
</header>


<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
<div className="card">
<div className="card-title">Net Worth</div>
<div className="card-value">₹ 8,90,000</div>
<div className="card-sub">lifetime</div>
</div>
<div className="card">
<div className="card-title">Income (M)</div>
<div className="card-value">₹ 78,000</div>
<div className="card-sub">this month</div>
</div>
<div className="card">
<div className="card-title">Expenses (M)</div>
<div className="card-value">₹ 42,380</div>
<div className="card-sub">this month</div>
</div>
<div className="card">
<div className="card-title">Alerts</div>
<div className="card-value">5</div>
<div className="card-sub">unread</div>
</div>
</div>


<div className="panel">
<div className="panel-title">Trends</div>
<div className="text-white/70">Charts can go here.</div>
</div>
</section>
);
}


