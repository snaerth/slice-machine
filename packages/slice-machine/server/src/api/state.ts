import fetchLibs from "./libraries";
import fetchCustomTypes from "./custom-types/index";
import { warningStates } from "@lib/consts";
import {
  BackendEnvironment,
  FrontEndEnvironment,
} from "@lib/models/common/Environment";
import Warning from "@lib/models/common/Warning";
import ErrorWithStatus from "@lib/models/common/ErrorWithStatus";
import ServerError from "@lib/models/server/ServerError";

import { generate } from "./common/generate";
import DefaultClient from "@lib/models/common/http/DefaultClient";
import { FileSystem } from "@slicemachine/core";
import { RequestWithEnv } from "./http/common";
import ServerState from "@models/server/ServerState";
import { setShortId } from "./services/setShortId";

// eslint-disable-next-line @typescript-eslint/require-await
export async function createWarnings(
  env: BackendEnvironment,
  clientError?: ErrorWithStatus
): Promise<ReadonlyArray<Warning>> {
  const newVersion =
    env.updateVersionInfo && env.updateVersionInfo.updateAvailable
      ? {
          key: warningStates.NEW_VERSION_AVAILABLE,
          value: env.updateVersionInfo,
        }
      : undefined;

  const connected = !env.prismicData?.auth
    ? {
        key: warningStates.NOT_CONNECTED,
      }
    : undefined;

  const client = clientError
    ? {
        key: warningStates.CLIENT_ERROR,
        title: `${
          warningStates.CLIENT_ERROR
        }:${clientError.reason.toUpperCase()}`,
      }
    : undefined;

  return [newVersion, connected, client].filter(
    Boolean
  ) as ReadonlyArray<Warning>;
}

export const getBackendState = async (
  configErrors: Record<string, ServerError>,
  env: BackendEnvironment
) => {
  const { libraries, remoteSlices, clientError } = await fetchLibs(env);
  const { customTypes, remoteCustomTypes, isFake } = await fetchCustomTypes(
    env
  );

  // Refresh auth
  if (!isFake && env.prismicData.auth) {
    try {
      const newTokenResponse: Response = await DefaultClient.refreshToken(
        env.prismicData.base,
        env.prismicData.auth
      );

      if (
        newTokenResponse.status &&
        Math.floor(newTokenResponse.status / 100) === 2
      ) {
        const newToken = await newTokenResponse.text();
        FileSystem.PrismicSharedConfigManager.setAuthCookie(newToken);

        // set the short ID if it doesn't exist yet.
        if (!env.prismicData.shortId) await setShortId(env, newToken);
      }
    } catch (e) {
      console.error("[Refresh token]: Internal error : ", e);
    }
  }

  const warnings = await createWarnings(env, clientError);

  if (libraries) await generate(env, libraries);

  return {
    libraries,
    customTypes,
    remoteCustomTypes,
    remoteSlices,
    clientError,
    isFake,
    configErrors,
    env,
    warnings,
  };
};

export default async function handler(
  req: RequestWithEnv
): Promise<ServerState> {
  const { errors: configErrors, env } = req;
  const serverState = await getBackendState(configErrors, env);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-unused-vars
  const { client, cwd, prismicData, baseUrl, ...frontEnv } = serverState.env;
  const frontEndEnv: FrontEndEnvironment = {
    ...frontEnv,
    sliceMachineAPIUrl: baseUrl,
    shortId: prismicData.shortId,
    prismicAPIUrl: prismicData.base,
  };

  return {
    ...serverState,
    env: frontEndEnv,
  };
}
