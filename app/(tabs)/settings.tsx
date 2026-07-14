import { Text, View, TouchableOpacity, Linking, useWindowDimensions, Modal, TextInput } from "react-native";
import { StyleSheet, Alert } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useFonts } from "expo-font";
import Constants from 'expo-constants';

import { readDataFile, writeDataFile } from "@/src/scripts/fileSystem";
import { isHasPassword, saveNewPassword, verifyPassword, deleteAppPassword } from "@/src/scripts/security";
import SocialLink from "@/app/components/Links";
import Feature from "../components/Feature";
import { colors, bigDisplay } from "@/src/globalVars";
import Button from "../components/Button";
import SmallButton from "../components/SmallButton";

const tgLogo = require("../../assets/images/telegram.png");
const githubLogo = require("../../assets/images/github.png");
const miniIcon = require("../../assets/images/mini-icon.png");

const feedback = () => {
  const form = "https://forms.gle/qtRpeUnDYGNCX5rR8";
  Linking.canOpenURL(form).then(supported => {
    if (supported) Linking.openURL(form);
    else Alert.alert('Ошибка', 'Не удалось открыть форму');
  });
}

export default function Settings() { // Основное наполнение страницы
  const [catVisible, setCatVisible] = useState(false);
  const [passVisible, setPassVisible] = useState(false);
  const [hasPassword, setHasPassword] = useState();
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [showRepeatPassword, setShowRepeatPassword] = useState(true);
  const [categories, setCategories] = useState("");
  const [fontsLoaded] = useFonts({
    "IBMPlexMono-Bold": require("@/assets/fonts/IBMPlexMono-Bold.ttf"),
  });
  const { width } = useWindowDimensions();
  const adaptiveStyle = {
    title: {
      color: "#fff",
      fontSize: width > bigDisplay? 46 : 32,
      fontFamily: "IBMPlexMono-Bold",
    },
    text: {
      color: "#fff",
      fontSize: width > bigDisplay? 22 : 15,
    },
    modalCategories: {
      backgroundColor: colors.panel,
      width: "100%",
      height: "100%",
      alignItems: "center",
    },
    modalText: {
      color: "#fff",
      fontSize: width > bigDisplay? 22 : 15,
    },
    modalTitle: {
      color: "#fff",
      fontSize: width > bigDisplay? 25 : 18,
      marginTop: 75,
      textAlign: "center",
    },
    modalInput: {
      color: colors.white,
      borderWidth: 2,
      borderColor: colors.lava,
      borderRadius: 20,
      height: "15%",
      width: "90%",
      textAlignVertical: "top",
      marginTop: 20,
      marginBottom: 50,
      fontSize: width > bigDisplay? 22 : 15,
    },
    modalPasswordPage: {
      backgroundColor: colors.panel,
      width: "100%",
      height: "100%",
      alignItems: "center",
      padding: width > bigDisplay? 25 : 10,
      marginTop: 30,
    },
    modalInputPassword: {
      color: colors.white,
      borderWidth: 2,
      borderColor: colors.lava,
      borderRadius: 20,
      height: width > bigDisplay? 60 : 40,
      width: "80%",
      textAlignVertical: "top",
      marginTop: 20,
      marginBottom: 10,
      padding: 10,
      fontSize: width > bigDisplay? 22 : 15,
    },
    modalTextPasswordPage: {
      color: colors.white,
      fontSize: width > bigDisplay? 22 : 15,
      textAlign: "center",
    },
    modalTextPasswordPageY: {
      color: colors.white,
      fontSize: width > bigDisplay? 22 : 15,
    },
    modalWarn: {
      padding: 10,
      borderLeftColor: "gold",
      borderWidth: 2,
      marginBottom: width > bigDisplay? 50 : 10,
      margin: 20,
      backgroundColor: "#ecd20825",
      fontSize: width > bigDisplay? 22 : 15,
    },
    button: {
      marginTop: width > bigDisplay? 60 : 30,
    },
    modalEditPasswordPage: {
      backgroundColor: colors.panel,
      width: "100%",
      height: "100%",
      alignItems: "center",
      padding: 10,
      marginTop: 30,
    },
    modalEnterPassword: {
      height: 75,
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: width > bigDisplay? 25 : 10,
      marginBottom: width > bigDisplay? 10 : 0,
    },
  }

  useFocusEffect( // Чтение и обновление строки категорий
      useCallback(() => {
        const loadCategories = async () => {
          const loadedCategories = await readDataFile("categories.txt");
          setCategories(loadedCategories);

          const checkedPassword = await isHasPassword();
          setHasPassword(checkedPassword);
        };
        loadCategories();
      }, []) // Зависимости
    );

  if (!fontsLoaded) {
    return null;
  }

  const openCategories = async () => {
    console.log("opening categories...");
    setCatVisible(true);
  };

  const saveCat = async (changes: string) => {
    writeDataFile("categories.txt", changes);
    console.log("categories was saved!");
    setCatVisible(false);
  };

  const createPassword = async () => {
    if (password.length < 4) {
      alert("Пароль должен составлять не менее 4 символов");
      return;
    } else if (password.length > 12) {
      alert("Пароль должен составлять не более 12 символов");
      return;
    } else if ((password === "") || (repeatPassword === "")) {
      alert("Заполните все поля");
    }
    if (password !== repeatPassword) {
      alert("Пароль должен совпадать");
      setRepeatPassword("");
      return;
    }
    console.log("password validation complete!");
    await saveNewPassword(password); // 
    setPassVisible(false);
  };

  const deletePassword = async () => {
    console.log("delete password...");
    const checkPass = await verifyPassword(password);
    if (checkPass) {
      deleteAppPassword();
      setPassVisible(false);
      alert("Текущий пароль был удалён. Вход в приложение теперь свободный. Вы можете поставить новый пароль в любое время")
    } else {
      alert("Введите текущий пароль или проверьте его правильность для удаления");
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={catVisible}
        onRequestClose={() => setCatVisible(false)}
      >
        <View style={adaptiveStyle.modalCategories}>
          <Text style={adaptiveStyle.modalTitle}>Измените список категорий для заметок через запятую</Text>
          <TextInput 
            style={adaptiveStyle.modalInput}
            placeholder="Введите ваши категории через запятую"
            value={categories}
            onChangeText={setCategories}
            scrollEnabled={true}
            multiline={true}
          />
          <Button label="Сохранить изменения" backgroundColor={colors.lava} onPress={async () => saveCat(categories)}/>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={passVisible}
        onRequestClose={() => setPassVisible(false)}
      >
        <View style={adaptiveStyle.modalPasswordPage}>
          {!hasPassword ? (
            <>
              <Text style={adaptiveStyle.modalTextPasswordPage}>Создайте пароль, защитив свои заметки. Он будет использоваться при входе в приложении.</Text>
              <View style={adaptiveStyle.modalWarn}>
                <Text style={adaptiveStyle.modalTextPasswordPageY}>Обратите внимание, что если вы забудете пароль, вам придётся переустанавливать приложение с потерей всех его данных</Text>
              </View>
              <View style={adaptiveStyle.modalEnterPassword}>
                <TextInput 
                  style={adaptiveStyle.modalInputPassword}
                  placeholder="Придумайте новый пароль"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={showPassword}
                />
                <SmallButton name="eye" backgroundColor="gray" borderRadius={15} onPress={() => setShowPassword(!showPassword)} />
              </View>
              <View style={adaptiveStyle.modalEnterPassword}>
                <TextInput 
                  style={adaptiveStyle.modalInputPassword}
                  placeholder="Повторите придуманный пароль"
                  value={repeatPassword}
                  onChangeText={setRepeatPassword}
                  secureTextEntry={showRepeatPassword}
                />
                <SmallButton name="eye" backgroundColor="gray" borderRadius={15} onPress={() => setShowRepeatPassword(!showRepeatPassword)} />
              </View>
              <View style={adaptiveStyle.button}>
                <Button label="Применить" backgroundColor={colors.lava} onPress={async () => await createPassword()} />
              </View>
            </>
          ) : (
            <>
              <View style={adaptiveStyle.modalEditPasswordPage}>
                <Text style={adaptiveStyle.modalText}>Настройте свой пароль</Text>
                <View style={adaptiveStyle.modalEnterPassword}>
                  <TextInput 
                    style={adaptiveStyle.modalInputPassword}
                    placeholder="Введите текущий пароль"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={showPassword}
                  />
                  <SmallButton name="eye" backgroundColor="gray" borderRadius={15} onPress={() => setShowPassword(!showPassword)} />
                </View>
                <View style={adaptiveStyle.button}>
                  <Button label="Удалить пароль" backgroundColor="red" onPress={() => deletePassword()} />
                </View>
              </View>
            </>
          )}
        </View>
      </Modal>

      <View style={styles.banner}>
        <Text style={styles.title, adaptiveStyle.title}>LavaNote</Text>
        <Text style={styles.text, adaptiveStyle.text}>Версия: {Constants.expoConfig?.version}</Text>
      </View>
      <Feature label="Изменить категории" backgroundColor="#482203bd" onPress={async () => openCategories()}/>
      <Feature label="Настроить пароль" backgroundColor="#482203bd" onPress={() => {
        setPassVisible(true);
        setPassword("");
      }} />
      <SocialLink image={tgLogo} label="Канал в Telegram"  url="https://t.me/under_the_ctrl"/>
      <SocialLink image={githubLogo} label="Страница на GitHub"  url="https://github.com/Denixel404/LavaNote"/>
      <SocialLink image={miniIcon} label="Спасибо, Flaticon!"  url="https://www.flaticon.com/free-icons/lava"/>
  
      <TouchableOpacity style={styles.feedback} onPress={feedback}>
        <Text style={styles.text, adaptiveStyle.text}>✏️ Нашли баг или есть идея?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({ // Таблица стилей
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    experimental_backgroundImage: "linear-gradient(#0A0F1A, #341913)"
  },
  banner: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50
  },
  linksList: {

  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontFamily: "IBMPlexMono-Bold",
  },
  text: {
    color: "#fff",
  },
  feedback: {
    marginTop: 30,
    backgroundColor: colors.background2,
    padding: 30,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.lava
  }
})