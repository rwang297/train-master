"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import {
  FiFileText,
  FiCalendar,
  FiUsers,
  FiMapPin,
  FiClock,
  FiTrash2,
  FiDownload,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import ResponsiveSearch from "@/components/ResponsiveSearch";

type ReportCard = {
  id: number;
  title: string;
  fileName: string;
  description: string;
  org: string;
  price: string;
  date: string;
  duration: string;
  contact: string;
  attendees: string;
  location: string;
  category: string;
  tags: string[];
  status: "completed" | "draft" | string;
  size: string;
  uploaded: string;
};

const CATEGORIES = [
  "Financial Literacy",
  "Employability Skills",
  "Digital Literacy Skills",
  "NRC",
  "GOPA",
];

const getFileType = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return "PDF";
    case "docx":
    case "doc":
      return "Word";
    case "ppt":
    case "pptx":
      return "PowerPoint";
    case "xls":
    case "xlsx":
      return "Excel";
    case "jpg":
    case "jpeg":
    case "png":
      return "Image";
    default:
      return "Other";
  }
};

const statusColor = (s: string) =>
  s === "completed" ? "bg-green-50 text-green-700" : "bg-slate-50 text-slate-600";

const categoryColor = (tag: string) => {
  const t = tag.toLowerCase();
  if (t === "Financial Literacy") return "bg-purple-100 text-purple-700";
  if (t === "Employability Skills") return "bg-red-100 text-red-700";
  if (t === "Digital Literacy Skills") return "bg-blue-100 text-blue-700";
  if (t === "NRC") return "bg-green-100 text-green-700";
  if (t === "GOPA") return "bg-pink-100 text-pink-700";
  return "bg-slate-100 text-slate-700";
};


