import React, { useCallback, useEffect, useState } from 'react';
import { Animated, Keyboard, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SnackbarItem, snackbar } from '../manager';
import { StandardSnackbar } from './StandardSnackbar';
import { ActionableSnackbar } from './ActionableSnackbar';
import { useSnackbarAnimation } from '../useSnackbarAnimation';

export interface BeautifulSnackbarProps {
	navigation?: any;
	avoidKeyboard?: boolean;
	templates?: Record<string, React.ComponentType<{ item: SnackbarItem; dismiss?: () => void }>>;
}

const CustomTemplateWrapper = ({
	item,
	Template,
}: {
	item: SnackbarItem;
	Template: React.ComponentType<{ item: SnackbarItem; dismiss?: () => void }>;
}) => {
	const { animStyle } = useSnackbarAnimation(item);
	const isTop = (item.position || snackbar.getPosition()) === 'top';
	const positionStyle = isTop ? { top: 0 } : { bottom: 0 };
	const dismiss = useCallback(() => {
		item.onDismissRequested?.();
	}, [item]);

	return (
		<Animated.View style={[styles.customOuter, positionStyle, animStyle]}>
			<Template item={item} dismiss={dismiss} />
		</Animated.View>
	);
};

export const BeautifulSnackbar = ({
	navigation,
	avoidKeyboard: propAvoidKeyboard,
	templates,
}: BeautifulSnackbarProps) => {
	const [activeItems, setActiveItems] = useState<SnackbarItem[]>([]);
	const [avoidKeyboard, setAvoidKeyboard] = useState(snackbar.getAvoidKeyboard());
	const [globalPosition, setGlobalPosition] = useState(snackbar.getPosition());
	const [keyboardOffset] = useState(() => new Animated.Value(0));

	const insets = useSafeAreaInsets();
	const bottomInset = insets.bottom;

	useEffect(() => {
		snackbar.registerListener(setActiveItems);
		const unregisterConfig = snackbar.registerConfigListener((config) => {
			setAvoidKeyboard(config.avoidKeyboard);
			setGlobalPosition(config.position);
		});

		return () => {
			snackbar.unregisterListener();
			unregisterConfig();
		};
	}, []);

	// Prioritize prop value if specified, otherwise fall back to manager configuration
	const finalAvoidKeyboard = propAvoidKeyboard !== undefined ? propAvoidKeyboard : avoidKeyboard;

	useEffect(() => {
		if (!finalAvoidKeyboard) {
			Animated.timing(keyboardOffset, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}).start();
			return;
		}

		const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
		const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

		const showSubscription = Keyboard.addListener(showEvent, (e: any) => {
			const targetOffset = Math.max(0, e.endCoordinates.height - bottomInset);
			Animated.timing(keyboardOffset, {
				toValue: targetOffset,
				duration: e.duration || 250,
				useNativeDriver: true,
			}).start();
		});

		const hideSubscription = Keyboard.addListener(hideEvent, (e: any) => {
			Animated.timing(keyboardOffset, {
				toValue: 0,
				duration: e.duration || 250,
				useNativeDriver: true,
			}).start();
		});

		return () => {
			showSubscription.remove();
			hideSubscription.remove();
		};
	}, [finalAvoidKeyboard, keyboardOffset, bottomInset]);

	const handleNavigationStateChange = useCallback(() => {
		activeItems.forEach((item: SnackbarItem) => {
			if (item.dismissOnNavigation) {
				item.onDismissRequested?.();
			}
		});
	}, [activeItems]);

	useEffect(() => {
		let cleanup: (() => void) | undefined;
		if (navigation && typeof navigation.addListener === 'function') {
			try {
				const isReady = typeof navigation.isReady === 'function' ? navigation.isReady() : true;
				if (isReady) {
					cleanup = navigation.addListener('state', handleNavigationStateChange);
				}
			} catch (e) {
				console.warn('BeautifulSnackbar failed to bind navigation listener:', e);
			}
		}
		return cleanup;
	}, [handleNavigationStateChange, navigation]);

	const renderItem = (item: SnackbarItem) => {
		// Custom template checks
		if (item.type && templates && templates[item.type]) {
			const TemplateComponent = templates[item.type];
			return (
				<CustomTemplateWrapper
					key={item.id}
					item={item}
					Template={TemplateComponent}
				/>
			);
		}

		if (item.actionLabel && item.onActionPress) {
			return <ActionableSnackbar key={item.id} item={item} />;
		}
		return <StandardSnackbar key={item.id} item={item} />;
	};

	const topItems = activeItems.filter(
		(item: SnackbarItem) => (item.position || globalPosition) === 'top'
	);
	const bottomItems = activeItems.filter(
		(item: SnackbarItem) => (item.position || globalPosition) === 'bottom'
	);

	return (
		<View style={styles.rootContainer} pointerEvents="box-none">
			<View style={styles.topContainer} pointerEvents="box-none">
				{topItems.map(renderItem)}
			</View>
			<Animated.View
				style={[
					styles.bottomContainer,
					{
						transform: [
							{
								translateY: keyboardOffset.interpolate({
									inputRange: [0, 1000],
									outputRange: [0, -1000],
								}),
							},
						],
					},
				]}
				pointerEvents="box-none"
			>
				{bottomItems.map(renderItem)}
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	rootContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		top: 0,
	},
	topContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		justifyContent: 'flex-start',
	},
	bottomContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		justifyContent: 'flex-end',
	},
	customOuter: {
		width: '100%',
		position: 'absolute',
	},
});
