import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import { SnackbarItem, snackbar } from '../manager';
import { useSnackbarAnimation } from '../useSnackbarAnimation';

interface ActionableSnackbarProps {
	item: SnackbarItem;
}

export const ActionableSnackbar = ({ item }: ActionableSnackbarProps) => {
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

	const customActionStyle = [
		styles.actionText,
		item.actionColor ? { color: item.actionColor } : null,
		item.actionStyle,
	];

	const isTop = (item.position || snackbar.getPosition()) === 'top';
	const positionStyle = isTop ? { top: 0 } : { bottom: 0 };

	const handleActionPress = () => {
		item.onActionPress?.();
		item.onDismissRequested?.();
	};

	return (
		<Animated.View style={[styles.outer, positionStyle, animStyle]}>
			<View style={customContainerStyle}>
				<TouchableOpacity activeOpacity={1} style={styles.contentArea}>
					{item.icon && <View style={styles.iconWrap}>{item.icon}</View>}
					<Text numberOfLines={2} style={customMessageStyle}>
						{item.message}
					</Text>
				</TouchableOpacity>
				{item.actionLabel && (
					<TouchableOpacity 
						onPress={handleActionPress} 
						style={styles.actionBtn}
						activeOpacity={0.7}
					>
						<Text style={customActionStyle}>
							{item.actionLabel}
						</Text>
					</TouchableOpacity>
				)}
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
		justifyContent: 'space-between',
		borderRadius: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 6,
		elevation: 4,
	},
	contentArea: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
		paddingRight: 12,
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
	actionBtn: {
		justifyContent: 'center',
	},
	actionText: {
		color: '#10B981', // Emerald 500
		fontSize: 14,
		fontWeight: '700',
	},
});
