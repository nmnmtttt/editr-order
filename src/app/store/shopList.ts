import { atom, useRecoilState, useSetRecoilState } from 'recoil'

/** 页面上的订单 */
const _shopList = atom({
  key: 'shopList',
  default: [],
})

const shopListStore = () => {
  const [shopList, setShopList] = useRecoilState(_shopList)

  return {
    shopList,
    setShopList,
  }
}

export { shopListStore }
