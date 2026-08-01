import type { HTMLAttributes } from "react";
import { useEffect } from "react";

/**
 * Loads the official Brazilian government VLibras widget, which provides
 * real-time automatic translation of on-screen text into Libras (Brazilian
 * Sign Language) via a 3D avatar. https://www.vlibras.gov.br/
 */
export default function VLibrasWidget() {
  useEffect(() => {
    if (document.getElementById("vlibras-script")) return;

    const script = document.createElement("script");
    script.id = "vlibras-script";
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;
    script.onload = () => {
      const VLibrasGlobal = (window as any).VLibras;
      if (VLibrasGlobal) {
        new VLibrasGlobal.Widget("https://vlibras.gov.br/app");
      }
    };
    document.body.appendChild(script);
  }, []);

  const rootProps = { vw: "true" } as unknown as HTMLAttributes<HTMLDivElement>;
  const buttonProps = {
    "vw-access-button": "true",
  } as unknown as HTMLAttributes<HTMLDivElement>;
  const wrapperProps = {
    "vw-plugin-wrapper": "true",
  } as unknown as HTMLAttributes<HTMLDivElement>;

  return (
    <div {...rootProps} className="enabled" aria-label="Tradutor de Libras VLibras">
      <div {...buttonProps} className="active" />
      <div {...wrapperProps}>
        <div className="vw-plugin-top-wrapper" />
      </div>
    </div>
  );
}
