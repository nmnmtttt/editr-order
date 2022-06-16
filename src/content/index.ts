import { forMatPrice } from './../utils/priceEdit'
import { cloneDeep } from 'lodash'
import { chooseElemetAfterIndex } from './../utils/arrDo'
import { ActionType, EditType } from './../actionType/PopupToConTent'

// 商品类型query
const ITEMQUERY = {
  price: '.order-product-price span span', //商品价格query
  img: '.order-product-item-img img', // 商品图片query
  title: '.order-product-item-detail li .order-product-item-title-wrap a',
  detialUl: '.order-product-item-detail', // 商品详情ul
  orderDetail: '.merge-order-title', //商品详情标题头
  productItem: '.order-product-item', //商品详情本体
}

//费用明细query
const FEEQUERY = {
  side: '.order-fee-group.right-border',
  feeItem: '.order-fee-item',
  head: '.merge-order-title',
  bottom: '.order-fee-total',
}
//冒号分隔符
const SPLITSIGN = '：'
// 编辑冒号之后INNERTEXT
const editTextAfterSign = (el, value) =>
  (el as any).innerText
    .split(SPLITSIGN)
    .map((_, index) => {
      if (index) return value
      return _
    })
    .join(SPLITSIGN)

// 联合商品
const unionProduct = () => {
  //ulClone
  const ulClone = cloneDeep(chooseElemetAfterIndex(document.querySelectorAll(ITEMQUERY.detialUl)))

  //商品标题
  //要删除的
  const deleteOrderDetails = Array.from(document.querySelectorAll(ITEMQUERY.orderDetail))
  //要编辑的
  const editOrderDetails = deleteOrderDetails.shift()

  //商品项
  //要删除的
  const deleteProductItems = Array.from(document.querySelectorAll(ITEMQUERY.productItem))
  //要编辑的
  const editProductItems = deleteProductItems.shift()

  //移除所有的其他元素
  while (deleteOrderDetails.length) deleteOrderDetails.pop().remove()
  while (deleteProductItems.length) deleteProductItems.pop().remove()

  ulClone.map((_) => editProductItems.insertBefore(_, Array.from(editProductItems.children).slice(-1)[0]))
}

// 联合价格表
const feeDetail = () => {
  const AllFee = Array.from(document.querySelector(FEEQUERY.side).querySelectorAll(FEEQUERY.feeItem))
  const deleteFee = AllFee.slice(AllFee.findIndex((_) => _.nextElementSibling.className.includes('space10')) + 1)
  deleteFee.map((_) => _.remove())
}

unionProduct()
feeDetail()

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type as ActionType) {
    case ActionType.EDIT:
      const { data } = request
      const { type, index, value } = data
      switch (type as EditType) {
        case EditType.IMG:
          document.querySelectorAll(ITEMQUERY[type])[index].src = value
          break
        case EditType.PRICE:
          document.querySelectorAll(ITEMQUERY[type])[index].innerText = forMatPrice(value)
          break
        case EditType.FEE:
          document
            .querySelectorAll(`${FEEQUERY.side} ${FEEQUERY.feeItem}`)
            [index].querySelectorAll('span')[1].innerText = value
          break
        case EditType.TITLE:
          {
            const el = document.querySelector(FEEQUERY.head).children[index]
            if (el.children.length) (el.children[0] as any).innerText = value
            else (el as any).innerText = editTextAfterSign(el, value)
          }
          break
        case EditType.BOTTOM:
          {
            const el = document.querySelector(FEEQUERY.bottom)
            if (el.children) (el.children[0] as any).innerText = value
          }
          break
        case EditType.DELETE:
          {
            // 移除对应的data
            document.querySelectorAll(ITEMQUERY.detialUl)[index].remove()
          }
          break
        default:
          break
      }
    case ActionType.GET: {
      const titles = Array.from(document.querySelectorAll(ITEMQUERY.title))
      const prices = Array.from(document.querySelectorAll(ITEMQUERY.price)).reduce(
        (pre, cur, index) => [...pre, { title: (titles[index] as any).innerText, value: (cur as any).innerText }],
        []
      )
      //商品列表
      const imgs = Array.from(document.querySelectorAll(ITEMQUERY.img)).reduce(
        (pre, cur, index) => [...pre, { ...prices[index], src: (cur as any).getAttribute('src') }],
        []
      )

      //商品订单详情
      const feedDetails = Array.from(document.querySelectorAll(`${FEEQUERY.side} ${FEEQUERY.feeItem}`)).map(
        (_, index) => {
          const childSpan = _.querySelectorAll('span')
          return { title: childSpan[0].innerText, value: childSpan[1].innerText }
        }
      )

      //订单头部信息
      const headDetails = Array.from(document.querySelector(FEEQUERY.head).children).map((_: any) => {
        const content = _.innerText?.split(SPLITSIGN)
        return { title: content[0], value: content[1] }
      })

      //订单底部信息
      const bottomDetails = Array.from(document.querySelectorAll(FEEQUERY.bottom)).map((_: any) => {
        const content = _.innerText?.split(SPLITSIGN)
        return { title: content[0], value: content[1] }
      })

      sendResponse({ shopInfos: imgs, feedDetails, headDetails, bottomDetails })
      break
    }
    case ActionType.UNION: {
      unionProduct()
      feeDetail()
      break
    }
    default:
      break
  }
  return true
})
