import React, { useReducer } from "react";
import { useRouter } from "next/router";
import type Models from "@slicemachine/core/build/src/models";
import { LibrariesContext } from "../libraries/context";
import { useContext } from "react";
import SliceStore from "./store";
import { reducer } from "./reducer";

import SliceState from "@lib/models/ui/SliceState";
import Slice from "@lib/models/common/Slice";
import { ComponentUI } from "@lib/models/common/ComponentUI";

export type ContextProps = {
  Model: SliceState;
  store: SliceStore;
  variation: Models.VariationAsArray;
};
export const SliceContext = React.createContext<Partial<ContextProps>>({});
SliceContext.displayName = "SliceContext";
/**
 * remoteSlicesState
 * fsSlicesState
 */

export function useModelReducer({
  slice,
  remoteSlice,
  mockConfig,
}: {
  slice: ComponentUI;
  remoteSlice?: Models.SliceAsObject;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockConfig: any;
}): [SliceState, SliceStore] {
  const { model, ...rest } = slice;

  const variations = Slice.toArray(model).variations;
  const initialState: SliceState = {
    model,
    ...rest,
    variations,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    mockConfig,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    initialMockConfig: mockConfig,
    remoteVariations: remoteSlice ? Slice.toArray(remoteSlice).variations : [],
    initialScreenshotUrls: rest.screenshotUrls,
    initialVariations: variations,
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const store = new SliceStore(dispatch);

  return [state, store];
}

type SliceProviderProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  variation: Models.VariationAsArray;
};

const SliceProvider: React.FunctionComponent<SliceProviderProps> = ({
  children,
  value,
  variation,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [Model, store] = value;
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-assignment
    <SliceContext.Provider value={{ Model, store, variation }}>
      {typeof children === "function" ? children(value) : children}
    </SliceContext.Provider>
  );
};
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
export const SliceHandler = ({ children }: { children: any }) => {
  const router = useRouter();
  const libraries = useContext(LibrariesContext);

  if (!router.query || !router.query.lib || !router.query.sliceName) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return children;
  }

  const libParam: string = (() => {
    const l = router.query.lib;
    if (l instanceof Array) return l[0];
    else return l;
  })();

  const lib = libraries?.find((l) => l?.name === libParam.replace(/--/g, "/"));
  if (!lib) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.replace("/");
    return null;
  }

  const slice = lib.components.find(
    ([state]) => state.infos.sliceName === router.query.sliceName
  );

  if (!slice) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.replace("/");
    return null;
  }

  const variationParam: string | undefined = (() => {
    const l = router.query.variation;
    if (l instanceof Array) return l[0];
    else return l;
  })();
  const variation = (() => {
    if (variationParam) {
      const maybeVariation = SliceState.variation(slice[0], variationParam);
      if (!maybeVariation) return SliceState.variation(slice[0]);
      else return maybeVariation;
    } else {
      return SliceState.variation(slice[0]);
    }
  })();
  if (!variation) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.replace("/");
    return null;
  }

  // variation not in the URL but a default variation was found
  if (!variationParam) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.replace(`/${lib.name}/${slice[0].infos.sliceName}/${variation.id}`);
  }

  return (
    <SliceProvider value={slice} variation={variation}>
      {children}
    </SliceProvider>
  );
};

export default SliceProvider;
