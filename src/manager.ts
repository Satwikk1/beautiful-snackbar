import { ViewStyle, TextStyle, Platform } from 'react-native';
import React from 'react';
import { SnackbarOptions, SnackbarDuration, SnackbarPosition, SnackbarAnimationType } from './types';

export interface SnackbarConfig {
	avoidKeyboard: boolean;
	position: SnackbarPosition;
	animationType: SnackbarAnimationType;
	bottomOffset: number;
	topOffset: number;
}

export class SnackbarItem {
	id: string;
	message: string;
	messageStyle?: TextStyle;
	containerStyle?: ViewStyle;
	actionLabel?: string;
	actionStyle?: TextStyle;
	onActionPress?: () => void;
	icon?: React.ReactNode;
	duration: SnackbarDuration;
	position?: SnackbarPosition;
	animationType?: SnackbarAnimationType;
	bottomOffset?: number;
	topOffset?: number;
	dismissOnNavigation: boolean;
	backgroundColor?: string;
	textColor?: string;
	actionColor?: string;
	type?: string;
	data?: any;

	onShowRequested = () => {};
	onHideRequested = () => {};
	onDismissRequested?: () => void;

	constructor(options: SnackbarOptions, id: string) {
		this.id = id;
		this.message = options.message;
		this.messageStyle = options.messageStyle;
		this.containerStyle = options.containerStyle;
		this.actionLabel = options.actionLabel;
		this.actionStyle = options.actionStyle;
		this.onActionPress = options.onActionPress;
		this.icon = options.icon;
		this.duration = options.duration ?? 'short';
		this.position = options.position;
		this.animationType = options.animationType;
		this.bottomOffset = options.bottomOffset;
		this.topOffset = options.topOffset;
		this.dismissOnNavigation = Boolean(options.dismissOnNavigation);
		this.backgroundColor = options.backgroundColor;
		this.textColor = options.textColor;
		this.actionColor = options.actionColor;
		this.type = options.type;
		this.data = options.data;
	}
}

export class SnackbarManager {
	private stateListener?: (items: SnackbarItem[]) => void;
	private configListeners: ((config: SnackbarConfig) => void)[] = [];
	private activeItems: SnackbarItem[] = [];
	private counter = 0;
	private config: SnackbarConfig = {
		avoidKeyboard: true,
		position: 'bottom',
		animationType: 'slide',
		bottomOffset: 24,
		topOffset: Platform.OS === 'ios' ? 50 : 24,
	};

	registerListener(listener: (items: SnackbarItem[]) => void) {
		this.stateListener = listener;
		listener([...this.activeItems]);
	}

	unregisterListener() {
		this.stateListener = undefined;
	}

	registerConfigListener(listener: (config: SnackbarConfig) => void) {
		this.configListeners.push(listener);
		listener({ ...this.config });
		return () => {
			this.configListeners = this.configListeners.filter((l) => l !== listener);
		};
	}

	setAvoidKeyboard(val: boolean) {
		this.config.avoidKeyboard = val;
		this.configListeners.forEach((listener) => listener({ ...this.config }));
	}

	getAvoidKeyboard(): boolean {
		return this.config.avoidKeyboard;
	}

	setPosition(val: SnackbarPosition) {
		this.config.position = val;
		this.configListeners.forEach((listener) => listener({ ...this.config }));
	}

	getPosition(): SnackbarPosition {
		return this.config.position;
	}

	setAnimationType(val: SnackbarAnimationType) {
		this.config.animationType = val;
		this.configListeners.forEach((listener) => listener({ ...this.config }));
	}

	getAnimationType(): SnackbarAnimationType {
		return this.config.animationType;
	}

	setBottomOffset(val: number) {
		this.config.bottomOffset = val;
		this.configListeners.forEach((listener) => listener({ ...this.config }));
	}

	getBottomOffset(): number {
		return this.config.bottomOffset;
	}

	setTopOffset(val: number) {
		this.config.topOffset = val;
		this.configListeners.forEach((listener) => listener({ ...this.config }));
	}

	getTopOffset(): number {
		return this.config.topOffset;
	}

	show(options: SnackbarOptions): SnackbarItem {
		this.counter++;
		const id = `sb_${Date.now()}_${this.counter}`;
		const item = new SnackbarItem(options, id);
		this.activeItems.push(item);
		this.stateListener?.([...this.activeItems]);
		return item;
	}

	dismiss(item: SnackbarItem) {
		this.activeItems = this.activeItems.filter(x => x.id !== item.id);
		this.stateListener?.([...this.activeItems]);
	}
}

export const snackbar = new SnackbarManager();
