// 生成[n,m]范围内的随机整数
const getRandomByRange = (n, m, randArr) => {
  function random() {
    const number1 = Math.random() * (m - n + 1);
    const number2 = Math.floor(number1);

    return number2 + n;
  }

  let rand = random();

  const tFlag = randArr.filter(item => {
    if (item === rand) {
      return false;
    }
    if (item > rand + 20 || item < rand - 20) {
      return true;
    } else {
      return false;
    }
  });

  while (tFlag.length > 1) {
    rand = random();
  }

  return rand;
};

// 列数
export const cols = 2;
// 槽宽，横向、纵向一致
export const gutter = 10;
// 瀑布流容器高宽
export const viewWidth = window.innerWidth - 24;
export const viewHeight = window.innerHeight - 48;
// 子项的扩展内容高度
export const addHeight = 32;
// 子项最大高度（包括addHeight）
export const maxHeight = 500;
// 懒加载属性集合
export const lazyLoadProps = {
  // 提前加载偏移（相对于图片容器顶部）
  // offset: 200,
  once: true,
  throttle: true,
  scroll: false
  // 占位图
  // placeholder: <img src="" alt="" />,
};

// 请求总数
export const reqCount = 30;
// 请求图片宽度
export const reqWidth = Math.ceil(viewWidth / cols);
// 请求图片最小高度
export const reqMinHeight = 200;
// 请求图片最大高度
export const reqMaxHeight = maxHeight;

export const getElements = (args = {}) => {
  const tDefault = {
    num: reqCount,
    minHeight: reqMinHeight,
    maxHeight: reqMaxHeight,
    start: 0,
    ...args
  };
  const { num, minHeight, maxHeight, start } = tDefault;
  const result = [];
  const reqHeights = [];

  for (let i = 0; i < num; i++) {
    const reqHeight = getRandomByRange(minHeight, maxHeight, reqHeights);

    result.push({
      id: `m-${i + 1 + start}`,
      src: `https://i.picsum.photos/id/${i + 1}/${reqWidth}/${reqHeight}.jpg`,
      // src: `https://picsum.photos/${reqWidth}/${reqHeight}?image=${i + 1}`,
      width: reqWidth,
      height: reqHeight,
      title: `[${i + 1 + start}] 我是标题我是标题我是标题我是标题我是标题`
    });
  }

  return result;
};
