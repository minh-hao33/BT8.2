import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  AppState,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

// Màn hình Home
const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chào mừng đến với Home Screen!</Text>
    </View>
  );
};

// Màn hình Đăng nhập
const SignInScreen = ({ navigation }) => {
  const [phone, setPhone] = useState("");

  // Hàm kiểm tra số điện thoại có hợp lệ không
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(09|03|07|08|05)\d{8}$/; // Số điện thoại Việt Nam hợp lệ
    return phoneRegex.test(phone.replace(/\D/g, "")); // Loại bỏ ký tự không phải số và kiểm tra
  };

  // Hàm xử lý khi nhấn nút "Tiếp tục"
  const handleContinue = () => {
    const cleanedPhone = phone.replace(/\D/g, ""); // Loại bỏ ký tự không phải số
    if (validatePhoneNumber(cleanedPhone)) {
      // Điều hướng đến HomeScreen khi số điện thoại hợp lệ
      navigation.navigate("Home");
    } else {
      Alert.alert("Số điện thoại không hợp lệ!");
    }
  };

  // Hàm tự động định dạng số điện thoại khi nhập
  const formatPhoneNumber = (input) => {
    const cleaned = input.replace(/\D/g, "");
    const formatted = cleaned
      .replace(/(\d{3})(\d{3})(\d{0,4})/, "$1 $2 $3")
      .trim();
    return formatted;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <Text style={styles.label}>Nhập số điện thoại</Text>
      <Text style={styles.description}>
        Dùng số điện thoại để đăng nhập hoặc đăng ký tài khoản
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập số điện thoại của bạn"
        keyboardType="numeric"
        value={formatPhoneNumber(phone)} // Tự động format số điện thoại khi nhập
        onChangeText={(text) => setPhone(text)} // Cập nhật state khi nhập
      />
      <Button title="Tiếp tục" onPress={handleContinue} />
    </View>
  );
};

// Component chính
const App = () => {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    // Hiển thị thông báo chỉ một lần khi ứng dụng được mở
    Alert.alert("Chào mừng bạn đến với ứng dụng!");

    // Lắng nghe sự thay đổi của AppState (foreground/background)
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      setAppState(nextAppState);
    });

    // Cleanup listener khi component unmount
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "left", // Chữ "Đăng nhập" nằm phía trái màn hình
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    fontSize: 18,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default App;