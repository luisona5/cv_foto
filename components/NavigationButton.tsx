// components/NavigationButton.tsx
import React from "react";
import { TouchableOpacity, Text, View, ViewStyle } from "react-native";

interface NavigationButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  style?: ViewStyle;
}

const variantStyles = {
  primary: "bg-blue-500",
  secondary: "bg-transparent border-2 border-blue-500",
  danger: "bg-red-500",
};

export const NavigationButton = ({
  title,
  onPress,
  variant = "primary",
  style,
}: NavigationButtonProps) => {
  return (
    <View className={`rounded-xl shadow-md ${style}`}>
      <TouchableOpacity
        className={`p-4 ${variantStyles[variant]} active:opacity-80`}
        onPress={onPress}
      >
        <Text
          className={`text-lg font-semibold text-white text-center ${
            variant === "secondary" && "text-blue-500"
          }`}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
