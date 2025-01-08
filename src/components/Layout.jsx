import { useState } from 'react'
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Breadcrumb, Layout, Menu, theme } from 'antd'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router'
import AddProducts from './AddProducts'
import Dashboard from './Dashboard'
import BooksTable from './AllProducts'
import AddCategory from './AddCategory'
import AllCategories from './AllCategories'

const { Header, Content, Footer, Sider } = Layout

const getItem = (label, key, icon, children, path) => ({
  key,
  icon,
  children,
  label: path ? <Link to={path}>{label}</Link> : label
})

// Fetch all products

const Breadcrumbitems = [
  {
    label: 'Home',
    key: 'home'
  },
  {
    label: 'First Level',
    key: 'first'
  },
  {
    label: 'Second Level',
    key: 'second'
  }
]

const items = [
  getItem('Dashboard', '1', <PieChartOutlined />, null, '/'),
  getItem('Products', 'SUB11', <DesktopOutlined />, [
    getItem('All Product', '2', <DesktopOutlined />, null, '/all-products'),
    getItem('Add Product', '3', <DesktopOutlined />, null, '/add-product'),
    getItem('Add Category', '444', <DesktopOutlined />, null, '/Add-category'),
    getItem('All Categories', '4', <DesktopOutlined />, null, '/all-categories')
  ]),
  getItem('Orders', '33', <DesktopOutlined />),
  getItem('Analytics', '44', <DesktopOutlined />),
  getItem('Inventory', '55', <DesktopOutlined />),
  getItem('Marketing', '66', <DesktopOutlined />),
  getItem('Shipping', '77', <DesktopOutlined />),
  getItem('Customer Support', '88', <DesktopOutlined />),
  getItem('Settings', '99', <DesktopOutlined />),
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('Tom', '14'),
    getItem('Bill', '15'),
    getItem('Alex', '16')
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [
    getItem('Team 1', '17'),
    getItem('Team 2', '18')
  ]),
  getItem('Files', '19', <FileOutlined />)
]

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={value => setCollapsed(value)}
          style={{
            position: 'fixed',
            height: '100vh',
            overflow: 'hidden',
            left: 0,
            top: 0,
            zIndex: 10
          }}
        >
          <div className='demo-logo-vertical' />
          <h1 className='text-white text-xl w-full text-center py-2'>
            BOOKSHOP.com
          </h1>
          <Menu
            theme='dark'
            defaultSelectedKeys={['1']}
            mode='inline'
            items={items}
          />
        </Sider>
        <Layout
          style={{
            marginLeft: collapsed ? 80 : 200,
            transition: 'margin-left 0.2s'
          }}
        >
          <Header style={{ padding: 0, background: colorBgContainer }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb items={Breadcrumbitems} />
            <div
              style={{
                marginTop: 16,
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG
              }}
            >
              <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path='/all-products' element={<BooksTable />} />
                <Route path='/add-product' element={<AddProducts />} />
                <Route path='/add-category' element={<AddCategory />} />
                <Route path='/all-categories' element={<AllCategories />} />
              </Routes>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Bipul & Ant Design ©{new Date().getFullYear()} Created by Ant UED
          </Footer>
        </Layout>
      </Layout>{' '}
    </Router>
  )
}

export default MainLayout
