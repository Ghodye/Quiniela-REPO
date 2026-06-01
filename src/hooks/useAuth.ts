import { useState, useCallback } from "react";
import { apiCall } from "@/lib/api";
import type { User, LoginResponse } from "@/types";

type AuthStep = "email" | "register" | "pin-new" | "pin-existing";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState<AuthStep>("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkEmail = useCallback(async (emailValue: string) => {
    if (!emailValue.trim()) {
      setError("Escribe tu correo electrónico");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = (await apiCall({ action: "login", correo: emailValue })) as LoginResponse;
      setEmail(emailValue);

      if (res.success) {
        // CONTROL ESTRICTO: Si el backend dice que es NUEVO, obligatoriamente va a pantalla de registro
        if (res.isNew === true) {
          setStep("register");
        } 
        // Si no es nuevo pero exige token (o ya tiene un PIN creado en la base de datos)
        else if (res.requireToken === true || !res.isNew) {
          setStep("pin-existing");
        } 
        // Si por alguna razón el backend devolvió el usuario listo sin pedir más nada
        else if (res.user) {
          setUser(res.user);
        }
      } else {
        // Respaldo por si el backend rechaza la petición diciendo que no existe
        if (res.message && (res.message.toLowerCase().includes("no existe") || res.message.toLowerCase().includes("not found"))) {
          setStep("register");
        } else {
          setError(res.message || "Error al verificar correo");
        }
      }
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  }, []);

  const registerUser = useCallback(async (nameValue: string) => {
    if (!nameValue.trim()) {
      setError("Escribe tu nombre o apodo");
      return;
    }
    setName(nameValue);
    // Cambia el flujo a la pantalla para crear el PIN NUEVO
    setStep("pin-new");
  }, []);

  const submitPin = useCallback(async (pinValue: string, isNew: boolean) => {
    if (pinValue.length !== 4 || !/^\d{4}$/.test(pinValue)) {
      setError("El PIN debe ser exactamente 4 números");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Mandamos la acción definitiva de registro o login pasándole el PIN
      const res = (await apiCall({
        action: "login",
        correo: email,
        nombre: isNew ? name : undefined,
        token: pinValue,
      })) as LoginResponse;

      if (res.success && res.user) {
        setUser(res.user);
        setError("");
      } else {
        setError(res.message || "Error al procesar el PIN");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }, [email, name]);

  const logout = useCallback(() => {
    setUser(null);
    setStep("email");
    setEmail("");
    setName("");
    setError("");
  }, []);

  const isAdmin = user?.esAdmin === true || user?.esAdmin === "true";

  return {
    user,
    step,
    email,
    name,
    loading,
    error,
    isAdmin,
    checkEmail,
    registerUser,
    submitPin,
    logout,
    setError,
  };
}