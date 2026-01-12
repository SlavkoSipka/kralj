import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import ProductPage from './pages/ProductPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPanel from './pages/AdminPanel';
import VendorManagement from './pages/VendorManagement';
import ManufacturerManagement from './pages/ManufacturerManagement';
import CategoryManagement from './pages/CategoryManagement';
import GenericManagement from './pages/GenericManagement';
import ProductManagement from './pages/ProductManagement';
import ProductVariantsManagement from './pages/ProductVariantsManagement';
import VendorExcelImport from './pages/VendorExcelImport';
import ManufacturerExcelImport from './pages/ManufacturerExcelImport';
import ProductExcelImport from './pages/ProductExcelImport';
import ProductVariantsExcelImport from './pages/ProductVariantsExcelImport';
import AlgoliaSyncGenerics from './pages/AlgoliaSyncGenerics';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rezultati" element={<ResultsPage />} />
        <Route path="/proizvod/:id" element={<ProductPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/vendors" element={<VendorManagement />} />
        <Route path="/admin/manufacturers" element={<ManufacturerManagement />} />
        <Route path="/admin/categories" element={<CategoryManagement />} />
        <Route path="/admin/generics" element={<GenericManagement />} />
        <Route path="/admin/products" element={<ProductManagement />} />
        <Route path="/admin/products/:productId/variants" element={<ProductVariantsManagement />} />
        <Route path="/admin/excel/vendors" element={<VendorExcelImport />} />
        <Route path="/admin/excel/manufacturers" element={<ManufacturerExcelImport />} />
        <Route path="/admin/excel/products" element={<ProductExcelImport />} />
        <Route path="/admin/excel/product-variants" element={<ProductVariantsExcelImport />} />
        <Route path="/admin/algolia/sync-generics" element={<AlgoliaSyncGenerics />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
