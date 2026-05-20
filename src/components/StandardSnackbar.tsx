import React from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { SnackbarItem, snackbar } from '../manager';
import { useSnackbarAnimation } from '../useSnackbarAnimation';

interface StandardSnackbarProps {
	item: SnackbarItem;
}

export const StandardSnackbar = ({ item }: StandardSnackbarProps) => {
	const { animStyle } = useSnackbarAnimation(item);

	const customContainerStyle = [
		styles.wrap,
		item.backgroundColor ? { backgroundColor: item.backgroundColor } : null,
		item.containerStyle,
	];

	const customMessageStyle = [
		styles.message,
		item.textColor ? { color: item.textColor } : null,
		item.messageStyle,
	];

	const isTop = (item.position || snackbar.getPosition()) === 'top';
	const positionStyle = isTop ? { top: 0 } : { bottom: 0 };

	return (
		<Animated.View style={[styles.outer, positionStyle, animStyle]}>
			<View style={customContainerStyle}>
				{item.icon && <View style={styles.iconWrap}>{item.icon}</View>}
				<Text numberOfLines={2} style={customMessageStyle}>
					{item.message}
				</Text>
			</View>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	outer: {
		width: '100%',
		position: 'absolute',
	},
	wrap: {
		paddingVertical: 14,
		paddingHorizontal: 16,
		marginHorizontal: 16,
		backgroundColor: '#1E293B',
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 6,
		elevation: 4,
	},
	iconWrap: {
		marginRight: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	message: {
		color: '#F8FAFC',
		fontSize: 14,
		fontWeight: '600',
		flexShrink: 1,
	},
});
