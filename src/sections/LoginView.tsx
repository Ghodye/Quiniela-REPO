import { Shield, KeyRound, User, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LoginViewProps {
  step: "email" | "register" | "pin-new" | "pin-existing";
  email: string;
  name: string;
  loading: boolean;
  error: string;
  onCheckEmail: (email: string) => void;
  onRegister: (name: string) => void;
  onSubmitPin: (pin: string, isNew: boolean) => void;
  onBack: () => void;
}

import { useState } from "react";

export function LoginView({
  step,
  loading,
  error,
  onCheckEmail,
  onRegister,
  onSubmitPin,
  onBack,
}: LoginViewProps) {
  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [pinInput, setPinInput] = useState("");

  const handleEmail = () => onCheckEmail(emailInput);
  const handleRegister = () => onRegister(nameInput);
  const handlePin = () => onSubmitPin(pinInput, step === "pin-new");

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPinInput(v);
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center space-y-6 py-12 px-4">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-white tracking-wide uppercase neon-text">
          Quiniela 2026
        </h1>
        <p className="text-xs text-cyan-400 tracking-[0.3em] font-mono font-bold">
          FASE DE GRUPOS
        </p>
      </div>

      <div className="w-full max-w-sm card-match p-6 rounded-2xl neon-border space-y-5">
        {/* Step 1: Email */}
        {step === "email" && (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-white">
              <Mail className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-semibold">Ingresa para participar</h2>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-mono uppercase tracking-wider">
                Correo Electrónico
              </label>
              <Input
                type="email"
                placeholder="tu_panita@gmail.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEmail()}
                className="bg-[#0d1117] border-gray-700 rounded-xl h-11 text-white placeholder:text-gray-600 focus:border-cyan-400 focus:ring-cyan-400/20"
              />
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <Button
              onClick={handleEmail}
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-sm shadow-lg transition-all"
            >
              {loading ? "PROCESANDO..." : "ENTRAR A LA QUINIELA"}
            </Button>
          </div>
        )}

        {/* Step 2: Register (name) */}
        {step === "register" && (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-white">
              <User className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-semibold">Completa tu registro</h2>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-mono uppercase tracking-wider">
                Tu Nombre / Apodo
              </label>
              <Input
                type="text"
                placeholder="Ej. El Gordo Kevin"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                className="bg-[#0d1117] border-gray-700 rounded-xl h-11 text-white placeholder:text-gray-600 focus:border-cyan-400 focus:ring-cyan-400/20"
              />
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1 h-11 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Atrás
              </Button>
              <Button
                onClick={handleRegister}
                className="flex-[2] h-11 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-sm shadow-lg"
              >
                CONTINUAR
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: PIN new */}
        {step === "pin-new" && (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-white">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-semibold">Crea tu PIN</h2>
            </div>
            <div className="bg-cyan-950/30 p-4 rounded-xl border border-cyan-800/50 text-center space-y-3">
              <label className="block text-xs text-cyan-400 font-mono font-bold uppercase tracking-wider">
                Inventa un PIN de 4 números
              </label>
              <Input
                type="password"
                inputMode="numeric"
                maxLength={4}
                placeholder="••••"
                value={pinInput}
                onChange={handlePinChange}
                onKeyDown={(e) => e.key === "Enter" && handlePin()}
                className="w-28 mx-auto bg-[#0d1117] border-cyan-500 rounded-xl h-12 text-center text-xl text-white font-mono font-bold tracking-[0.3em] placeholder:text-gray-600 placeholder:tracking-normal focus:border-cyan-400 focus:ring-cyan-400/20"
              />
              <p className="text-xs text-gray-400">
                No lo olvides. Lo usarás siempre para volver a entrar.
              </p>
            </div>
            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1 h-11 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Atrás
              </Button>
              <Button
                onClick={handlePin}
                disabled={loading || pinInput.length !== 4}
                className="flex-[2] h-11 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold rounded-xl text-sm shadow-lg disabled:opacity-50"
              >
                {loading ? "CREANDO..." : "CREAR PIN Y ENTRAR"}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: PIN existing */}
        {step === "pin-existing" && (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-white">
              <KeyRound className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-semibold">Verificar Identidad</h2>
            </div>
            <div className="bg-amber-950/20 p-4 rounded-xl border border-amber-800/40 text-center space-y-3">
              <label className="block text-xs text-amber-400 font-mono font-bold uppercase tracking-wider">
                Ingresa tu PIN de acceso
              </label>
              <Input
                type="password"
                inputMode="numeric"
                maxLength={4}
                placeholder="••••"
                value={pinInput}
                onChange={handlePinChange}
                onKeyDown={(e) => e.key === "Enter" && handlePin()}
                className="w-28 mx-auto bg-[#0d1117] border-amber-500 rounded-xl h-12 text-center text-xl text-white font-mono font-bold tracking-[0.3em] placeholder:text-gray-600 placeholder:tracking-normal focus:border-amber-400 focus:ring-amber-400/20"
              />
              <p className="text-xs text-gray-400">
                PIN de 4 números que creaste al registrarte.
              </p>
            </div>
            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1 h-11 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Atrás
              </Button>
              <Button
                onClick={handlePin}
                disabled={loading || pinInput.length !== 4}
                className="flex-[2] h-11 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-xl text-sm shadow-lg disabled:opacity-50"
              >
                {loading ? "VERIFICANDO..." : "VERIFICAR PIN"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
