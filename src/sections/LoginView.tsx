import { Shield, KeyRound, User, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

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

  const handleEmail = () => {
    if (!emailInput.trim()) return;
    onCheckEmail(emailInput);
  };

  const handleRegister = () => {
    if (!nameInput.trim()) return;
    onRegister(nameInput);
  };

  const handlePin = () => {
    if (pinInput.length !== 4) return;
    onSubmitPin(pinInput, step === "pin-new");
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPinInput(v);
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center space-y-6 max-w-sm mx-auto p-4">
      {/* Icono de Cabecera Dinámico */}
      <div className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-800 shadow-xl">
        {step === "email" && <Mail className="w-8 h-8 text-cyan-400" />}
        {step === "register" && <User className="w-8 h-8 text-emerald-400" />}
        {step === "pin-new" && <KeyRound className="w-8 h-8 text-amber-400" />}
        {step === "pin-existing" && <Shield className="w-8 h-8 text-cyan-400" />}
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-white uppercase tracking-wider">
          {step === "email" && "Polla Euro 2026"}
          {step === "register" && "¡Pana Nuevo!"}
          {step === "pin-new" && "Crea tu PIN"}
          {step === "pin-existing" && "Verificación"}
        </h1>
        <p className="text-sm text-gray-400">
          {step === "email" && "Introduce tu correo para ingresar o registrarte."}
          {step === "register" && "Este correo no está registrado. ¿Cómo te van a llamar en la quiniela?"}
          {step === "pin-new" && "Define un PIN numérico de 4 dígitos para proteger tus pronósticos."}
          {step === "pin-existing" && "Tu correo ya tiene cuenta. Ingresa tu PIN de acceso."}
        </p>
      </div>

      <div className="w-full bg-[#0d1117]/40 border border-gray-800 rounded-2xl p-5 shadow-2xl space-y-4">
        
        {/* PASO 1: Pedir Correo */}
        {step === "email" && (
          <div className="space-y-3">
            <Input
              type="email"
              placeholder="tu-correo@gmail.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEmail()}
              className="bg-[#0d1117] border-gray-700 rounded-xl h-11 text-white focus:border-cyan-400"
            />
            <Button
              onClick={handleEmail}
              disabled={loading || !emailInput.trim()}
              className="w-full h-11 bg-cyan-500 hover:bg-cyan-400 text-[#0d1117] font-extrabold rounded-xl"
            >
              {loading ? "VERIFICANDO..." : "CONTINUAR"}
            </Button>
          </div>
        )}

        {/* PASO 2: Pedir Nombre de Usuario (Solo si es Nuevo) */}
        {step === "register" && (
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Tu Apodo o Nombre"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              className="bg-[#0d1117] border-gray-700 rounded-xl h-11 text-white focus:border-emerald-400"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1 h-11 border-gray-700 text-gray-300 hover:bg-gray-800 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Atrás
              </Button>
              <Button
                onClick={handleRegister}
                disabled={loading || !nameInput.trim()}
                className="flex-[2] h-11 bg-emerald-500 hover:bg-emerald-400 text-[#0d1117] font-extrabold rounded-xl"
              >
                CONFIGURAR PIN
              </Button>
            </div>
          </div>
        )}

        {/* PASO 3: Crear PIN Nuevo (Solo si es Nuevo) */}
        {step === "pin-new" && (
          <div className="space-y-4 text-center">
            <Input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="••••"
              value={pinInput}
              onChange={handlePinChange}
              onKeyDown={(e) => e.key === "Enter" && handlePin()}
              className="w-28 mx-auto bg-[#0d1117] border-amber-500 rounded-xl h-12 text-center text-xl text-white font-mono font-bold tracking-[0.3em] placeholder:tracking-normal focus:border-amber-400"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1 h-11 border-gray-700 text-gray-300 hover:bg-gray-800 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Atrás
              </Button>
              <Button
                onClick={handlePin}
                disabled={loading || pinInput.length !== 4}
                className="flex-[2] h-11 bg-amber-500 hover:bg-amber-400 text-[#0d1117] font-extrabold rounded-xl"
              >
                {loading ? "CREANDO..." : "FINALIZAR REGISTRO"}
              </Button>
            </div>
          </div>
        )}

        {/* PASO 4: Pedir PIN a un usuario Viejo */}
        {step === "pin-existing" && (
          <div className="space-y-4 text-center">
            <Input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="••••"
              value={pinInput}
              onChange={handlePinChange}
              onKeyDown={(e) => e.key === "Enter" && handlePin()}
              className="w-28 mx-auto bg-[#0d1117] border-cyan-500 rounded-xl h-12 text-center text-xl text-white font-mono font-bold tracking-[0.3em] placeholder:tracking-normal focus:border-cyan-400"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1 h-11 border-gray-700 text-gray-300 hover:bg-gray-800 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Atrás
              </Button>
              <Button
                onClick={handlePin}
                disabled={loading || pinInput.length !== 4}
                className="flex-[2] h-11 bg-cyan-500 hover:bg-cyan-400 text-[#0d1117] font-extrabold rounded-xl"
              >
                {loading ? "INGRESANDO..." : "ENTRAR"}
              </Button>
            </div>
          </div>
        )}

        {error && (
          <p className="text-red-400 text-xs text-center font-mono bg-red-950/20 border border-red-900/50 p-2.5 rounded-xl">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}