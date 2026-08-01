import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface AccessibilityState {
  audioDescriptionEnabled: boolean;
  highContrast: boolean;
  fontScale: number;
  isSpeaking: boolean;
  isListening: boolean;
  voiceSupportError: string | null;
}

interface AccessibilityContextValue extends AccessibilityState {
  toggleAudioDescription: () => void;
  toggleHighContrast: () => void;
  increaseFontScale: () => void;
  decreaseFontScale: () => void;
  resetFontScale: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  startListening: (onResult: (transcript: string) => void) => void;
  stopListening: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

const FONT_SCALE_MIN = 1;
const FONT_SCALE_MAX = 1.5;
const FONT_SCALE_STEP = 0.1;

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [audioDescriptionEnabled, setAudioDescriptionEnabled] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupportError, setVoiceSupportError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 100}%`;
  }, [fontScale]);

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const startListening = useCallback((onResult: (transcript: string) => void) => {
    const SpeechRecognitionCtor =
      (window as unknown as Record<string, unknown>)["SpeechRecognition"] ||
      (window as unknown as Record<string, unknown>)["webkitSpeechRecognition"];
    if (!SpeechRecognitionCtor) {
      setVoiceSupportError("Reconhecimento de voz não é suportado neste navegador.");
      return;
    }
    setVoiceSupportError(null);
    const recognition = new (SpeechRecognitionCtor as new () => any)();
    recognition.lang = "pt-BR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setIsListening(true);
    recognition.onerror = () => {
      setIsListening(false);
      setVoiceSupportError("Não foi possível reconhecer sua voz. Tente novamente.");
    };
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? "";
      onResult(transcript);
    };
    recognition.start();
    (window as any).__conectamercado_recognition = recognition;
  }, []);

  const stopListening = useCallback(() => {
    const recognition = (window as any).__conectamercado_recognition;
    if (recognition) recognition.stop();
    setIsListening(false);
  }, []);

  const toggleAudioDescription = useCallback(() => {
    setAudioDescriptionEnabled((prev) => {
      if (prev) stopSpeaking();
      return !prev;
    });
  }, [stopSpeaking]);

  const toggleHighContrast = useCallback(() => setHighContrast((prev) => !prev), []);

  const increaseFontScale = useCallback(
    () => setFontScale((prev) => Math.min(FONT_SCALE_MAX, prev + FONT_SCALE_STEP)),
    [],
  );

  const decreaseFontScale = useCallback(
    () => setFontScale((prev) => Math.max(FONT_SCALE_MIN, prev - FONT_SCALE_STEP)),
    [],
  );

  const resetFontScale = useCallback(() => setFontScale(1), []);

  const value = useMemo<AccessibilityContextValue>(
    () => ({
      audioDescriptionEnabled,
      highContrast,
      fontScale,
      isSpeaking,
      isListening,
      voiceSupportError,
      toggleAudioDescription,
      toggleHighContrast,
      increaseFontScale,
      decreaseFontScale,
      resetFontScale,
      speak,
      stopSpeaking,
      startListening,
      stopListening,
    }),
    [
      audioDescriptionEnabled,
      highContrast,
      fontScale,
      isSpeaking,
      isListening,
      voiceSupportError,
      toggleAudioDescription,
      toggleHighContrast,
      increaseFontScale,
      decreaseFontScale,
      resetFontScale,
      speak,
      stopSpeaking,
      startListening,
      stopListening,
    ],
  );

  return (
    <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return ctx;
}

/**
 * Reads text aloud only when audio description is enabled.
 */
export function useAudioDescribe() {
  const { audioDescriptionEnabled, speak } = useAccessibility();
  return useCallback(
    (text: string) => {
      if (audioDescriptionEnabled) speak(text);
    },
    [audioDescriptionEnabled, speak],
  );
}
