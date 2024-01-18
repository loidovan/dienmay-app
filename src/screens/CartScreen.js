import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import CartItem from "../components/cart-items";
import { BASE_URL_API } from "../utils";

export default function CartScreen(props) {
  const navigation = useNavigation();
  const [cart, setCart] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("Giỏ hàng đang trống");
  const [totalQty, setTotalQty] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    getCart();
  }, []);

  const getCart = async () => {
    const cart = await AsyncStorage.getItem("DienMay_cart_id");
    if (cart) {
      await axios
        .post(`${BASE_URL_API}/getCart`, {
          cart_id: cart,
        })
        .then((res) => {
          setCart(res.data);
          let price = 0;
          let totalQty = 0;
          res?.data?.map((item) => {
            price += item?.product?.price * item?.quantity;
            totalQty += item?.quantity;
          });
          setTotalPrice(price);
          setTotalQty(totalQty);

          if (res?.data?.length == 0) {
            setAlertMsg("Giỏ hàng đang trống");
            setShowAlert(true);
          }
        })
        .catch((e) => console.log(e.repsonse));
    } else {
      setAlertMsg("Giỏ hàng đang trống");
      setShowAlert(true);
    }
  };

  return (
    // SafeAreaView is used to avoid the notch on the phone
    <SafeAreaView style={[styles.container]}>
      {/* SchrollView is used in order to scroll the content */}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          borderBottomWidth: heightPercentageToDP(0.05),
          paddingBottom: heightPercentageToDP(1),
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full ml-5 bg-white"
        >
          <ChevronLeftIcon strokeWidth={4.5} color="#ed1b24" />
        </TouchableOpacity>
        <Text
          className="ml-4"
          style={{
            flex: 2,
            fontSize: heightPercentageToDP(2),
            color: "#d0011b",
          }}
        >
          Giỏ hàng
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Using the reusable header component */}

        {/* Mapping the products into the Cart component */}
        {cart?.map((cart) => (
          <CartItem cart={cart} onRefresh={getCart} />
        ))}
      </ScrollView>
      {/* Creating a seperate view to show the total amount and checkout button */}
      <View>
        <View style={styles.row}>
          <Text style={styles.cartTotalText}>Số lượng</Text>

          {/* Showing Cart Total */}
          <Text
            style={[
              styles.cartTotalText,
              {
                color: "#4C4C4C",
              },
            ]}
          >
            {/* Dividing the total by 100 because Medusa doesn't store numbers in decimal */}
            {totalQty} sp
          </Text>
        </View>
        <View style={[styles.row, styles.total]}>
          <Text style={styles.cartTotalText}>Tổng tiền</Text>
          <Text
            style={[
              styles.cartTotalText,
              {
                color: "#4C4C4C",
              },
            ]}
          >
            {new Intl.NumberFormat("en-US").format(totalPrice || "")}₫
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#d0011b",
            borderRadius: 20,
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          {/* A button to navigate to checkout screen */}
          <TouchableOpacity
            style={{ width: "100%" }}
            large={true}
            onPress={() =>
              navigation.navigate("Checkout", { totalPrice, cart })
            }
          >
            <Text
              style={{
                color: "white",
                fontSize: 20,
                width: "100%",
                textAlign: "center",
              }}
            >
              Thanh toán
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title=""
        message={alertMsg}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Xác nhận"
        confirmButtonColor="#d0011b"
        onCancelPressed={() => {
          setShowAlert(false);
        }}
        onConfirmPressed={() => {
          setShowAlert(false);
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}

// Styles....
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: widthPercentageToDP(90),
    marginTop: 15,
  },
  total: {
    borderTopWidth: 1,
    paddingTop: 15,
    borderTopColor: "#E5E5E5",
    marginBottom: 15,
  },
  cartTotalText: {
    fontSize: widthPercentageToDP(4.5),
    color: "#989899",
  },
});
