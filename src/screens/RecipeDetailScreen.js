import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { CachedImage } from "../helpers/image";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  ChevronLeftIcon,
  PlusCircleIcon,
  ShoppingBagIcon,
} from "react-native-heroicons/outline";
import {
  HeartIcon,
  Square3Stack3DIcon,
  UsersIcon,
} from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Loading from "../components/loading";
import YouTubeIframe from "react-native-youtube-iframe";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { BASE_URL, BASE_URL_API } from "../utils";
import WebView from "react-native-webview";
import RenderHTML from "react-native-render-html";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AwesomeAlert from "react-native-awesome-alerts";
import { SliderBox } from "react-native-image-slider-box";

export default function RecipeDetailScreen(props) {
  let item = props.route.params;
  const [isFavourite, setIsFavourite] = useState(false);
  const navigation = useNavigation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("Đã thêm vào giỏ hàng");
  const [images, setImages] = useState([]);
  const sourceInfo = {
    html: product?.post?.info_product,
  };
  const thongSo = {
    html: product?.description,
  };

  useEffect(() => {
    getProductData(item.id);
  }, []);

  const getProductData = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL_API}/products/${id}`);
      //   console.log('got meal data: ',response.data);
      if (response && response.data) {
        setProduct(response.data);
        setImages(
          [`${BASE_URL}${response.data?.image}`].concat(
            response.data?.images?.map(
              (item) => `${BASE_URL}/storage/images/products/${item?.name}`
            )
          )
        );
        setLoading(false);
      }
    } catch (err) {
      console.log("error: ", err.message);
    }
  };

  const addToCart = async () => {
    const cart = await AsyncStorage.getItem("DienMay_cart_id");
    if (cart) {
      await axios
        .post(`${BASE_URL_API}/carts`, {
          product_id: item.id,
          cart_id: cart,
        })
        .then(() => {
          setAlertMsg("Đã thêm vào giỏ hàng");
        })
        .catch((e) => {
          if (e?.response?.data?.message) {
            setAlertMsg(e.response.data.message);
          }
        })
        .finally(() => setShowAlert(true));
    } else {
      const randomId = makeid(16);
      await AsyncStorage.setItem("DienMay_cart_id", randomId);
      await axios
        .post(`${BASE_URL_API}/carts`, {
          product_id: item.id,
          cart_id: randomId,
        })
        .then(() => {
          setAlertMsg("Đã thêm vào giỏ hàng");
        })
        .catch((e) => {
          if (e?.response?.data?.message) {
            setAlertMsg(e.response.data.message);
          }
        })
        .finally(() => setShowAlert(true));
    }
  };

  const buyNow = async () => {
    const cart = await AsyncStorage.getItem("DienMay_cart_id");
    if (cart) {
      await axios
        .post(`${BASE_URL_API}/carts`, {
          product_id: item.id,
          cart_id: cart,
        })
        .then(() => {
          navigation.navigate("Cart");
        })
        .catch((e) => {
          if (e?.response?.data?.message) {
            setAlertMsg(e.response.data.message);
            setShowAlert(true);
          }
        });
    } else {
      const randomId = makeid(16);
      await AsyncStorage.setItem("DienMay_cart_id", randomId);
      await axios
        .post(`${BASE_URL_API}/carts`, {
          product_id: item.id,
          cart_id: randomId,
        })
        .then(() => {
          navigation.navigate("Cart");
        })
        .catch((e) => {
          if (e?.response?.data?.message) {
            setAlertMsg(e.response.data.message);
            setShowAlert(true);
          }
        });
    }
  };

  const makeid = (length) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const getYoutubeVideoId = (url) => {
    const regex = /[?&]v=([^&]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        className="bg-white flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <StatusBar style={"light"} />
        {/* recipe image */}
        <View className="flex-row justify-center">
          <SliderBox sliderBoxHeight={hp(40)} images={images} />
        </View>

        {/* back button */}
        <Animated.View
          entering={FadeIn.delay(200).duration(1000)}
          className="w-full absolute flex-row justify-between items-center pt-14"
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 rounded-full ml-5 bg-white"
          >
            <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color="#ed1b24" />
          </TouchableOpacity>
          {/* <TouchableOpacity
          onPress={() => setIsFavourite(!isFavourite)}
          className="p-2 rounded-full mr-5 bg-white"
        >
          <HeartIcon
            size={hp(3.5)}
            strokeWidth={4.5}
            color={isFavourite ? "red" : "gray"}
          />
        </TouchableOpacity> */}
        </Animated.View>

        {/* meal description */}
        {loading ? (
          <Loading size="large" className="mt-16" />
        ) : (
          <View className="px-4 flex justify-between space-y-4 pt-4">
            {/* name and area */}
            <Animated.View
              entering={FadeInDown.duration(700).springify().damping(12)}
              className="space-y-2"
            >
              <Text
                style={{ fontSize: hp(3) }}
                className="font-bold flex-1 text-neutral-700"
              >
                {product?.name}
              </Text>
              <Text
                style={{ fontSize: hp(2), color: "orange" }}
                className="font-medium flex-1 text-neutral-500"
              >
                {new Intl.NumberFormat("en-US").format(item.price || "")}₫
              </Text>
            </Animated.View>

            {/* misc */}

            {/* ingredients */}
            <Animated.View
              entering={FadeInDown.delay(200)
                .duration(700)
                .springify()
                .damping(12)}
              className="space-y-4"
            >
              <Text
                style={{ fontSize: hp(2.5) }}
                className="font-bold flex-1 text-neutral-700"
              >
                Thông tin sản phẩm
              </Text>
              <View className="space-y-2">
                <RenderHTML
                  contentWidth={(width * 95) / 100}
                  source={sourceInfo}
                />
              </View>
            </Animated.View>
            {/* instructions */}
            <Animated.View
              entering={FadeInDown.delay(300)
                .duration(700)
                .springify()
                .damping(12)}
              className="space-y-4"
            >
              <Text
                style={{ fontSize: hp(2.5) }}
                className="font-bold flex-1 text-neutral-700"
              >
                Thông số
              </Text>
            </Animated.View>
            <Animated.View>
              <RenderHTML contentWidth={(width * 100) / 100} source={thongSo} />
            </Animated.View>

            {/* recipe video */}
            {product?.post?.path && (
              <Animated.View
                entering={FadeInDown.delay(400)
                  .duration(700)
                  .springify()
                  .damping(12)}
                className="space-y-4"
              >
                <Text
                  style={{ fontSize: hp(2.5) }}
                  className="font-bold flex-1 text-neutral-700"
                >
                  Video giới thiệu
                </Text>
                <View>
                  <YouTubeIframe
                    videoId={getYoutubeVideoId(product?.post?.path || "")}
                    height={hp(30)}
                  />
                </View>
              </Animated.View>
            )}
          </View>
        )}
      </ScrollView>

      <View
        style={{
          height: hp(8),
          backgroundColor: "white",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.58,
          shadowRadius: 16.0,

          elevation: 24,
        }}
      >
        <View className="flex-row">
          <TouchableOpacity
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              paddingTop: hp(0.8),
              paddingBottom: hp(0.5),
            }}
            onPress={addToCart}
          >
            <PlusCircleIcon color={"#d0011b"} />
            <Text>Thêm vào giỏ hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              backgroundColor: "#d0011b",
              paddingTop: hp(0.5),
              paddingBottom: hp(0.5),
            }}
            onPress={buyNow}
          >
            <Text style={{ color: "white" }}>Mua ngay</Text>
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
        }}
      />
    </View>
  );
}
