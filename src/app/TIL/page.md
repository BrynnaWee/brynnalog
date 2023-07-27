# 모듈 사용 방식(CommonJS vs ECMA Script)

**👩 I N D E X**

---

### 들어가기 전에

- 자바스크립트 모듈은 CJS와 ESM말고도 여러가지 방식이 존재한다.
    - https://weblogs.asp.net/dixin/understanding-all-javascript-module-formats-and-tools

## ES모듈과 CommonJS모듈의 import/export 방식 차이

### **CommonJS**

- 내보내기 - `module.exports` 사용
    
    ```jsx
    module.exports.sum = (x, y) => x + y
    //또는
    module.exports = (x, y) => x + y
    
    const foo = () => {}
    module.exports = foo;
    
    ```
    
- 가져오기 - `require()` 사용
    
    ```jsx
    const { sum } = require('./util.cjs')
    ```
    

- CommonJS에서는 module이라는 객체를 지원한다.
- module객체에 exports라는 속성이 존재한다.
- exprots속성에 모듈로 사용할 객체나 함수, 값 등을 넣고,
- 모듈을 사용하는 쪽에서 require로 가져오는 것이다.
    - require()는 module.exports를 리턴한다.
- 객체 안에 여러 개를 집어 넣을 수도 있고, 각각 지정할 수도 있다

```jsx
module.exports = { PI, addNumbers	}
//또는
module.exports.PI = PI; //exports객체 안의 PI라는 key에 PI를 value로 지정
module.exports.addNumbers = addNumbers //내보내는 key는 실제 value명과 달라도 된다.

//또는 shortcut으로 exports만 사용 가능하다.
exports = PI = PI;
exports = addNumbers = addNumbers ;
```

module.exports를 exports로 줄여쓸 수 있다.

하지만 컨텍스트 내에 exports를 다른 값으로 덮어쓰게 된다면 더이상 exports는 module.exports의 축약형이 아닌, 새로운 exports가 된다.

```jsx
//⭕내보내기 가능 : exports 객체에 각각 key-value 할당 가능
exports = PI = PI;
exports = addNumbers = addNumbers ;

//❌내보내기 불가능 : exports객체를 새로운 객체로 덮어쓰기 때문에 module의 exports가 아니게됨.
exports = { PI, addNumbers	}

```

그렇다면, require함수로 어떻게 모듈을 리턴하는 것일까?

사실 더 복잡한 단계가 있겠지만 간단한 원리는 이렇게 된다.

