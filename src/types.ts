import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';

export type SnackbarDuration = 'short' | 'medium' | 'long' | 'infinite';
export type SnackbarPosition = 'top' | 'bottom';
export type SnackbarAnimationType = 'slide' | 'fade' | 'scale';

export interface SnackbarOptions {
	message: string;
	messageStyle?: TextStyle;
	containerStyle?: ViewStyle;
	actionLabel?: string;
	actionStyle?: TextStyle;
	onActionPress?: () => void;
	icon?: React.ReactNode;
	duration?: SnackbarDuration;
	position?: SnackbarPosition;
	animationType?: SnackbarAnimationType;
	bottomOffset?: number;
	topOffset?: number;
	dismissOnNavigation?: boolean;
	backgroundColor?: string;
	textColor?: string;
	actionColor?: string;
	type?: string; // Key for registered custom template UI
	data?: any;   // Custom metadata context passed to custom templates
}
