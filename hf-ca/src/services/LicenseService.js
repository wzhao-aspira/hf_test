import licenseData from "./mock_data/license.json";

export async function getLicenseData() {
    return new Promise((res) => {
        setTimeout(() => res(licenseData), 3000);
    });
}

export function getLoadingData() {
    const data = [];
    for (let index = 0; index < 5; index++) {
        const loadingItem = { isLoading: true, id: `Loading${index}` };
        data[index] = loadingItem;
    }
    return data;
}
