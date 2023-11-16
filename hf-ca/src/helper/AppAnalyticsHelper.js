// eslint-disable-next-line import/no-extraneous-dependencies
import analytics from "@react-native-firebase/analytics";

const analyticsInstance = analytics();
const sessionTimeoutDuration = undefined;

export default {
    init: async () => {
        if (sessionTimeoutDuration) {
            await analyticsInstance.setSessionTimeoutDuration(sessionTimeoutDuration);
        }
    },

    logEvent: async (eventName, properties = undefined) => {
        await analyticsInstance.logEvent(eventName, properties);
    },
};
