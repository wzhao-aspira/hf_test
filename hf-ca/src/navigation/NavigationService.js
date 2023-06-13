import * as React from "react";

export const navigationRef = React.createRef();

function navigate(name, params) {
    return navigationRef.current?.navigate(name, params);
}

export default {
    navigate,
};
