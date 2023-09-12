import { instance } from "../AxiosClient";
import getAPIConfig from "../APIConfig";

import { LicenseAgentsApi } from "../generated";

function getLicenseAgents({ latitude, longitude }: { latitude: number; longitude: number }) {
    const api = new LicenseAgentsApi(getAPIConfig(), null, instance);

    return api.v1LicenseAgentsGet(latitude, longitude);
}

export type { LicenseAgentVM } from "../generated";
export default { getLicenseAgents };
