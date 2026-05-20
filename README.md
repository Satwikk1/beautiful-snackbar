# 🌈 Beautiful Snackbar

A lightweight, premium, highly customizable, and **Reanimated-free** notification system for React Native and Expo. Powered by standard React Native `Animated` with native driver transitions to guarantee buttery-smooth 60fps animations.

<div align="center">
  <br />
  <div style="background-color: #1e1e2e; border: 1px solid #313244; padding: 12px; border-radius: 16px; max-width: 320px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
    <div style="background-color: #11111b; border-radius: 10px; overflow: hidden; display: flex; border: 1px solid #45475a;">
      <video src="https://github.com/user-attachments/assets/acf635cd-dbe8-401c-b3cc-701cde5464c7" width="100%" autoplay loop muted playsinline></video>
    </div>
  </div>
  <br />
</div>

---

## 💡 Why Beautiful Snackbar?

Most React Native notification libraries either require heavy libraries like `react-native-reanimated` or wrap your entire code in complex React context providers. 

`beautiful-snackbar` was built to solve this by providing:
* 🔋 **Zero Heavy Dependencies:** Written entirely using React Native's built-in `Animated` API with `useNativeDriver: true`.
* ⚡ **Singleton Architecture:** Trigger notifications from anywhere—inside a Redux action, an Axios interceptor, or a vanilla helper function—without hooks, contexts, or prop-drilling.
* 🎹 **True Keyboard Synchronization:** Dynamically adjusts its position as the soft keyboard slides up, taking safe areas into account so that it sits naturally at a configured height without compounding inset paddings.

---

## ✨ Features

* 🚀 **Buttery-Smooth Animations:** Built-in transition presets (`slide`, `fade`, `scale`) that execute entirely on the native thread.
* ⌨️ **Keyboard & Safe Area Aware:** Intelligently listens to keyboard show/hide events and automatically translates above the keyboard while cleanly canceling out safe area bottom margins.
* 🛠️ **Custom UI Templates:** Register your own custom layouts at the root, and trigger them dynamically from anywhere by passing custom metadata.
* ⚙️ **Global Configuration Manager:** Tweak properties (offsets, animations, placement) dynamically at runtime via manager setters.
* 🧭 **Navigation Listener:** Automatically dismisses active snackbars on navigation transitions to keep user experience clean.

---

## 📦 Installation

Install the package using your favorite package manager:

```bash
# Using yarn
yarn add beautiful-snackbar

# Using npm
npm install beautiful-snackbar
```

### Peer Dependencies
To handle safe area offsets and screen layouts cleanly, ensure you have `react-native-safe-area-context` installed:

```bash
npx expo install react-native-safe-area-context
```

---

## 🚀 Quick Start

### 1. Mount the Root Provider
Render `<BeautifulSnackbar />` at the root of your application (usually inside `_layout.tsx` or `App.tsx`). This acts as the overlay portal.

```tsx
import React from 'react';
import { View } from 'react-native';
import { BeautifulSnackbar } from 'beautiful-snackbar';

export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      {/* Your main app views (Tabs, Stack, etc.) */}
      
      {/* Overlay container */}
      <BeautifulSnackbar />
    </View>
  );
}
```

### 2. Trigger Notifications Anywhere
Simply import the `snackbar` singleton instance and call `.show()` from anywhere in your codebase:

```tsx
import { snackbar } from 'beautiful-snackbar';

// Trigger a default bottom toast
snackbar.show({
  message: '✨ Profile updated successfully!',
  backgroundColor: '#10B981', // Emerald green
  duration: 'short',
});
```

---

## 🛠️ Advanced Usage & Customization

### 1. Global Configuration Manager
You can modify the default behaviors dynamically. This is typically done during app startup:

```tsx
import { snackbar } from 'beautiful-snackbar';

// Set global configuration defaults
snackbar.setPosition('bottom');      // Set default position ('top' | 'bottom')
snackbar.setAnimationType('scale');    // Set default entry animation ('slide' | 'fade' | 'scale')
snackbar.setBottomOffset(24);        // Set default bottom spacing in pixels
snackbar.setAvoidKeyboard(true);      // Enable/disable soft keyboard avoidance
```

