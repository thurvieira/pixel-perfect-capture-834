import type { HTMLAttributes } from "react";
import { useEffect } from "react";

const ROOT_PATH = "https://vlibras.gov.br/app";

/**
 * Loads the official Brazilian government VLibras widget, which provides
 * real-time automatic translation of on-screen text into Libras (Brazilian
 * Sign Language) via a 3D avatar. https://www.vlibras.gov.br/
 *
 * The official plugin bootstraps itself from `window.onload`, which has already
 * fired in a single-page app, so after constructing the widget we invoke the
 * handler it registered manually.
 */
export default function VLibrasWidget() {
  useEffect(() => {
    let cancelled = false;

    const boot = () => {
      if (cancelled) return;
      const VLibrasGlobal = (
        window as unknown as {
          VLibras?: { Widget: new (options: Record<string, unknown>) => unknown };
        }
      ).VLibras;
      if (!VLibrasGlobal?.Widget) return;

      const previousOnload = window.onload;
      new VLibrasGlobal.Widget({ rootPath: ROOT_PATH, position: "R", avatar: "icaro" });

      // The plugin assigns its bootstrap to window.onload; run it now.
      const bootstrap = window.onload;
      if (typeof bootstrap === "function" && bootstrap !== previousOnload) {
        bootstrap.call(window, new Event("load") as unknown as UIEvent);
        window.onload = previousOnload ?? null;
      }
    };

    const existing = document.getElementById("vlibras-script");
    if (existing) {
      boot();
      return () => {
        cancelled = true;
      };
    }

    const script = document.createElement("script");
    script.id = "vlibras-script";
    script.src = `${ROOT_PATH}/vlibras-plugin.js`;
    script.async = true;
    script.onload = boot;
    document.body.appendChild(script);

    return () => {
      cancelled = true;
    };
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
