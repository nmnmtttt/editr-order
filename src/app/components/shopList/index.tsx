import { Input, PageHeader, Avatar, Upload } from 'antd'
import React, { Fragment, useEffect, useState } from 'react'
import { getShopList, changeShopPage } from '../../store/shopList';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

enum EditType {
  PRICE = 'price',
  IMG = 'img',
}

const shopList: React.FC<any> = () => {
  const [shopList, setShopList] = useState([])

  useEffect(() => {
    getShopList(setShopList)
  }, [])
  const changeShop = (inputEve, index) => {
    setShopList((e) => {
      const arr = [...e]
      arr[index].value = inputEve.target.value
      return arr
    })
  }
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const toBase64 = (file: File) => new Promise((res) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      res(reader.result)
    };
  })

  const deleteImg = (index) => {
    setShopList((e) => {
      const arr = [...e]
      arr[index].src = ''
      return arr
    })
    changeShopPage(index, '', EditType.IMG)
  }
  const handleFileChange = async (target, index) => {
    const file = await toBase64(target.file.originFileObj)
    setShopList((e) => {
      const arr = [...e]
      toBase64(target.file).then()
      arr[index].src = file
      return arr
    })
    changeShopPage(index, file, EditType.IMG)
  }

  return (
    <Fragment>
      <PageHeader className="site-page-header" title="商品列表" subTitle="列表中的商品" />
      <div style={{ height: '90%', overflow: 'auto' }}>
        {shopList?.map((_, index) => (
          <div className='shopItem' key={index.toString(36)}>
            {_.src ? <div style={{ position: 'relative' }}>
              <DeleteOutlined
                onClick={() => deleteImg(index)}
                style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  zIndex: 2,
                  left: '45%',
                  top: '45%',
                  color: '#fff',
                }} />
              <Avatar style={{ width: '104px', height: '104px' }} shape="square" size="small" src={_.src} /></div> : <Upload
                maxCount={1}
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                onChange={(e) => handleFileChange(e, index)}
              >
              {uploadButton}
            </Upload>}
            <em style={{ width: '60%' }}>{_.title}</em>
            < Input
              key={index.toString(36)}
              value={_.value}
              onChange={(e) => {
                changeShop(e, index)
              }}
              onBlur={(e) => {
                changeShopPage(index, shopList[index].value, EditType.PRICE)
              }} />

          </div>

        ))
        }
      </div>
    </Fragment >
  )
}

export default shopList