export default function RepositoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const initialCategory = searchParams.get("category") || "All Categories";
  const [reports, setReports] = useState<ReportCard[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);
  const [category, setCategory] = useState(initialCategory);
  

  const mapServerToReport = (item: any): ReportCard => {
    const rawTags = Array.isArray(item.tags)
      ? item.tags
      : (typeof item.tags === 'string' ? JSON.parse(item.tags || '[]') : []);
    const category = item.trainingCategory || item.category || item.trainingType || "";

    const tagsSet = rawTags.slice();
    if (category) {
      const hasCategoryTag = rawTags.some((t: string) => String(t).toLowerCase() === String(category).toLowerCase());
      if (!hasCategoryTag) tagsSet.unshift(category);
    }

    return {
      id: item.id || item._id || Math.random(),
      title: item.reportTitle || item.title || item.name || "Untitled",
      fileName: item.fileName || item.originalName || item.file?.name || "file",
      description: item.projectDescription || item.description || item.summary || "",
      org: item.clientCompany || item.org || item.company || "",
      price: item.projectCost || item.price || "",
      date: item.trainingStartDate || item.date || item.uploadedDate || "",
      duration: item.duration ? `${item.duration} days` : item.durationDays ? `${item.durationDays} days` : item.duration || "",
      contact: item.instructor || item.contact || "",
      attendees: item.participants || item.attendees || "",
      location: item.trainingLocation || item.location || "",
      category,
      tags: tagsSet,
      status: item.projectStatus || item.status || "",
      size: item.size || (item.file && item.file.size ? `${(item.file.size / (1024*1024)).toFixed(2)} MB` : ""),
      uploaded: item.uploaded || item.uploadedAt || item.projectCompletionDate || "",
    };
  };

 const fetchReports = async () => {
  setLoadingReports(true);
  setReportsError(null);
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "https://plasmida.onrender.com";
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const safeFetch = async (input: RequestInfo, init?: RequestInit, timeout = 10000) => {
      const controller = new AbortController();
      const id = setTimeout(() => {
        try {
          if (typeof DOMException !== 'undefined') {
            // Provide a reason where supported to avoid noisy "signal is aborted without reason" logs
            (controller as any).abort(new DOMException('Request timed out', 'AbortError'));
          } else {
            controller.abort();
          }
        } catch (e) {
          try { controller.abort(); } catch (err) { /* ignore */ }
        }
      }, timeout);
      try {
        return await fetch(input, { signal: controller.signal, ...(init || {}) });
      } finally {
        clearTimeout(id);
      }
    };

    let res: Response;
    try {
      res = await safeFetch(`${API_URL}/api/v1/plasmida/reports`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
    } catch (err: any) {
      console.error("Fetch request failed", err);
      if (err?.name === 'AbortError') {
        setReportsError('Request timed out while fetching reports');
      } else if (err instanceof TypeError && /failed to fetch/i.test(String(err.message))) {
        setReportsError('Network error while fetching reports');
      } else {
        setReportsError('Unknown error while fetching reports');
      }
      setLoadingReports(false);
      return;
    }

    if (!res.ok) {
      const body = await res.text().catch(() => null);
      setReportsError(`Failed to load reports (${res.status}): ${body}`);
      setLoadingReports(false);
      return;
    }

    const response = await res.json().catch(() => null);
    // ✅ The backend returns { statusCode, message, data }
    const list = Array.isArray(response?.data) ? response.data : [];

    if (list.length === 0) {
      console.warn("No reports found or unexpected structure", response);
    }

    setReports(list.map(mapServerToReport));
  } catch (err) {
    console.error("Fetch reports error", err);
    setReportsError("Network error while fetching reports");
  } finally {
    setLoadingReports(false);
  }
};

  const handleDelete = async (id: number | string) => {
    if (!id) return;
    // Confirmation
    if (!confirm('Are you sure you want to delete this report? This action cannot be undone.')) return;

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/proxy/api/v1/plasmida/reports/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!res.ok) {
        const body = await res.text().catch(() => null);
        alert(`Failed to delete report (${res.status}): ${body || 'Unknown error'}`);
        return;
      }

      setReports((prev) => prev.filter((r) => String(r.id) !== String(id)));
      window.dispatchEvent(new CustomEvent('reports:updated'));
    } catch (err) {
      console.error('Delete error', err);
      alert('Network error while deleting report');
    }
  };

  useEffect(() => {
    fetchReports();
    const onUpdated = () => fetchReports();
    window.addEventListener('reports:updated', onUpdated as EventListener);
    return () => window.removeEventListener('reports:updated', onUpdated as EventListener);
  }, []);


  const [search, setSearch] = useState("");
  // const [category, setCategory] = useState("All Categories, initialCategory");
  const [type, setType] = useState("All Types");
  const [sort, setSort] = useState("Newest first");

  const filteredCards = useMemo(() => {
    const cat = category;
    return reports
      .filter((card) => {
        const q = search.trim().toLowerCase();
        const titleMatch = card.title.toLowerCase().includes(q);
        const orgMatch = card.org.toLowerCase().includes(q);
        const tagsMatch = card.tags.some((t) => t.toLowerCase().includes(q));
        const searchMatch = q === "" ? true : titleMatch || orgMatch || tagsMatch;

        const categoryMatch =
          cat === "All Categories" ||
          (cat === "Others"
            ? ((!(card.category)) || !CATEGORIES.map((c) => c.toLowerCase()).includes((card.category || "").toLowerCase())) &&
              !card.tags.some((t) => CATEGORIES.map((c) => c.toLowerCase()).includes(t.toLowerCase()))
            : (card.category && card.category.toLowerCase() === (cat || "").toLowerCase()) ||
              card.tags.some((t) => t.toLowerCase() === (cat || "").toLowerCase()));

        const fileType = getFileType(card.fileName);
        const typeMatch = type === "All Types" || fileType.toLowerCase() === type.toLowerCase();

        return searchMatch && categoryMatch && typeMatch;
      })
      .sort((a, b) => {
        const da = new Date(a.date).getTime();
        const db = new Date(b.date).getTime();
        return sort === "Newest first" ? db - da : da - db;
      });
  }, [reports, search, category, type, sort]);

  // Carousel state for mobile
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let raf = 0;

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const scrollLeft = el.scrollLeft;
        const cardWidth = el.clientWidth * 0.9 + 16; // item width + gap
        const idx = Math.round(scrollLeft / cardWidth);
        setActiveIndex(Math.max(0, Math.min(filteredCards.length - 1, idx)));
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [filteredCards.length]);

  const scrollToIndex = (i: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const cardWidth = el.clientWidth * 0.9 + 16;
    el.scrollTo({ left: i * cardWidth, behavior: "smooth" });
  };
 const handleDownload = async (id: number | string) => {
  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://plasmida.onrender.com";

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!token) {
    alert("You must be logged in to download this file.");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/v1/plasmida/reports/${id}/download`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      alert(`Download failed (${res.status}): ${err}`);
      return;
    }

    const blob = await res.blob();

    const downloadURL = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    // If backend sends filename, use that
    const filename =
      res.headers.get("Content-Disposition")?.split("filename=")[1] ||
      "report";

    a.href = downloadURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadURL);
  } catch (error) {
    alert("Network error while downloading file.");
  }
};


  return (
    <div className="repository-page p-4 md:p-8 bg-gray-50 min-h-screen">
      <header className="repository-header mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Training Reports Repository</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and organize all your training documentation</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/upload")}
            className="h-10 inline-flex items-center gap-2 rounded-md bg-blue-600 text-white px-3 font-medium hover:bg-blue-600 transition"
          >
            + Upload Report
          </button>
        </div>
      </header>

      <section className="controls mb-6 flex flex-col md:flex-row gap-3">
        <input
          placeholder="Search reports by title, description, or tags"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 h-10 rounded-md border border-gray-500 px-3 text-black"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-10 rounded-md border border-gray-500 px-2 text-black"
        >
          <option>All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
          <option>Others</option>
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="h-10 rounded-md border border-gray-500 px-2 text-black"
        >
          <option>All Types</option>
          <option>PDF</option>
          <option>PowerPoint</option>
          <option>Word</option>
          <option>Excel</option>
          <option>Image</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-10 rounded-md border border-gray-500 px-2 text-black"
        >
          <option>Newest first</option>
          <option>Oldest first</option>
        </select>
      </section>

      {/* Mobile carousel visible on small screens only */}
      <section className="md:hidden">
  <div
    ref={carouselRef}
    className="report-carousel flex overflow-x-auto snap-x snap-mandatory gap-4 py-6 px-4 touch-pan-x scrollbar-hide"
    style={{ WebkitOverflowScrolling: "touch" }}
  >
    {filteredCards.map((c) => (
      <article
        key={c.id}
        className="card flex-shrink-0 w-[90%] sm:w-[75%] rounded-lg border border-slate-100 bg-white p-4 shadow-md snap-center mx-2"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="file-icon h-10 w-10 rounded-md bg-slate-50 flex items-center justify-center text-sky-600">
              <FiFileText className="text-lg" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-md font-semibold text-slate-800 line-clamp-2">{c.title}</h3>
                <div className="flex flex-col items-end gap-2">
                  {(c.category || c.tags[0]) && (
                    <span
                      className={`${categoryColor(c.category || c.tags[0] || "")} rounded-full px-2 py-1 text-xs font-medium`}
                    >
                      {c.category || c.tags[0]}
                    </span>
                  )}
                  <span
                    className={`${statusColor(c.status)} rounded-full px-2 py-1 text-xs font-medium`}
                  >
                    {c.status}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-400 mt-1 flex items-center gap-2 break-words">
                <span className="text-slate-500 font-medium">{c.fileName}</span>
              </div>

              <p className="text-sm text-slate-500 mt-2 line-clamp-4">{c.description}</p>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                {c.price && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-bold">₦</span>
                    <span className="text-slate-700 font-medium">{c.price}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-slate-400" />
                  <span>{c.date}</span>
                </div>
                {c.duration && (
                  <div className="flex items-center gap-2">
                    <FiClock className="text-slate-400" />
                    <span>{c.duration}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <FiUsers className="text-slate-400" />
                  <span>{c.contact}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-slate-400" />
                  <span>{c.location}</span>
                </div>

                <div className="pt-2 flex flex-wrap gap-1">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-700 break-words"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-slate-400">{c.size} · {c.uploaded}</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDelete(c.id)}
              aria-label="Delete report"
              className="h-9 w-9 rounded-md border border-slate-200 flex items-center justify-center text-slate-600"
            >
              <FiTrash2 />
            </button>
            <button
              onClick={() => handleDownload(c.id)}
              className="h-9 w-9 rounded-md border border-slate-200 flex items-center justify-center text-slate-600"
            >
              <FiDownload />
            </button>
          </div>
        </div>
      </article>
    ))}
  </div>

  <div className="dots mt-2 flex items-center justify-center gap-2">
    {filteredCards.map((_, i) => (
      <button
        key={i}
        onClick={() => scrollToIndex(i)}
        aria-label={`Go to slide ${i + 1}`}
        className={`h-2 w-2 rounded-full ${i === activeIndex ? "bg-sky-600" : "bg-slate-300"}`}
      />
    ))}
  </div>
</section>

      <section className="hidden md:grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredCards.map((c) => (
          <article key={c.id} className="card rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="file-icon h-8 w-8 rounded-md bg-slate-50 flex items-center justify-center text-sky-600">
                  <FiFileText />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-md font-semibold text-slate-800">{c.title}</h3>
                    <div className="flex flex-col items-end gap-2">
                      {(c.category || c.tags[0]) && (
                        <span className={`${categoryColor(c.category || c.tags[0] || "")} rounded-full px-2 py-1 text-xs font-medium`}>
                          {c.category || c.tags[0]}
                        </span>
                      )}
                      <span className={`${statusColor(c.status)} rounded-full px-2 py-1 text-xs font-medium`}>{c.status}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span className="text-slate-500 font-medium">{c.fileName}</span>
                  </div>
                <p className="text-sm text-slate-500 mt-3 line-clamp-3 overflow-hidden break-words break-all whitespace-normal">{c.description}</p>


                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    {c.price && (
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-bold">₦</span>
                        <span className="text-slate-700 font-medium">{c.price}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <FiCalendar className="text-slate-400" />
                      <span>{c.date}</span>
                    </div>

                    {c.duration && (
                      <div className="flex items-center gap-3">
                        <FiClock className="text-slate-400" />
                        <span>{c.duration}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <FiUsers className="text-slate-400" />
                      <span>{c.contact}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <FiMapPin className="text-slate-400" />
                      <span>{c.location}</span>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-2">
                      {c.tags.map((t) => (
                        <span key={t} className="text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-700">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-slate-400">{c.size} · {c.uploaded}</div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleDelete(c.id)} aria-label="Delete report" className="h-8 w-8 rounded-md border border-slate-200 flex items-center justify-center text-slate-600"><FiTrash2 /></button>
                <button
  onClick={() => handleDownload(c.id)}
  className="h-8 w-8 rounded-md border border-slate-200 flex items-center justify-center text-slate-600"
>
  <FiDownload />
</button>
              </div>
            </div>
          </article>
        ))}

        {filteredCards.length === 0 && (
          <div className="text-center text-slate-600 col-span-full py-12">No reports match your filters.</div>
        )}
      </section>

      <footer className="mt-8 text-center text-sm text-slate-500">
        Showing {filteredCards.length} of {reports.length} reports
      </footer>
    </div>
  );
}
