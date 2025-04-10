import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MediRecord</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#007AFF",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
});
