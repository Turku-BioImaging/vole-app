import React, { useEffect } from "react";

import { Lut, View3d, Volume } from "@aics/volume-viewer";

import { controlPointsToLut } from "../../shared/utils/controlPointsToLut";
import { ChannelState } from "../ViewerStateProvider/types";
import { UseImageEffectType } from "./types";

interface ChannelUpdaterProps {
  index: number;
  channelState: ChannelState;
  view3d: View3d;
  image: Volume | null;
  version: number;
}

/**
 * A component that doesn't render anything, but reacts to the provided `ChannelState`
 * and keeps it in sync with the viewer.
 */
const ChannelUpdater: React.FC<ChannelUpdaterProps> = ({ index, channelState, view3d, image, version }) => {
  const { volumeEnabled, isosurfaceEnabled, isovalue, colorizeEnabled, colorizeAlpha, opacity, color, controlPoints } =
    channelState;

  // Effects to update channel settings should check if image is present and channel is loaded first
  const useImageEffect: UseImageEffectType = (effect, deps) => {
    useEffect(() => {
      if (image && version > 0) {
        return effect(image);
      }
    }, [...deps, image, version]);
  };

  // enable/disable channel can't be dependent on channel load state because it may trigger the channel to load
  useEffect(() => {
    if (image) {
      view3d.setVolumeChannelEnabled(image, index, volumeEnabled);
      view3d.updateLuts(image);
    }
  }, [image, volumeEnabled]);

  useEffect(() => {
    if (image) {
      view3d.setVolumeChannelOptions(image, index, { isosurfaceEnabled });
    }
  }, [image, isosurfaceEnabled]);

  useImageEffect((currentImage) => view3d.setVolumeChannelOptions(currentImage, index, { isovalue }), [isovalue]);

  useImageEffect(
    (currentImage) => view3d.setVolumeChannelOptions(currentImage, index, { isosurfaceOpacity: opacity }),
    [opacity]
  );

  useImageEffect(
    (currentImage) => {
      view3d.setVolumeChannelOptions(currentImage, index, { color });
      view3d.updateLuts(currentImage);
    },
    [color]
  );

  useImageEffect(
    (currentImage) => {
      if (colorizeEnabled) {
        // TODO get the labelColors from the tf editor component
        const lut = new Lut().createLabelColors(currentImage.getHistogram(index));
        currentImage.setColorPalette(index, lut.lut);
        currentImage.setColorPaletteAlpha(index, colorizeAlpha);
      } else {
        currentImage.setColorPaletteAlpha(index, 0);
      }
      view3d.updateLuts(currentImage);
    },
    [colorizeEnabled]
  );

  useImageEffect(
    (currentImage) => {
      if (controlPoints.length < 2) {
        return;
      }
      const gradient = controlPointsToLut(controlPoints);
      currentImage.setLut(index, gradient);
      view3d.updateLuts(currentImage);
    },
    [controlPoints]
  );

  useImageEffect(
    (currentImage) => {
      currentImage.setColorPaletteAlpha(index, colorizeEnabled ? colorizeAlpha : 0);
      view3d.updateLuts(currentImage);
    },
    [colorizeAlpha]
  );

  return null;
};

export default ChannelUpdater;
