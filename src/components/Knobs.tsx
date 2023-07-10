import { useRouter } from "next/router";
import prand from "pure-rand";
import { FC, useCallback, useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Select } from "./Select";
import { Slider } from "./Slider";

enum KnobTypes {
  select = "select",
  slider = "slider",
  random = "random",
}

interface SelectKnob {
  name: string;
  type: KnobTypes;
  value: string;
  values: string[];
}

interface SliderKnob {
  name: string;
  type: KnobTypes;
  value: number;
  min: number;
  max: number;
  steps?: number;
}

type Knob = SelectKnob | SliderKnob;
interface KnobsState {
  knobsByPath: {
    [path: string]: {
      [key: string]: Knob;
    };
  };
  setKnobValue: (path: string, name: string, value: string | number) => void;
  addKnob: (path: string, knob: Knob) => void;
}

const useKnobsStore = create<KnobsState>()(
  persist(
    immer<KnobsState>((set) => ({
      knobsByPath: {},
      setKnobValue: (path, name, value) => {
        set((state) => {
          state.knobsByPath[path][name].value = value;
        });
      },
      addKnob: (path: string, knob: Knob) => {
        set((state) => {
          if (!state.knobsByPath[path]) {
            state.knobsByPath[path] = {};
          }

          const currentValue = state.knobsByPath[path][knob.name]?.value;
          state.knobsByPath[path][knob.name] = knob;
          if (currentValue) {
            state.knobsByPath[path][knob.name].value = currentValue;
          }
        });
      },
    })),
    {
      name: "knobs-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

const useKnobs = () => {
  // get the route path from the next.js hook
  const { pathname } = useRouter();
  const store = useKnobsStore();

  // create a function to set the value of a knob
  const setKnob = useCallback(
    (name: string, value: string | number) => {
      store.setKnobValue(pathname, name, value);
    },
    [pathname, store]
  );

  const addKnob = useCallback(
    (knob: Knob) => {
      store.addKnob(pathname, knob);
    },
    [pathname, store]
  );

  return { knobs: store.knobsByPath[pathname] ?? {}, setKnob, addKnob };
};

interface KnobsProps {}
export const Knobs: FC<KnobsProps> = ({}) => {
  const { knobs, setKnob } = useKnobs();

  const download = useCallback(() => {
    const dataURL =
      "data:image/svg+xml," +
      encodeURIComponent(document?.getElementById("sketch")?.outerHTML ?? "");
    const dl = document.createElement("a");
    dl.setAttribute("href", dataURL);
    dl.setAttribute("download", "sketch.svg");
    dl.click();
  }, []);

  return (
    <div
      suppressHydrationWarning
      style={{
        width: "30%",
        backgroundColor: "white",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
        position: "absolute",
        top: 10,
        right: 10,
        minHeight: 50,
        borderRadius: 5,
        padding: 8,
      }}
    >
      {Object.values(knobs).map((knob) => {
        switch (knob.type) {
          case KnobTypes.select:
            const selectKnob = knob as SelectKnob;
            return (
              <Select
                name={selectKnob.name}
                value={selectKnob.value}
                values={selectKnob.values}
                onChange={(value) => setKnob(selectKnob.name, value)}
                key={selectKnob.name}
              />
            );
          case KnobTypes.slider:
            const sliderKnob = knob as SliderKnob;
            return (
              <Slider
                name={sliderKnob.name}
                value={sliderKnob.value}
                min={sliderKnob.min}
                max={sliderKnob.max}
                steps={sliderKnob.steps}
                onChange={(value) => setKnob(sliderKnob.name, value)}
                key={sliderKnob.name}
              />
            );

          case KnobTypes.random:
            const randomKnob = knob as SliderKnob;
            return (
              <Slider
                name={randomKnob.name}
                value={randomKnob.value}
                min={1}
                max={1000}
                steps={1}
                onChange={(value) => setKnob(randomKnob.name, value)}
                key={randomKnob.name}
              />
            );
        }
      })}

      <button onClick={download}>Download</button>
    </div>
  );
};

export function useRandomKnob(name: string): () => number {
  const { knobs, setKnob, addKnob } = useKnobs();
  const knob = knobs[name];

  useEffect(() => {
    addKnob({
      name,
      type: KnobTypes.slider,
      value: 1,
      min: 1,
      max: 1000,
      steps: 1,
    });
  }, []);

  const rng = prand.xoroshiro128plus((knob?.value as number) ?? 1);
  return () => (rng.unsafeNext() >>> 0) / 0x100000000;
}

interface SelectKnobProps {
  name: string;
  values: string[];
  initialValue?: string;
}

export function useSelectKnob<T>({
  name,
  values,
  initialValue,
}: SelectKnobProps): T {
  const { knobs, setKnob, addKnob } = useKnobs();
  const knob = knobs[name];

  useEffect(() => {
    addKnob({
      name,
      type: KnobTypes.select,
      value: initialValue ?? values[0],
      values,
    });
  }, []);

  return (knob?.value ?? initialValue ?? values[0]) as T;
}

interface SliderKnobProps {
  name: string;
  min: number;
  max: number;
  initialValue?: number;
  steps?: number;
}
export function useSliderKnob({
  name,
  min,
  max,
  initialValue,
  steps,
}: SliderKnobProps): number {
  const { knobs, setKnob, addKnob } = useKnobs();
  const knob = knobs[name];

  useEffect(() => {
    addKnob({
      name,
      type: KnobTypes.slider,
      value: initialValue ?? min,
      min,
      max,
      steps,
    });
  }, []);

  return (knob?.value as number) ?? initialValue ?? min;
}

export function useKnobValue<T>(name: string): T {
  const { knobs } = useKnobs();
  const knob = knobs[name];
  return knob?.value as T;
}
