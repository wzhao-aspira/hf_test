import usefulLinksMockData from "./mock_data/useful_links.json";

async function getUsefulLinksData() {
    const { usefulLinksData } = await usefulLinksMockData;

    return usefulLinksData;
}

export default {
    getUsefulLinksData,
};