(출처 : [https://medium.com/@chullino/require-exports-module-exports-공식문서로-이해하기-1d024ec5aca3](https://medium.com/@chullino/require-exports-module-exports-%EA%B3%B5%EC%8B%9D%EB%AC%B8%EC%84%9C%EB%A1%9C-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-1d024ec5aca3))

```jsx
var require = function(src){                 //line 1
    var fileAsStr = readFile(src)            //line 2
    var module.exports = {}                  //line 3
    eval(fileAsStr)                          //line 4
    return module.exports                    //line 5
}

//line4는 그 파일의 코드를 실행하는 구문이다. 코드가 삽입된다는 개념으로 생각하면 쉽다.
```

- 참고
    - https://nodejs.org/api/modules.html
    - https://nodejs.sideeffect.kr/docs/v0.10.7/api/modules.html#modules_file_modules
    - https://ko.javascript.info/modules-intro

- require() 사용하여 모듈을 호출할 경우, 글로벌에 cache된다?
- 그래서 require전에 선언한 변수도, require로 불러오는 모듈 내부에서 그 변수를 사용 가능하다.

---

### **ES6**

- 내보내기 - `export` 사용

```jsx
const numberOfStickers = 11;
export default numberOfStickers;(대표 지정)

//또는
export const numberOfStickers = 11;
//import numberOfStickers from './utils';
//가져올 때는 from파일에서 해당되는 이름을 가져옴.

//또는 (이러면 아래의 named방식으로 import함)
export { randomIntFromRange, distance, collide, intersect, createImgAsync }
//import * as utils from './utils';
//사용할 때 utils.randomIntFromRange();

//또는 (이러면 이걸 객체로 import해서 그냥 별칭하나로 사용할 수 있음.
export default { randomIntFromRange, distance, collide, intersect, createImgAsync }
//import utils from './index.js';
//사용할 때 utils.randomIntFromRange();
```

- 가져오기 - `import 모듈명 from 경로` 사용

```jsx
import * as utils from './utils';
//또는
import numberOfStickers from './utils';
//또는 아래와 같이 **named import방식 사용.**
import {randomIntFromRange, distance, collide, intersect, createImgAsync} from './utils';
```

- 여기서..  * as utils 와 같이, 모든 export한 값들을 utils라는 객체의 속성으로 받아오려면,,
    - ex) `**utils.randomIntFromRange()**`
- tsconfig.json에서 "esModuleInterop”을 true로 해주어야한다.

```jsx
/* Emit additional JavaScript to ease support 
for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' 
for type compatibility. */

"esModuleInterop": true
```

- 하지만 왠만하면 default는 쓰지 않는 것이 좋다.
- import하는 곳에서 어떤것을 받아와야할지 정확한 정보가 없기때문이다.
- 1번처럼 named방식으로 import할 수 있도록, 각각의 함수나 변수를 객체에 묶어서, 혹은 각각 따로 export해주는 것이 좋다.
- 자세한 내용은 링크 참고
    - https://velog.io/@eunbinn/default-exports-in-javascript-modules-are-terrible

---

### Node.js에서 ESM(ES Module) 방식을 사용하는 두 가지 방법

*(출처 : [https://ui.toast.com/weekly-pick/ko_20190805#es-모듈을-사용하여-nodejs-실행](https://ui.toast.com/weekly-pick/ko_20190805#es-%EB%AA%A8%EB%93%88%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%98%EC%97%AC-nodejs-%EC%8B%A4%ED%96%89))*

1. `-experimental-modules` 플래그 사용 : 노드에서 제공하는 최소 기능이다.
2. 라이브러리 사용 : [@std/esm](https://github.com/standard-things/esm) 패키지를 사용
    - [esm](https://github.com/standard-things/esm)은 전체 프로세스를 단순화하고 한 곳에서 구현의 모든 주요 부분을 번들링한다.

**🧡 [@std/esm](https://github.com/standard-things/esm) 패키지 설치 방법** 

- esm모듈을 설치해야함.
    - `npm install esm`
- 그러면 node_modules폴더와 package.json파일이 생성됨
- 그 후에 esm방식으로 import/export 사용 가능

---

- 참고
    
    https://yceffort.kr/2020/08/commonjs-esmodules
    
    1. ESM에서는 **`require()`**를 사용할 수는 없다. 오로지 **`import`**만 가능하다.
    2. CJS도 마찬가지로 **`import`**를 사용할 수는 없다.
    3. ESM에서 CJS를 **`import`**하여 사용할 수 있다. 그러나 오로지 default import만 가능하다. **`import _ from 'lodash'`** 그러나 CJS가 named export를 사용하고 있다면 named import **`import { shuffle } from 'lodash`**와 같은 것은 불가능하다.
    4. ESM을 CJS에서 **`require()`**로 가져올 수는 있다. 그러나 이는 별로 권장되지 않는다. 그 이유는 이를 사용하기 위해서는 더 많은 boilerplate가 필요하고, 최악의 경우 Webpack이나 Rollup 같은 번들러도 필요 하다. 그 이유는, ESM가 **`require()`**에서 어떻게 동작해야 하는지 모르기 때문이다.
    5. CJS는 기본값으로 지정되어 있다. 따라서 ESM 모드를 사용하기 위해서는 opt-in해야 한다. **`.js`**를 **`.mjs`**로 바꾸거나, **`package.json`**에 **`"type": "module"`** 옵션을 넣는 방법이 있다. (기존에 CJS를 쓰던 것은 **`.cjs`**로 바꾸면 된다.)
    6. 
    
    ---
    

## CommonJS와 ESM 방식의 차이가 발생한 이유 - history

출처 : [https://velog.io/@eunbinn/commonjs-is-hurting-javascript](https://velog.io/@eunbinn/commonjs-is-hurting-javascript?utm_source=substack&utm_medium=email)

### Common JS의 역사

- 자바스크립트가 서버에서도 사용되기 시작
- 프로젝트의 규모가 커지면서 모듈의 필요성이 커짐
- 서버사이드 자바스크립트에서의 모듈의 필요성이 제기됨(2009년)
- common JS가 생겨남
    - module.exports, require()를 사용하는 방식은 기존 자바스크립트와 형태가 다름(?)
    - 의도적으로 그렇게 만든 것.
    
    > 서버 사이드 코드에서 필요한 것은 클라이언트 사이드 코드에서 필요한 것과 다르기 때문에 Dojo나 jQuery보다는 Python과 Ruby를 참고하여 설계해야한다고 생각합니다.
    > 
    
- Node.js 외 초기의 server-side JS runtime에서 CommonJS를 채택함.
- Node.js가 메인으로 자리잡으면서 CommonJS가 표준화 되지 못함.(주로 Node.js만 사용하기 때문에 통일할 필요가 없어짐)

### CommonJS의 문제

- 모듈 로딩이 동기로 진행된다.
    - 호출되는 순서대로 로드되고 실행된다.
- 트리셰이킹이 어렵다.
    - 그러므로 사용하지 않는 모듈을 제거하고 번들 크기를 최소화 하기 어렵다.
    - 동적으로 호출하기 때문에 언제 어디서 사용할지 몰라서 사용되지 않는 export를 제거하기 어렵다.
    - 이에 반해 import/export 방식은 정적으로 분석이 가능하기 때문에 (정적로딩?) 번들러가 코드를 분석하여 사용하지 않는 export는 제거한다.
    
    - **[Linking] 정적 링킹과 동적 링킹의 차이(**https://live-everyday.tistory.com/69**)**
- 브라우저 기반이 아님.
    - 애초에 서버사이드 용으로 만들어진 것이기 때문에 클라이언트 자바스크립트에서 동작하려면 번들러와 트랜스파일러가 필요함.
    - 따라서 빌드 시간이 길어지거나 클라이언트와 서버의 코드를 구분해서 작성해야함.

- 2013년에 CommonJS그룹이 해체되기 시작. 이후 이 모듈의 후속작이 ECMAScript가 됨.

### ECMAScript의 등장

- 위에서 CJS에 없던 기능을 포함함
- 모듈의 비동기 로딩, 정적 분석, 트리쉐이킹, 브라우저와의 호환성
- 모듈의 로딩 시스템이 언어에 내장되어있으므로, 번들러가 필요없다? 아니… es5는 몰라도 es6는 필요해. 이건 언어 바벨링의 문제?
- 2018년 거의 모든 브라우저에서 ESM을 지원하게됨.
- ESM은 WebAssembly도 지원함.
- ESM은 정적(static)이다.
    - 즉, 런타임이 아닌 컴파일 타임에만 이동이 가능하다.
    - 그렇기에 파일의 가장 상단에서 import로 모듈을 불러와야 한다.
        - 위의 이유로 모듈을 사용하는 부분이 import구문보다 위에 있으면 에러가 발생함.

### CJS와 ESM의 충돌 문제 발생

- Node.js에서 CJS와 ESM을 모두 지원하게 됨
- 이미 CJS가 Node에 너무 깊이 영향을 미쳐서 폐지시킬 수 없음.
- 그러한 이유로 패키지를 만드는 개발자가 패키지를 만들 때 CJS와 ESM을 모두 지원해야함.
    - 업데이트 하면서 CJS를 지원하지 않는 패키지도 있음(모듈 export방식)

### 💔**두 모듈 방식이 충돌하는 이유**💔

- CJS는 동기식으로 로드되고,
- ESM은 비동기식으로 로드되기 때문이다.
- 따라서 모듈을 불러오는 영역에서 모듈의 타입에 따라 import하는 방식을 다르게 해야한다.
- 게다가 모듈을 불러오는 곳에서도 cjs, mjs등으로 모듈에 따른 확장자를 써주어야한다.
- esm으로 {type:module}로 설정한 프로젝트 에서 cjs 형태로 만들어진 모듈을 불러올 때에는 동적 import를 해야한다.
- **`정적으로 로드`** : import 모듈명 from 경로명
- **`동적으로 로드`** : import(’경로’).then(res ⇒ { … }); 또는 async()⇒{await import()}
- 정리된 페이지 : [모듈이 버전업 되면서 cjs/esm방식의 충돌 이슈](https://www.notion.so/cjs-esm-1dca2a4f8b644325bf367a8fe260adda?pvs=21)

> 다른 모듈 작성자는 [dnt](https://github.com/denoland/dnt)를 사용해서 [CommonJS 및 ESM을 성공적으로 지원했습니다](https://frontside.com/blog/2023-04-27-deno-is-the-easiest-way-to-author-npm-packages/). TypeScript로 모듈을 작성하면 이 빌드 도구가 Node.js로 변환하고 ESM/CommonJS/TypeScript 선언 파일과 `package.json`을 생성합니다.
> 
> 
> 2023년에 CommonJS의 지원을 무시하기엔 너무 큰 문제가 된 것이 분명합니다. 이제 CommonJS는 묻어버리고 모두 ESM으로 전환해야 할 때입니다.
> 
> 하지만 ESM이 표준이 되고 엣지, 브라우저, 서버리스 컴퓨팅과 같은 클라우드 기본 요소로 초점이 옮겨가면서 CommonJS는 더 이상 적합하지 않게 되었습니다. ESM은 브라우저 호환 코드를 작성할 수 있기 때문에 개발자에게는 더 나은 솔루션이며, 사용자에게는 더 나은 경험을 제공할 수 있습니다.
> 

### ⭐결론 : 서로 타입이 다른 모듈을 불러오는 방식⭐

- **cjs파일에서 cjs모듈을 불러올 때**
    - 똑같이 require를 사용하면 됨.
- **cjs파일에서 mjs모듈을 불러올 때**
    - require로 불러오지 못함. 대신 **동적 import**를 써야함.
- **mjs파일에서 cjs모듈을 불러올 때**
    - module.exports로 내보내기 된 cjs모듈은 mjs모듈과 마찬가지로 import 구문으로 가져올 수 있음.

***(예제 코드)***

- ***c_mart.cjs*** (CommonJS 모듈)

```jsx
const priceArr = {
    'milk' : 1800,
    'banana' : 4000,
    'melon' : 5000
};

const getPriceFromC = item => {
    return `${item} : ${priceArr[item]}`;
}

module.exports = {getPriceFromC};
```

- ***m_mart.mjs*** (ESM 모듈)

```jsx
const priceArr = {
    'milk' : 1950,
    'banana' : 4500,
    'melon' : 5500
};

const getPriceFromM = item => {
    return `${item} : ${priceArr[item]}`;
}

export {getPriceFromM}
```

- ***customer.cjs*** (패키지 `"type": "commonjs”`)

```jsx
**//cjs모듈을 불러올 때 - require사용**

const { getPriceFromC } = require('./c_mart.cjs');
const mart_C = getPriceFromC('milk');
console.log('mart_C =>',mart_C);

**//⭐esm모듈을 불러올 때 - 동적 import사용⭐**
const getPriceFromM = async(item) => {
    return await import('./m_mart.mjs').then(res=>{
        return res.getPriceFromM(item);   
    });
}

const mart_M = async () => {console.log('mart_M => ',await getPriceFromM('milk'))};

**mart_M();**
```

- ***customer.mjs*** (패키지 `"type": "module”`)