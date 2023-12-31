import { Accordion, Button, FormControl } from "@rewind-ui/core";
import { useRouter } from "next/router";
import prand from "pure-rand";
import { FC, useCallback, useEffect } from "react";
import { create } from "zustand";
import { StateStorage, createJSONStorage, persist } from "zustand/middleware";
import { PageColors, Pages } from "../components/Paper";
import { PenColors } from "../constants";
import { ColorPicker, Colors } from "./Color";
import { FromTo } from "./FromTo";
import { Select } from "./Select";
import { Slider } from "./Slider";

const getUrlSearch = () => {
  return window.location.search.slice(1);
};

// Create a function that calls window.history.replaceState but debounces it so we don't spam the history
let timer: NodeJS.Timeout | null = null;
const debouncedReplaceState = (value: string) => {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    window.history.replaceState(null, "", `?${value}`);
  }, 500);
};

const persistentStorage: StateStorage = {
  getItem: (key): string => {
    // Check URL first
    if (getUrlSearch()) {
      const searchParams = new URLSearchParams(getUrlSearch());
      const storedValue = searchParams.get(key);
      return JSON.parse(storedValue ?? "null");
    } else {
      // Otherwise, we should load from localStorage or alternative storage
      return JSON.parse(localStorage.getItem(key) ?? "null");
    }
  },
  setItem: (key, newValue): void => {
    const searchParams = new URLSearchParams(getUrlSearch());
    searchParams.set(key, JSON.stringify(newValue));
    debouncedReplaceState(searchParams.toString());
    localStorage.setItem(key, JSON.stringify(newValue));
  },
  removeItem: (key): void => {
    const searchParams = new URLSearchParams(getUrlSearch());
    searchParams.delete(key);
    window.location.search = searchParams.toString();
  },
};

enum KnobTypes {
  select = "select",
  slider = "slider",
  random = "random",
  color = "color",
  fromTo = "fromTo",
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
type KnobValue = string | number | Colors | [number, number];

const knobProps: {
  [key: string]: Knob;
} = {};

function addKnobProps(key: string, knob: Knob) {
  knobProps[key] = knob;
}

interface KnobsStore {
  [key: string]: KnobValue;
  pathname: string;
}

const useKnobsStore = create<KnobsStore>()(
  persist(
    () => ({
      pathname: "",
    }),
    {
      name: "knobs",
      storage: createJSONStorage(() => persistentStorage),
      partialize(state: KnobsStore) {
        // Reduce the state object to only the keys that start with the current pathname
        return Object.keys(state).reduce((acc, key) => {
          if (key.startsWith(state.pathname)) {
            acc[key] = state[key];
          }
          return acc;
        }, {} as KnobsStore);
      },
    }
  )
);

const useKnobs = () => {
  // get the route path from the next.js hook
  const { pathname } = useRouter();
  const store = useKnobsStore();

  // create a function to set the value of a knob
  const setKnob = useCallback(
    (name: string, value: KnobValue) => {
      useKnobsStore.setState(() => ({ [pathname + name]: value }));
    },
    [pathname]
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
    (name: string, value?: KnobValue) => {
      const currentKnobValue = store[pathname + name];
      if (value !== undefined && currentKnobValue === undefined) {
        useKnobsStore.setState(() => ({ [pathname + name]: value }));
      }
    },
    [pathname, store]
  );

  const getKnobValue = useCallback(
    (name: string) => store[pathname + name],
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
    useKnobsStore.setState(() => ({ pathname }));
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

  const seedKnobs = knobs.filter((k) => k.type === KnobTypes.random);
  const paramKnobs = knobs.filter((k) => k.type !== KnobTypes.random);

  return (
    <div
      suppressHydrationWarning
      style={{
        width: "30%",
        backgroundColor: "white",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
        minHeight: 50,
        borderRadius: 5,
      }}
    >
      <FormControl size="xs" className="p-2">
        {paramKnobs.map((knobProp) => {
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

            case KnobTypes.fromTo:
              const fromToKnob = knobProp as FromToKnobProps;
              return (
                <FromTo
                  name={fromToKnob.name}
                  value={knobValue as [number, number]}
                  min={fromToKnob.min}
                  max={fromToKnob.max}
                  steps={fromToKnob.steps}
                  onChange={(value) => setKnob(fromToKnob.name, value)}
                  key={fromToKnob.name}
                />
              );

            default:
              return null;
          }
        })}

        {seedKnobs.length > 0 && (
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
                {seedKnobs.map((knobProp) => {
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
        )}

        <Button onClick={download}>Download</Button>
      </FormControl>
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

interface FromToKnobProps {
  name: string;
  min: number;
  max: number;
  fromInitialValue?: number;
  toInitialValue?: number;
  steps?: number;
}
export function useFromToKnob({
  name,
  min,
  max,
  fromInitialValue,
  toInitialValue,
  steps,
}: FromToKnobProps): [number, number] {
  const { getKnobValue, initKnob, addKnob } = useKnobs();

  // From knob
  addKnob({
    name,
    type: KnobTypes.fromTo,
    min,
    max,
    steps,
  });

  useEffect(() => {
    initKnob(name, [fromInitialValue ?? min, toInitialValue ?? max]);
  }, []);

  const value = (getKnobValue(name) as [number, number]) ?? [];

  const from = value[0] ?? fromInitialValue;
  const to = value[1] ?? toInitialValue;

  return [from, to];
}
