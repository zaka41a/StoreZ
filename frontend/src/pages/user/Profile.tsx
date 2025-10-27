import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";

export default function Profile() {
    const { user } = useAuth();
    const [form, setForm] = useState({
        name: user?.name ?? "",
        email: user?.email ?? "",
        phone: "",
        address: "",
        city: "",
        country: "",
        zip: "",
    });

    const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);

    useEffect(() => {
        // Essaie de charger un profil détaillé si tu crées /users/me côté backend.
        (async () => {
            try {
                const r = await api.get("/users/me", { withCredentials: true });
                setForm((f) => ({ ...f, ...r.data }));
            } catch {
                // ok si l’endpoint n’existe pas encore
            }
        })();
    }, []);

    const saveProfile = async () => {
        setSaving(true);
        setMsg(null);
        try {
            await api.put("/users/me", form, { withCredentials: true });
            setMsg("Profile updated successfully.");
        } catch {
            setMsg("Could not update profile. (Endpoint not implemented?)");
        } finally {
            setSaving(false);
        }
    };

    const changePassword = async () => {
        setSaving(true);
        setMsg(null);
        try {
            if (pwd.next !== pwd.confirm) {
                setMsg("Passwords do not match."); setSaving(false); return;
            }
            await api.post("/users/me/change-password", pwd, { withCredentials: true });
            setMsg("Password changed.");
            setPwd({ current: "", next: "", confirm: "" });
        } catch {
            setMsg("Could not change password. (Endpoint not implemented?)");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card p-6 space-y-3">
                <h2 className="text-xl font-semibold">Delivery information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Name" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})}/>
                    <Input label="Email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})}/>
                    <Input label="Phone" value={form.phone} onChange={(e)=>setForm({...form, phone: e.target.value})}/>
                    <Input label="Address" value={form.address} onChange={(e)=>setForm({...form, address: e.target.value})}/>
                    <Input label="City" value={form.city} onChange={(e)=>setForm({...form, city: e.target.value})}/>
                    <Input label="Country" value={form.country} onChange={(e)=>setForm({...form, country: e.target.value})}/>
                    <Input label="ZIP / Postal code" value={form.zip} onChange={(e)=>setForm({...form, zip: e.target.value})}/>
                </div>
                <div className="flex gap-3 pt-2">
                    <button className="btn btn-primary" onClick={saveProfile} disabled={saving}>Save</button>
                    {msg && <span className="text-sm text-gray-600">{msg}</span>}
                </div>
            </div>

            <div className="card p-6 space-y-3">
                <h3 className="text-lg font-semibold">Change password</h3>
                <Input label="Current password" type="password" value={pwd.current} onChange={(e)=>setPwd({...pwd, current:e.target.value})}/>
                <Input label="New password" type="password" value={pwd.next} onChange={(e)=>setPwd({...pwd, next:e.target.value})}/>
                <Input label="Confirm new password" type="password" value={pwd.confirm} onChange={(e)=>setPwd({...pwd, confirm:e.target.value})}/>
                <button className="btn btn-secondary" onClick={changePassword} disabled={saving}>Update password</button>
            </div>
        </div>
    );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
    const { label, ...rest } = props;
    return (
        <div className="space-y-1">
            <label className="text-sm text-gray-600">{label}</label>
            <input {...rest} className="input w-full" />
        </div>
    );
}
