import React, { useCallback, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ImageBackground, Pressable } from "react-native";
import Mapbox, { MarkerView } from "@rnmapbox/maps";
import { isEmpty, debounce } from "lodash";
import AppTheme from "../../assets/_default/AppTheme";
import { isIos } from "../../helper/AppHelper";
import { SalesAgentsItem } from "./SalesAgentsList";
import AppContract from "../../assets/_default/AppContract";

Mapbox.setAccessToken(AppContract.mapBoxAccessToken);

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
        overflow: "hidden",
    },
    map: {
        flex: 1,
        overflow: "hidden",
    },
    marker: {
        width: 26,
        height: 35,
        alignItems: "center",
        justifyContent: "center",
    },
    markerLabel: {
        color: AppTheme.colors.font_color_4,
    },
    card: {
        position: "absolute",
        bottom: 80,
        alignSelf: "center",
    },
});

const markerBg = require("../../assets/_default/images/marker_bg.png");

const zoomLevel = 12;

function IssuerLocationMarker({ coordinate = [0, 0], label = "", onPress }) {
    return (
        <MarkerView coordinate={coordinate} allowOverlap>
            <Pressable
                onPressOut={() => {
                    if (isIos()) {
                        console.log(`onPressOut:${coordinate}`);
                        onPress?.(coordinate);
                    }
                }}
                onPress={() => {
                    onPress?.(coordinate);
                    console.log(`onPress:${coordinate}`);
                }}
            >
                <ImageBackground source={markerBg} style={styles.marker} resizeMethod="resize">
                    <Text style={styles.markerLabel}>{label}</Text>
                </ImageBackground>
            </Pressable>
        </MarkerView>
    );
}

export default function MapScreen({
    selectIndex,
    onSelectChange,
    mapCenter = [0, 0],
    salesAgents = [],
    onMapTouch,
    onMapChange,
    onClickMarker,
    onDirectionsClick,
}) {
    const camera = useRef(null);
    const clickMarker = useRef(false);
    const touchMap = useRef(false);
    // const [selectIndex, setSelectIndex] = useState(-1);

    const moveCamera = (coor) => {
        console.log("moveCamera:", coor);
        camera.current?.setCamera({
            centerCoordinate: coor,
            animationDuration: 500,
            zoomLevel,
        });
    };

    useEffect(() => {
        if (isEmpty(mapCenter) || mapCenter[0] == 0 || mapCenter[1] == 0) {
            return;
        }
        moveCamera(mapCenter);
    }, [mapCenter]);

    useEffect(() => {
        if (isEmpty(salesAgents) || salesAgents.length == 1) {
            return;
        }
        const points = salesAgents.map((agent) => {
            return { latitude: agent.coor[1], longitude: agent.coor[0] };
        });
        let maxLat = -Infinity;
        let maxLng = -Infinity;
        let minLat = Infinity;
        let minLng = Infinity;

        for (let i = 0; i < points.length; i++) {
            if (points[i].latitude > maxLat) {
                maxLat = points[i].latitude;
            }
            if (points[i].longitude > maxLng) {
                maxLng = points[i].longitude;
            }
            if (points[i].latitude < minLat) {
                minLat = points[i].latitude;
            }
            if (points[i].longitude < minLng) {
                minLng = points[i].longitude;
            }
        }
        const northeast = [maxLng, maxLat];
        const southwest = [minLng, minLat];
        setTimeout(() => {
            camera.current?.fitBounds(northeast, southwest, [120, 30]);
        }, 100);
    }, [salesAgents]);

    const onMove = (center) => {
        console.log("onCameraChanged:", center);
        if (clickMarker.current) {
            clickMarker.current = false;
            return;
        }
        onMapChange?.(center);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceMove = useCallback(debounce(onMove, 200), []);

    return (
        <View style={styles.container}>
            <Mapbox.MapView
                style={styles.map}
                compassEnabled={false}
                scaleBarEnabled={false}
                onCameraChanged={(event) => {
                    if (touchMap.current) {
                        touchMap.current = false;
                        debounceMove(event.properties.center);
                    }
                }}
                onTouchStart={() => {
                    console.log("onTouchStart,");
                    touchMap.current = true;
                    onMapTouch?.();
                }}
            >
                <Mapbox.Camera
                    ref={camera}
                    animationMode="flyTo"
                    animationDuration={500}
                    zoomLevel={zoomLevel}
                    centerCoordinate={mapCenter}
                />
                {!isEmpty(salesAgents) &&
                    salesAgents?.map((data, index) => {
                        return (
                            <IssuerLocationMarker
                                onPress={(coor) => {
                                    clickMarker.current = true;
                                    moveCamera(coor);
                                    onClickMarker?.(data, index);
                                    onSelectChange?.(index);
                                }}
                                coordinate={data.coor}
                                label={`${index + 1}`}
                                key={data.id}
                            />
                        );
                    })}
            </Mapbox.MapView>

            {selectIndex >= 0 && (
                <View style={styles.card}>
                    <SalesAgentsItem
                        item={salesAgents[selectIndex]}
                        index={selectIndex}
                        onDirectionsClick={onDirectionsClick}
                    />
                </View>
            )}
        </View>
    );
}
