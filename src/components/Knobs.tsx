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
  values: string[];
}

interface SliderKnob {
  name: string;
  type: KnobTypes;
  min: number;
  max: number;
  steps?: number;
}

type Knob = SelectKnob | SliderKnob;
type KnobValue = string | number;
const knobProps: {
  [key: string]: Knob;
} = {};

interface KnobsState {
  knobValues: {
    [key: string]: string | number;
  };
  setKnobValue: (key: string, value: KnobValue) => void;
  addKnob: (key: string, knob: Knob, value: KnobValue) => void;
}

const useKnobsStore = create<KnobsState>()(
  persist(
    immer<KnobsState>((set) => ({
      knobValues: {},
      setKnobValue: (key, value) => {
        set((state) => {
          state.knobValues[key] = value;
        });
      },
      addKnob: (key, knob, value) => {
        set((state) => {
          state.knobValues[key] = state.knobValues[key] ?? value;
          knobProps[key] = knob;
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
      store.setKnobValue(pathname + name, value);
    },
    [pathname, store]
  );

  const addKnob = useCallback(
    (knob: Knob, value: KnobValue) => {
      store.addKnob(pathname + knob.name, knob, value);
    },
    [pathname, store]
  );

  const getKnobValue = useCallback(
    (name: string) => {
      return store.knobValues[pathname + name];
    },
    [pathname, store]
  );

  return { getKnobValue, setKnob, addKnob };
};

interface KnobsProps {}
export const Knobs: FC<KnobsProps> = ({}) => {
  const { getKnobValue, setKnob } = useKnobs();

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
      {Object.values(knobProps).map((knobProp) => {
        const knobValue = getKnobValue(knobProp.name);
        switch (knobProp.type) {
          case KnobTypes.select:
            const selectKnob = knobProp as SelectKnob;
            return (
              <Select
                name={selectKnob.name}
                value={knobValue as string}
                values={selectKnob.values}
                onChange={(value) => setKnob(selectKnob.name, value)}
                key={selectKnob.name}
              />
            );
          case KnobTypes.slider:
            const sliderKnob = knobProp as SliderKnob;
            return (
              <Slider
                name={sliderKnob.name}
                value={knobValue as number}
                min={sliderKnob.min}
                max={sliderKnob.max}
                steps={sliderKnob.steps}
                onChange={(value) => setKnob(sliderKnob.name, value)}
                key={sliderKnob.name}
              />
            );

          case KnobTypes.random:
            const randomKnob = knobProp as SliderKnob;
            return (
              <Slider
                name={`${randomKnob.name} Seed`}
                value={knobValue as number}
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
  const { getKnobValue, setKnob, addKnob } = useKnobs();

  useEffect(() => {
    addKnob(
      {
        name,
        type: KnobTypes.slider,
        min: 1,
        max: 1000,
        steps: 1,
      },
      1
    );
  }, []);

  const rng = prand.xoroshiro128plus((getKnobValue(name) as number) ?? 1);
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
  const { getKnobValue, setKnob, addKnob } = useKnobs();

  useEffect(() => {
    addKnob(
      {
        name,
        type: KnobTypes.select,
        values,
      },
      initialValue ?? values[0]
    );
  }, []);

  return (getKnobValue(name) ?? initialValue ?? values[0]) as T;
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
  const { getKnobValue, setKnob, addKnob } = useKnobs();

  useEffect(() => {
    addKnob(
      {
        name,
        type: KnobTypes.slider,
        min,
        max,
        steps,
      },
      initialValue ?? min
    );
  }, []);

  return (getKnobValue(name) as number) ?? initialValue ?? min;
}

export function useKnobValue<T>(name: string): T {
  const { getKnobValue } = useKnobs();
  return getKnobValue(name) as T;
}
