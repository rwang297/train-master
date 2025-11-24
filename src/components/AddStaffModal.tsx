"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { FiX, FiSave } from "react-icons/fi";

export interface StaffFormData {
  staffName: string;
  department: string;
  email: string;
  phone: string;
  unit: string;
  status: string;
  contractValue: string;
  contractStartDate: string;
  contractEndDate: string;
  satisfaction?: string;
}

interface AddStaffModalProps {
  onClose: () => void;
  onSave?: () => void; // Optional callback to refresh parent list
}

export default function AddStaffModal({ onClose, onSave }: AddStaffModalProps) {
  const [formData, setFormData] = useState<StaffFormData>({
    staffName: "",
    department: "",
    email: "",
    phone: "",
    unit: "",
    status: "Prospect",
    contractValue: "",
    contractStartDate: "",
    contractEndDate: "",
    satisfaction: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        staffName: formData.staffName,
        department: formData.department,
        email: formData.email,
        phoneNumber: formData.phone,
        unit: formData.unit,
        status: formData.status,
        contractValue: Number(formData.contractValue) || 0,
        contractStartDate: formData.contractStartDate || null,
        contractEndDate: formData.contractEndDate || null,
        joinedDate: formData.contractStartDate || null,
      };

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      const base =
        process.env.NEXT_PUBLIC_API_BASE_URL;

      const res = await fetch(`${base}/api/v1/plasmida/staff/add`, {
        method: "POST", // ✅ Correct method
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      // Check response
      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        let errorMessage = `Request failed with status ${res.status}`;

        if (contentType?.includes("application/json")) {
          const data = await res.json();
          errorMessage = data.message || JSON.stringify(data);
        } else {
          const text = await res.text();
          errorMessage = text || errorMessage;
        }

        throw new Error(errorMessage);
      }

      // Success
      const data = await res.json();
      console.log("✅ Staff added:", data);

      // Save satisfaction locally (since backend doesn’t accept it)
      if (formData.satisfaction && typeof window !== "undefined") {
        const key = "plasmida_satisfaction";
        const raw = localStorage.getItem(key);
        const list = raw ? JSON.parse(raw) : [];
        const satValue = Number(formData.satisfaction);
        const entry = {
          email: formData.email,
          staffName: formData.staffName,
          satisfaction: satValue,
        };
        const index = list.findIndex((x: any) => x.email === formData.email);
        if (index >= 0) list[index] = entry;
        else list.push(entry);
        localStorage.setItem(key, JSON.stringify(list));
      }

      if (onSave) onSave();
      onClose();
    } catch (err: any) {
      console.error("❌ Error adding staff:", err);
      setError(err.message || "Failed to add staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          aria-label="Close"
        >
          <FiX size={20} />
        </button>

        <header className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Add New Staff</h2>
          <p className="text-sm text-slate-600 mt-1">
            Fill in the staff details below.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Staff Name *"
              name="staffName"
              value={formData.staffName}
              onChange={handleChange}
              required
            />
            <InputField
              label="Department *"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            />
            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
            />
            <InputField
              label="Unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
            />
            <SelectField
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                "Prospect",
                "Active",
                "Onboarding",
                "Inactive",
                "On Leave",
                "Terminated",
              ]}
            />
            <InputField
              label="Contract Value (₦)"
              name="contractValue"
              type="number"
              value={formData.contractValue}
              onChange={handleChange}
            />
            <InputField
              label="Contract Start Date"
              name="contractStartDate"
              type="date"
              value={formData.contractStartDate}
              onChange={handleChange}
            />
            <InputField
              label="Contract End Date"
              name="contractEndDate"
              type="date"
              value={formData.contractEndDate}
              onChange={handleChange}
            />
            <InputField
              label="Satisfaction (1.1 - 9.9)"
              name="satisfaction"
              type="number"
              step="0.1"
              min="1.1"
              max="9.9"
              value={formData.satisfaction}
              onChange={handleChange}
              placeholder="e.g. 4.4"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700 inline-flex items-center gap-2"
            >
              <FiSave />
              <span>{loading ? "Saving..." : "Save"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputField({
  label,
  name,
  type = "text",
  ...props
}: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        name={name}
        type={type}
        {...props}
        className="w-full text-gray-600 rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full text-gray-600 rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
      >
        {options.map((opt: string) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
