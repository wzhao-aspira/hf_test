import useNavigateToIS from "../../../hooks/useNavigateToIS";

function useNavigateToISViewHarvestReport(harvestReportId: string) {
    const { navigateToIS } = useNavigateToIS();

    return {
        navigateToViewHarvestReport: async () => {
            const targetPath = `/LicenseNeedsHarvestReporting/ViewHarvestMobile/${harvestReportId}`;
            await navigateToIS({
                targetPath,
            });
        },
    };
}

export default useNavigateToISViewHarvestReport;
