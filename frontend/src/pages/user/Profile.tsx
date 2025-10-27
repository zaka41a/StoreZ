import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { Save, Lock } from "lucide-react";
import BackButton from "@/components/BackButton";

export default function Profile() {
    const { user } = useAuth();
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
        address: "",
        city: "",
        country: "",
    });

    const saveProfile = async () => {
        setSaving(true);
        setMsg(null);
        try {
            await api.put("/users/me", form, { withCredentials: true });
            setMsg("Profile updated successfully ✅");
        } catch {
            setMsg("⚠️ Could not update profile (backend endpoint missing?)");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <BackButton label="Back to dashboard" to="/user/home" />

            <div className="card p-6 space-y-4">
                <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-brand-700" />
                    <h2 className="text-xl font-semibold">Personal & Delivery Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { label: "Name", key: "name" },
                        { label: "Email", key: "email" },
                        { label: "Phone", key: "phone" },
                        { label: "Address", key: "address" },
                        { label: "City", key: "city" },
                        { label: "Country", key: "country" },
                    ].map((f) => (
                        <div key={f.key} className="space-y-1">
                            <label className="text-sm text-gray-600">{f.label}</label>
                            <input
                                className="input w-full"
                                value={(form as any)[f.key]}
                                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <button
                        className="btn btn-primary flex items-center gap-2"
                        onClick={saveProfile}
                        disabled={saving}
                    >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save changes"}
                    </button>
                    {msg && <span className="text-sm text-gray-600">{msg}</span>}
                </div>
            </div>

            <div className="card p-6 space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Lock className="w-5 h-5 text-brand-700" />
                    Change password
                </h3>
                <input type="password" placeholder="Current password" className="input w-full" />
                <input type="password" placeholder="New password" className="input w-full" />
                <input type="password" placeholder="Confirm new password" className="input w-full" />
                <button className="btn btn-secondary mt-2">Update password</button>
            </div>
        </div>
    );
}
