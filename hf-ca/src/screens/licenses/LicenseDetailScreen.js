import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, ScrollView, RefreshControl, Pressable, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import { faAngleRight } from "@fortawesome/pro-solid-svg-icons/faAngleRight";
import { faAngleLeft } from "@fortawesome/pro-solid-svg-icons/faAngleLeft";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN, PAGE_MARGIN_BOTTOM, SCREEN_WIDTH } from "../../constants/Dimension";

import Page from "../../components/Page";
import CommonHeader from "../../components/CommonHeader";
import { selectors } from "../../redux/ProfileSlice";
import ProfileThunk from "../../redux/ProfileThunk";
import { REQUEST_STATUS } from "../../constants/Constants";
import {
    selectIsLicenseListChanged,
    selectIsLicenseRefreshing,
    selectLicenseForDetailSwiper,
} from "../../redux/LicenseSelector";
import { actions, getLicense } from "../../redux/LicenseSlice";
import useFocus from "../../hooks/useFocus";
import LicenseDetailLoading from "./LicenseDetailLoading";
import useTitle from "../../hooks/useTitle";
import LicenseDetailsItem from "./LicenseDetailsItem";
import { useDialog } from "../../components/dialog/index";
import NavigationService from "../../navigation/NavigationService";

const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
    },
    scrollView: {
        width: SCREEN_WIDTH,
        height: "100%",
    },
    buttonAndPaginationContainer: {
        position: "relative",
        marginHorizontal: DEFAULT_MARGIN,
        paddingVertical: 16,
    },
    pagination: {
        textAlign: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        position: "absolute",
        marginVertical: 16,
        width: "100%",
    },
    iconButton: {
        width: 24,
        height: 24,
        position: "absolute",
    },
});

function SwiperButtonsAndPagination({ currentSliderIndex, total, onPrevClick, onNextClick }) {
    const showPrevButton = currentSliderIndex !== 0;
    const showNextButton = currentSliderIndex !== total - 1;

    return (
        <View style={styles.buttonAndPaginationContainer}>
            <Text style={styles.pagination}>
                {currentSliderIndex + 1}/{total}
            </Text>
            <View style={styles.buttonContainer}>
                {showPrevButton && (
                    <Pressable
                        onPress={() => {
                            onPrevClick();
                        }}
                        style={{ ...styles.iconButton, left: 0 }}
                    >
                        <FontAwesomeIcon icon={faAngleLeft} size={20} />
                    </Pressable>
                )}
                {showNextButton && (
                    <Pressable
                        onPress={() => {
                            onNextClick();
                        }}
                        style={{ ...styles.iconButton, right: 0 }}
                    >
                        <FontAwesomeIcon icon={faAngleRight} size={20} />
                    </Pressable>
                )}
            </View>
        </View>
    );
}

function LicenseDetailScrollView({ children, licenseRefreshing, getLicenseOfActiveProfile }) {
    const safeAreaInsets = useSafeAreaInsets();
    return (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={{ paddingBottom: safeAreaInsets.bottom + PAGE_MARGIN_BOTTOM }}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    colors={[AppTheme.colors.primary]}
                    tintColor={AppTheme.colors.primary}
                    refreshing={licenseRefreshing}
                    onRefresh={() => {
                        getLicenseOfActiveProfile(true);
                    }}
                />
            }
        >
            {children}
        </ScrollView>
    );
}

