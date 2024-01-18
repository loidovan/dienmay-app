import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  BellIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
} from "react-native-heroicons/outline";
import Categories from "../components/categories";
import axios from "axios";
import Recipes from "../components/recipes";
import { BASE_URL, BASE_URL_API } from "../utils";
import Products from "../components/products";
import { useNavigation } from "@react-navigation/native";
export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState("Beef");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    getCategories();
  }, []);
  useEffect(() => {
    getRecipes();
  }, [categories]);
  useEffect(() => {
    if (keyword === "") getRecipes();
  }, [keyword]);

  const handleChangeCategory = (category) => {
    setProducts([]);
    getRecipes(category);
    setActiveCategory(category);
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(BASE_URL_API + "/categories");
      // const response = await axios.get(
      //   "https://themealdb.com/api/json/v1/1/categories.php"
      // );

      console.log("got categories: ", BASE_URL_API);
      if (response && response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      console.log("error1: ", BASE_URL_API);
    }
  };
  const getRecipes = async (categoryId) => {
    try {
      // const response = await axios.get(
      //   `https://themealdb.com/api/json/v1/1/filter.php?c=${category}`
      // );
      const response = await axios.post(BASE_URL_API + "/products/filters", {
        category_id: categoryId || categories[0]?.id,
      });

      if (response && response.data) {
        setProducts(response.data);
      }
    } catch (err) {
      console.log("error: ", err);
    }
  };

  const getDataByKeyword = async (keyword) => {
    if (!keyword) return;
    try {
      // const response = await axios.get(
      //   `https://themealdb.com/api/json/v1/1/filter.php?c=${category}`
      // );
      const response = await axios.post(BASE_URL_API + "/products/search", {
        keyword,
      });

      if (response && response.data) {
        setProducts(response.data);
      }
    } catch (err) {
      console.log("error: ", err);
    }
  };
  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className="space-y-6 pt-14"
      >
        {/* avatar and bell icon */}
        {/* <View className="mx-4 flex-row justify-between items-center mb-2">
          <Image
            source={require("../../assets/images/avatar.png")}
            style={{ height: hp(5), width: hp(5.5) }}
          />
          <BellIcon size={hp(4)} color="gray" />
        </View> */}

        {/* search bar */}
        <View
          className="flex-row"
          style={{
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ paddingLeft: hp(2) }}>
            <View className="rounded-full p-1">
              <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
                <ShoppingCartIcon
                  size={hp(3)}
                  strokeWidth={2}
                  color="#d0011b"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ paddingLeft: hp(2) }}>
            <View className="rounded-full p-1">
              <TouchableOpacity onPress={() => navigation.navigate("History")}>
                <CurrencyDollarIcon
                  size={hp(3)}
                  strokeWidth={2}
                  color="#d0011b"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{ flex: "2" }}
            className="mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]"
          >
            <TextInput
              onChangeText={(text) => setKeyword(text || "")}
              placeholder="Tìm kiếm"
              placeholderTextColor={"gray"}
              style={{ fontSize: hp(1.7) }}
              className="flex-1 text-base mb-1 pl-3 tracking-wider"
            />
            <View
              className="bg-white rounded-full p-3"
              onStartShouldSetResponder={() => {
                getDataByKeyword(keyword);
              }}
            >
              <MagnifyingGlassIcon
                size={hp(2.5)}
                strokeWidth={2.5}
                color="#d0011b"
              />
            </View>
          </View>
        </View>

        {/* categories */}
        <View>
          {categories.length > 0 && (
            <Categories
              categories={categories}
              activeCategory={activeCategory}
              handleChangeCategory={handleChangeCategory}
            />
          )}
        </View>

        {/* recipes */}
        <View style={{ marginBottom: 20 }}>
          <Products
            products={products}
            categories={categories}
            keyword={keyword}
          />
        </View>
      </ScrollView>
    </View>
  );
}
