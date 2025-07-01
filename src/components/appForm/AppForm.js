import { Form, Input, InputNumber, DatePicker } from "antd";

const AppForm = ({ form }) => {
  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      autoComplete="off"
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[
          { required: true, message: "Введите Ваше Имя" },
          {
            pattern: /^[A-Za-z]+$/,
            message: "Только латинские буквы",
          },
          {
            pattern: /^[А-ЯЁA-Z][а-яёa-z]*(-[А-ЯЁA-Z][а-яёa-z]*)?$/,
            message: "Имя должно начинаться с заглавной буквы",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Date"
        name="date"
        rules={[{ required: true, message: "Введите дату Вашего рождения" }]}
      >
        <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Age"
        name="age"
        rules={[
          { required: true, message: "Введите Ваш возраст" },
          {
            type: "number",
            min: 15,
            max: 99,
            message: "Возраст 15-99",
          },
        ]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>
    </Form>
  );
};

export default AppForm;
