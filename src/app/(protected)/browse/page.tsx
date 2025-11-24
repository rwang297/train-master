"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiFolder, FiTrendingUp, FiCalendar } from "react-icons/fi";

export default function BrowsePage() {
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [totalReports, setTotalReports] = useState(0);
  const [loading, setLoading] = useState(true);

  const categoryNames = [
    "Financial Literacy",
    "Employability Skills",
    "Digital Literacy Skills",
    "NRC",
    "GOPA",
  ];

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://plasmida.onrender.com";
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/v1/plasmida/reports`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch reports");

        const fetchedReports = data?.data || [];
        setReports(fetchedReports);
        setFilteredReports(fetchedReports);
        setTotalReports(fetchedReports.length);

        // Count category occurrences
        const counts: Record<string, number> = {};
        categoryNames.forEach((cat) => (counts[cat] = 0));
        fetchedReports.forEach((r: any) => {
          const category = r.trainingCategory;
          if (category && counts[category] !== undefined) counts[category]++;
        });

        const categoryArray = categoryNames.map((name) => ({
          name,
          count: counts[name] || 0,
        }));

        setCategories(categoryArray);
      } catch (err) {
        console.error("❌ Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Handle category click
  const handleCategoryClick = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));

    if (selectedCategory === category) {
      // If user clicks same category, show all again
      setFilteredReports(reports);
    } else {
      const filtered = reports.filter((r) => r.trainingCategory === category);
      setFilteredReports(filtered);
    }
  };

  const colorMap: Record<string, string> = {
    "Financial Literacy": "bg-purple-100 text-purple-700",
    "Employability Skills": "bg-blue-100 text-blue-700",
    "Digital Literacy Skills": "bg-red-100 text-red-700",
    NRC: "bg-amber-100 text-amber-700",
    GOPA: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="browse-page p-8 bg-gray-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Training Projects Overview</h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore your training projects and documentation by category and statistics
        </p>
      </header>

      {loading ? (
        <div className="text-center text-slate-500 mt-20">Loading data...</div>
      ) : (
        <>
          {/* === Top Stats === */}
          <section className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="stat-card rounded-lg bg-white p-4 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">Total Projects</div>
                  <div className="text-xl font-semibold text-slate-800">{totalReports}</div>
                </div>
                <div className="h-10 w-10 rounded bg-slate-50 flex items-center justify-center text-sky-600">
                  <FiFolder />
                </div>
              </div>
            </div>

            <div className="stat-card rounded-lg bg-white p-4 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">Total Revenue</div>
                  <div className="text-xl font-semibold text-emerald-600">₦0</div>
                </div>
                <div className="h-10 w-10 rounded bg-slate-50 flex items-center justify-center text-emerald-600">
                  <FiTrendingUp />
                </div>
              </div>
            </div>

            <div className="stat-card rounded-lg bg-white p-4 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">This Month</div>
                  <div className="text-xl font-semibold text-slate-800">0</div>
                </div>
                <div className="h-10 w-10 rounded bg-slate-50 flex items-center justify-center text-slate-600">
                  <FiCalendar />
                </div>
              </div>
            </div>

            <div className="stat-card rounded-lg bg-white p-4 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">Most Popular</div>
                  <div className="text-xl font-semibold text-slate-800">
                    {categories.length > 0
                      ? categories.reduce((max, c) =>
                          c.count > max.count ? c : max
                        ).name
                      : "—"}
                  </div>
                </div>
                <div className="h-10 w-10 rounded bg-slate-50 flex items-center justify-center text-amber-500">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 6v6l4 2"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </section>

          {/* === Category Cards === */}
          <section className="categories bg-white rounded-lg p-6 border border-slate-100 shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-4 text-black">Categories Overview</h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {categories.map((c) => {
                const badgeClass = colorMap[c.name] || "bg-slate-100 text-slate-700";
                const isSelected = selectedCategory === c.name;
                return (
                  <button
                    key={c.name}
                    onClick={() => handleCategoryClick(c.name)}
                    className={`category-card group rounded-lg border ${
                      isSelected
                        ? "border-sky-400 ring-2 ring-sky-200"
                        : "border-slate-100"
                    } bg-white p-4 text-center hover:shadow transition`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-10 w-10 rounded bg-slate-50 flex items-center justify-center text-slate-600">
                        <FiFolder />
                      </div>
                      <div className="text-sm font-medium text-slate-800">{c.name}</div>
                      <div className="mt-2">
                        <span
                          className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
                        >
                          {c.count} reports
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* === Filtered Reports List === */}
          <section className="reports-list bg-white rounded-lg p-6 border border-slate-100 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-black">
              {selectedCategory ? `${selectedCategory} Reports` : "All Reports"}
            </h2>

            {filteredReports.length === 0 ? (
              <p className="text-sm text-slate-500">No reports found for this category.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {filteredReports.map((report, index) => (
                  <li key={report._id || index} className="py-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-slate-800">{report.trainingTitle}</div>
                        <div className="text-xs text-slate-500">
                          {report.trainingCategory} • {report.createdAt?.slice(0, 10)}
                        </div>
                      </div>
                     <Link
                        href={`/repository?category=${encodeURIComponent(report.trainingCategory)}`}
                        className="text-sky-600 text-sm hover:underline font-medium"
                      >
                        View
                      </Link>
                       </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
