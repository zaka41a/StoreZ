import { Outlet } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import MobileBottomBar from "@/components/MobileBottomBar"

export default function PublicLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* 🧭 Barre de navigation principale */}
            <Navbar />

            {/* 📄 Contenu principal */}
            <main className="flex-grow container mx-auto px-4 py-6">
                <Outlet />
            </main>

            {/* ⚙️ Pied de page */}
            <Footer />

            {/* 📱 Barre de navigation mobile (affichée uniquement sur mobile) */}
            <MobileBottomBar />
        </div>
    )
}