function LicenseDetailScreen(props) {
    const swiperRef = useRef(null);
    const dispatch = useDispatch();
    const { openSimpleDialog } = useDialog();

    const title = useTitle("licenseDetails.licenseDetails", "licenseDetails.licenseDetails");

    const isLicenseListChanged = useSelector(selectIsLicenseListChanged);
    const licenseList = useSelector(selectLicenseForDetailSwiper);
    const licenseRefreshing = useSelector(selectIsLicenseRefreshing);
    const currentInUseProfileId = useSelector(selectors.selectCurrentInUseProfileID);
    const profileDetails = useSelector(selectors.selectProfileDetailsById(currentInUseProfileId));
    const profileDetailsStatus = useSelector(selectors.selectProfileDetailsRequestStatus);
    const profileRefreshing =
        profileDetailsStatus === REQUEST_STATUS.pending || profileDetailsStatus === REQUEST_STATUS.idle;

    const { route } = props;
    const { licenseId } = route.params;
    let itemIndex = licenseList.findIndex((item) => item.id === licenseId);
    if (itemIndex < 0) {
        itemIndex = 0;
    }

    const [currentSliderIndex, setCurrentSliderIndex] = useState(itemIndex);
    const [initSliderIndex, setInitSliderIndex] = useState(itemIndex);

    const isLoading =
        isEmpty(licenseList) ||
        licenseRefreshing ||
        profileRefreshing ||
        profileDetails.noCacheData ||
        isLicenseListChanged;

    const onNextClick = () => {
        swiperRef.current.scrollToIndex({ index: currentSliderIndex + 1 });
    };
    const onPrevClick = () => {
        swiperRef.current.scrollToIndex({ index: currentSliderIndex - 1 });
    };
    const onIndexChanged = (params) => {
        const newIndex = params?.index;
        if (typeof newIndex === "number" && newIndex > -1 && newIndex < licenseList.length) {
            setCurrentSliderIndex(newIndex);
        }
    };

    const getLicenseOfActiveProfile = async (isForce) => {
        setInitSliderIndex(currentSliderIndex);
        dispatch(ProfileThunk.initResidentMethodTypes());
        dispatch(ProfileThunk.initProfileDetails({ profileId: currentInUseProfileId, isForce })).then((response) => {
            if (response?.success) {
                dispatch(
                    getLicense({
                        isForce,
                        checkIsListChanged: true,
                        searchParams: { activeProfileId: currentInUseProfileId },
                    })
                );
            }
        });
    };

    useFocus(() => {
        getLicenseOfActiveProfile(false);
    });

    useEffect(() => {
        console.log("isLicenseListChanged:", isLicenseListChanged);
        if (isLicenseListChanged) {
            openSimpleDialog({
                title: "common.reminder",
                message: "license.LicenseListChanged",
                okText: "common.gotIt",
                onConfirm: () => {
                    NavigationService.back();
                    dispatch(actions.updateIsLicenseListChanged(false));
                },
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLicenseListChanged]);

    useEffect(() => {
        // refresh when change profile
        dispatch(ProfileThunk.initResidentMethodTypes());
        dispatch(ProfileThunk.initProfileDetails({ profileId: currentInUseProfileId, isForce: true })).then(
            (response) => {
                if (response?.success) {
                    dispatch(getLicense({ isForce: true, searchParams: { activeProfileId: currentInUseProfileId } }));
                }
            }
        );
    }, [currentInUseProfileId, dispatch]);

    return (
        <Page style={styles.container}>
            <CommonHeader titleComponent={title} />
            {!isLoading && (
                <>
                    <SwiperButtonsAndPagination
                        onNextClick={onNextClick}
                        onPrevClick={onPrevClick}
                        currentSliderIndex={currentSliderIndex}
                        total={licenseList.length}
                    />
                    <SwiperFlatList
                        ref={swiperRef}
                        index={initSliderIndex}
                        loop={false}
                        windowSize={2}
                        onChangeIndex={onIndexChanged}
                    >
                        {licenseList?.map((item) => (
                            <LicenseDetailScrollView
                                key={item.id}
                                licenseRefreshing={licenseRefreshing}
                                getLicenseOfActiveProfile={getLicenseOfActiveProfile}
                            >
                                <LicenseDetailsItem licenseData={item} />
                            </LicenseDetailScrollView>
                        ))}
                    </SwiperFlatList>
                </>
            )}
            {isLoading && (
                <LicenseDetailScrollView
                    licenseRefreshing={licenseRefreshing}
                    getLicenseOfActiveProfile={getLicenseOfActiveProfile}
                >
                    <LicenseDetailLoading />
                </LicenseDetailScrollView>
            )}
        </Page>
    );
}

export default LicenseDetailScreen;
