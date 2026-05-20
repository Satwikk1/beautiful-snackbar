import React, { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { snackbar } from "beautiful-snackbar";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing, MaxContentWidth } from "@/constants/theme";

export default function HomeScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];
  const [avoidKeyboard, setAvoidKeyboard] = useState(
    snackbar.getAvoidKeyboard(),
  );
  const [globalPosition, setGlobalPosition] = useState(snackbar.getPosition());
  const [globalAnimation, setGlobalAnimation] = useState(
    snackbar.getAnimationType(),
  );
  const [globalBottomOffset, setGlobalBottomOffset] = useState(
    snackbar.getBottomOffset(),
  );
  const [globalTopOffset, setGlobalTopOffset] = useState(
    snackbar.getTopOffset(),
  );
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    return snackbar.registerConfigListener((config) => {
      setAvoidKeyboard(config.avoidKeyboard);
      setGlobalPosition(config.position);
      setGlobalAnimation(config.animationType);
      setGlobalBottomOffset(config.bottomOffset);
      setGlobalTopOffset(config.topOffset);
    });
  }, []);

  const handleToggleAvoidKeyboard = (value: boolean) => {
    snackbar.setAvoidKeyboard(value);
  };

  const handleSetPosition = (value: "top" | "bottom") => {
    snackbar.setPosition(value);
  };

  const handleSetAnimation = (value: "slide" | "fade" | "scale") => {
    snackbar.setAnimationType(value);
  };

  const handleSetBottomOffset = (value: number) => {
    snackbar.setBottomOffset(value);
  };

  const handleSetTopOffset = (value: number) => {
    snackbar.setTopOffset(value);
  };

  const triggerSuccess = () => {
    snackbar.show({
      message: "Success: Your profile has been updated successfully.",
      backgroundColor: "#10B981",
      duration: "short",
    });
  };

  const triggerError = () => {
    snackbar.show({
      message:
        "Error: Failed to upload photo. Please check your internet connection.",
      backgroundColor: "#EF4444",
      duration: "long",
    });
  };

  const triggerWarning = () => {
    snackbar.show({
      message: "Warning: Your storage is 90% full. Upgrade to get more space.",
      backgroundColor: "#F59E0B",
      duration: "long",
    });
  };

  const triggerInfo = () => {
    snackbar.show({
      message: "Info: Version 2.0 is now live with exciting new features.",
      backgroundColor: "#3B82F6",
      duration: "medium",
    });
  };

  const triggerActionable = () => {
    snackbar.show({
      message: "Message Deleted: Your message has been permanently deleted.",
      backgroundColor: "#1E293B",
      actionColor: "#818CF8",
      duration: "long",
      actionLabel: "Undo",
      onActionPress: () => {
        snackbar.show({
          message: "Action Restored: Deletion canceled.",
          backgroundColor: "#10B981",
          duration: "short",
        });
      },
    });
  };

  const triggerInfinite = () => {
    snackbar.show({
      message:
        "Offline: You are now browsing in offline mode. Pull to refresh.",
      backgroundColor: "#1E293B",
      actionColor: "#F59E0B",
      duration: "infinite",
      actionLabel: "Dismiss",
      onActionPress: () => {
        // Just closes itself automatically when action is pressed
      },
    });
  };

  const triggerCustomCard = () => {
    snackbar.show({
      type: "customCard",
      message: "Premium Feature Unlocked!",
      data: {
        subtitle: "Enjoy unlimited ad-free streaming and offline play.",
        badge: "PRO",
      },
      duration: "medium",
    });
  };

  const triggerCustomOffset = () => {
    snackbar.show({
      message: "Custom Offset: Floating high at 120px!",
      backgroundColor: "#4f46e5",
      bottomOffset: 120,
      duration: "short",
    });
  };

  const triggerMultiple = () => {
    triggerSuccess();
    setTimeout(() => triggerInfo(), 300);
    setTimeout(() => triggerWarning(), 600);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.glowText, { color: colors.text }]}>
              Beautiful Snackbar
            </Text>
            <ThemedText type="small" style={styles.subtitle}>
              A highly customizable, animated notification system.
            </ThemedText>
          </View>

          {/* Configuration Card */}
          <View
            style={[styles.card, { backgroundColor: colors.backgroundElement }]}
          >
            {/* Avoid Keyboard switch */}
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Avoid Keyboard
                </Text>
                <Text
                  style={[styles.settingDesc, { color: colors.textSecondary }]}
                >
                  If enabled, bottom snackbars slide up above the soft keyboard.
                </Text>
              </View>
              <Switch
                value={avoidKeyboard}
                onValueChange={handleToggleAvoidKeyboard}
                trackColor={{ false: "#767577", true: "#4ade80" }}
                thumbColor={Platform.OS === "ios" ? undefined : "#f4f3f4"}
              />
            </View>

            {/* Position segmented control */}
            <View style={[styles.settingRow, { marginTop: Spacing.three }]}>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Global Position
                </Text>
                <Text
                  style={[styles.settingDesc, { color: colors.textSecondary }]}
                >
                  Configure where notifications render on the screen.
                </Text>
              </View>
              <View
                style={[
                  styles.segmentContainer,
                  { backgroundColor: colors.backgroundSelected },
                ]}
              >
                {(["top", "bottom"] as const).map((pos) => (
                  <TouchableOpacity
                    key={pos}
                    style={[
                      styles.segmentBtn,
                      globalPosition === pos && { backgroundColor: "#6d28d9" },
                    ]}
                    onPress={() => handleSetPosition(pos)}
                  >
                    <Text
                      style={[
                        styles.segmentBtnText,
                        {
                          color:
                            globalPosition === pos
                              ? "#ffffff"
                              : colors.textSecondary,
                        },
                        { textTransform: "capitalize" },
                      ]}
                    >
                      {pos}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Animation Type segmented control */}
            <View style={[styles.settingRow, { marginTop: Spacing.three }]}>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Animation Type
                </Text>
                <Text
                  style={[styles.settingDesc, { color: colors.textSecondary }]}
                >
                  Transition preset style for snackbars.
                </Text>
              </View>
              <View
                style={[
                  styles.segmentContainer,
                  { backgroundColor: colors.backgroundSelected },
                ]}
              >
                {(["slide", "fade", "scale"] as const).map((anim) => (
                  <TouchableOpacity
                    key={anim}
                    style={[
                      styles.segmentBtn,
                      globalAnimation === anim && {
                        backgroundColor: "#6d28d9",
                      },
                    ]}
                    onPress={() => handleSetAnimation(anim)}
                  >
                    <Text
                      style={[
                        styles.segmentBtnText,
                        {
                          color:
                            globalAnimation === anim
                              ? "#ffffff"
                              : colors.textSecondary,
                        },
                        { textTransform: "capitalize" },
                      ]}
                    >
                      {anim}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Bottom Offset segmented control */}
            <View style={[styles.settingRow, { marginTop: Spacing.three }]}>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Bottom Offset
                </Text>
                <Text
                  style={[styles.settingDesc, { color: colors.textSecondary }]}
                >
                  Adjust default spacing from bottom/keyboard.
                </Text>
              </View>
              <View
                style={[
                  styles.segmentContainer,
                  { backgroundColor: colors.backgroundSelected },
                ]}
              >
                {([16, 24, 40, 60] as const).map((offsetVal) => (
                  <TouchableOpacity
                    key={offsetVal}
                    style={[
                      styles.segmentBtn,
                      globalBottomOffset === offsetVal && {
                        backgroundColor: "#6d28d9",
                      },
                    ]}
                    onPress={() => handleSetBottomOffset(offsetVal)}
                  >
                    <Text
                      style={[
                        styles.segmentBtnText,
                        {
                          color:
                            globalBottomOffset === offsetVal
                              ? "#ffffff"
                              : colors.textSecondary,
                        },
                      ]}
                    >
                      {offsetVal}px
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Top Offset segmented control */}
            <View style={[styles.settingRow, { marginTop: Spacing.three }]}>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Top Offset
                </Text>
                <Text
                  style={[styles.settingDesc, { color: colors.textSecondary }]}
                >
                  Adjust default spacing from top of screen.
                </Text>
              </View>
              <View
                style={[
                  styles.segmentContainer,
                  { backgroundColor: colors.backgroundSelected },
                ]}
              >
                {([24, 40, 60, 80] as const).map((offsetVal) => (
                  <TouchableOpacity
                    key={offsetVal}
                    style={[
                      styles.segmentBtn,
                      globalTopOffset === offsetVal && {
                        backgroundColor: "#6d28d9",
                      },
                    ]}
                    onPress={() => handleSetTopOffset(offsetVal)}
                  >
                    <Text
                      style={[
                        styles.segmentBtnText,
                        {
                          color:
                            globalTopOffset === offsetVal
                              ? "#ffffff"
                              : colors.textSecondary,
                        },
                      ]}
                    >
                      {offsetVal}px
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Actions grid */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Standard Types
          </Text>
          <View style={styles.grid}>
            <TouchableOpacity
              style={[styles.btn, styles.successBtn]}
              onPress={triggerSuccess}
            >
              <Text style={styles.btnText}>Success Toast</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.errorBtn]}
              onPress={triggerError}
            >
              <Text style={styles.btnText}>Error Toast</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.warningBtn]}
              onPress={triggerWarning}
            >
              <Text style={styles.btnText}>Warning Toast</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.infoBtn]}
              onPress={triggerInfo}
            >
              <Text style={styles.btnText}>Info Toast</Text>
            </TouchableOpacity>
          </View>

          {/* Actionable & Advanced */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Advanced Interactions
          </Text>
          <View style={styles.grid}>
            <TouchableOpacity
              style={[styles.btn, styles.actionBtn]}
              onPress={triggerActionable}
            >
              <Text style={styles.btnText}>With Action Button</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.infiniteBtn]}
              onPress={triggerInfinite}
            >
              <Text style={styles.btnText}>Infinite Banner</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.multiBtn]}
              onPress={triggerCustomCard}
            >
              <Text style={styles.btnText}>Custom UI Toast</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#8b5cf6" }]}
              onPress={triggerCustomOffset}
            >
              <Text style={styles.btnText}>Custom Offset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#06b6d4" }]}
              onPress={triggerMultiple}
            >
              <Text style={styles.btnText}>Queue Demo</Text>
            </TouchableOpacity>
          </View>

          {/* Test area */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.backgroundElement,
                marginTop: Spacing.four,
              },
            ]}
          >
            <Text
              style={[
                styles.settingTitle,
                { color: colors.text, marginBottom: Spacing.one },
              ]}
            >
              Keyboard Offset Test
            </Text>
            <Text
              style={[
                styles.settingDesc,
                { color: colors.textSecondary, marginBottom: Spacing.two },
              ]}
            >
              Tap the input field below to raise the keyboard. Observe how the
              active snackbars dynamically float above it.
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.backgroundSelected,
                },
              ]}
              placeholder="Tap here to open keyboard..."
              placeholderTextColor={colors.textSecondary}
              value={inputText}
              onChangeText={setInputText}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignSelf: "center",
    width: "100%",
    maxWidth: MaxContentWidth,
  },
  scrollContent: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.seven,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.five,
  },
  glowText: {
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginTop: Spacing.one,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
  },
  card: {
    borderRadius: 16,
    padding: Spacing.three,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: Spacing.three,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  settingDesc: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  btn: {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: "45%",
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  btnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  successBtn: {
    backgroundColor: "#10b981",
  },
  errorBtn: {
    backgroundColor: "#ef4444",
  },
  warningBtn: {
    backgroundColor: "#f59e0b",
  },
  infoBtn: {
    backgroundColor: "#3b82f6",
  },
  actionBtn: {
    backgroundColor: "#6366f1",
  },
  infiniteBtn: {
    backgroundColor: "#a855f7",
  },
  multiBtn: {
    backgroundColor: "#14b8a6",
  },
  textInput: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    fontSize: 14,
  },
  segmentContainer: {
    flexDirection: "row",
    borderRadius: 8,
    padding: 3,
  },
  segmentBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  segmentBtnText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
