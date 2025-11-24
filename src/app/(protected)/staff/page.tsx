"use client";

import { useState, useEffect, useCallback } from "react";
import AddStaffModal from "@/components/AddStaffModal";
import { safeFetch } from "@/utils/safeFetch";
import { API_URL } from "@/config";

type StaffRow = {
  name: string;
  email: string;
  dept: string;
  phone?: string;
  status: string;
};

export default function StaffPage() {
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [staff, setStaff] = useState<StaffRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) throw new Error("No token found. Please log in again.");

      const data = await safeFetch(`${API_URL}/api/v1/plasmida/staff`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!data || !data.data || !Array.isArray(data.data)) {
        throw new Error("Invalid staff data format");
      }

      // Map only the required fields
      const mapped: StaffRow[] = data.data.map((item: any) => ({
        name: item.staffName || item.name || "",
        email: item.email || "",
        dept: item.department || item.dept || "",
        phone:  item.phone ||
          item.phoneNumber ||
          item.mobile ||
          item.contact ||
          item.tel ||
          "",
        status: item.status || "",
      }));

      setStaff(mapped);
    } catch (err: any) {
      console.error("❌ Error fetching staff:", err);
      setError(err.message || "Failed to load staff");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const totalStaff = staff.length;
  const activeStaff = staff.filter(
    (s) => (s.status || "").toLowerCase() === "active"
  ).length;

  return (
    <div className="staff-page p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen pt-16 md:pt-6">
      {/* Header */}
      <header className="mb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-semibold text-black">
            Staff Management
          </h1>
          <p className="text-sm text-gray-700 mt-1">
            Manage all staff members for the agency
          </p>
        </div>
        <button
          onClick={() => setShowAddStaff(true)}
          className="inline-flex items-center gap-2 h-10 px-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition whitespace-nowrap text-sm md:text-base"
        >
          + Add New Staff
        </button>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg bg-white p-4 border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-700">Total Staff</div>
          <div className="text-2xl md:text-xl font-semibold text-black mt-2">
            {totalStaff}
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-700">Active Staff</div>
          <div className="text-2xl md:text-xl font-semibold text-black mt-2">
            {activeStaff}
          </div>
        </div>
      </section>

      {/* Main Content */}
      {loading ? (
        <div className="py-12 text-center text-sm text-gray-600">
          Loading staff...
        </div>
      ) : error ? (
        <div className="py-12 text-center text-sm text-red-600">{error}</div>
      ) : staff.length === 0 ? (
        <div className="py-12 text-center text-sm text-gray-600">
          No staff members found.
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <section className="md:hidden space-y-4">
            {staff.map((s) => (
              <div
                key={s.email || s.name}
                className="bg-white rounded-lg border border-gray-200 shadow-sm p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-base">
                      {s.name}
                    </h3>
                    <p className="text-xs text-gray-600">{s.email}</p>
                  </div>

                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs whitespace-nowrap ml-2 ${
                      (s.status || "").toLowerCase() === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {s.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Department:</span>
                    <span className="font-medium">{s.dept || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{s.phone || "—"}</span>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Table View */}
          <section className="hidden md:block bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-gray-700">
                  <th className="py-3 px-4 font-semibold">Staff Name</th>
                  <th className="py-3 px-4 font-semibold">Department</th>
                  <th className="py-3 px-4 font-semibold">Email</th>
                  <th className="py-3 px-4 font-semibold">Phone</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody>
                {staff.map((s) => (
                  <tr
                    key={s.email || s.name}
                    className="border-t border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-800 text-sm lg:text-base">
                        {s.name}
                      </div>
                      <div className="text-xs text-gray-600">{s.email}</div>
                    </td>

                    <td className="py-3 px-4 text-gray-800 text-sm lg:text-base">
                      {s.dept}
                    </td>

                    <td className="py-3 px-4 text-gray-800 text-sm lg:text-base">
                      {s.email}
                    </td>

                    <td className="py-3 px-4 text-gray-800 text-sm lg:text-base">
                      {s.phone}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                          (s.status || "").toLowerCase() === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}

      {showAddStaff && (
        <AddStaffModal
          onClose={() => setShowAddStaff(false)}
          onSave={fetchStaff}
        />
      )}
    </div>
  );
}
