// 一、复习-浏览器渲染
// 1、解析HTML，生成DOM树，解析CSS，生成cssom树
// 2、将DOM树和CSSOM树结合，生成render树，dis:none,不会在render上，
// 3、回流（layout），根据render树，计算节点的几何信息（位置，大小）
// 4、重绘（painting），根据render树和回流得到的几何信息，计算节点的绝对像素
// 5、输出（display），将像素发送GPU进行渲染

// 减少回流和重绘
// 1、复杂的动画效果，使用绝对定位脱离文档流
// 2、使用css3触发硬件加速，常用：transfrom,opacity,filters

// 二、瀑布流布局-贪心算法
// 即：在每装一个图片前都对比一下左右数组的高度和，往高度较小的那个数组里去放入下一项。
// 1、把所有图片预加载以后获取对应的高度，放到一个数组里返回
// 2、把图片按照 宽高比 和屏幕宽度的一半进行相乘，得到缩放后适配屏宽的图片高度
let loadImgHeights = (imgs) => {
    return new Promise((resolve, reject) => {
      const length = imgs.length
      const heights = []
      let count = 0
      const load = (index) => {
        let img = new Image()
        const checkIfFinished = () => {
          count++
          if (count === length) {
            resolve(heights)
          }
        }
        img.onload = () => {
          const ratio = img.height / img.width
          const halfHeight = ratio * halfInnerWidth
          // 高度按屏幕一半的比例来计算
          heights[index] = halfHeight
          checkIfFinished()
        }
        img.onerror = () => {
          heights[index] = 0
          checkIfFinished()
        }
        img.src = imgs[index]
      }
      imgs.forEach((img, index) => load(index))
    })
  }

//   贪心算法实现
let greedy = (heights) => {
    let mid = Math.round(sum(heights) / 2)
    let total = 0
    let leftHeights = []
    let rightHeights = []
    let left = []
    let right = []
  
    heights.forEach((height, index) => {
      if (sum(leftHeights) > sum(rightHeights)) {
        right.push(index)
        rightHeights.push(height)
      } else {
        left.push(index)
        leftHeights.push(height)
      }
      total += height
    })
  
    return { left, right }
  }

/* <div class="wrap" v-if="imgsLoaded">
  <div class="half">
    <img
      class="img"
      v-for="leftIndex in leftImgIndexes"
      :src="imgs[leftIndex]"
      :style="{ width: '100%', height: imgHeights[leftIndex] + 'px' }"
    />
  </div>
  <div class="half">
    <img
      class="img"
      v-for="rightIndex in rightImgIndexes"
      :src="imgs[rightIndex]"
      :style="{ width: '100%', height: imgHeights[rightIndex] + 'px' }"
    />
  </div>
</div> */