### 2. Custom UI Template Registration
Do you need custom cards, badge overlays, or promotional layouts? Register your custom React layouts at the root using the `templates` prop:

```tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BeautifulSnackbar } from 'beautiful-snackbar';

// Define your custom template layout
const customTemplates = {
  promoCard: ({ item, dismiss }) => (
    <View style={{ padding: 16, backgroundColor: '#31115F', borderRadius: 12 }}>
      <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>{item.message}</Text>
      <Text style={{ color: '#C084FC' }}>{item.data?.subtitle}</Text>
      
      <TouchableOpacity onPress={dismiss}>
        <Text style={{ color: '#F59E0B', marginTop: 8 }}>Got it</Text>
      </TouchableOpacity>
    </View>
  ),
};

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <BeautifulSnackbar templates={customTemplates} />
    </View>
  );
}
```

Trigger your custom UI card programmatically from anywhere:
```tsx
import { snackbar } from 'beautiful-snackbar';

snackbar.show({
  type: 'promoCard', // Match the template key
  message: 'Premium Feature Unlocked!',
  data: {
    subtitle: 'Enjoy unlimited ad-free streaming.',
  },
  duration: 'infinite', // Keep visible until dismissed manually
});
```

### 3. Actionable Buttons
Create standard, actionable snackbars with button press handlers:

```tsx
snackbar.show({
  message: '🗑️ Message permanently deleted.',
  backgroundColor: '#1E293B',
  actionLabel: 'Undo',
  actionColor: '#818CF8',
  onActionPress: () => {
    // Perform undo action
    snackbar.show({ message: 'Restored!', backgroundColor: '#10B981' });
  },
});
```

---

## 📖 API Reference

### `<BeautifulSnackbar />` Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `navigation` | `any` | `undefined` | Optional React Navigation controller reference to automatically clear notifications on screen changes. |
| `avoidKeyboard` | `boolean` | `true` | When `true`, snackbars automatically shift up dynamically when the keyboard appears. |
| `templates` | `Record<string, Component>` | `undefined` | Map of key-value pairs representing custom templates. |

### `snackbar.show()` Configuration Options

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `message` | `string` | **Required** | The message string to display inside standard alerts. |
| `duration` | `'short' \| 'medium' \| 'long' \| 'infinite' \| number` | `'short'` | Time on screen. Short (1500ms), Medium (2750ms), Long (4000ms), Infinite (requires dismissal), or custom duration in milliseconds. |
| `position` | `'top' \| 'bottom'` | `'bottom'` (config) | Placement on screen. Overrides global manager position. |
| `animationType` | `'slide' \| 'fade' \| 'scale'` | `'slide'` (config) | Transition style preset. Overrides global manager type. |
| `bottomOffset` | `number` | `24` (config) | Pixel spacing from screen bottom or soft keyboard. |
| `topOffset` | `number` | `50` (iOS) / `24` (Android) | Pixel spacing from screen top. |
| `backgroundColor` | `string` | `'#1E293B'` | Custom container background color. |
| `textColor` | `string` | `'#F8FAFC'` | Custom color for message text. |
| `actionLabel` | `string` | `undefined` | Interactive button label text. |
| `actionColor` | `string` | `'#6366F1'` | Text color of the interactive button. |
| `onActionPress` | `() => void` | `undefined` | Callback function triggered when action button is clicked. |
| `icon` | `React.ReactNode` | `undefined` | Optional leading element (e.g. image, custom SVG, text emoji). |
| `dismissOnNavigation` | `boolean` | `true` | If `true`, dismisses the notification when user changes pages. |
| `type` | `string` | `undefined` | Key matching a registered custom template component. |
| `data` | `any` | `undefined` | Arbitrary context payload passed down to custom templates. |

---

## 🛠️ Testing & Running the Example App

To inspect the package interactively, run the local Expo example app:

1. **Clone and Install dependencies:**
   ```bash
   yarn install
   ```

2. **Build the parent library:**
   ```bash
   yarn run build
   ```

3. **Start the Expo development server:**
   ```bash
   cd example
   npx expo start
   ```

4. Press `i` to open in iOS simulator, or `a` to open in Android.

---

## 📄 License
This project is licensed under the **MIT License**.
