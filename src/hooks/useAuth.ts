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
      if (res.requireToken) {
        // User exists, needs PIN
        if (res.isNew) {
          setStep("register");
        } else {
          setStep("pin-existing");
        }
      } else if (res.success && res.user) {
        // No PIN required (legacy user), enter directly
        setUser(res.user);
      } else {
        setError(res.message || "Error al verificar correo");
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
