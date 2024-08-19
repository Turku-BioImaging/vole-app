import React from "react";
import { Button, Checkbox } from "antd";

import SliderRow from "./shared/SliderRow";
import { connectToViewerState } from "./ViewerStateProvider";
import { ViewerSettingUpdater, ViewerState } from "./ViewerStateProvider/types";

type GlobalVolumeControlKey = "maskAlpha" | "brightness" | "density" | "levels";

export interface GlobalVolumeControlsProps {
  // From parent
  imageName: string | undefined;
  pixelSize: [number, number, number];
  visibleControls: {
    alphaMaskSlider: boolean;
    brightnessSlider: boolean;
    densitySlider: boolean;
    levelsSliders: boolean;
    interpolationControl: boolean;
  };

  // From viewer state
  maskAlpha: number;
  brightness: number;
  density: number;
  levels: [number, number, number];
  interpolationEnabled: boolean;
  getDefaultViewerState: () => ViewerState;

  changeViewerSetting: ViewerSettingUpdater;
}

const GlobalVolumeControls: React.FC<GlobalVolumeControlsProps> = (props) => {
  const createSliderRow = (
    label: string,
    start: number | number[],
    max: number,
    propKey: GlobalVolumeControlKey
  ): React.ReactNode => {
    const onUpdate = (_strValues: string[], _handle: number, values: number[]): void => {
      const selectValue = values.length === 1 ? values[0] : (values as [number, number, number]);
      props.changeViewerSetting(propKey, selectValue);
    };

    return <SliderRow label={label} start={start} max={max} onUpdate={onUpdate} />;
  };

  const { visibleControls: showControls, maskAlpha, brightness, density, levels, getDefaultViewerState } = props;

  const resetToDefaults = (): void => {
    const { maskAlpha, brightness, density, levels, interpolationEnabled } = getDefaultViewerState();
    props.changeViewerSetting("maskAlpha", maskAlpha);
    props.changeViewerSetting("brightness", brightness);
    props.changeViewerSetting("density", density);
    props.changeViewerSetting("levels", levels);
    props.changeViewerSetting("interpolationEnabled", interpolationEnabled);
  };

  return (
    <div style={{ paddingTop: 18, paddingBottom: 22 }}>
      {showControls.alphaMaskSlider && createSliderRow("mask cell", maskAlpha, 100, "maskAlpha")}
      {showControls.brightnessSlider && createSliderRow("brightness", brightness, 100, "brightness")}
      {showControls.densitySlider && createSliderRow("density", density, 100, "density")}
      {showControls.levelsSliders && createSliderRow("levels", levels, 255, "levels")}
      {showControls.interpolationControl && (
        <SliderRow label="interpolate">
          <Checkbox
            checked={props.interpolationEnabled}
            onChange={({ target }) => props.changeViewerSetting("interpolationEnabled", target.checked)}
          />
        </SliderRow>
      )}
      <Button onClick={resetToDefaults}>Reset to defaults</Button>
    </div>
  );
};

export default connectToViewerState(GlobalVolumeControls, [
  "maskAlpha",
  "brightness",
  "density",
  "levels",
  "interpolationEnabled",
  "changeViewerSetting",
  "getDefaultViewerState",
]);
