import type { DrawApplicationItem as DrawApplicationItemData } from "../../../../types/drawApplication";

function formatDrawApplicationChoices(drawApplicationChoices: DrawApplicationItemData[]) {
    if (drawApplicationChoices.length > 1) {
        let indexOfFirstItem: number;

        const filteredDrawApplicationChoices = drawApplicationChoices.filter((item, index) => {
            const { alternateNumber, didIWin } = item;

            const shouldFilter = (typeof alternateNumber === "string" && alternateNumber !== "N/A") || didIWin === "Y";

            if (shouldFilter) indexOfFirstItem = index;

            return !shouldFilter;
        });

        const shouldSortTheList = indexOfFirstItem !== undefined;

        if (shouldSortTheList) {
            const firstDisplayedItem = drawApplicationChoices[indexOfFirstItem];
            filteredDrawApplicationChoices.unshift(firstDisplayedItem);

            const { alternateNumber, didIWin } = firstDisplayedItem;

            const isWinDraw = didIWin === "Y";
            const isAlternateDraw = typeof alternateNumber === "string" && alternateNumber !== "N/A";

            const fileList =
                (isWinDraw && [firstDisplayedItem.fileInfoList]) ||
                (isAlternateDraw && filteredDrawApplicationChoices.map((item) => item.fileInfoList));

            return {
                filteredDrawApplicationChoices,
                fileList,
            };
        }
    }

    return {
        filteredDrawApplicationChoices: drawApplicationChoices,
        fileList: drawApplicationChoices.map((item) => item.fileInfoList),
    };
}

export default formatDrawApplicationChoices;
