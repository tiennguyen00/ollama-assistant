import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";

import { Live2DModel } from "pixi-live2d-display-lipsyncpatch";
import { aiPreferences } from "../../constant";

import { Ticker } from "@pixi/ticker";

interface CharacterSelectionProps {
  model: Live2DModel | null;
  setModel: (model: Live2DModel | null) => void;
}

const CharacterSelection = ({ model, setModel }: CharacterSelectionProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null); // referensi untuk ukuran canvasnya
  const [app, setApp] = useState<PIXI.Application<PIXI.ICanvas> | null>(null);
  const selectedModel = aiPreferences[aiPreferences.length - 1].modelData;

  useEffect(() => {
    const app = new PIXI.Application({
      view: canvasRef.current as HTMLCanvasElement,
      autoStart: true,
      resizeTo: canvasRef.current as HTMLCanvasElement,
      backgroundAlpha: 0,
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
      await Live2DModel.from(selectedModel, {
        autoUpdate: false,
      }).then((model) => {
        setModel(model);
        model.anchor.set(0.5, 0.5);
        model.position.set(canvasWidth / 2, canvasHeight / 2);

        const modelWidth = model.width;
        const modelHeight = model.height;
        const scaleX = canvasWidth / modelWidth;
        const scaleY = canvasHeight / modelHeight;
        const uniformScale = Math.min(scaleX, scaleY); // *0.9 untuk memberikan sedikit margin

        model.scale.set(uniformScale);

        // manual update model animation frame by frame
        const speedFactor = 1;
        const ticker = new Ticker();
        ticker.add(() => model.update(ticker.elapsedMS));
        let then = performance.now();
        function tick(now) {
          const deltaTime = (now - then) * speedFactor; // Scale down the time
          model.update(deltaTime);
          then = now;
          requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);

        try {
          app.stage.addChild(model);
        } catch (error) {
          console.error("error while addChild model", error);
        }
      });
    };

    loadModel();
  }, [app, selectedModel]);

  return (
    <canvas
      ref={canvasRef}
      className="flex items-center justify-center w-full overflow-hidden"
    />
  );
};

export default CharacterSelection;
