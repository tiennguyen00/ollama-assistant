import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";

import { Live2DModel } from "pixi-live2d-display-lipsyncpatch";
import { aiPreferences } from "../../constant";

// expose PIXI to window so that this plugin is able to
// reference window.PIXI.Ticker to automatically update Live2D models
window.PIXI = PIXI;

const CharacterSelection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null); // referensi untuk ukuran canvasnya
  const [app, setApp] = useState<PIXI.Application<PIXI.ICanvas> | null>(null);
  const [selectedModel, setSelectedModel] = useState(
    aiPreferences[0].modelData
  );

  useEffect(() => {
    const app = new PIXI.Application({
      view: canvasRef.current as HTMLCanvasElement,
      autoStart: true,
      resizeTo: canvasRef.current as HTMLCanvasElement,
      backgroundColor: "#4a628a",
    });
    setApp(app);

    // Add resize re render
    const handleResize = () => {
      const model = app.stage.children[0];

      const canvasWidth = canvasRef.current!.offsetWidth;
      const canvasHeight = canvasRef.current!.offsetHeight;

      if (model) {
        model.position.set(canvasWidth / 2, canvasHeight / 2);
        const modelWidth = model.width;
        const modelHeight = model.height;

        const scaleX = canvasWidth / modelWidth;
        const scaleY = canvasHeight / modelHeight;
        const uniformScale = Math.min(scaleX, scaleY);

        // TODO: Perbaiki useEffect ini karena modelnya disaat dikecilkan berubah besar sekali dulu baru jadi kecil lagi
        model.scale.set(uniformScale);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      if (app.stage.children.length > 0) {
        app.stage.children.forEach((child) => {
          if (child instanceof Live2DModel) {
            child.destroy();
          }
        });
      }
      window.removeEventListener("resize", handleResize);
      app.destroy(true, {
        children: true,
        texture: true,
        baseTexture: true,
      });
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !app || !selectedModel) return;
    if (app.stage) {
      app.stage.removeChildren();
    }

    const canvasWidth = canvasRef.current!.offsetWidth;
    const canvasHeight = canvasRef.current!.offsetHeight;

    const loadModel = async () => {
      await Live2DModel.from(selectedModel).then((model) => {
        model.anchor.set(0.5, 0.5);
        model.position.set(canvasWidth / 2, canvasHeight / 2);

        const modelWidth = model.width;
        const modelHeight = model.height;
        const scaleX = canvasWidth / modelWidth;
        const scaleY = canvasHeight / modelHeight;
        const uniformScale = Math.min(scaleX, scaleY); // *0.9 untuk memberikan sedikit margin

        model.scale.set(uniformScale);

        try {
          app.stage.addChild(model);
        } catch (error) {
          console.log(error);
        }
      });
    };

    loadModel();
  }, [app, selectedModel]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-4">
      {/* Model Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-[400px] bg-transparent rounded-2xl"
        style={{ overflow: "hidden" }}
      />

      {/* Character Selection */}
      <div className="w-full py-5 overflow-x-auto">
        <section className="flex justify-center gap-4 w-max">
          {aiPreferences.map((char, index) => (
            <div key={index} className="flex flex-col items-center">
              <button
                onClick={() => setSelectedModel(char.modelData)}
                className={`flex flex-col items-center p-2 border border-gray-300 rounded-2xl shadow w-28 h-36 overflow-hidden ${
                  selectedModel === char.modelData
                    ? "bg-ghost"
                    : "bg-blue-muted"
                }`}
              >
                <img
                  // src={catPixel}
                  src=""
                  alt={char.name}
                  className="object-cover w-20 h-20 mb-4"
                />
                <span className="text-sm font-bold text-center uppercase">
                  {char.name}
                </span>
              </button>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default CharacterSelection;
