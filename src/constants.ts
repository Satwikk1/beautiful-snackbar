import { SnackbarDuration } from './types';

export const DURATION_SHORT = 1500;
export const DURATION_MEDIUM = 2200;
export const DURATION_LONG = 3200;

export const DEFAULT_HEIGHT_LIMIT = 90;
export const TRANSITION_SPEED = 200;

export const getDurationMs = (duration?: SnackbarDuration): number => {
	switch (duration) {
		case 'long':
			return DURATION_LONG;
		case 'medium':
			return DURATION_MEDIUM;
		case 'short':
		default:
			return DURATION_SHORT;
	}
};
