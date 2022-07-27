<h1 align="center"> Jquery Range Slider </h1>
<h2>Try -> <a href="https://dmitrysaf.github.io/JqueryRangePlugin/">DEMO</a> <-</h2>
<h2>Установка</h2>
Установка с помощью npm: <br>
Шаг 1:

1) Скачать <a href="https://github.com/DmitrySaf/JqueryRangePlugin/blob/main/dist/assets/app/main.js" download>скрипты</a><br>
2) Скачать <a href="https://github.com/DmitrySaf/JqueryRangePlugin/blob/main/dist/assets/css/main.css" download>стили</a><br>

Шаг 2:
Подключить
  
```
<html>
  <head>
    ···
    <link href="/path/to/main.css" rel="stylesheet">
  </head>
  <body>
    ···
    <script src="/path/to/main.js"></script>
  </body>
</html>
```
  
<h2>Описание архитектуры</h2>
Для построение архитектуры приложения использовался подход MVP (Model-View-Presenter). Model и View взаимодействуют между собой через Presenter при помощи паттерна Observer.
<h3>Model</h3>
Бизнес-логика приложения
<h3>View</h3>
Реагирует на действия пользователя и направляет данные в Presenter
<h3>Presenter</h3>
Получает данные от View и передает их в Model, затем получает данные от Model и передает во View для отображения
<h3>UML диаграмма:</h3>
<img src="https://github.com/DmitrySaf/JqueryRangePlugin/blob/main/src/assets/img/uml.drawio.png">

<h2>Запуск команд:</h2> <br>
Шаг 1:

```
git clone https://github.com/DmitrySaf/JqueryRangePlugin/
```
Шаг 2:
  
```
cd JqueryRangeSlider
```
Шаг 3:
 
```
npm install
```
Шаг 4:
  
1) Build

```
npm run build
```
2) Develop

```
npm run dev
```
3) Tests

```
npm run test
```
  
  
  
  
