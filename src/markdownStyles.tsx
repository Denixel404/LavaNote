import * as md from "@codearcade/expo-markdown-native"

export const mdStyles = {
    body: {
        color: '#fff',
        fontSize: 16,
        lineHeight: 24,
    },
    heading1: { fontSize: 32, fontWeight: 'bold', color: '#ffffff', marginTop: 20, marginBottom: 10 },
    link: { color: '#f1951d', textDecorationLine: 'underline' },
}

export const codeStyles = {

    "hljs": { color: '#e2e2e2' },

    "hljs-comment": { color: '#828181' },
    'hljs-quote': { color: '#828181' },

    'hljs-keyword': { color: '#e47b6f' },
    'hljs-selector-tag': { color: '#e47b6f' },
    'hljs-addition': { color: '#e47b6f' },
    // Числа
    'hljs-number': { color: '#7eb1dc' },
    'hljs-literal': { color: '#7eb1dc' },
    'hljs-built_in': { color: '#7eb1dc' },
    // Строки
    'hljs-string': { color: '#CE9178' },
    'hljs-doctag': { color: '#CE9178' },
    // Заголовки
    'hljs-title': { color: '#ccaadc' },
    'hljs-section': { color: '#ccaadc' },
    'hljs-name': { color: '#ccaadc' },
    // Типы
    'hljs-type': { color: '#e2e2e2' },
    'hljs-class': { color: '#e2e2e2' },
    // Функции
    'hljs-function': { color: '#ccaadc' },
    'hljs-params': { color: '#ccaadc' },
    // Операторы
    'hljs-operator': { color: '#e47b6f' },
    'hljs-punctuation': { color: '#e47b6f' },
    // Переменные
    'hljs-variable': { color: '#D4D4D4' },
    // Атрибуты
    'hljs-attribute': { color: '#eda343' },
    // Теги
    'hljs-tag': { color: '#D4D4D4' },
    // Регулярные выражения
    'hljs-regexp': { color: '#CE9178' },
    // Символы
    'hljs-symbol': { color: '#D4D4D4' },
    // Булевы значения
    'hljs-literal': { color: '#7eb1dc' },
}
