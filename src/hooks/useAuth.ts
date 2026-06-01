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
      // Primera llamada para comprobar el estado del correo
      const res = (await apiCall({ action: "login", correo: emailValue })) as LoginResponse;
      setEmail(emailValue);

      // Si el servidor responde exitosamente
      if (res.success) {
        // CASO 1: El usuario YA existe en la base de datos, exigimos el PIN de una
        if (res.requireToken || !res.isNew) {
          setStep("pin-existing");
        } 
        // CASO 2: El usuario NO existe (res.isNew es true), lo mandamos a registrar su nombre/usuario
        else if (res.isNew) {
          setStep("register");
        } 
        // Por si las moscas con usuarios viejos sin PIN asignado
        else if (res.user) {
          setUser(res.user);
        }
      } else {
        // Si el backend dice success: false pero es porque el usuario no existe, lo tratamos como registro
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

  const registerUser = useCallback(
    async (nameValue: string) => {
      if (!nameValue.trim()) {
        setError("Escribe tu nombre o apodo");
        return;
      }
      setName(nameValue);
      setStep("pin-new");
    },
    []
  );

  const submitPin = useCallback(
    async (pinValue: string, isNew: boolean) => {
      if (pinValue.length !== 4 || !/^\d{4}$/.test(pinValue)) {
        setError("El PIN debe ser exactamente 4 números");
        return;
      }
      setLoading(true);
      setError("");
      try {
        const res = (await apiCall({
          action: "login",
          correo: email,
          nombre: isNew ? name : undefined,
          token: pinValue,
        })) as LoginResponse;

        if (res.success && res.user) {
          setUser(res.user);
          // PIN verified successfully
        } else {
          setError(res.message || "PIN incorrecto");
        }
      } catch {
        setError("Error de conexión");
      } finally {
        setLoading(false);
      }
    },
    [email, name]
  );

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