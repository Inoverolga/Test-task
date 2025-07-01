import { Table, Button, Space, message, Input } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  openEditModal,
  userDeleted,
  fetchUser,
  setSearchText,
  selectFilteredUsers,
  selectAllUsers,
} from "../appForm/userSlice";
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

  //console.log(dataUsers); // Проверьте данные в консоли
  //[ вернет массив со всеми пользователями
  //   { id: 1, name: "John", age: 25 },
  //   { id: 2, name: "Alice", age: 30 }
  //]

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
      //filters: Array.from(new Set(dataUsers.map((item) => item.name))).map(
      //   (name) => ({
      //     text: name,  // Отображаемый текст в фильтре
      //     value: name, // Значение для фильтрации
      //   })
      // )
      // dataUsers.map((item) => item.name)

      // Преобразуем массив объектов в массив имен:
      // ['John', 'Alice', 'Bob', 'John'] → ['John', 'Alice', 'Bob']

      // new Set()

      // Удаляем дубликаты, оставляя только уникальные значения:
      // ['John', 'Alice', 'Bob']

      // Array.from()

      // Преобразуем Set обратно в массив (так как Set не является массивом).

      // .map()

      // Форматируем каждый элемент в объект, который ожидает Ant Design:

      // javascript
      // { text: 'John', value: 'John' }
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
      render: (
        _,
        record, //record — это объект, содержащий все данные текущей строки таблицы.
      ) => (
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
        allowClear // Добавляем кнопку очистки
      />
      <Table dataSource={dataFiltredUsers} columns={columns} rowKey="id" />
    </>
  );
};

export default AppTable;
