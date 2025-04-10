import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";

type ToastOptions = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
};

type ToastContextType = {
  toast: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextType>({
  toast: () => {},
});

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState<ToastOptions | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;

  const showToast = useCallback((options: ToastOptions) => {
    setMessage(options);

    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setMessage(null);
      });
    }, options.duration || 3000);
  }, [opacity]); // ✅ Fixed ESLint warning

  return (
    <ToastContext.Provider value={{ toast: showToast }}>
      {children}
      {message && (
        <Animated.View
          style={[
            styles.toast,
            {
              opacity,
              backgroundColor: message.variant === "destructive" ? "#F87171" : "#4ADE80",
            },
          ]}
        >
          <Text style={styles.title}>{message.title}</Text>
          {message.description && <Text style={styles.description}>{message.description}</Text>}
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 8,
    zIndex: 1000,
  },
  title: {
    fontWeight: "bold",
    color: "white",
    fontSize: 16,
  },
  description: {
    color: "white",
    marginTop: 4,
    fontSize: 14,
  },
});

export const useToast = () => useContext(ToastContext);
