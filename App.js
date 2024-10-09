import React, { useState, useEffect, createContext, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  AppState,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Tạo PhoneContext để lưu số điện thoại
const PhoneContext = createContext();

// Màn hình Home
const HomeScreen = () => {
  const { phone } = useContext(PhoneContext); // Lấy số điện thoại từ context

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chào mừng đến với Home Screen!</Text>
      {/* Thay đổi văn bản hiển thị số điện thoại */}
      <Text style={styles.label}>Bạn đã đăng nhập thành công với số điện thoại: {phone}</Text>
    </View>
  );
};

// Màn hình Đăng nhập
const SignInScreen = ({ navigation }) => {
  const [phone, setPhone] = useState("");
  const { setPhoneContext } = useContext(PhoneContext); // Hàm để cập nhật số điện thoại vào context

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(09|03|07|08|05)\d{8}$/; // Số điện thoại Việt Nam hợp lệ
    return phoneRegex.test(phone.replace(/\D/g, ""));
  };

  const handleContinue = () => {
    const cleanedPhone = phone.replace(/\D/g, ""); // Loại bỏ ký tự không phải số
    if (validatePhoneNumber(cleanedPhone)) {
      setPhoneContext(cleanedPhone);
      navigation.navigate("Home"); // Điều hướng đến HomeScreen
    } else {
      Alert.alert("Số điện thoại không hợp lệ!");
    }
  };

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
        value={formatPhoneNumber(phone)}
        onChangeText={(text) => setPhone(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Tiếp tục</Text>
      </TouchableOpacity>
    </View>
  );
};

// Component chính
const App = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const [phone, setPhoneContext] = useState(""); // State để lưu số điện thoại toàn cục

  useEffect(() => {
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
    <PhoneContext.Provider value={{ phone, setPhoneContext }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SignIn">
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PhoneContext.Provider>
  );
};

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "left",
    color: "#333",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: "#555",
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
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  button: {
    backgroundColor: "#a59dfa",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default App;
