import { StyleSheet, View, Text, Pressable } from "react-native";
import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../constants/Dimension";
import { faEnvelope } from "@fortawesome/pro-light-svg-icons/faEnvelope";
import { faEnvelopeOpen } from "@fortawesome/pro-light-svg-icons/faEnvelopeOpen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { DEFAULT_DATE_DISPLAY_FORMAT } from "../../constants/Constants";
import moment from "moment";
import { LoadingShimmer } from "../../components/SkeletonLoader";
import { MobileAppAlert } from "../../types/mobileAppAlert";

export const styles = StyleSheet.create({
    mainContainerStyle: {
        ...AppTheme.shadow,
        marginVertical: 7,
        borderRadius: 10,
        backgroundColor: AppTheme.colors.font_color_4,
        marginHorizontal: DEFAULT_MARGIN,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderLeftWidth: 5,
        borderLeftColor: AppTheme.colors.transparent,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
    },
    mainContainerStyle_Unread: {
        borderLeftColor: AppTheme.colors.primary_2,
    },
    title_unread: {
        fontFamily: "Medium",
        color: AppTheme.colors.primary_2,
    },
    icon: {
        width: 50,
        display: "flex",
        justifyContent: "center",
    },
    content: {
        flexShrink: 1,
    },
    titleContainer: {
        height: 40,
        display: "flex",
        justifyContent: "center",
    },
    title: {
        verticalAlign: "middle",
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_1,
        fontFamily: "Regular",
    },
    dateSentWrapper: {
        marginTop: 5,
        height: 20,
    },
    dateSent: {
        ...AppTheme.typography.card_small_r,
        color: AppTheme.colors.font_color_2,
    },
    pressable: {
        display: "flex",
        flexDirection: "row",
    },
});

const loadingSkeletonStyles = StyleSheet.create({
    icon: {
        width: 30,
        borderRadius: 4,
        height: 30,
    },
    title: {
        width: 180,
    },
    title_line2: {
        marginTop: 5,
        width: 180 * 0.618,
    },
    dateSent: {
        borderRadius: 5,
        height: 10,
        width: 100,
    },
});
interface MobileAppAlertListItemProps {
    mobileAppAlert: MobileAppAlert;
    isLoading: boolean;
    onpress: (mobileAppAlertId: number) => unknown;
}
export function MobileAppAlertListItem(props: MobileAppAlertListItemProps) {
    const dateSent = moment(props.mobileAppAlert.displayBeginDate).format(DEFAULT_DATE_DISPLAY_FORMAT);
    return (
        <View style={[styles.mainContainerStyle, !props.mobileAppAlert.isRead && styles.mainContainerStyle_Unread]}>
            <Pressable
                onPress={() => props.onpress(props.mobileAppAlert.mobileAppAlertId)}
                key={props.mobileAppAlert.mobileAppAlertId}
                style={styles.pressable}
            >
                <View style={styles.icon}>
                    <LoadingShimmer shimmerStyle={loadingSkeletonStyles.icon} isLoading={props.isLoading}>
                        <FontAwesomeIcon
                            icon={props.mobileAppAlert.isRead ? faEnvelopeOpen : faEnvelope}
                            size={30}
                            color={AppTheme.colors.primary_2}
                        />
                    </LoadingShimmer>
                </View>
                <View style={styles.content}>
                    <View style={styles.titleContainer}>
                        <LoadingShimmer shimmerStyle={loadingSkeletonStyles.title} isLoading={props.isLoading}>
                            <Text
                                numberOfLines={2}
                                style={[styles.title, !props.mobileAppAlert.isRead && styles.title_unread]}
                            >
                                {props.mobileAppAlert.subject}
                            </Text>
                        </LoadingShimmer>
                        <LoadingShimmer
                            shimmerStyle={[loadingSkeletonStyles.title, loadingSkeletonStyles.title_line2]}
                            isLoading={props.isLoading}
                        />
                    </View>
                    <View style={styles.dateSentWrapper}>
                        <LoadingShimmer shimmerStyle={loadingSkeletonStyles.dateSent} isLoading={props.isLoading}>
                            <Text style={styles.dateSent}>Date Sent: {dateSent}</Text>
                        </LoadingShimmer>
                    </View>
                </View>
            </Pressable>
        </View>
    );
}
