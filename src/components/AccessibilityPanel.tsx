import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAccessibility } from "@/lib/accessibility";
import {
  Contrast,
  Ear,
  Mic,
  MicOff,
  Minus,
  Plus,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useState } from "react";

export default function AccessibilityPanel() {
  const {
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
  } = useAccessibility();
  const [lastCommand, setLastCommand] = useState("");

  const handleVoiceCommand = () => {
    if (isListening) {
      stopListening();
      return;
    }
    startListening((transcript) => {
      setLastCommand(transcript);
      speak(`Você disse: ${transcript}`);
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 print:hidden">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg"
            aria-label="Abrir painel de acessibilidade"
          >
            <Ear className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          side="top"
          className="w-80 space-y-4"
          aria-label="Painel de acessibilidade"
        >
          <div>
            <p className="text-sm font-semibold">Acessibilidade</p>
            <p className="text-xs text-muted-foreground">
              Ajuste como você usa o ConectaMercado.
            </p>
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              {audioDescriptionEnabled ? (
                <Volume2 className="h-4 w-4 text-primary" />
              ) : (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              )}
              <span>Áudio-descrição</span>
            </div>
            <Button
              size="sm"
              variant={audioDescriptionEnabled ? "default" : "outline"}
              onClick={toggleAudioDescription}
              aria-pressed={audioDescriptionEnabled}
            >
              {audioDescriptionEnabled ? "Ativada" : "Desativada"}
            </Button>
          </div>

          {isSpeaking && (
            <Button
              size="sm"
              variant="ghost"
              className="w-full justify-start text-xs"
              onClick={stopSpeaking}
            >
              Parar leitura em voz alta
            </Button>
          )}

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              {isListening ? (
                <Mic className="h-4 w-4 text-primary" />
              ) : (
                <MicOff className="h-4 w-4 text-muted-foreground" />
              )}
              <span>Busca por voz</span>
            </div>
            <Button
              size="sm"
              variant={isListening ? "default" : "outline"}
              onClick={handleVoiceCommand}
              aria-pressed={isListening}
            >
              {isListening ? "Ouvindo…" : "Falar"}
            </Button>
          </div>
          {voiceSupportError && (
            <p className="text-xs text-destructive">{voiceSupportError}</p>
          )}
          {lastCommand && (
            <p className="text-xs text-muted-foreground">
              Último comando: "{lastCommand}"
            </p>
          )}

          <Separator />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Contrast className="h-4 w-4" />
              <span>Alto contraste</span>
            </div>
            <Button
              size="sm"
              variant={highContrast ? "default" : "outline"}
              onClick={toggleHighContrast}
              aria-pressed={highContrast}
            >
              {highContrast ? "Ativado" : "Desativado"}
            </Button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-sm">Tamanho da fonte</span>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={decreaseFontScale}
                aria-label="Diminuir fonte"
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={resetFontScale}
                aria-label="Restaurar tamanho da fonte"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={increaseFontScale}
                aria-label="Aumentar fonte"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {Math.round(fontScale * 100)}% do tamanho padrão
          </p>

          <Separator />

          <p className="text-xs text-muted-foreground">
            Use o botão do <strong>VLibras</strong> (canto da tela) para tradução
            automática em Libras com avatar 3D.
          </p>
        </PopoverContent>
      </Popover>
    </div>
  );
}
