import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  Select, 
  Upload, 
  Button, 
  message,
  Row,
  Col,
  Typography
} from 'antd';
import { 
  PlusOutlined, 
  UploadOutlined,
  CalendarOutlined,
  FileImageOutlined
} from '@ant-design/icons';
import { Event } from '../../types';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;
const { RangePicker } = DatePicker;

interface EventModalProps {
  visible: boolean;
  onCancel: () => void;
  event?: Event | null;
  mode: 'create' | 'edit';
}

const EventModal: React.FC<EventModalProps> = ({ 
  visible, 
  onCancel, 
  event, 
  mode 
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const { addEvent, updateEvent } = useDataStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (visible) {
      if (mode === 'edit' && event) {
        form.setFieldsValue({
          name: event.name,
          slogan: event.slogan,
          description: event.description,
          dateRange: [dayjs(event.start_time), dayjs(event.end_time)],
          status: event.status,
          image_url: event.image_url
        });
        setImageUrl(event.image_url || '');
      } else {
        form.resetFields();
        setImageUrl('');
      }
    }
  }, [visible, mode, event, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const eventData = {
        name: values.name,
        slogan: values.slogan || null,
        description: values.description || null,
        image_url: imageUrl || null,
        start_time: values.dateRange[0].toISOString(),
        end_time: values.dateRange[1].toISOString(),
        status: values.status,
        created_by: user?.id || null
      };

      if (mode === 'create') {
        await addEvent(eventData);
        message.success('Tạo sự kiện thành công!');
      } else if (mode === 'edit' && event) {
        await updateEvent(event.id, eventData);
        message.success('Cập nhật sự kiện thành công!');
      }

      form.resetFields();
      setImageUrl('');
      onCancel();
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const getDefaultImages = () => [
    'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
    'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg',
    'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg',
    'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
    'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg'
  ];

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <CalendarOutlined className="text-white text-sm" />
          </div>
          <Title level={4} className="m-0">
            {mode === 'create' ? 'Tạo sự kiện mới' : 'Chỉnh sửa sự kiện'}
          </Title>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      className="event-modal"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-6"
        size="large"
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="name"
              label="Tên sự kiện"
              rules={[
                { required: true, message: 'Vui lòng nhập tên sự kiện!' },
                { min: 3, message: 'Tên sự kiện phải có ít nhất 3 ký tự!' }
              ]}
            >
              <Input 
                placeholder="Nhập tên sự kiện..."
                className="rounded-lg"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="slogan"
              label="Khẩu hiệu"
            >
              <Input 
                placeholder="Nhập khẩu hiệu..."
                className="rounded-lg"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="Mô tả sự kiện"
          rules={[
            { required: true, message: 'Vui lòng nhập mô tả sự kiện!' }
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Nhập mô tả chi tiết về sự kiện..."
            className="rounded-lg"
          />
        </Form.Item>

        <Row gutter={[16, 0]}>
          <Col xs={24} md={16}>
            <Form.Item
              name="dateRange"
              label="Thời gian diễn ra"
              rules={[
                { required: true, message: 'Vui lòng chọn thời gian diễn ra!' }
              ]}
            >
              <RangePicker
                showTime
                format="DD/MM/YYYY HH:mm"
                placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
                className="w-full rounded-lg"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[
                { required: true, message: 'Vui lòng chọn trạng thái!' }
              ]}
            >
              <Select
                placeholder="Chọn trạng thái"
                className="rounded-lg"
              >
                <Option value="draft">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Nháp</span>
                  </div>
                </Option>
                <Option value="open">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Đang mở</span>
                  </div>
                </Option>
                <Option value="closed">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Đã đóng</span>
                  </div>
                </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Hình ảnh sự kiện"
        >
          <div className="space-y-4">
            <Input
              placeholder="Nhập URL hình ảnh hoặc chọn từ thư viện bên dưới..."
              value={imageUrl}
              onChange={handleImageUrlChange}
              prefix={<FileImageOutlined className="text-gray-400" />}
              className="rounded-lg"
            />
            
            {imageUrl && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <p className="text-sm text-gray-600 mb-2">Xem trước:</p>
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg';
                  }}
                />
              </div>
            )}

            <div>
              <p className="text-sm text-gray-600 mb-2">Hoặc chọn từ thư viện:</p>
              <div className="grid grid-cols-3 gap-2">
                {getDefaultImages().map((url, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-200 hover:scale-105 ${
                      imageUrl === url ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setImageUrl(url)}
                  >
                    <img
                      src={url}
                      alt={`Option ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Form.Item>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button 
            onClick={onCancel}
            size="large"
            className="rounded-lg"
          >
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 rounded-lg px-8"
          >
            {mode === 'create' ? 'Tạo sự kiện' : 'Cập nhật'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EventModal;