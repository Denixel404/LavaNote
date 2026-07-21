import { Text, ScrollView, useWindowDimensions } from "react-native";
import { colors, bigDisplay } from "@/src/globalVars";
import { Markdown } from "@codearcade/expo-markdown-native";

export default function mdGuide() {
  const { width } = useWindowDimensions();
  const adaptiveStyle = {
    container: {
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "flex-start",
      experimental_backgroundImage: "linear-gradient(#0A0F1A, #341913)"
    },
    text: {
      color: "#fff",
      fontSize: width > bigDisplay? 22 : 15,
      textAlign: "left",
      marginTop: 7,
    },
    title: {
      color: "white",
      fontSize: width > bigDisplay? 26 : 24,
    },
}
  
  return (
    <ScrollView contentContainerStyle={adaptiveStyle.container}>
      <Text style={adaptiveStyle.title}> Что такое Markdown?</Text>
      <Text style={adaptiveStyle.text}>
        Markdown - это язык разметки, который активно используется для написания постов в 
        соцсетях, документаций к проектам и стилизации текста. В LavaNote есть поддержка базового 
        синтаксиса Markdown. Благодаря ей вы можете сделать свои заметки чуточку красивее.
        И это не так сложно как может показаться в самом начале. На этой странице представлены 
        базовые примеры, которые помогут вам разобраться в этой теме, если вы ничего не 
        понимаете.
      </Text>
      <Text style={adaptiveStyle.text}>
        Чтобы применить стили к какому-либо тексту, вы должны прежде всего включить
        поддержку Markdown при создании заметки. Изменить эту функцию впоследствие будет невозможно.
        Далее вам необходимо обернуть нужный вам фрагмент в заметке в специальные символы, которые
        не будут видны при просмотре. Вот как это работает внутри самой заметки:
      </Text>

      <Text style={adaptiveStyle.title}>Примеры разметки</Text>

      <Text style={adaptiveStyle.text}>
        **Пример текста в заметке** - шрифт внутри символов будет жирным
      </Text>
      <Text style={adaptiveStyle.text}>
        _Пример текста в заметке_ - шрифт внутри символов будет курсивом
      </Text>
      <Text style={adaptiveStyle.text}>
        ~~Пример текста в заметке~~ - шрифт внутри символов будет зачёркнутым
      </Text>
      <Text style={adaptiveStyle.text}>
        ~~Пример текста в заметке~~ - шрифт внутри символов будет зачёркнутым
      </Text>
      <Text style={adaptiveStyle.text}>
        Добавьте перед текстом решётку, чтобы сделать заголовок. Чем больше решёток, тем 
        мельче шрифт. Одна решётка равна заголовку уровня h1, а шесть решёток - самый 
        маленький заголовок уровня h6. Ниже представлены варианты их написания.
      </Text>
      <Text style={adaptiveStyle.text}>
        # Заголовок h1
      </Text>
      <Text style={adaptiveStyle.text}>
        ## Заголовок h2
      </Text>
      <Text style={adaptiveStyle.text}>
        ### Заголовок h3
      </Text>
      <Text style={adaptiveStyle.text}>
        И т.д.
      </Text>

      <Text style={adaptiveStyle.title}>Напоследок...</Text>
      <Text style={adaptiveStyle.text}>
        Для тех, кто совсем не разбирается в языках разметки будет сложно понять этот текст, 
        без наглядных примеров. Однако в интернете есть множество других статей с наглядными 
        и подробными разъяснениями. Если вас заинтересовала эта тема, то вам стоит посмотреть 
        соответсвующие ресурсы и узнать ещ больше о возможностях Markdown. 
      </Text>
    </ScrollView>
  );
}