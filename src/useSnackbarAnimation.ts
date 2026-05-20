import { useCallback, useEffect, useRef } from 'react';
import { Animated } from "react-native";
import { SnackbarItem, snackbar } from './manager';
import { TRANSITION_SPEED, getDurationMs } from "./constants";

export const useSnackbarAnimation = (item: SnackbarItem) => {
	const durationMs = getDurationMs(item.duration);
	const position = item.position || snackbar.getPosition();
  const animType = item.animationType || snackbar.getAnimationType();
  const isTop = position === "top";

	const offset = isTop
    ? item.topOffset !== undefined
      ? item.topOffset
      : snackbar.getTopOffset()
    : item.bottomOffset !== undefined
      ? item.bottomOffset
      : snackbar.getBottomOffset();

  const startVal = isTop ? -120 : 120;
  const endVal = isTop ? offset : -offset;

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(
    new Animated.Value(animType === "scale" ? 0.8 : 1),
  ).current;
  const translateY = useRef(
    new Animated.Value(animType === "slide" ? startVal : endVal),
  ).current;

	const animStyle = {
    opacity,
    transform: [{ translateY }, { scale }],
  };

	const removeSelf = useCallback(() => {
		snackbar.dismiss(item);
	}, [item]);

	const animateIntro = useCallback(() => {
    const animations = [
      Animated.timing(opacity, {
        toValue: 1,
        duration: TRANSITION_SPEED,
        useNativeDriver: true,
      }),
    ];

    if (animType === "slide") {
      animations.push(
        Animated.timing(translateY, {
          toValue: endVal,
          duration: TRANSITION_SPEED,
          useNativeDriver: true,
        }),
      );
    }

    if (animType === "scale") {
      animations.push(
        Animated.spring(scale, {
          toValue: 1,
          tension: 40,
          friction: 6,
          useNativeDriver: true,
        }),
      );
    }

    return Animated.parallel(animations);
  }, [opacity, translateY, scale, animType, endVal]);

  const animateOutro = useCallback(() => {
    const animations = [
      Animated.timing(opacity, {
        toValue: 0,
        duration: TRANSITION_SPEED,
        useNativeDriver: true,
      }),
    ];

    if (animType === "slide") {
      animations.push(
        Animated.timing(translateY, {
          toValue: startVal,
          duration: TRANSITION_SPEED,
          useNativeDriver: true,
        }),
      );
    }

    if (animType === "scale") {
      animations.push(
        Animated.timing(scale, {
          toValue: 0.8,
          duration: TRANSITION_SPEED,
          useNativeDriver: true,
        }),
      );
    }

    return Animated.parallel(animations);
  }, [opacity, translateY, scale, animType, startVal]);

  const animateIntroAndOutro = useCallback(() => {
    Animated.sequence([
      animateIntro(),
      Animated.delay(durationMs),
      animateOutro(),
    ]).start(({ finished }: { finished: boolean }) => {
      if (finished) {
        removeSelf();
      }
    });
  }, [animateIntro, animateOutro, durationMs, removeSelf]);

	const animateShow = useCallback(() => {
    animateIntro().start();
  }, [animateIntro]);

	const animateHide = useCallback(() => {
    animateOutro().start();
  }, [animateOutro]);

	const animateDismiss = useCallback(() => {
    animateOutro().start(({ finished }: { finished: boolean }) => {
      if (finished) {
        removeSelf();
      }
    });
  }, [animateOutro, removeSelf]);

	useEffect(() => {
		if (item.duration !== 'infinite') {
			animateIntroAndOutro();
		} else {
			item.onShowRequested = animateShow;
			item.onHideRequested = animateHide;
			animateShow();
		}
		item.onDismissRequested = animateDismiss;
	}, [animateDismiss, animateHide, item, animateShow, animateIntroAndOutro]);

	return { animStyle };
};
