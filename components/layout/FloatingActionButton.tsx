import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export function FloatingActionButton() {
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={() => {
        console.log("Floating action button pressed!");
      }}
    >
      <MaterialIcons name="add" size={30} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#6200EE",
    borderRadius: 50,
    padding: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
