import { Accordion, FormControl } from "@rewind-ui/core";
import { useRouter } from "next/router";
import prand from "pure-rand";
import { FC, useCallback, useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { PageColors, Pages } from "../components/Paper";
import { PenColors } from "../constants";
import { ColorPicker, Colors } from "./Color";
import { Select } from "./Select";
import { Slider } from "./Slider";

enum KnobTypes {
  select = "select",
  slider = "slider",
  random = "random",
  color = "color",
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

interface ColorKnob {
  name: string;
  type: KnobTypes;
  colors: Colors[];
}

type Knob = SelectKnob | SliderKnob | ColorKnob;
type KnobValue = string | number;
const knobProps: {
  [key: string]: Knob;
} = {};

function addKnobProps(key: string, knob: Knob) {
  knobProps[key] = knob;
}

interface KnobsState {
  knobValues: {
    [key: string]: string | number;
  };
  setKnobValue: (key: string, value: KnobValue) => void;
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
    (knob: Knob) => {
      if (pathname) {
        addKnobProps(pathname + knob.name, knob);
      }
    },
    [pathname]
  );

  const initKnob = useCallback(
    (name: string, value?: string | number) => {
      const currentKnobValue = store.knobValues[pathname + name];
      if (value !== undefined && currentKnobValue === undefined) {
        store.setKnobValue(pathname + name, value);
      }
    },
    [pathname, store]
  );

  const getKnobValue = useCallback(
    (name: string) => {
      return store.knobValues[pathname + name];
    },
    [pathname, store]
  );

  // Set global knob props
  addKnob({
    name: "Page Type",
    values: Object.values(Pages),
    type: KnobTypes.select,
  });

  addKnob({
    name: "Page Color",
    values: Object.values(PageColors),
    type: KnobTypes.color,
  });

  addKnob({
    name: "Pen Color",
    values: Object.values(PenColors),
    type: KnobTypes.color,
  });

  addKnob({
    name: "Pen Size",
    min: 1,
    max: 10,
    type: KnobTypes.slider,
  });

  // Init the global knob values
  useEffect(() => {
    initKnob("Page Type", Pages.portrait85x11);
    initKnob("Page Color", PageColors.white);
    initKnob("Pen Color", PenColors.black);
    initKnob("Pen Size", 1);
  }, []);

  return { getKnobValue, setKnob, addKnob, initKnob };
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

  const knobs = Object.values(knobProps);

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
      }}
    >
      <FormControl size="xs" className="p-2">
        {knobs
          .filter((k) => k.type !== KnobTypes.random)
          .map((knobProp) => {
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

              case KnobTypes.color:
                const colorKnob = knobProp as ColorKnob;
                return (
                  <ColorPicker
                    name={colorKnob.name}
                    onClick={(value) => setKnob(colorKnob.name, value)}
                    colors={colorKnob.colors}
                    color={knobValue as Colors}
                    key={colorKnob.name}
                  />
                );
              default:
                return null;
            }
          })}
      </FormControl>

      <Accordion
        defaultItem="item-1"
        activeColor="black"
        bordered={false}
        radius="none"
        size="sm"
        withRing={false}
        className="text-sm text-black"
      >
        <Accordion.Item anchor="seeds">
          <Accordion.Header>Seeds</Accordion.Header>
          <Accordion.Body>
            {knobs
              .filter((k) => k.type === KnobTypes.random)
              .map((knobProp) => {
                const knobValue = getKnobValue(knobProp.name);
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
              })}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <button onClick={download}>Download</button>
    </div>
  );
};

export function useRandomKnob(name: string): () => number {
  const { getKnobValue, addKnob, initKnob } = useKnobs();

  addKnob({
    name,
    type: KnobTypes.random,
    min: 1,
    max: 1000,
    steps: 1,
  });

  useEffect(() => {
    initKnob(name, 1);
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
  const { getKnobValue, initKnob, addKnob } = useKnobs();
  addKnob({
    name,
    type: KnobTypes.select,
    values,
  });

  useEffect(() => {
    initKnob(name, initialValue);
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
  const { getKnobValue, initKnob, addKnob } = useKnobs();

  addKnob({
    name,
    type: KnobTypes.slider,
    min,
    max,
    steps,
  });

  useEffect(() => {
    initKnob(name, initialValue);
  }, []);

  return (getKnobValue(name) as number) ?? initialValue ?? min;
}

export function useKnobValue<T>(name: string): T {
  const { getKnobValue } = useKnobs();
  return getKnobValue(name) as T;
}

interface ColorKnobProps {
  name: string;
  colors: Colors[];
  initialValue?: Colors;
}
export function useColorKnob<T>({
  name,
  colors,
  initialValue,
}: ColorKnobProps): T {
  const { getKnobValue, addKnob, initKnob } = useKnobs();

  addKnob({
    name,
    type: KnobTypes.color,
    colors,
  });

  useEffect(() => {
    initKnob(name, initialValue);
  }, []);

  return (getKnobValue(name) ?? initialValue ?? colors[0]) as T;
}
