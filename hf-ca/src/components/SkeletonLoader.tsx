import React, { RefObject } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ShimmerPlaceholder, { ShimmerPlaceholderProps } from "react-native-shimmer-placeholder";
import color from "color";

const item1 = {
    width: 300,
    height: 10,
    marginTop: 10,
    borderRadius: 10,
};

const item2 = {
    width: 100,
    height: 5,
    marginTop: 10,
    borderRadius: 10,
};

const item3 = {
    width: 200,
    height: 20,
    marginTop: 10,
    borderRadius: 10,
};

const defaultLayout = [item1, item3, item2];

function createRefArray<T>(layoutArray) {
    const ret: RefObject<T>[] = [];
    layoutArray.forEach((layout) => {
        if (Array.isArray(layout)) {
            ret.push(...createRefArray<T>(layout));
        } else {
            ret.push(React.createRef<T>());
        }
    });
    return ret;
}

const PlaceHolder = React.forwardRef((prop: ShimmerPlaceholderProps, ref: RefObject<ShimmerPlaceholder>) => {
    const { shimmerColors } = prop;
    return (
        <ShimmerPlaceholder
            {...prop}
            ref={ref}
            shimmerColors={shimmerColors}
            stopAutoRun={false}
            LinearGradient={LinearGradient}
        />
    );
});

const getKey = () => {
    return (Math.random() + 1).toString(36).substring(7);
};

function SkeletonLoader(props) {
    const { layout = defaultLayout, colors = ["#DDD", color("#eee").alpha(0.4).rgb().toString(), "#DDD"] } = props;
    const refs = createRefArray<ShimmerPlaceholder>(layout);
    React.useEffect(() => {
        const anims = refs.map((ref) => {
            return ref?.current?.getAnimated();
        });
        const facebookAnimated = Animated.stagger(50, [Animated.parallel(anims, { stopTogether: true })]);
        Animated.loop(facebookAnimated).start();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    let start = -1;
    return (
        <View>
            {layout.map((child) => {
                if (Array.isArray(child)) {
                    return (
                        <View
                            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                            key={getKey()}
                        >
                            {child.map((item) => {
                                start += 1;
                                return (
                                    <PlaceHolder
                                        ref={refs[start]}
                                        {...props}
                                        key={getKey()}
                                        style={item}
                                        shimmerColors={colors}
                                    />
                                );
                            })}
                        </View>
                    );
                }
                start += 1;
                return <PlaceHolder ref={refs[start]} {...props} key={getKey()} style={child} shimmerColors={colors} />;
            })}
        </View>
    );
}

const placeholderStyle = StyleSheet.create({
    defaultshimmerStyle: {
        borderRadius: 10,
    },
});

export type PlaceholderProps = Omit<
    {
        isLoading: boolean;
    } & ShimmerPlaceholderProps,
    "visible"
>;
export const LoadingShimmer = (props: PlaceholderProps) => {
    const shimmerColors = ["#DDD", color("#eee").alpha(0.4).rgb().toString(), "#DDD"];

    const visible = !props.isLoading;

    return (
        <ShimmerPlaceholder
            key={getKey()}
            LinearGradient={LinearGradient}
            {...props}
            visible={visible}
            style={[props.style]}
            shimmerColors={shimmerColors}
            stopAutoRun={false}
            shimmerStyle={[placeholderStyle.defaultshimmerStyle, props.shimmerStyle]}
        >
            {props.children}
        </ShimmerPlaceholder>
    );
};

export default SkeletonLoader;
