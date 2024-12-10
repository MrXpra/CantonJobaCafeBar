import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MenuList from '../components/menu/MenuList';
import MenuItemForm from '../components/menu/MenuItemForm';
import CategoryManager from '../components/menu/CategoryManager';

function Menu() {
  return (
    <Routes>
      <Route index element={<MenuList />} />
      <Route path="new" element={<MenuItemForm />} />
      <Route path="edit/:id" element={<MenuItemForm />} />
      <Route path="categories" element={<CategoryManager />} />
    </Routes>
  );
}

export default Menu;