import { Button, Modal, Space, Form, Spin } from "antd";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import AppForm from "../appForm/AppForm";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  openAddModal,
  closeModal,
  userAdded,
  userUpdated,
} from "../appForm/userSlice";

import "../modal/modal.scss";
import { useHttp } from "../hook/useHook";
import Swal from "sweetalert2";
const AppModal = () => {
  const [form] = Form.useForm();
  // вытаскиваем из формы
  // getFieldValue	Получить значение поля	form.getFieldValue('name')
  // setFieldsValue	Установить значения	form.setFieldsValue({name: 'John'})
  // validateFields	Валидация формы	form.validateFields()
  // resetFields	Сброс формы	form.resetFields()
  // submit	Отправка формы	form.submit()

  const dispatch = useDispatch();
  const { request } = useHttp();
  const { isOpen, mode, currentUser } = useSelector(
    (state) => state.user.modal,
  ); //получаем глобальное состоняние
  const [confirmLoading, setConfirmLoading] = useState(false); //локально состояние загрузки модалки

  // Устанавливаем значения формы при открытии редактирования
  useEffect(() => {
    if (mode === "edit" && currentUser) {
      form.setFieldsValue({
        //Метод из Ant Design Form, который устанавливает значения полей
        name: currentUser.name,
        date: dayjs(currentUser.date),
        age: currentUser.age,
      });
    } else {
      form.resetFields();
    }
  }, [isOpen, mode, currentUser, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);

      const userData = {
        id: uuidv4(), // для json-server
        name: values.name,
        date: values.date.startOf("day").format("YYYY-MM-DD"),
        age: Number(values.age), // преобразуем в число
      };

      console.log(userData);

      await request(
        "http://localhost:3001/test",
        "POST",
        JSON.stringify(userData),
      );

      dispatch(userAdded(userData));

      await Swal.fire({
        title: "Успех!",
        text: "Данные успешно сохранены",
        icon: "success",
        confirmButtonText: "OK",
      });

      form.resetFields();

      dispatch(closeModal()); //закрываем модалку через диспатч
    } catch (error) {
      console.error("Ошибка при отправке формы:", error);

      await Swal.fire({
        title: "Ошибка!",
        text: `Не удалось сохранить данные: ${error.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setConfirmLoading(false);
    }
  };

  const editHandleSubmit = async () => {
    try {
      setConfirmLoading(true);
      const values = await form.validateFields();

      // Форматируем дату перед созданием объекта
      const formattedValues = {
        ...values,
        date: values.date.startOf("day").format("YYYY-MM-DD"),
      };

      const updatedUser = {
        id: currentUser.id, // сохраняем оригинальный ID
        ...formattedValues, // новые значения полей
      };

      await request(
        `http://localhost:3001/test/${currentUser.id}`,
        "PUT",
        JSON.stringify(updatedUser),
      );

      dispatch(
        userUpdated({
          id: currentUser.id,
          changes: {
            ...values,
            date: values.date.startOf("day").format("YYYY-MM-DD"), // Преобразуем dayjs в строку
          },
        }),
      );

      await Swal.fire({
        title: "Успех!",
        text: "Данные успешно изменены",
        icon: "success",
        confirmButtonText: "OK",
      });

      form.resetFields();

      dispatch(closeModal()); //закрываем модалку через диспатч
    } catch (error) {
      console.error("Ошибка при отправке формы:", error);

      await Swal.fire({
        title: "Ошибка!",
        text: `Не удалось изменить данные: ${error.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setConfirmLoading(false);
    }
  };

  const showModal = () => {
    dispatch(openAddModal()); //открываем через диспатч
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    form.resetFields();
    dispatch(closeModal());
  };

  return (
    <Space className="modal__btn">
      <Button type="primary" onClick={showModal}>
        Добавить
      </Button>
      <Modal
        title={
          mode === "add" ? (
            <p>Заполните форму</p>
          ) : (
            <p>Внесите изменения в форму</p>
          )
        }
        confirmLoading={confirmLoading} // ← Теперь Spin на всю модалку!
        open={isOpen}
        onOk={mode === "edit" && currentUser ? editHandleSubmit : handleSubmit}
        onCancel={handleCancel}
        destroyOnHidden
      >
        {confirmLoading ? (
          <Spin tip="Данные загружаются...">
            <AppForm form={form} />
          </Spin>
        ) : (
          <AppForm form={form} />
        )}
      </Modal>
    </Space>
  );
};

export default AppModal;
