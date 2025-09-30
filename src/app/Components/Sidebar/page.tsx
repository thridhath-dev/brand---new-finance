// components/sidebar/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  HomeIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  TagIcon,
  BellAlertIcon,
} from "@heroicons/react/24/outline";
import "./style.css";
import Alerts from "../Alerts/page";
import Home from "../Home/page";
import Categories from "../Categories/page";
import Transactions from "../Transactions/page";
import Dashboard from "../Dashboard/page";


export default function Sidebar() {
  const [activeTab, setActiveTab] = useState("/");
  const [isOpen, setIsOpen] = useState(false);

  const nav = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/dashboard", label: "Dashboard", icon: ChartBarIcon },
    { href: "/transactions", label: "Transactions", icon: CurrencyDollarIcon },
    { href: "/categories", label: "Categories", icon: TagIcon },
    { href: "/alerts", label: "Alerts", icon: BellAlertIcon, badge: 5 },
  ];

  // restore last active tab from localStorage
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("activeTab");
      if (stored) setActiveTab(stored);
    } catch {}
  }, []);

  // persist active tab
  useEffect(() => {
    try {
      window.localStorage.setItem("activeTab", activeTab);
    } catch {}
  }, [activeTab]);

  const activeLabel = useMemo(() => nav.find(n => n.href === activeTab)?.label ?? "Home", [activeTab]);

  const handleTabClick = (href: string) => {
    setActiveTab(href);
    setIsOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "/":
        return <Home />;
      case "/dashboard":
        return <Dashboard />;
      case "/transactions":
        return <Transactions />;
      case "/categories":
        return <Categories />;
      case "/alerts":
        return <Alerts />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="sidebar-shell relative">
      {/* Sidebar */}
      <aside className={`sidebar w-60 bg-black/90 min-h-screen flex flex-col text-white ${isOpen ? "open" : ""}`} aria-expanded={isOpen}>
        {/* Title */}
        <div className="px-4 pt-6 pb-2">
          <h2 className="finance">Finance Tracker</h2>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4">
          <ul className="menu">
            {nav.map((item) => {
              const Active = activeTab === item.href;
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <button
                    onClick={() => handleTabClick(item.href)}
                    className={`menu-link ${Active ? "active" : ""} group w-full text-left`}
                    aria-current={Active ? "page" : undefined}
                  >
                    <span
                      className="icon-wrap"
                      aria-label={item.label}
                      role="img"
                    >
                      <Icon className="icon" />
                    </span>

                    <span className="link-text">{item.label}</span>

                    {/* optional small description / subtle text */}
                    <span className="link-sub">Quick access</span>

                    {/* badge (optional) */}
                    {item.badge ? (
                      <span className="badge" aria-hidden>
                        {item.badge}
                      </span>
                    ) : null}

                    {/* small chevron shown on hover */}
                    <span className="chev" aria-hidden>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 18l6-6-6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer p-4">
          <div className="text-xs text-white/60">
            Signed in as <strong>you</strong>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="btn outline small">Settings</button>
            <button className="btn primary small">New</button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen ? (
        <button className="overlay md:hidden" onClick={() => setIsOpen(false)} aria-label="Close sidebar" />
      ) : null}

      {/* Main Content Area */}
      <main className="bg-gray-900 text-white overflow-auto">
        {/* Topbar (mobile) */}
        <div className="topbar md:hidden">
          <button className="topbar-btn" aria-label="Open sidebar" onClick={() => setIsOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div className="topbar-title">{activeLabel}</div>
          <div className="topbar-spacer" />
        </div>

        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}