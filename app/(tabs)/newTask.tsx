import { View, Text, StyleSheet, TextInput, Platform, ScrollView, Alert, useWindowDimensions, TouchableOpacity } from "react-native"; 
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as notifications from "expo-notifications";
import React, { useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import * as intentLaunch from "expo-intent-launcher";
import { useScheduleExactAlarmPermission } from "expo-exact-alarms-permission"

import { colors, title_fontSize, bigDisplay } from "@/src/globalVars";
import { getDisplayDate } from "@/src/scripts/utils";
import { notificationsInit } from "@/src/scripts/notificationsSystem";
import { saveDataReminder } from "@/src/scripts/fileSystem";

notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldShowAlert: true,
    shouldSetBadge: false,
  }),
});

export default function tasks_index() {
  const nav = useNavigation();
  const hasScheduleExactAlarm = useScheduleExactAlarmPermission();
  const [taskTitle, setTaskText] = useState("");
  const [taskDate, setTaskDate] = useState(new Date());
  const [taskDateTime, setTaskDateTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { width } = useWindowDimensions();
  const adaptiveStyle = {
    text: {
      color: colors.white,
      marginBottom: 30,
      fontSize: width > bigDisplay? 22 : 15,
    },
    title: {
      color: "white",
      marginTop: 10,
      marginBottom: 10,
      fontSize: width > bigDisplay? 32 : title_fontSize,
    },
    infoblock: {
      padding: 10,
      borderLeftColor: "gold",
      borderWidth: 2,
      marginBottom: width > bigDisplay? 50 : 10,
      margin: 20,
      backgroundColor: "#ecd20825",
      fontSize: width > bigDisplay? 22 : 15,
    },
    text_infoblock: {
      color: "white",
      fontSize: width > bigDisplay? 22 : 19,
    },
    h2: {
      color: "gold",
      fontSize: width > bigDisplay? 26 : 19,
    },
    example: {
      backgroundColor: colors.unactive_input,
      borderWidth: 1,
      borderColor: colors.lava,
      width: width > bigDisplay? 450 : 350,
      height: width > bigDisplay? 125 : 100,
      padding: 15,
      borderRadius: width > bigDisplay? 40 : 30,
      marginTop: width > bigDisplay? 10 : 0,
    },
    input_title: {
      color: colors.white,
      borderWidth: 2,
      borderColor: colors.lava,
      borderRadius: 10,
      width: width > bigDisplay? 435: 333,
      height: width > bigDisplay? 50: 40,
      fontSize: width > bigDisplay? 22: 15,
    },
    button: {
      width: width > bigDisplay? 435 : 333,
      height: width > bigDisplay? 50 : 35,
      backgroundColor: colors.lava,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: width > bigDisplay? 40 :  30,
    },
    button_picker: {
      width: width > bigDisplay? 215 : 161,
      height: width > bigDisplay? 50 : 35,
      backgroundColor: "gray",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: width > bigDisplay? 40 :  30,
    },
    button_text: {
      fontSize: width > bigDisplay? 25 : 17,
      color: colors.white
    },
    button_picker_text: {
      fontSize: width > bigDisplay? 23 : 16,
      color: colors.white
    }
  }
  useEffect(() => {
    notificationsInit();
  }, []);

  useFocusEffect( // Динамическое обновление списка заметок
      useCallback(() => {
        setTaskText("");
      }, []) // Зависимости
    );

  const onDateChange = (event, selectedDate) => {
    const currentDate = new Date(selectedDate);
    currentDate.setHours(taskDate.getHours());
    currentDate.setMinutes(taskDate.getMinutes());
    setTaskDate(new Date(currentDate));
    setShowDatePicker(false);
  };
  const onTimeChange = (event, selectedDate) => {
    const currentTime = new Date(selectedDate);
    currentTime.setDate(taskDate.getDate());
    setTaskDate(new Date(currentTime));
    setShowTimePicker(false);
  };
  const createTask = async (text: string, date: Date) => {
    if (taskTitle.length > 70) {
      alert("Текст напоминания слишком длинный");
      return;
    }  else if (taskTitle.length < 3) {
      alert("Текст напоминания слишком короткий");
      return;
    } 

    date.setSeconds(0);
    date.setMilliseconds(0);
    const fileID = Date.now(); 
    const finaldate = Math.floor((date.getTime() - Date.now()) / 1000);
    if (date.getTime() <= Date.now()) console.log("Uncorrect plan date"); 
    else {
      // console.log(`Create task\nNow: ${getDisplayDate(Date.now())} in timestamp - ${Date.now()}`);
      // console.log(`Get date: ${getDisplayDate(date.getTime())} in timestamp - ${date.getTime()}`)
      // console.log(`Get date: ${date.getTime()}`);
      // console.log(`Step: ${date.getTime() - Date.now()}`);
    }

    if (Platform.OS === "android") {
      try {
        if (!hasScheduleExactAlarm) {
          Alert.alert(
            "Инструкция",
            "На операционной системе android 12 и выше для создания напоминаний требуется особое разрешение. Сейчас вам будет необходимо выбрать приложение LavaNote в списке и выдать ему это разрешение. Без него напоминания могут работать некорректно.",
            [
              {text: "Ок", style: "default", 
                onPress: async () => {
                  await intentLaunch.startActivityAsync(intentLaunch.ActivityAction.REQUEST_SCHEDULE_EXACT_ALARM);
                }
              }
            ]
          )
          console.log("Get permission SCHEDULE_EXACT_ALARM");
        } else {
          console.log("Permission SCHEDULE_EXACT_ALARM already get");
        }
      } catch (error) {
        console.warn(`Permission SCHEDULE_EXACT_ALARM not get: ${error}`);
      }
    }

    try {
      const diff = date.getTime() - Date.now();
      const id = await notifications.scheduleNotificationAsync({
        content: {
          title: "📌 LavaNote напоминает",
          body: text,
          priority: notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          type: "date",
          //seconds: Math.round(diff / 1000),
          date: date.getTime(),
          repeats: false,
          channelId: "default",
        }
      });
      const triggerData = {
        "id": id,
        "text": text,
        "date": date,
    };
    await saveDataReminder(triggerData, `LNTask${fileID}`);
    } catch (error) {
      console.error(`notification not schedule\nError: ${error}`);
    }
    nav.navigate("tasks_index");
  };

  // const { width } = useWindowDimensions();
  // const taskInput = {
  //   color: colors.white,
  //   borderWidth: 2,
  //   borderColor: colors.lava,
  //   borderRadius: 10,
  //   width: width > 600? 550 : 313,
  //   height: width > 600? 60 : 40,
  // };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <Text style={styles.title, adaptiveStyle.title}>Создайте новое напоминание</Text>
      <View style={styles.info}>
        <View style={styles.infoblock, adaptiveStyle.infoblock}>
          <Text style={styles.h2, adaptiveStyle.h2}>Важно!</Text>
          <Text style={styles.text_infoblock, adaptiveStyle.text_infoblock}>
            Созданное вами напоминание работает как push-уведомление. Его нельзя будет 
            отредактировать, но можно будет отменить и создать новое. Во избежание неудобств 
            проверяйте все введённые данные перед окончательным сохранением и созданием напоминания.
          </Text>
        </View>
        <View style={styles.example, adaptiveStyle.example}>
          <Text style={styles.example_title}>📌 LavaNote напоминает!</Text>
          <Text style={styles.text, adaptiveStyle.text}>{taskTitle}</Text>
        </View>
        <Text style={styles.text, adaptiveStyle.text}>{`Сигнал прозвучит: ${getDisplayDate(taskDate.getTime())}`}</Text>
      </View>
        <View style={styles.input_container}>
          <TextInput 
            style={styles.input_title, adaptiveStyle.input_title}
            placeholder="Введите здесь текст напоминания"
            placeholderTextColor={colors.secondtext}
            value={taskTitle}
            onChangeText={text => setTaskText(text)}
          />
          <View style={styles.timePicker}>
            <TouchableOpacity style={adaptiveStyle.button_picker} onPress={() => setShowDatePicker(true)}>
              <Text style={adaptiveStyle.button_text}>Выберите дату</Text>
            </TouchableOpacity>
            <TouchableOpacity style={adaptiveStyle.button_picker} onPress={() => setShowTimePicker(true)}>
              <Text style={adaptiveStyle.button_text}>Выберите время</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.save}>
            <TouchableOpacity style={styles.button, adaptiveStyle.button}  onPress={() => createTask(taskTitle, taskDate)}>
              <Text style={adaptiveStyle.button_text}>Сохранить</Text>
            </TouchableOpacity>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={taskDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          {showTimePicker && (
            <DateTimePicker
              value={taskDateTime}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    experimental_backgroundImage: "linear-gradient(#0A0F1A, #341913)",
  },
  example: {
    backgroundColor: colors.unactive_input,
    borderWidth: 1,
    borderColor: colors.lava,
    width: 350,
    height: 100,
    padding: 15,
    borderRadius: 30,
    marginTop: 0,
    marginBottom: 10,
  },
  info: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  infoblock: {
    padding: 10,
    borderLeftColor: "gold",
    borderWidth: 2,
    marginBottom: 10,
    margin: 20,
    backgroundColor: "#ecd20825"
  },  
  timePicker: {
    flexDirection: "row",
    gap: 10,
  },
  save: {
    marginBottom: 40,
  },
  text_infoblock: {
    color: "white",
  },
  text: {
    color: colors.white,
    marginBottom: 30,
  },
  h2: {
    color: "gold",
    fontSize: 19,
  },
  title: {
    color: "white",
    marginTop: 10,
    marginBottom: 10,
    fontSize: title_fontSize,
  },
  example_title: {
    color: "white",
    fontSize: 18,
    marginBottom: 7,
  },
  input_title: {
    color: colors.white,
    borderWidth: 2,
    borderColor: colors.lava,
    borderRadius: 10,
    width: 313,
    height: 40,
  },
  input_container: {
    gap: 10,
  },
  button: {
    width: 200,
  }
})
