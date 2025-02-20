import path from "path";

export const paths = (
  cwd: string,
  prefix: string
  // eslint-disable-next-line @typescript-eslint/ban-types
): Record<string, Function> => ({
  value: () => path.join(cwd, prefix),
  customType: (id: string) => ({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    value: () => path.join(paths(cwd, prefix).value()),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    model: () => path.join(paths(cwd, prefix).value(), id, "index.json"),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-argument
    mock: () => path.join(paths(cwd, prefix).value(), id, "mocks.json"),
  }),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/ban-types
  library: (libraryName: string): Record<string, Function> => ({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-argument
    value: () => path.join(paths(cwd, prefix).value(), libraryName),
    slice: (sliceName: string) => ({
      value: () =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        path.join(paths(cwd, prefix).library(libraryName).value(), sliceName),
      preview: (filename = "preview.png") =>
        path.join(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          paths(cwd, prefix).library(libraryName).slice(sliceName).value(),
          filename
        ),
      stories: (filename = "index.stories.js") =>
        path.join(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          paths(cwd, prefix).library(libraryName).slice(sliceName).value(),
          filename
        ),
      mocks: () =>
        path.join(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          paths(cwd, prefix).library(libraryName).slice(sliceName).value(),
          "mocks.json"
        ),
      model: () =>
        path.join(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          paths(cwd, prefix).library(libraryName).slice(sliceName).value(),
          "model.json"
        ),
      variation: (variationId: string) => ({
        value: () =>
          path.join(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            paths(cwd, prefix).library(libraryName).slice(sliceName).value(),
            variationId
          ),
        preview: (filename = "preview.png") =>
          path.join(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            paths(cwd, prefix)
              .library(libraryName)
              .slice(sliceName)
              .variation(variationId)
              .value(),
            filename
          ),
      }),
    }),
  }),
});

// eslint-disable-next-line @typescript-eslint/ban-types
export const GeneratedPaths = (cwd: string): Record<string, Function> =>
  paths(cwd, path.join(".slicemachine", "assets"));
export const GeneratedCustomTypesPaths = (
  cwd: string
  // eslint-disable-next-line @typescript-eslint/ban-types
): Record<string, Function> =>
  paths(cwd, path.join(".slicemachine", "assets", "customtypes"));
// eslint-disable-next-line @typescript-eslint/ban-types
export const CustomTypesPaths = (cwd: string): Record<string, Function> =>
  paths(cwd, "customtypes");
// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/ban-types
export const CustomPaths = (cwd: string): Record<string, Function> =>
  paths(cwd, "");
// eslint-disable-next-line @typescript-eslint/ban-types
export const PackagePaths = (cwd: string): Record<string, Function> =>
  paths(cwd, "node_modules");
export const LibrariesStatePath = (cwd: string): string =>
  path.join(cwd, ".slicemachine", "libraries-state.json");
export const PrismicConfig = (cwd: string): string =>
  path.join(cwd, ".prismic");
// This function is used in the changelog/migrate.js / don't remove it
export const SMConfig = (cwd: string): string => path.join(cwd, "sm.json");
export const SliceTemplateConfig = (
  cwd: string,
  customPathToTemplate?: string
): string =>
  customPathToTemplate
    ? path.join(cwd, customPathToTemplate)
    : path.join(PrismicConfig(cwd), "slice-template");
export const Pkg = (cwd: string): string => path.join(cwd, "package.json");
export const YarnLock = (cwd: string): string => path.join(cwd, "yarn.lock");
export const MocksConfig = (cwd: string): string =>
  path.join(cwd, ".slicemachine", "mock-config.json");
