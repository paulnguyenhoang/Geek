import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import AlbumList from "../pages/AlbumList";
import AlbumDetail from "../pages/AlbumDetail";
import UserList from "../pages/UserList";
import UserDetail from "../pages/UserDetail";

export default function AppRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<AlbumList />} />
        <Route path="/albums" element={<AlbumList />} />
        <Route path="/albums/:id" element={<AlbumDetail />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id" element={<UserDetail />} />
      </Routes>
    </MainLayout>
  );
}
