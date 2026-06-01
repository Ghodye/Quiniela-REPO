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
        // Si el backend avisa explícitamente que es un usuario NUEVO
        if (res.isNew === true) {
          setStep("register");
        } 
        // Si es un usuario EXISTENTE que necesita poner su PIN
        else if (res.requireToken === true || !res.isNew) {
          setStep("pin-existing");
        } 
        // Solo entramos directo si el backend ya nos mandó el objeto de usuario completo
        else if (res.user) {
          setUser(res.user);
        } else {
          // Por descarte seguro, si no hay usuario, es que falta registrarse
          setStep("register");
        }
      } else {
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
    setStep("pin-new"); // Te manda a la pantalla de crear PIN de 4 dígitos
  }, []);

  const submitPin = useCallback(async (pinValue: string, isNew: boolean) => {
    if (pinValue.length !== 4 || !/^\d{4}$/.test(pinValue)) {
      setError("El PIN debe ser exactamente 4 números");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Mandamos los datos reales al Apps Script para que los guarde en las columnas limpias
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
        setError(res.message || "PIN incorrecto");
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