// redux核心store
import {createStore,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import reducer from './reducer'
// 向外暴露store   异步的话需要applyMiddleware 和thunk\
// 开发工具 还需要composeWtihDevTools
export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)) )
// export default createStore(reducer, applyMiddleware(thunk) )