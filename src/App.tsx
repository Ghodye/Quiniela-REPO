import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePronos } from "@/hooks/usePronos";
import { useRanking } from "@/hooks/useRanking";
import { useBonos } from "@/hooks/useBonos";
import { LoginView } from "@/sections/LoginView";
import { PronosticosTab } from "@/sections/PronosticosTab";
import { BonosTab } from "@/sections/BonosTab";
import { RankingTab } from "@/sections/RankingTab";
import { AdminTab } from "@/sections/AdminTab";
import { API_URL } from "@/lib/api";
import { Trophy, Target, Star, Medal, ShieldAlert, LogOut } from "lucide-react";
import type { ActiveTab } from "@/types";
import "./App.css";

function App() {
  const {
    user,
    step,
    loading: authLoading,
    error: authError,
    isAdmin,
    checkEmail,
    registerUser,
    submitPin,
    logout,
    setError,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>("pronos");

  // Hooks for data
  const { scores, saving: savingPronos, message: msgPronos, updateScore, savePronos } = usePronos(
    user?.correo || "",
    user?.token
  );

  const { bonos, saving: savingBonos, message: msgBonos, updateBono, saveBonos } = useBonos(
    user?.correo || "",
    user?.token
  );

  const { ranking, loading: rankingLoading, load: loadRanking } = useRanking(API_URL);

  // Load ranking on mount when logged in
  useEffect(() => {
    if (user) {
      loadRanking();
    }
  }, [user, loadRanking]);

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: "pronos", label: "PRONÓSTICOS", icon: <Target className="w-3.5 h-3.5" /> },
    { id: "bonos", label: "BONOS", icon: <Star className="w-3.5 h-3.5" /> },
    { id: "ranking", label: "POSICIONES", icon: <Medal className="w-3.5 h-3.5" /> },
  ];

  if (isAdmin) {
    tabs.push({ id: "admin", label: "ADMIN", icon: <ShieldAlert className="w-3.5 h-3.5" /> });
  }

  if (!user) {
    return (
      <div className="app-container">
        <LoginView
          step={step}
          email=""
          name=""
          loading={authLoading}
          error={authError}
          onCheckEmail={checkEmail}
          onRegister={registerUser}
          onSubmitPin={submitPin}
          onBack={() => {
            setError("");
            if (step === "pin-new" || step === "pin-existing") {
              // Can't go back from PIN if user exists
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#161b22] p-4 rounded-xl border border-gray-800">
        <div>
          <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
            Jugador
          </p>
          <h3 className="text-white font-bold text-base">{user.nombre}</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-cyan-400">
            <Trophy className="w-4 h-4" />
            <span className="text-xs font-mono font-bold">2026</span>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
            title="Salir"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#161b22] p-1 rounded-xl grid grid-cols-3 gap-1 text-xs font-bold font-mono">
        {tabs.slice(0, 3).map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center justify-center gap-1 py-2.5 rounded-lg transition-all ${
              activeTab === t.id
                ? "bg-cyan-500 text-[#0d1117]"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Admin tab button */}
      {isAdmin && (
        <button
          onClick={() => setActiveTab("admin")}
          className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all border ${
            activeTab === "admin"
              ? "bg-red-600 border-red-500 text-white"
              : "bg-red-950/30 border-red-900/50 text-red-400 hover:bg-red-900/50"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          PANEL ADMIN
        </button>
      )}

      {/* Content */}
      {activeTab === "pronos" && (
        <PronosticosTab
          scores={scores}
          saving={savingPronos}
          message={msgPronos}
          updateScore={updateScore}
          savePronos={savePronos}
        />
      )}

      {activeTab === "bonos" && (
        <BonosTab
          bonos={bonos}
          saving={savingBonos}
          message={msgBonos}
          updateBono={updateBono}
          saveBonos={saveBonos}
        />
      )}

      {activeTab === "ranking" && (
        <RankingTab ranking={ranking} loading={rankingLoading} />
      )}

      {activeTab === "admin" && isAdmin && (
        <AdminTab
          correo={user.correo}
          token={user.token}
          onResultSubmitted={loadRanking}
        />
      )}
    </div>
  );
}

export default App;
