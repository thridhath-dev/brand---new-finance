import React, { useState } from "react";


type Alert = { id: number; type: "budget" | "large_txn"; message: string; read?: boolean };


export default function Alerts() {
const [alerts, setAlerts] = useState<Alert[]>([
{ id: 1, type: "budget", message: "Food category reached 80% of budget" },
{ id: 2, type: "large_txn", message: "Unusually large transaction: ₹ 15,000" },
{ id: 3, type: "budget", message: "Transport at 70% of budget" },
]);


const markAllRead = () => setAlerts((as) => as.map((a) => ({ ...a, read: true })));


return (
<section className="space-y-6">
<header className="flex items-center justify-between">
<div>
<h1 className="text-2xl font-semibold">Alerts</h1>
<p className="text-gray-600">Budget and anomaly notifications.</p>
</div>
<button className="btn outline" onClick={markAllRead}>Mark all read</button>
</header>


<ul className="space-y-2">
{alerts.map((a) => (
<li key={a.id} className={`panel flex items-center justify-between ${a.read ? "opacity-60" : ""}`}>
<div>
<div className="panel-title capitalize">{a.type.replace("_", " ")}</div>
<div className="text-gray-700">{a.message}</div>
</div>
{!a.read && <span className="badge">New</span>}
</li>
))}
</ul>
</section>
);
}