import BatchedBridge from 'react-native/Libraries/BatchedBridge/BatchedBridge'
import UIManager from 'react-native/Libraries/ReactNative/UIManager'

// 图片监控依赖四部分能力: 图片创建感知，获取属性 (如 uri, width, height); 图片加载过程、成功、失败回调; 图片节点可见性检测(获取节点位置); 图片缓存有效性
// 图片缓存有效性 正常使用 Image.queryCache API 即可

// @ts-ignore
const originCreateView = UIManager.createView

// APM 当前上报内容
// {
//   imageUrl: "",
//   imageHost: "",
//   intersectTime: viewable ? Date.now() : 0,
//   imageSize: 0,
//   isFirstScreen: "false",
//   isPrefetch: "",
//   isSuccess: "false",
//   errorReason: "",
//   loadedStartTime: 0,
//   loadedTime: 0,
//   loadDuration: 0,
//   viewDuration: 0,
// }
console.log('patch PaperUIManager', originCreateView)

const watchedImages = new Map<number, string>()

// 图片创建感知：拦截 createView 事件获取所有图片节点的属性并且强制其接受 loadEvent 回调
// @ts-ignore
UIManager.createView = function createView(reactTag: number, viewName: string, rootTag: string, props: object) {
  if (viewName === 'RCTImageView') {
    console.log('createView', reactTag, props)
    // @ts-ignore
    // 不借助 onLayout，采用 load 完成时触发 measureLayout 的方案，参考下方 receiveEvent 实现
    // props.onLayout = true
    // @ts-ignore
    props.shouldNotifyLoadEvents = true
    watchedImages.set(reactTag, props.src?.[0]?.uri)
  }
  originCreateView(reactTag, viewName, rootTag, props)
}

// const eventEmitter = BatchedBridge.getCallableModule('RCTEventEmitter')
// console.log('eventEmitter', eventEmitter)

const originRegisterCallableModule = BatchedBridge.registerCallableModule.bind(BatchedBridge)

// Hint: object can be modified after passed
// 两个拦截路径：一个是在注册模块之前拦截模块注册，一个是注册之后覆写方法，后者已经在滑动的监控中使用到：https://code.devops.xiaohongshu.com/fe/infra/asgard-plugin-eaglet/-/blob/master/src/collector/pageFluency.ts#L120
BatchedBridge.registerCallableModule = function registerCallableModule(name: string, module: object) {
  if (name === 'RCTEventEmitter') {
    console.log('patch RCTEventEmitter')
    const originalReceiveEvent = module.receiveEvent
    module.receiveEvent = function receiveEvent(rootNodeID, topLevelType, nativeEventParam) {
      if (!topLevelType.startsWith('topScroll') && topLevelType !== 'topLayout') {
        console.log('receiveEvent: ', rootNodeID, topLevelType, nativeEventParam)
      }
      // 加载成功且为图片节点
      // 加载失败时 topLevelType 为 topError
      if (topLevelType === 'topLoadEnd' && watchedImages.has(rootNodeID)) {
        // 图片节点可见性检测
        UIManager.measureInWindow(rootNodeID, (left: number, top: number, width: number, height: number) => {
          console.log('loadSuccess: ', rootNodeID, 'left: ', left, 'top: ', top, 'width: ', width, 'height: ', height)
        })
      }
      originalReceiveEvent(rootNodeID, topLevelType, nativeEventParam)
    }
  }
  originRegisterCallableModule(name, module)
}

// Consider updateView when source updated
