import { Table, Button, Space, message, Input } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  openEditModal,
  userDeleted,
  fetchUser,
  setSearchText,
  selectFilteredUsers,
  selectAllUsers,
} from "../userSlice";
import { useEffect, useCallback } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "../appTable/appTable.scss";
import { useHttp } from "../hook/useHook";

const AppTable = () => {
  const dispatch = useDispatch();
  const dataUsers = useSelector(selectAllUsers); //выбираем из state всех пользователей
  const dataFiltredUsers = useSelector(selectFilteredUsers); //уже отфильтрованные пользователи
  const searchText = useSelector((state) => state.user.searchText);

  useEffect(() => {
    dispatch(fetchUser()); // Загружаем данные при монтировании
  }, []);

  const { request } = useHttp();

  const handleDelete = useCallback(
    async (id) => {
      try {
        await request(`http://localhost:3001/test/${id}`, "DELETE")
          .then(() => dispatch(userDeleted(id)))
          .catch((err) => console.log(err));
      } catch (err) {
        console.error("Ошибка при удалении:", err);
        message.error("Не удалось удалить пользователя");
      }
    },
    [request],
  );

  const handleEdit = async (user) => {
    dispatch(openEditModal(user));
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      filters: Array.from(new Set(dataUsers.map((item) => item.name))).map(
        (name) => ({
          text: name,
          value: name,
        }),
      ),

      onFilter: (value, record) => record.name.includes(value),
      filterSearch: true,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      filterSearch: true,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      sorter: (a, b) => a.age - b.age,
      filterSearch: true,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            type="dashed"
            size="small"
            onClick={() => handleEdit(record)}
          >
            Редактировать
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            size="small"
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
      align: "center",
    },
  ];

  return (
    <>
      <Input
        placeholder="Введите текст для фильтрации"
        className="app__input"
        value={searchText}
        onChange={(e) => dispatch(setSearchText(e.target.value))}
        allowClear
      />
      <Table dataSource={dataFiltredUsers} columns={columns} rowKey="id" />
    </>
  );
};

export default AppTable;
