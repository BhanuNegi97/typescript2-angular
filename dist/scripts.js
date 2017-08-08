define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function sayHello(name) {
        return "Hello from " + name;
    }
    exports.sayHello = sayHello;
});

// function hello(compiler: string) {
//     console.log(`Hello from ${compiler}`);
// }
// hello("TypeScript");
define(["require", "exports", "./greet"], function (require, exports, greet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function showHello(divName, name) {
        var elt = document.getElementById(divName);
        elt.innerText = greet_1.sayHello(name);
    }
    showHello("greeting", "TypeScript");
});
