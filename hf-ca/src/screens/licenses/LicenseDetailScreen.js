import { useCallback, useEffect, useRef, useState } from "react";
import { View, StyleSheet, ScrollView, RefreshControl, Pressable, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty, debounce } from "lodash";
import { faAngleRight } from "@fortawesome/pro-solid-svg-icons/faAngleRight";
import { faAngleLeft } from "@fortawesome/pro-solid-svg-icons/faAngleLeft";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN, PAGE_MARGIN_BOTTOM, SCREEN_WIDTH } from "../../constants/Dimension";

import Page from "../../components/Page";
import CommonHeader from "../../components/CommonHeader";
import { selectors } from "../../redux/ProfileSlice";
import ProfileThunk from "../../redux/ProfileThunk";
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
    const detailPageRef = useRef(0);
    const swiperRef = useRef(null);
    const dispatch = useDispatch();
    const { openSimpleDialog } = useDialog();

    const title = useTitle("licenseDetails.licenseDetails", "licenseDetails.licenseDetails");

    const isLicenseListChanged = useSelector(selectIsLicenseListChanged);
    const licenseList = useSelector(selectLicenseForDetailSwiper);
    const licenseRefreshing = useSelector(selectIsLicenseRefreshing);
    const currentInUseProfileId = useSelector(selectors.selectCurrentInUseProfileID);
    const noProfileDetailCacheData = useSelector(selectors.selectNoProfileDetailCacheData);
    const profileRefreshing = useSelector(selectors.selectProfileDetailRefreshing);

    const { route } = props;
    const { licenseId } = route.params;
    let itemIndex = licenseList.findIndex((item) => item.id === licenseId);
    if (itemIndex < 0) {
        itemIndex = 0;
    }

    const [currentSliderIndex, setCurrentSliderIndex] = useState(itemIndex);
    const [isLicenseListEmpty, setIsLicenseListEmpty] = useState(false);

    const isLoading =
        isEmpty(licenseList) ||
        licenseRefreshing ||
        profileRefreshing ||
        noProfileDetailCacheData ||
        isLicenseListChanged ||
        isLicenseListEmpty;

    const onNextClick = debounce(() => swiperRef.current.scrollToIndex({ index: currentSliderIndex + 1 }), 200);
    const onPrevClick = debounce(() => swiperRef.current.scrollToIndex({ index: currentSliderIndex - 1 }), 200);

    const handleViewableItemsChanged = useCallback(
        (info) => {
            const newIndex = info?.changed[0]?.index;
            if (typeof newIndex === "number" && newIndex > -1 && newIndex < licenseList.length) {
                setCurrentSliderIndex(newIndex);
            }
        },
        [licenseList.length]
    );

    const getLicenseOfActiveProfile = async (isForce) => {
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
        dispatch(getLicense({ isForce: true, searchParams: { activeProfileId: currentInUseProfileId } }));
    }, [currentInUseProfileId, dispatch]);

    useEffect(() => {
        // back from other page and licenseList Changed.
        if (detailPageRef.current === 0) {
            detailPageRef.current = 1;
            return;
        }
        console.log("back to details page and license list changed");
        if (licenseList.length != 0) {
            setCurrentSliderIndex(0);
            setIsLicenseListEmpty(false);
        } else {
            setIsLicenseListEmpty(true);
        }
    }, [currentInUseProfileId, licenseList.length]);

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
                        index={currentSliderIndex}
                        windowSize={2}
                        onViewableItemsChanged={handleViewableItemsChanged}
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
