import { Frameworks } from "@slicemachine/core/build/src/models";

import NextSetupStepperConfiguration from "./next";
import NuxtSetupStepperConfiguration from "./nuxt";
import { SetupStepperConfiguration } from "@builders/SliceBuilder/SetupDrawer/steps/common";

export const getStepperConfigurationByFramework = (
  framework: Frameworks
): SetupStepperConfiguration => {
  switch (framework) {
    case Frameworks.nuxt:
      return NuxtSetupStepperConfiguration;
    case Frameworks.next:
      return NextSetupStepperConfiguration;
    default:
      throw new Error(`${framework} : doesn't support simulator`);
  }
};
