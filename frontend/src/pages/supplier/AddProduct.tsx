import { useEffect, useRef, useState } from "react";
import { api } from "@/services/api";
import { motion } from "framer-motion";
import { ImagePlus, CheckCircle2, Loader2, Upload } from "lucide-react";

export default function AddProduct() {
    const [form, setForm] = useState({
        name: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        image: null as File | null,
    });
    const [categories, setCategories] = useState<string[]>([]);
    const [preview, setPreview] = useState<string | null>(null);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Charger catégories
    useEffect(() => {
        api
            .get("/categories")
            .then((res) => setCategories(res.data || []))
            .catch(() => setCategories([]));
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setForm((f) => ({ ...f, image: file }));
        setPreview(file ? URL.createObjectURL(file) : null);
    };

    const openFilePicker = () => fileInputRef.current?.click();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg("");
        setLoading(true);

        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => v && fd.append(k, v as any));

        try {
            console.log("🔵 Submitting product to /api/supplier/products");
            const response = await api.post("/supplier/products", fd, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("✅ Product submitted:", response.data);
            setMsg("✅ Product submitted for admin approval!");
            setForm({
                name: "",
                category: "",
                price: "",
                stock: "",
                description: "",
                image: null,
            });
            setPreview(null);
        } catch (err: any) {
            console.error("❌ Error submitting product:", err);
            console.error("Response status:", err.response?.status);
            console.error("Response data:", err.response?.data);

            if (err.response?.status === 401 || err.response?.status === 403) {
                setMsg("❌ Not authenticated. Please log in as a supplier.");
            } else {
                setMsg(`❌ Error: ${err.response?.data?.message || err.message || "Please try again."}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
        >
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Add New Product</h1>
            </div>

            {msg && (
                <div
                    className={`p-3 rounded-lg text-sm font-medium ${
                        msg.startsWith("✅")
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                >
                    {msg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="card p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm text-gray-600 font-medium">Name</label>
                    <input
                        className="input"
                        name="name"
                        placeholder="Product name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm text-gray-600 font-medium">Category</label>
                    <select
                        className="input"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-sm text-gray-600 font-medium">Price ($)</label>
                    <input
                        className="input"
                        type="number"
                        step="0.01"
                        name="price"
                        placeholder="0.00"
                        value={form.price}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm text-gray-600 font-medium">Stock</label>
                    <input
                        className="input"
                        type="number"
                        name="stock"
                        placeholder="0"
                        value={form.stock}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="space-y-1 md:col-span-2">
                    <label className="text-sm text-gray-600 font-medium">Description</label>
                    <textarea
                        className="input min-h-[120px]"
                        name="description"
                        placeholder="Describe your product..."
                        value={form.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Upload image — SANS overlay */}
                <div className="md:col-span-2">
                    <label className="text-sm text-gray-600 font-medium mb-2 block">Product Image</label>

                    <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 items-start">
                        {/* Aperçu */}
                        <div className="w-44 h-44 rounded-lg border bg-white flex items-center justify-center overflow-hidden">
                            {preview ? (
                                <img src={preview} alt="preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-gray-400 text-sm flex flex-col items-center">
                                    <ImagePlus className="w-8 h-8 mb-1" />
                                    No image
                                </div>
                            )}
                        </div>

                        {/* Bouton + input caché */}
                        <div className="flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={openFilePicker}
                                className="btn btn-secondary inline-flex items-center gap-2 w-fit"
                            >
                                <Upload className="w-4 h-4" />
                                Choose image
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFile}
                                className="hidden"
                            />
                            <p className="text-xs text-gray-500">
                                JPG/PNG up to 5MB. Square images look best.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="md:col-span-2 flex justify-end">
                    <button
                        type="submit"
                        className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                Submit Product
                            </>
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
