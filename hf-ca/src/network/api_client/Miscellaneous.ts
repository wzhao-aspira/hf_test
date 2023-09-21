import { instance } from "../AxiosClient";
import getAPIConfig from "../APIConfig";

import { MiscellaneousApi } from "../generated";

function checkTokenAPI() {
    const api = new MiscellaneousApi(getAPIConfig(), null, instance);

    return api.v1MiscellaneousTokenCheckGet();
}

export default { checkTokenAPI };
