import { View, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

export function BottomNavigation() {
  const navigation = useNavigation();

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#ffffff",
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
        paddingVertical: 10,
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text>🏠 Home</Text> {/* Replaced icon with text */}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Records")}>
        <Text>📄 Records</Text> {/* Replaced icon with text */}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <Text>👤 Profile</Text> {/* Replaced icon with text */}
      </TouchableOpacity>
    </View>
  );
}
