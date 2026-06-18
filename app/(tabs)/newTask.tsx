import { View, Text, StyleSheet, TextInput, Platform, Alert } from "react-native";
import { Button } from "react-native"; 
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as notifications from "expo-notifications";
import React, { useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { colors, title_fontSize } from "@/src/globalVars";
import { getDisplayDate, checkZero } from "@/src/scripts/utils";
import { notificationsInit } from "@/src/scripts/notificationsSystem";
import { deleteFolder } from "@/src/scripts/fileSystem";
import { requestNotificationsPermission } from "@/src/scripts/permissions";
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
  const [taskTitle, setTaskText] = useState("");
  const [taskDate, setTaskDate] = useState(new Date());
  const [taskDateTime, setTaskDateTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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
    date.setSeconds(0);
    date.setMilliseconds(0);
    const fileID = Date.now(); 
    const finaldate = Math.floor((date.getTime() - Date.now()) / 1000);
    if (date.getTime() <= Date.now()) console.log("Uncorrect plan date"); 
    else {
      // console.log(`Now: ${Date.now()}`);
      // console.log(`Get date: ${date.getTime()}`);
      // console.log(`Step: ${date.getTime() - Date.now()}`);
    }
    try {
      const diff = date.getTime() - Date.now();
      const id = await notifications.scheduleNotificationAsync({
        content: {
          title: "📌 LavaNote напоминает",
          body: text,
        },
        trigger: {
          type: "timeInterval",
          seconds: Math.round(diff / 1000),
          //timestamp: finaldate,
          repeats: false,
          channelId: "default",
        }
      });
      const triggerData = {
        "id": id,
        "text": text,
        "date": date,
    };
    saveDataReminder(triggerData, `LNTask${fileID}`);
    } catch (error) {
      console.error(`notification not schedule\nError: ${error}`);
    }
    nav.navigate("tasks_index");
  };

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Создайте новое напоминание</Text>
      <View style={styles.example}>
        <Text style={styles.example_title}>📌 LavaNote напоминает!</Text>
        <Text style={styles.text}>{taskTitle}</Text>
      </View>
      <Text style={styles.text}>{`Сигнал прозвучит: ${getDisplayDate(taskDate.getTime())}`}</Text>
      <View style={styles.input_container}>
        <TextInput 
          style={styles.input_title}
          placeholder="Введите здесь текст напоминания"
          placeholderTextColor={colors.secondtext}
          value={taskTitle}
          onChangeText={text => setTaskText(text)}
        />
        <View style={styles.timePicker}>
          <Button title="Выберите дату" onPress={() => setShowDatePicker(true)} color={colors.lava} />
          <Button title="Выберите время" onPress={() => setShowTimePicker(true)} color={colors.lava} />
        </View>
        <Button title="Сохранить" onPress={() => createTask(taskTitle, taskDate)} color={colors.lava} />
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

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: 20,
    marginBottom: 10,
  },
  timePicker: {
    flexDirection: "row",
    //: 10,
  },
  text: {
    color: colors.white,
    marginBottom: 30,
  },
  title: {
    color: "white",
    marginTop: 24,
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
    width: 300,
    height: 40,
  },
  input_container: {
    gap: 10,
  }
})