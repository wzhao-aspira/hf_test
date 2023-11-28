import type { DrawApplicationItem as DrawApplicationItemData } from "../../../../types/drawApplication";

type FileInfoList = DrawApplicationItemData["fileInfoList"];

function formatDrawApplicationChoices(drawApplicationChoices: DrawApplicationItemData[]) {
    if (drawApplicationChoices.length > 1) {
        const wonOrHasAlternatedItem = drawApplicationChoices.find((item) => {
            const { alternateNumber, didIWin } = item;
            return (typeof alternateNumber === "string" && alternateNumber !== "N/A") || didIWin === "Y";
        });
        if (wonOrHasAlternatedItem) {
            return {
                filteredDrawApplicationChoices: drawApplicationChoices,
                fileList: [wonOrHasAlternatedItem.fileInfoList],
            };
        }

        const fileList = drawApplicationChoices.map((item, index) =>
            index === 0 ? item.fileInfoList : ([null, item.fileInfoList[1]] as FileInfoList)
        );

        return {
            filteredDrawApplicationChoices: drawApplicationChoices,
            fileList,
        };
    }

    return {
        filteredDrawApplicationChoices: drawApplicationChoices,
        fileList: drawApplicationChoices.map((item) => item.fileInfoList),
    };
}

export default formatDrawApplicationChoices;
