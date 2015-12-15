App = App || {};
App.Templates = App.Templates || {};
(function (base, extend) { for (var key in extend) base[key] = extend[key]; }).call(
this,
App.Templates,
{"first":"   <h1>Hi everybody</h1> ","second_template":"   <h1>Bye!</h1> ","third-template":"   <h1>Hi everybody</h1> "}
);