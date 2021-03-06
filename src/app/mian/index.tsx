import React, { useState } from 'react'
import { Layout, Menu, Row, Col } from 'antd'
import ShopList from '../components/shopList'
import FeedDetailList from '../components/feedDetailList'
import BottomDetailList from '../components/bottomDetailList'
import HeadDetailList from '../components/headDetailList'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons'

const { Sider, Content } = Layout

const main: React.FC<any> = () => {
  const [collapsed, setCollapsed] = useState(false)
  const toggle = () => setCollapsed((e) => !e)
  return (
    <Layout style={{ height: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          style: {
            position: 'relative',
            left: collapsed ? '80px' : '200px',
          },
          className: 'trigger',
          onClick: toggle,
        })}
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            基础
          </Menu.Item>
          <Menu.Item key="2" icon={<VideoCameraOutlined />}>
            高级
          </Menu.Item>
          <Menu.Item key="3" icon={<UploadOutlined />}>
            设置
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          <HeadDetailList></HeadDetailList>
          <Row style={{ width: '100%', height: '76%' }} className={'main-warp'}>
            <Col className={'item-warp'} span={11}>
              <ShopList></ShopList>
            </Col>
            <Col span={2} />
            <Col className={'item-warp'} span={11}>
              <FeedDetailList></FeedDetailList>
            </Col>
          </Row>
          <BottomDetailList></BottomDetailList>
        </Content>
      </Layout>
    </Layout>
  )
}

export default main
