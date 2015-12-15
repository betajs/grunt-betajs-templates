App = App || {};
App.NewNamespace = App.NewNamespace || {};
(function (base, extend) { for (var key in extend) base[key] = extend[key]; }).call(
this,
App.NewNamespace,
{"first":"   <h1>Hi everybody</h1> ","second_template":"   <h1>Bye!</h1> ","third-template":"   <h1>Hi everybody</h1> "}
);